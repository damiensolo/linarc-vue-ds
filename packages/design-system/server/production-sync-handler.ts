#!/usr/bin/env tsx
/**
 * Production Sync Handler
 * 
 * Handles syncing tokens to GitHub (creates commit/PR) for production deployment
 */

import { syncFromFigmaMCP } from "../scripts/sync-from-figma-mcp.js";
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, "../../..");

interface SyncRequest {
  variables: Record<string, any>;
  fileKey?: string;
  nodeId?: string;
  githubToken?: string;
  createPR?: boolean;
  branchName?: string;
}

interface GitHubFile {
  path: string;
  mode: "100644" | "100755" | "040000" | "160000" | "120000";
  type: "blob" | "tree" | "commit";
  sha?: string;
  content?: string;
}

/**
 * Get current file SHA from GitHub
 */
async function getFileSha(
  owner: string,
  repo: string,
  path: string,
  branch: string,
  token: string
): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.sha;
    }
    return null;
  } catch (error) {
    console.error("Error getting file SHA:", error);
    return null;
  }
}

/**
 * Create a commit with token changes
 */
async function createCommit(
  owner: string,
  repo: string,
  branch: string,
  token: string,
  files: Array<{ path: string; content: string; sha?: string | null }>,
  message: string
): Promise<string> {
  // Get current branch ref and commit
  const refResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${branch}`,
    {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!refResponse.ok) {
    throw new Error(`Failed to get branch ref: ${refResponse.statusText}`);
  }

  const refData = await refResponse.json();
  const parentCommitSha = refData.object.sha;

  // Get the commit to get its tree SHA
  const parentCommitResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/commits/${parentCommitSha}`,
    {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!parentCommitResponse.ok) {
    throw new Error(`Failed to get commit: ${parentCommitResponse.statusText}`);
  }

  const parentCommitData = await parentCommitResponse.json();
  const baseTreeSha = parentCommitData.tree.sha;

  // Create blobs for each file
  const blobs = await Promise.all(
    files.map(async (file) => {
      // GitHub API requires base64 encoded content
      const contentBase64 = Buffer.from(file.content, "utf-8").toString("base64");
      
      const blobResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/blobs`,
        {
          method: "POST",
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: contentBase64,
            encoding: "base64",
          }),
        }
      );

      if (!blobResponse.ok) {
        const error = await blobResponse.json();
        throw new Error(`Failed to create blob: ${JSON.stringify(error)}`);
      }

      const blobData = await blobResponse.json();
      return {
        path: file.path,
        mode: "100644" as const,
        type: "blob" as const,
        sha: blobData.sha,
      };
    })
  );

  // Create tree
  const treeResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees`,
    {
      method: "POST",
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        base_tree: baseTreeSha,
        tree: blobs,
      }),
    }
  );

  if (!treeResponse.ok) {
    throw new Error(`Failed to create tree: ${treeResponse.statusText}`);
  }

  const treeData = await treeResponse.json();

  // Create commit
  const commitResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/commits`,
    {
      method: "POST",
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        tree: treeData.sha,
        parents: [parentCommitSha],
      }),
    }
  );

  if (!commitResponse.ok) {
    const error = await commitResponse.json();
    throw new Error(`Failed to create commit: ${JSON.stringify(error)}`);
  }

  const commitData = await commitResponse.json();
  return commitData.sha;
}

/**
 * Update branch reference
 */
async function updateBranch(
  owner: string,
  repo: string,
  branch: string,
  token: string,
  commitSha: string
): Promise<void> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sha: commitSha,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to update branch: ${JSON.stringify(error)}`);
  }
}

/**
 * Create a Pull Request
 */
async function createPullRequest(
  owner: string,
  repo: string,
  head: string,
  base: string,
  token: string,
  title: string,
  body: string
): Promise<string> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls`,
    {
      method: "POST",
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        head,
        base,
        body,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to create PR: ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  return data.html_url;
}

/**
 * Get repository owner and name from git remote
 */
function getRepoInfo(): { owner: string; repo: string } | null {
  try {
    const remoteUrl = execSync("git config --get remote.origin.url", {
      cwd: REPO_ROOT,
      encoding: "utf-8",
    }).trim();

    // Handle both SSH and HTTPS URLs
    const match = remoteUrl.match(
      /(?:git@github\.com:|https:\/\/github\.com\/)([\w-]+)\/([\w-]+)(?:\.git)?/
    );
    if (match) {
      return { owner: match[1], repo: match[2] };
    }
    return null;
  } catch (error) {
    console.error("Error getting repo info:", error);
    return null;
  }
}

/**
 * Handle production sync request
 */
export async function handleProductionSync(
  data: SyncRequest
): Promise<{
  success: boolean;
  message: string;
  commitSha?: string;
  prUrl?: string;
  branch?: string;
}> {
  if (!data.githubToken) {
    throw new Error("GitHub token is required for production sync");
  }

  // Get repo info
  const repoInfo = getRepoInfo();
  if (!repoInfo) {
    throw new Error("Could not determine repository owner/name");
  }

  const { owner, repo } = repoInfo;
  const branch = data.branchName || "main";
  const createPR = data.createPR !== false; // Default to true

  console.log(`\n🚀 Production sync to GitHub...`);
  console.log(`📦 Repo: ${owner}/${repo}`);
  console.log(`🌿 Branch: ${branch}`);
  console.log(`📁 File: ${data.fileKey || "unknown"}\n`);

  // Sync tokens locally first
  const tokens = syncFromFigmaMCP(data.variables);

  // Read token files
  const tokenFiles = [
    {
      path: "packages/design-system/src/tokens/figma-tokens.ts",
      content: readFileSync(
        resolve(REPO_ROOT, "packages/design-system/src/tokens/figma-tokens.ts"),
        "utf-8"
      ),
    },
    {
      path: "packages/design-system/src/tokens/tailwind-extension.json",
      content: readFileSync(
        resolve(
          REPO_ROOT,
          "packages/design-system/src/tokens/tailwind-extension.json"
        ),
        "utf-8"
      ),
    },
  ];

  // Get file SHAs for update
  const filesWithSha = await Promise.all(
    tokenFiles.map(async (file) => ({
      ...file,
      sha: await getFileSha(owner, repo, file.path, branch, data.githubToken!),
    }))
  );

  // Create commit message
  const commitMessage = `chore: sync design tokens from Figma\n\nFile: ${data.fileKey || "unknown"}\nNode: ${data.nodeId || "root"}\nSynced: ${new Date().toISOString()}`;

  // Create commit
  const commitSha = await createCommit(
    owner,
    repo,
    branch,
    data.githubToken,
    filesWithSha,
    commitMessage
  );

  console.log(`✅ Commit created: ${commitSha}`);

  // Update branch directly (Vercel will auto-deploy)
  await updateBranch(owner, repo, branch, data.githubToken, commitSha);
  
  console.log(`✅ Branch ${branch} updated with commit ${commitSha}`);
  console.log(`🚀 Vercel will auto-deploy from this commit`);

  return {
    success: true,
    message: `Tokens synced to GitHub successfully! Committed to ${branch}. Vercel will auto-deploy shortly.`,
    commitSha,
    branch,
  };
}

