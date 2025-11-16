<template>
    <section
        class="bg-gray justify-center flex flex-col items-center pb-20 py-10">
        <h2 v-if="locale === 'en'" class="title-full">
            Frequently Asked Questions
        </h2>
        <h2 v-else class="title-full"> Perguntas Frequentes </h2>
        <div class="w-full px-10 md:px-0 md:w-1/2 mt-5 md:mt-20">
            <div
                v-for="(faq, index) in props.faqs"
                :key="index"
                class="border-b-2 border-black">
                <h3
                    @click="toggleAccordion(index)"
                    class="text-lg px-2 flex gap-2 cursor-pointer py-5 title-lg normal-case tracking-[0em] leading-[1.5]">
                    <span class="h-full">{{ index + 1 }}.</span>
                    <span>{{ faq.Question }}?</span>
                </h3>
                <div v-show="isOpen[index]" class="px-7 pb-5 text-sm">
                    <RichText :blocks="faq.Answer" />
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
import type { Faq } from '~/types/strapi'

const { locale } = useI18n()

const props = defineProps({
    faqs: { type: Array as PropType<Faq[]>, required: true },
})

const faq = ref<Faq>()

const isOpen = ref<boolean[]>(Array(props.faqs.length).fill(false))

const toggleAccordion = (index: number) => {
    isOpen.value[index] = !isOpen.value[index]
}
</script>
