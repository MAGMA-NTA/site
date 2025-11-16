<template>
    <div>
        <template v-if="Array.isArray(blocks)">
            <template v-for="(block, index) in blocks" :key="index">
                <p
                    v-if="block.type === 'paragraph'"
                    v-html="
                        block.children.map((child) => child.text).join('')
                    "></p>

                <h1
                    v-else-if="block.type === 'heading' && block.level === 1"
                    v-html="block.children[0].text"></h1>
                <h2
                    v-else-if="block.type === 'heading' && block.level === 2"
                    v-html="block.children[0].text"></h2>
                <h3
                    v-else-if="block.type === 'heading' && block.level === 3"
                    v-html="block.children[0].text"></h3>
            </template>
        </template>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps({
    blocks: {
        type: [Array, String],
        required: true,
        default: () => [],
    },
})
</script>
