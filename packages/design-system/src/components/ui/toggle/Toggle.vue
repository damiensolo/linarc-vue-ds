<template>
  <div :class="cn('inline-flex items-center gap-2', containerClasses)">
    <button
      :class="cn(toggleVariants({ size, type, state: checked }), props.class)"
      :disabled="disabled"
      :aria-checked="checked"
      :aria-label="label || 'Toggle'"
      role="switch"
      v-bind="$attrs"
      @click="handleToggle"
    >
      <!-- Track/Base -->
      <div :class="cn(trackClasses, trackBgColor)" data-name="Base">
        <!-- Thumb/Control -->
        <div :class="thumbClasses" data-name="Control">
          <div :class="thumbInnerClasses" class="bg-white rounded-full flex items-center justify-center">
            <!-- Icon for Icon type -->
            <div v-if="type === 'Icon'" class="flex items-center justify-center w-full h-full" data-name="Icon">
              <XIcon v-if="!checked" class="w-2.5 h-2.5 text-[var(--text-body)]" />
              <CheckIcon v-else class="w-2.5 h-2.5 text-[var(--text-body)]" />
            </div>
          </div>
        </div>
      </div>
    </button>
    
    <!-- Label -->
    <label
      v-if="showLabel && label"
      :class="labelClasses"
      :for="toggleId"
    >
      {{ label }}
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'
import { cva, type VariantProps } from 'class-variance-authority'
import { XIcon, CheckIcon } from 'lucide-vue-next'
import { cn } from '../../../utils'

const toggleVariants = cva(
  'relative inline-flex items-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      size: {
        S: '',
        L: '',
      },
      type: {
        Default: '',
        Icon: '',
        Short: '',
      },
      state: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      // L Default - On
      {
        size: 'L',
        type: 'Default',
        state: true,
        class: 'h-5',
      },
      // L Default - Off
      {
        size: 'L',
        type: 'Default',
        state: false,
        class: 'h-5',
      },
      // L Icon - On
      {
        size: 'L',
        type: 'Icon',
        state: true,
        class: 'h-5',
      },
      // L Icon - Off
      {
        size: 'L',
        type: 'Icon',
        state: false,
        class: 'h-5',
      },
      // L Short - On
      {
        size: 'L',
        type: 'Short',
        state: true,
        class: 'h-4',
      },
      // L Short - Off
      {
        size: 'L',
        type: 'Short',
        state: false,
        class: 'h-4',
      },
      // S Default - On
      {
        size: 'S',
        type: 'Default',
        state: true,
        class: 'h-3',
      },
      // S Default - Off
      {
        size: 'S',
        type: 'Default',
        state: false,
        class: 'h-3',
      },
      // S Icon - On
      {
        size: 'S',
        type: 'Icon',
        state: true,
        class: 'h-3',
      },
      // S Icon - Off
      {
        size: 'S',
        type: 'Icon',
        state: false,
        class: 'h-3',
      },
      // S Short - On
      {
        size: 'S',
        type: 'Short',
        state: true,
        class: 'h-4',
      },
      // S Short - Off
      {
        size: 'S',
        type: 'Short',
        state: false,
        class: 'h-4',
      },
    ],
    defaultVariants: {
      size: 'S',
      type: 'Default',
      state: false,
    },
  }
)

type ToggleVariants = VariantProps<typeof toggleVariants>

interface Props {
  size?: ToggleVariants['size']
  type?: ToggleVariants['type']
  checked?: boolean
  disabled?: boolean
  label?: string
  showLabel?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'S',
  type: 'Default',
  checked: false,
  disabled: false,
  label: 'Toggle',
  showLabel: true,
  class: '',
})

const emit = defineEmits<{
  'update:checked': [checked: boolean]
}>()

const toggleId = useId()

const containerClasses = computed(() => {
  if (props.size === 'L') {
    return 'h-8'
  }
  return 'h-6'
})

const trackClasses = computed(() => {
  const base = 'relative shrink-0 rounded-[10px] transition-colors'
  
  // Track width and height based on size and type
  // Short type: smaller track (16px x 16px for both sizes)
  if (props.type === 'Short') {
    return `${base} w-4 h-4`
  }
  // Default and Icon types
  if (props.size === 'L') {
    return `${base} w-9 h-5` // 36px x 20px
  }
  // S size Default/Icon
  return `${base} w-9 h-3` // 36px x 12px
})

const thumbClasses = computed(() => {
  const base = 'absolute top-1/2 -translate-y-1/2 w-4 h-4 transition-transform duration-200 ease-in-out rounded-full'
  
  if (props.checked) {
    // When checked, thumb moves to the right
    if (props.type === 'Short') {
      return `${base} right-0`
    }
    return `${base} right-0.5`
  } else {
    // When unchecked, thumb is on the left
    if (props.type === 'Short') {
      // For Short type (w-4 track), thumb at left edge when unchecked
      return `${base} left-0`
    }
    // For Default/Icon types (w-9 track), thumb at right-[18px] when unchecked
    return `${base} right-[18px]`
  }
})

const thumbInnerClasses = computed(() => {
  if (props.size === 'L' && props.type !== 'Short') {
    return 'absolute inset-0'
  }
  if (props.type === 'Short') {
    return 'absolute inset-[-6.25%_-6.25%_-12.5%_-6.25%]'
  }
  return 'absolute inset-0'
})

const labelClasses = computed(() => {
  if (props.size === 'L') {
    return 'flex flex-col font-["Inter"] font-normal justify-center not-italic relative shrink-0 text-lg text-[var(--text-body)] whitespace-nowrap leading-8'
  }
  return 'flex flex-col font-["Lato"] justify-center not-italic relative shrink-0 text-base text-[var(--text-body)] tracking-[0.032px] whitespace-nowrap leading-6'
})

const handleToggle = () => {
  if (!props.disabled) {
    emit('update:checked', !props.checked)
  }
}

// Dynamic track background color based on state
const trackBgColor = computed(() => {
  if (props.checked) {
    return 'bg-bg-strong'
  }
  return 'bg-bg-subtle'
})
</script>

