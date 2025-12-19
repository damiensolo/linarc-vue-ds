<template>
  <h3 :class="cn('text-2xl font-semibold leading-none tracking-tight', props.class)" v-bind="$attrs">
    <slot />
  </h3>
</template>

<script setup lang="ts">
import { cn } from '../../../utils'

interface Props {
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
})
</script>
