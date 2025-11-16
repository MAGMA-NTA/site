<template>
    <Header />
    <div class="py-[200px] bg-black">
        <section class="">
            <div
                class="tracking-[0.1em] text-rotating-lg text-yellow flex gap-10 [&_div]:w-full [&_div]:text-center"
            >
                <Dates
                    :start-date="event.StartDate"
                    :end-date="event.EndDate"
                    :hour="true"
                    :date-range="false"
                />
            </div>
            <div
                class="flex gap-10 items-center overflow-hidden leading-none"
                data-name="rotating-text"
            >
                <div
                    v-for="i in 5"
                    class="text-[7.313rem] uppercase tracking-[0.15em] text-nowrap text-white"
                >
                    {{ event.Name }}
                </div>
            </div>
        </section>
        <section class="mt-20">
            <div
                class="flex flex-col-reverse md:flex-row gap-10 relative min-h-screen pb-20 md:pb-0"
            >
                <div class="w-full md:w-4/6 columns-2 gap-4 space-y-4">
                    <div
                        class="break-inside-avoid"
                        v-for="image in event.Gallery"
                        :key="image.id"
                    >
                        <NuxtImg
                            v-if="image?.url"
                            provider="strapi"
                            format="webp"
                            @click="openPopup(image.id)"
                            class="w-full h-auto cursor-pointer"
                            :src="image.url"
                            :alt="image.Title + ' obra'"
                        />

                        <div
                            :data-name="`popup-${image.id}`"
                            class="fixed bg-gray w-full h-full top-0 left-0 z-40 text-black hidden overflow-y-auto"
                        >
                            <div
                                class="flex justify-between min-h-full items-center relative"
                            >
                                <button
                                    class="fixed left-10 top-1/2 -translate-y-1/2 title-xl text-white mix-blend-difference z-50 cursor-pointer"
                                    @click.stop="previousImage(image.id)"
                                >
                                    <
                                </button>

                                <NuxtImg
                                    v-if="image?.url"
                                    provider="strapi"
                                    format="webp"
                                    class="w-full object-contain max-h-none cursor-pointer"
                                    :src="image.url"
                                    :alt="image.Title + ' obra'"
                                    @click="nextImage(image.id)"
                                />

                                <button
                                    class="fixed right-10 top-1/2 -translate-y-1/2 title-xl text-white mix-blend-difference z-50 cursor-pointer"
                                    @click.stop="nextImage(image.id)"
                                >
                                    >
                                </button>

                                <button
                                    class="fixed top-5 right-10 title-lg text-white mix-blend-difference"
                                    @click="closePopup(image.id)"
                                >
                                    X
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    class="w-full md:w-2/6 md:sticky top-10 h-fit text-sm pr-5 text-white"
                >
                    <h3>{{ event.Name }}</h3>
                    <div
                        class="tracking-[0.1em] uppercase text-white flex gap-10"
                    >
                        <Dates
                            :start-date="event.StartDate"
                            :end-date="event.EndDate"
                            :hour="true"
                            :date-range="false"
                        />
                    </div>
                    <RichText class="mt-10" :blocks="event.Description" />
                </div>
            </div>
        </section>
    </div>
    <Faqs :faqs="faqs" />
    <MainFooter></MainFooter>
</template>

<script lang="ts" setup>
const config = useRuntimeConfig()
const route = useRoute()
const { find } = useStrapi()
const { locale } = useI18n()

const response = await find<Event>('events', {
    filters: { id: route.params.id },
    populate: {
        '*': true,
        Gallery: {
            populate: '*',
        },
        events_faqs: {
            populate: {
                faqsList: {
                    populate: '*',
                },
            },
        },
    },
    locale: locale.value,
}).catch(() => ({ data: [] }))

const event = response?.data?.[0]

if (!event) {
    throw createError({ statusCode: 404, message: 'Event not found' })
}

const faqs = event.events_faqs?.faqsList || []

const currentImageId = ref<string | null>(null)

const openPopup = (obraId: string) => {
    currentImageId.value = obraId
    const popup = document.querySelector(`[data-name="popup-${obraId}"]`)
    document.body.classList.add('overflow-y-hidden')

    if (popup) {
        popup.classList.remove('hidden')
        document.addEventListener('keydown', handleKeyPress)
    }
}

const closePopup = (obraId: string) => {
    currentImageId.value = null
    const popup = document.querySelector(`[data-name="popup-${obraId}"]`)
    document.body.classList.remove('overflow-y-hidden')

    if (popup) {
        popup.classList.add('hidden')
        document.removeEventListener('keydown', handleKeyPress)
    }
}

const handleKeyPress = (event: KeyboardEvent) => {
    if (!currentImageId.value) return

    switch (event.key) {
        case 'ArrowRight':
            nextImage(currentImageId.value)
            break
        case 'ArrowLeft':
            previousImage(currentImageId.value)
            break
        case 'Escape':
            closePopup(currentImageId.value)
            break
    }
}

const nextImage = (currentId: string) => {
    const currentIndex = event.Gallery.findIndex((img) => img.id === currentId)
    const nextIndex = (currentIndex + 1) % event.Gallery.length
    const nextImage = event.Gallery[nextIndex]

    closePopup(currentId)
    openPopup(nextImage.id)
}

const previousImage = (currentId: string) => {
    const currentIndex = event.Gallery.findIndex((img) => img.id === currentId)
    const previousIndex =
        (currentIndex - 1 + event.Gallery.length) % event.Gallery.length
    const previousImage = event.Gallery[previousIndex]

    closePopup(currentId)
    openPopup(previousImage.id)
}
</script>

<style></style>
