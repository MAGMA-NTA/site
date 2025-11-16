<template>
    <div
        class="flex shrink-0 gap-[5vw] items-center h-full inset-0 absolute"></div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    speed: number
    type: 'titles' | 'mood'
}>()
</script>
