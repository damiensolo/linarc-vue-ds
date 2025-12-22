<template>
  <div class="container mx-auto p-8">
    <Card>
      <CardHeader>
        <CardTitle>Welcome to Linarc Data Management Platform</CardTitle>
        <CardDescription>
          Built with Nuxt 3 and the Linarc Design System
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Example Input</label>
            <Input placeholder="Enter text here..." />
          </div>
          <div class="flex gap-2">
            <Button>Primary Button</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
          </div>
          <div class="space-y-3">
            <div class="flex items-center space-x-2">
              <Checkbox id="terms" v-model:checked="termsChecked" />
              <label for="terms"
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Accept terms and conditions
              </label>
            </div>
            <div class="flex items-center space-x-2">
              <Checkbox id="newsletter" v-model:checked="newsletterChecked" />
              <label for="newsletter"
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Subscribe to newsletter
              </label>
            </div>
            <div class="flex items-center space-x-2">
              <Checkbox id="disabled" :checked="true" disabled />
              <label for="disabled"
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Disabled checkbox
              </label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Floating Action Button Showcase -->
    <Card class="mt-8">
      <CardHeader>
        <CardTitle>Floating Action Button</CardTitle>
        <CardDescription>
          Different sizes and shapes of Floating Action Buttons
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-6">
          <div>
            <h3 class="text-sm font-medium mb-4">Sizes</h3>
            <div class="flex items-center gap-4 flex-wrap">
              <div class="flex flex-col items-center gap-2">
                <FloatingActionButton size="S" />
                <span class="text-xs text-muted-foreground">Small</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <FloatingActionButton size="M" />
                <span class="text-xs text-muted-foreground">Medium</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <FloatingActionButton size="L" />
                <span class="text-xs text-muted-foreground">Large</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <FloatingActionButton size="XL" />
                <span class="text-xs text-muted-foreground">Extra Large</span>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium mb-4">Shapes</h3>
            <div class="flex items-center gap-4 flex-wrap">
              <div class="flex flex-col items-center gap-2">
                <FloatingActionButton size="XL" shape="Circle" />
                <span class="text-xs text-muted-foreground">Circle</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <FloatingActionButton size="XL" shape="Square" />
                <span class="text-xs text-muted-foreground">Square</span>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium mb-4">All Variants</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div class="flex flex-col items-center gap-2">
                <FloatingActionButton size="S" shape="Circle" />
                <span class="text-xs text-muted-foreground">S Circle</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <FloatingActionButton size="S" shape="Square" />
                <span class="text-xs text-muted-foreground">S Square</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <FloatingActionButton size="M" shape="Circle" />
                <span class="text-xs text-muted-foreground">M Circle</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <FloatingActionButton size="M" shape="Square" />
                <span class="text-xs text-muted-foreground">M Square</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <FloatingActionButton size="L" shape="Circle" />
                <span class="text-xs text-muted-foreground">L Circle</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <FloatingActionButton size="L" shape="Square" />
                <span class="text-xs text-muted-foreground">L Square</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <FloatingActionButton size="XL" shape="Circle" />
                <span class="text-xs text-muted-foreground">XL Circle</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <FloatingActionButton size="XL" shape="Square" />
                <span class="text-xs text-muted-foreground">XL Square</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Toggle Showcase -->
    <Card class="mt-8">
      <CardHeader>
        <CardTitle>Toggle</CardTitle>
        <CardDescription>
          Different sizes, types, and states of Toggle components
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-6">
          <div>
            <h3 class="text-sm font-medium mb-4">Sizes - Default Type</h3>
            <div class="flex items-center gap-6 flex-wrap">
              <div class="flex flex-col gap-2">
                <Toggle v-model:checked="toggleStates.defaultS" size="S" type="Default" label="Toggle" />
                <span class="text-xs text-muted-foreground">Small</span>
              </div>
              <div class="flex flex-col gap-2">
                <Toggle v-model:checked="toggleStates.defaultL" size="L" type="Default" label="Toggle" />
                <span class="text-xs text-muted-foreground">Large</span>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium mb-4">Types - Large Size</h3>
            <div class="flex items-center gap-6 flex-wrap">
              <div class="flex flex-col gap-2">
                <Toggle v-model:checked="toggleStates.defaultL" size="L" type="Default" label="Toggle" />
                <span class="text-xs text-muted-foreground">Default</span>
              </div>
              <div class="flex flex-col gap-2">
                <Toggle v-model:checked="toggleStates.iconL" size="L" type="Icon" label="Toggle" />
                <span class="text-xs text-muted-foreground">Icon</span>
              </div>
              <div class="flex flex-col gap-2">
                <Toggle v-model:checked="toggleStates.shortL" size="L" type="Short" label="Toggle" />
                <span class="text-xs text-muted-foreground">Short</span>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium mb-4">All Variants</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div class="flex flex-col gap-2">
                <Toggle v-model:checked="toggleStates.defaultS" size="S" type="Default" label="Toggle" />
                <span class="text-xs text-muted-foreground">S Default</span>
              </div>
              <div class="flex flex-col gap-2">
                <Toggle v-model:checked="toggleStates.iconS" size="S" type="Icon" label="Toggle" />
                <span class="text-xs text-muted-foreground">S Icon</span>
              </div>
              <div class="flex flex-col gap-2">
                <Toggle v-model:checked="toggleStates.shortS" size="S" type="Short" label="Toggle" />
                <span class="text-xs text-muted-foreground">S Short</span>
              </div>
              <div class="flex flex-col gap-2">
                <Toggle v-model:checked="toggleStates.defaultL" size="L" type="Default" label="Toggle" />
                <span class="text-xs text-muted-foreground">L Default</span>
              </div>
              <div class="flex flex-col gap-2">
                <Toggle v-model:checked="toggleStates.iconL" size="L" type="Icon" label="Toggle" />
                <span class="text-xs text-muted-foreground">L Icon</span>
              </div>
              <div class="flex flex-col gap-2">
                <Toggle v-model:checked="toggleStates.shortL" size="L" type="Short" label="Toggle" />
                <span class="text-xs text-muted-foreground">L Short</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Checkbox,
  Input,
  FloatingActionButton,
  Toggle,
} from '@linarc/design-system'

const termsChecked = ref(false)
const newsletterChecked = ref(false)
const toggleStates = ref({
  defaultS: false,
  defaultL: false,
  iconS: false,
  iconL: false,
  shortS: false,
  shortL: false,
})
</script>
