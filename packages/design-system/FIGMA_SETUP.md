# Figma Integration Setup

This guide explains how to set up Figma MCP integration to sync design tokens.

## Prerequisites

1. Figma MCP server configured in Cursor
2. Access to your Figma design file
3. Figma file key (extracted from Figma URL)

## Getting Your Figma File Key

From a Figma URL like: `https://figma.com/design/pqrs/ExampleFile`

The file key is `pqrs` (the part after `/design/`)

## Setting Up Variables in Figma

1. Create variable collections in Figma for:
   - Colors
   - Spacing
   - Typography
   - Shadows
   - Border Radius

2. Name variables clearly (e.g., `primary-color`, `spacing-sm`, `font-size-base`)

3. Organize variables into collections by category

## Using the Sync Script

### Manual Sync

```bash
# Set your Figma file key
export FIGMA_FILE_KEY=your-file-key

# Run sync
pnpm --filter design-system sync:figma
```

### Using Cursor AI

You can ask Cursor to sync tokens using prompts like:

```
Sync design tokens from Figma file [file-key] to the design system
```

Or:

```
Fetch Figma variables from node [node-id] in file [file-key] and update the tokens
```

## MCP Integration Workflow

1. **Fetch Variables**: Use `mcp_Figma_get_variable_defs` to get variable definitions
2. **Convert to Tokens**: The sync script converts Figma variables to design tokens
3. **Generate Config**: Tailwind config and TypeScript tokens are generated
4. **Update Components**: Components automatically use the new tokens

## Example Cursor Prompts

### Fetch Variables

```
Use Figma MCP to get variable definitions from file [file-key] node [node-id] and show me the color variables
```

### Sync Tokens

```
Sync all design tokens from Figma file [file-key] and update the design system
```

### Build Component from Figma

```
Get the design context from Figma file [file-key] node [node-id] and create a Vue component using our design system components
```

## Troubleshooting

- **No variables found**: Ensure Figma MCP is configured and file key is correct
- **Token format issues**: Check variable naming conventions in Figma
- **Sync errors**: Verify node IDs and file permissions

## Next Steps

After syncing tokens:
1. Review generated tokens in `src/tokens/figma-tokens.ts`
2. Update Tailwind config if needed
3. Test components with new tokens
4. Commit token updates

