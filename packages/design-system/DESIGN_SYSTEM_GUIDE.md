# Design System Style Management Guide

## Current Approach: ShadCN Vue Pattern

Our design system follows the **ShadCN Vue** pattern, which uses:

1. **Tailwind CSS utility classes** - All styles are defined using Tailwind classes
2. **Class Variance Authority (CVA)** - For managing component variants
3. **Co-located styles** - Styles live in the component files, not separate CSS files
4. **Type-safe variants** - TypeScript ensures variant combinations are valid

## Component Structure

### Simple Components (Card, Input)
```vue
<template>
  <div :class="cn('base-classes-here', props.class)">
    <slot />
  </div>
</template>
```

### Variant Components (Button, FloatingActionButton)
```vue
<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'

const componentVariants = cva(
  'base-classes', // Base styles applied to all variants
  {
    variants: {
      variant: {
        default: 'variant-classes',
        // ... other variants
      },
      size: {
        sm: 'size-classes',
        // ... other sizes
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
    },
  }
)
</script>
```

## Why This Approach?

### ✅ Advantages

1. **Co-location** - Styles are next to component logic, easier to maintain
2. **No CSS files** - Everything is in Vue files, simpler file structure
3. **Type safety** - TypeScript ensures valid variant combinations
4. **Tree-shaking** - Only used Tailwind classes are included in build
5. **Consistency** - All components follow the same pattern
6. **Easy customization** - Consumers can override via `class` prop
7. **Design token integration** - Figma variables map directly to Tailwind config

### ⚠️ Considerations

1. **Component file length** - Complex components can have long variant definitions
2. **Shared styles** - Common patterns should be extracted to utilities or base classes
3. **Design tokens** - Keep Figma variables synced in Tailwind config

## Best Practices

### 1. Use CVA for Variants
Always use `class-variance-authority` when components have multiple variants:

```typescript
const buttonVariants = cva('base', {
  variants: { /* ... */ },
  defaultVariants: { /* ... */ }
})
```

### 2. Extract Common Base Styles
If multiple components share base styles, create a utility:

```typescript
// utils/component-base.ts
export const interactiveBase = 'transition-colors focus-visible:outline-none focus-visible:ring-2'
```

### 3. Use Design Tokens
Map Figma variables to Tailwind config:

```javascript
// tailwind.config.js
colors: {
  'indigo-600': '#4f46e5', // From Figma
}
```

### 4. Keep Variants Simple
If a component has too many compound variants, consider splitting into separate components.

### 5. Document Variants
Add JSDoc comments for complex variant combinations:

```typescript
/**
 * FloatingActionButton variants
 * @example
 * <FloatingActionButton size="XL" shape="Circle" />
 */
```

## Design Token Management

### Figma Integration
1. Sync variables from Figma using MCP tools
2. Map to Tailwind config in `tailwind.config.js`
3. Use in components via Tailwind classes

### Token Structure
```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      // Design system colors
      primary: 'hsl(var(--primary))',
      // Figma-specific colors
      'indigo-600': '#4f46e5',
    },
    borderRadius: {
      // Figma radii
      'radii-xxl': '999px',
    },
  }
}
```

## Alternative Approaches (Not Recommended)

### ❌ Separate CSS Files
- Breaks co-location principle
- Harder to maintain
- Goes against Tailwind philosophy

### ❌ CSS-in-JS
- Adds runtime overhead
- Not needed with Tailwind
- Breaks Vue's template compilation

### ❌ Scoped Styles
- Tailwind handles scoping via utility classes
- Unnecessary complexity

## Migration Path

If you need to refactor existing components:

1. **Identify variants** - What props change styling?
2. **Create CVA definition** - Use `cva()` for variant management
3. **Extract base styles** - Common styles go in base string
4. **Define variants** - Each variant gets its own classes
5. **Add TypeScript types** - Use `VariantProps` for type safety

## Example: Refactoring Simple Component to Variant Component

**Before:**
```vue
<div :class="cn(size === 'lg' ? 'text-lg' : 'text-sm', props.class)">
```

**After:**
```typescript
const sizeVariants = cva('base-classes', {
  variants: {
    size: {
      sm: 'text-sm',
      lg: 'text-lg',
    },
  },
})
```

## Conclusion

The current ShadCN Vue pattern is the **recommended approach** for this design system because:

- It's battle-tested and widely adopted
- Maintains consistency across components
- Integrates well with Tailwind CSS
- Supports design token workflow
- Keeps components maintainable and type-safe

Stick with this pattern for all new components!

