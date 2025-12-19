# @linarc/design-system

Vue 3 Design System Component Library built with ShadCN Vue, Reka UI, and Tailwind CSS.

## Installation

```bash
pnpm add @linarc/design-system
```

## Usage

```vue
<script setup>
import { Button, Card, Input } from '@linarc/design-system'
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Hello World</CardTitle>
    </CardHeader>
    <CardContent>
      <Input placeholder="Enter text..." />
      <Button>Submit</Button>
    </CardContent>
  </Card>
</template>
```

## Components

Components follow ShadCN Vue patterns and are built on Reka UI primitives for accessibility and functionality.

## Design Tokens

Design tokens can be synced from Figma using the MCP integration. See `src/tokens/` for token management.

