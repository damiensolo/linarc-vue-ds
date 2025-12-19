<template>
    <button :class="cn(floatingActionButtonVariants({ size, shape }), props.class)" :disabled="disabled"
        v-bind="$attrs">
        <slot>
            <div v-if="showIcon" class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" data-name="Icon">
                <svg :class="iconSizeClasses" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </div>
        </slot>
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'

const floatingActionButtonVariants = cva(
    'inline-flex items-center justify-center relative transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-indigo-600 text-slate-50 shadow-light-400 hover:bg-indigo-700 active:bg-indigo-800',
    {
        variants: {
            size: {
                S: '',
                M: '',
                L: '',
                XL: '',
            },
            shape: {
                Circle: '',
                Square: '',
            },
        },
        compoundVariants: [
            // XL Circle
            {
                size: 'XL',
                shape: 'Circle',
                class: 'w-16 h-16 rounded-radii-xxl',
            },
            // XL Square
            {
                size: 'XL',
                shape: 'Square',
                class: 'w-16 h-16 rounded-radii-s',
            },
            // L Circle
            {
                size: 'L',
                shape: 'Circle',
                class: 'w-12 h-12 rounded-radii-xxl',
            },
            // L Square
            {
                size: 'L',
                shape: 'Square',
                class: 'w-12 h-12 rounded-radii-s',
            },
            // M Circle
            {
                size: 'M',
                shape: 'Circle',
                class: 'w-10 h-10 rounded-radii-xxl',
            },
            // M Square
            {
                size: 'M',
                shape: 'Square',
                class: 'w-10 h-10 rounded-radii-xs',
            },
            // S Circle
            {
                size: 'S',
                shape: 'Circle',
                class: 'w-8 h-8 rounded-radii-xxl',
            },
            // S Square
            {
                size: 'S',
                shape: 'Square',
                class: 'w-8 h-8 rounded-radii-xs',
            },
        ],
        defaultVariants: {
            size: 'XL',
            shape: 'Circle',
        },
    }
)

type FloatingActionButtonVariants = VariantProps<typeof floatingActionButtonVariants>

interface Props {
    size?: FloatingActionButtonVariants['size']
    shape?: FloatingActionButtonVariants['shape']
    disabled?: boolean
    class?: string
    showIcon?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    size: 'XL',
    shape: 'Circle',
    disabled: false,
    class: '',
    showIcon: true,
})

const iconSizeClasses = computed(() => {
    const sizeMap: Record<string, string> = {
        XL: 'w-8 h-8',
        L: 'w-6 h-6',
        M: 'w-4 h-4',
        S: 'w-4 h-4',
    }
    return sizeMap[props.size || 'XL']
})
</script>
