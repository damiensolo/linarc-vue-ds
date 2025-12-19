<template>
    <CheckboxRoot :class="cn(
        'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
        props.class
    )" :checked="checked" :disabled="disabled" v-bind="$attrs"
        @update:checked="(checked: boolean | 'indeterminate') => $emit('update:checked', checked)">
        <CheckboxIndicator class="flex items-center justify-center text-current">
            <CheckIcon class="h-4 w-4" />
        </CheckboxIndicator>
    </CheckboxRoot>
</template>

<script setup lang="ts">
import { CheckboxRoot, CheckboxIndicator } from 'reka-ui'
import { CheckIcon } from 'lucide-vue-next'
import { cn } from '../../../utils'

interface Props {
    checked?: boolean | 'indeterminate'
    disabled?: boolean
    class?: string
}

const props = withDefaults(defineProps<Props>(), {
    checked: false,
    disabled: false,
    class: '',
})

defineEmits<{
    'update:checked': [checked: boolean | 'indeterminate']
}>()
</script>
