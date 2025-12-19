<template>
  <div class="container mx-auto p-8 space-y-8">
    <div>
      <h1 class="text-3xl font-bold mb-4">Token Sync Test</h1>
      <p class="text-muted-foreground">
        This page tests if Figma tokens are syncing correctly.
      </p>
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-semibold">Color Token: indigo-600</h2>

      <!-- Direct Token Value -->
      <div class="space-y-2">
        <h3 class="text-lg font-medium">From figma-tokens.ts:</h3>
        <div class="flex items-center gap-4">
          <div :style="{ backgroundColor: tokenValue }" class="w-24 h-24 rounded-lg border-2 border-border shadow-md" />
          <div>
            <p class="font-mono text-sm">{{ tokenValue }}</p>
            <p class="text-sm text-muted-foreground">indigo-600</p>
          </div>
        </div>
      </div>

      <!-- Tailwind Class -->
      <div class="space-y-2">
        <h3 class="text-lg font-medium">Using Tailwind class bg-indigo-600:</h3>
        <div class="flex items-center gap-4">
          <div class="w-24 h-24 rounded-lg border-2 border-border shadow-md bg-indigo-600" />
          <div>
            <p class="font-mono text-sm">bg-indigo-600</p>
            <p class="text-sm text-muted-foreground">
              Should be {{ expectedColor }} (RED if synced correctly!)
            </p>
          </div>
        </div>
      </div>

      <!-- Component Usage -->
      <div class="space-y-2">
        <h3 class="text-lg font-medium">In Components:</h3>
        <div class="flex gap-4">
          <Button class="bg-indigo-600">Button with Token</Button>
          <FloatingActionButton />
        </div>
        <p class="text-sm text-muted-foreground">
          These components use <code class="bg-muted px-1 rounded">bg-indigo-600</code> class
        </p>
      </div>

      <!-- Expected vs Actual -->
      <div class="p-4 bg-muted rounded-lg space-y-2">
        <h3 class="text-lg font-medium">Expected Result:</h3>
        <ul class="list-disc list-inside space-y-1 text-sm">
          <li>
            <strong>If synced:</strong> All swatches should be <span class="text-red-600 font-bold">RED (#e54646)</span>
          </li>
          <li>
            <strong>If not synced:</strong> All swatches will be <span class="text-purple-600 font-bold">PURPLE
              (#4f46e5)</span>
          </li>
        </ul>
        <div class="mt-4 p-3 bg-background rounded border">
          <p class="text-xs font-mono text-muted-foreground">
            Token file: packages/design-system/src/tokens/figma-tokens.ts<br>
            Extension file: packages/design-system/src/tokens/tailwind-extension.json<br>
            Current value: {{ tokenValue }}
          </p>
        </div>
      </div>
    </div>

    <!-- Instructions -->
    <div class="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
      <h3 class="text-lg font-medium mb-2">How to Test Sync:</h3>
      <ol class="list-decimal list-inside space-y-1 text-sm">
        <li>Change <code class="bg-white dark:bg-gray-800 px-1 rounded">indigo/600</code> in Figma</li>
        <li>Ask Cursor: "Sync tokens from Figma file rDLR9ZCB0Dq2AmRvxrifds node 1:110"</li>
        <li>Restart dev server: <code class="bg-white dark:bg-gray-800 px-1 rounded">pnpm dev</code></li>
        <li>Refresh this page - colors should update!</li>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@linarc/design-system'
import { FloatingActionButton } from '@linarc/design-system'
import { figmaTokens } from '@linarc/design-system'

const expectedColor = '#e54646' // Current value from Figma
const tokenValue = figmaTokens.colors['indigo-600'] || '#4f46e5'

useHead({
  title: 'Token Sync Test',
})
</script>
