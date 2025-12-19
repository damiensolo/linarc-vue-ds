# Linarc Vue Design System

A monorepo containing a Vue 3 design system and Nuxt 3 application for building data management platforms.

## Structure

```
linarc-vue-ds/
├── packages/
│   ├── design-system/    # Vue 3 component library
│   └── nuxt-app/          # Nuxt 3 application
```

## Technology Stack

- **Vue 3** - Component framework
- **Nuxt 3** - Application framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **ShadCN Vue** - Component library
- **Reka UI** - Primitive components (v2 of Radix Vue)
- **Pinia** - State management
- **VueUse** - Composition utilities

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation

```bash
pnpm install
```

### Development

**Run the Nuxt application:**

```bash
pnpm dev
```

**Build design system:**

```bash
pnpm build:ds
```

**Build application:**

```bash
pnpm build:app
```

## Packages

### Design System (`packages/design-system`)

Reusable Vue 3 components built with ShadCN Vue and Tailwind CSS. Components can be imported and used in any Vue application.

**Key Features:**

- ShadCN Vue component patterns
- Reka UI primitives for accessibility
- Tailwind CSS styling
- TypeScript support
- Figma token sync integration

**Usage:**

```vue
<script setup>
import { Button, Card, Input } from "@linarc/design-system";
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

### Nuxt App (`packages/nuxt-app`)

Main application consuming the design system package. Built with Nuxt 3 for optimal performance and developer experience.

## Figma Integration

Design tokens and variables can be synced from Figma using the built-in plugin.

**Quick Start:**

1. Build plugin: `pnpm --filter design-system build:plugin`
2. Start sync server: `pnpm --filter design-system dev:sync-server`
3. Load plugin in Figma Desktop
4. Sync tokens with one click!

**Full Guide:** See [`packages/design-system/FIGMA_INTEGRATION.md`](packages/design-system/FIGMA_INTEGRATION.md)

## Development Guidelines

See `.cursorrules` for comprehensive development guidelines and best practices.

## Project Scripts

### Root Level

- `pnpm dev` - Start Nuxt development server
- `pnpm build:ds` - Build design system
- `pnpm build:app` - Build Nuxt application

### Design System

- `pnpm --filter design-system build` - Build design system
- `pnpm --filter design-system build:plugin` - Build Figma plugin
- `pnpm --filter design-system dev:sync-server` - Start Figma sync server

See `packages/design-system/package.json` for all available scripts.

## Documentation

- **[Figma Integration Guide](packages/design-system/FIGMA_INTEGRATION.md)** - Complete guide for syncing tokens from Figma
- **[Design System README](packages/design-system/README.md)** - Component library documentation
- **[Nuxt App README](packages/nuxt-app/README.md)** - Application documentation

## Contributing

1. Follow the guidelines in `.cursorrules`
2. Use TypeScript for all code
3. Follow ShadCN Vue patterns for components
4. Test changes in the Nuxt app
5. Sync tokens from Figma when design changes

## License

MIT
