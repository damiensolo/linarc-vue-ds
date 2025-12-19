# Nuxt App Pages

## Available Pages

- `/` - Home page with example components (index.vue)
- `/floating-action-button` - FloatingActionButton demo
- `/test-token-sync` - Token sync test page

## Component Usage

Components are imported from `@linarc/design-system`:

```vue
<script setup lang="ts">
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Checkbox,
  FloatingActionButton,
} from '@linarc/design-system'
</script>
```

## Troubleshooting

### Page shows nothing / blank

1. **Check Nuxt dev server is running:**
   ```bash
   pnpm dev
   ```

2. **Check browser console for errors:**
   - Open DevTools (F12)
   - Look for import errors or component errors

3. **Verify components are imported:**
   - Components must be explicitly imported in each page
   - Check `packages/design-system/src/components/index.ts` for available exports

4. **Check CSS is loading:**
   - Verify `nuxt.config.ts` has CSS import
   - Check browser DevTools → Network tab for CSS files

5. **Restart dev server:**
   ```bash
   # Stop server (Ctrl+C)
   pnpm dev
   ```

### Components not found

If you see "Cannot find module '@linarc/design-system'":

1. Check alias in `nuxt.config.ts`:
   ```ts
   alias: {
     "@linarc/design-system": "../design-system/src",
   }
   ```

2. Verify component exists in `packages/design-system/src/components/ui/`

3. Verify component is exported in `packages/design-system/src/components/index.ts`

