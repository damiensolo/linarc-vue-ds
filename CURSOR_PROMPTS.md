# Cursor AI Prompt Templates and Workflows

This document provides ready-to-use prompts and workflows for AI-assisted development with Cursor in this monorepo.

## Table of Contents

- [Design System Component Development](#design-system-component-development)
- [Figma Integration](#figma-integration)
- [Nuxt App Development](#nuxt-app-development)
- [Token Management](#token-management)
- [Common Tasks](#common-tasks)

## Design System Component Development

### Create a New Component

```
Create a new [ComponentName] component in the design system following ShadCN Vue patterns.
Use Reka UI primitives for accessibility and include variants: [variant1, variant2].
Export it from the components index file.
```

**Example:**

```
Create a new Dialog component in the design system following ShadCN Vue patterns.
Use Reka UI primitives for accessibility and include variants: default, destructive.
Export it from the components index file.
```

### Add Variants to Existing Component

```
Add [variant] variant to the [ComponentName] component in packages/design-system/src/components/ui/[component-name]/[ComponentName].vue.
The variant should have [description of styling/behavior].
```

### Create Component from ShadCN Vue Documentation

```
Install and set up the [component-name] component from ShadCN Vue in our design system.
Follow our established patterns and export it properly.
```

## Figma Integration

### Get Design and Implement Component

```
Get the design context from Figma file [fileKey] node [nodeId] and create a Vue component
using our design system components. Match the design as closely as possible while using
our existing Button, Card, Input, and other design system components.
```

**Example:**

```
Get the design context from Figma file abc123 node 456:789 and create a Vue component
using our design system components. Match the design as closely as possible while using
our existing Button, Card, Input, and other design system components.
```

### Sync Design Tokens from Figma

```
Use Figma MCP to fetch variable definitions from file [fileKey] node [nodeId] and sync
them to the design system tokens. Update the figma-tokens.ts file and regenerate the
Tailwind config if needed.
```

### Build Page from Figma Design

```
Get the design context from Figma file [fileKey] node [nodeId] and create a Nuxt page
at packages/nuxt-app/pages/[page-name].vue. Use our design system components to match
the design. Include proper TypeScript types and responsive design.
```

### Extract Design Tokens

```
Extract design tokens (colors, spacing, typography) from Figma file [fileKey] node [nodeId]
and show me what variables are available. Then help me sync them to our design system.
```

## Nuxt App Development

### Create a New Page

```
Create a new Nuxt page at packages/nuxt-app/pages/[page-name].vue. Use design system
components from @linarc/design-system. Include [feature1, feature2] functionality using
Pinia stores and VueUse composables.
```

**Example:**

```
Create a new Nuxt page at packages/nuxt-app/pages/dashboard.vue. Use design system
components from @linarc/design-system. Include data fetching and user authentication
functionality using Pinia stores and VueUse composables.
```

### Create a Pinia Store

```
Create a new Pinia store at packages/nuxt-app/stores/[store-name].ts for managing
[description of state]. Include actions for [action1, action2] and getters for [getter1].
```

### Build a Form with Design System

```
Create a form component in packages/nuxt-app/components/[form-name].vue using our design
system Input, Button, and Card components. Include form validation using [validation library]
and handle submission with [method].
```

### Implement a Feature

```
Implement [feature description] in the Nuxt app. Use design system components, create
necessary Pinia stores, and add the page at packages/nuxt-app/pages/[route].vue.
Include proper TypeScript types and error handling.
```

## Token Management

### Update Design Tokens

```
Update the design tokens in packages/design-system/src/tokens/index.ts to include
[token category] with values: [values]. Update the Tailwind config and style.css
to use these new tokens.
```

### Sync Tokens from Figma

```
Run the Figma token sync script and update the design system with the latest tokens
from Figma file [fileKey]. Review the changes and update components if needed.
```

## Common Tasks

### Fix TypeScript Errors

```
Fix all TypeScript errors in [file/path]. Ensure proper type definitions and follow
our TypeScript conventions.
```

### Refactor Component

```
Refactor [ComponentName] in packages/design-system/src/components/ui/[component-name]/
to follow our latest patterns. Improve type safety, add proper JSDoc comments, and
ensure it's properly exported.
```

### Add Responsive Design

```
Make [ComponentName/Page] responsive using Tailwind CSS mobile-first approach.
Ensure it works well on mobile, tablet, and desktop breakpoints.
```

### Optimize Performance

```
Optimize [Component/Page] for performance. Implement lazy loading, code splitting,
and optimize images/assets. Ensure good Web Vitals scores.
```

### Add Accessibility Features

```
Add accessibility features to [ComponentName]. Use Reka UI primitives where possible,
add ARIA labels, keyboard navigation, and ensure WCAG compliance.
```

## Advanced Workflows

### Complete Feature Implementation

```
1. Get design context from Figma file [fileKey] node [nodeId]
2. Create necessary design system components if they don't exist
3. Create Pinia store for state management
4. Build the Nuxt page using design system components
5. Add proper TypeScript types throughout
6. Implement responsive design
7. Add error handling and loading states
```

### Design System Component Suite

```
Create a complete [component category] component suite in the design system:
- [Component1] with variants [variants]
- [Component2] with variants [variants]
- [Component3] with variants [variants]

Follow ShadCN Vue patterns, use Reka UI primitives, and export all from the index file.
```

### Prototype from Figma

```
Prototype the [feature/page] from Figma file [fileKey] node [nodeId]:
1. Analyze the design and identify design system components to use
2. Create any missing components in the design system
3. Build the Nuxt page matching the design
4. Add interactivity and state management
5. Ensure responsive design and accessibility
```

## Tips for Best Results

1. **Be Specific**: Include file paths, component names, and specific requirements
2. **Reference Existing Code**: Point to similar components or patterns when possible
3. **Break Down Complex Tasks**: Split large features into smaller, manageable prompts
4. **Use Figma MCP**: Always use Figma MCP tools when working with designs
5. **Follow Patterns**: Reference existing components to maintain consistency
6. **Type Safety**: Always request TypeScript types and proper type definitions

## Example Conversation Flow

### Scenario: Building a Dashboard Page from Figma

**Step 1 - Get Design:**

```
Get the design context from Figma file abc123 node 456:789. Show me the structure
and components used in the design.
```

**Step 2 - Identify Components:**

```
Based on the Figma design, what design system components do we need? List any
components that need to be created.
```

**Step 3 - Create Missing Components:**

```
Create the [ComponentName] component in the design system following our patterns.
```

**Step 4 - Build the Page:**

```
Create the dashboard page at packages/nuxt-app/pages/dashboard.vue using the
design system components. Match the Figma design and include [specific features].
```

**Step 5 - Add Functionality:**

```
Add [feature] to the dashboard page. Create a Pinia store for [state management]
and use VueUse composables for [functionality].
```

**Step 6 - Polish:**

```
Add loading states, error handling, and ensure the dashboard is responsive.
Optimize for performance.
```

## Quick Reference

- **Design System Path**: `packages/design-system/src/components/ui/`
- **Nuxt App Path**: `packages/nuxt-app/`
- **Import Pattern**: `import { Component } from '@linarc/design-system'`
- **Figma File Key**: Extract from URL: `figma.com/design/[fileKey]/...`
- **Node ID Format**: `123:456` or `123-456`

## Getting Help

If a prompt doesn't work as expected:

1. Check the `.cursorrules` file for project conventions
2. Review similar existing components for patterns
3. Break down the task into smaller steps
4. Be more specific about file paths and requirements

--- Custom DS Analysis ---
using figma mcp get the design context from Figma file: https://www.figma.com/design/741fX93fgNrJjb7p7zlSvG/Linarc-Design-System-Testing-Base?node-id=27291-31510&t=qCi8Fzbx8uBPYlUw-1

I'm switching to a new figma file with more variables and components that are not yet in the design system. I need to analyze the structure of the figma variables and components to see how add in these viriable to the design system with the primitive and semantic token structure that is already in the design system and token syscing system. Study the existing code and token syncing system to see how to best add in the new variables and components. See if there are any missing variables or components that are needed. Before adding in the new variables and components, see if there are any existing variables or components that are similar and can be reused and how those can be remapped to the new variables and components. I want to make sure the full scyching process is complete and working correctly with the existing code and token syncing system and make sure all the variables and components are added in correctly and are working correctly before adding in the new variables and building components. Give me a detailed plan of what to do and how to do it.
