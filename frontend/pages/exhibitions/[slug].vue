<template>
    <Header />
    <div class="bg-black text-white pt-40 pb-20">
        <section>
            <div
                class="tracking-[0.1em] text-rotating-lg text-yellow flex gap-10 [&_div]:w-full [&_div]:text-center"
            >
                <Dates
                    :start-date="exhibition.StartDate"
                    :end-date="exhibition.EndDate"
                    :date-range="true"
                />
            </div>
            <div class="overflow-hidden leading-none">
                <div
                    class="loop flex gap-10 items-center w-fit"
                    data-speed="slow"
                >
                    <div
                        data-name="rotating-text"
                        v-for="i in 5"
                        class="text-[7.313rem] uppercase tracking-[0.15em] text-nowrap"
                    >
                        {{ exhibition.artists?.[0]?.Name }}
                        {{ exhibition.Name }}
                    </div>
                </div>
            </div>
        </section>
        <section class="mt-20">
            <div
                class="flex flex-col-reverse px-5 md:px-0 md:flex-row gap-10 relative min-h-screen"
            >
                <div class="md:w-4/6 columns-2 gap-4 space-y-4">
                    <div
                        class="break-inside-avoid"
                        v-for="obra in exhibition.piece"
                        :key="obra.id"
                    >
                        <NuxtImg
                            v-if="obra.Image?.url"
                            provider="strapi"
                            format="webp"
                            @click="openPopup(obra.id)"
                            class="w-full h-auto cursor-pointer"
                            :src="obra.Image.url"
                            :alt="obra.Title + ' obra'"
                        />

                        <div
                            :data-name="`popup-${obra.id}`"
                            class="fixed bg-gray w-full h-full top-0 left-0 z-40 text-black hidden overflow-y-auto"
                            data-name="popup"
                        >
                            <div
                                class="flex flex-col md:flex-row justify-between h-full items-center"
                            >
                                <NuxtImg
                                    v-if="obra.Image?.url"
                                    provider="strapi"
                                    format="webp"
                                    class="w-full md:w-1/2 h-full object-cover"
                                    :src="obra.Image.url"
                                    :alt="obra.Title + ' obra'"
                                />
                                <div
                                    class="w-full md:w-1/2 px-5 md:px-10 mt-10 md:mt-0 lg:px-20 2xl:px-30"
                                >
                                    <h3
                                        class="title-lg text-center leading-[1.5] mb-5 md:mb-0"
                                    >
                                        <p class="text-teaser"> Name </p>

                                        {{ obra.Title }}</h3
                                    >
                                    <ul>
                                        <li
                                            class="flex justify-between border-b-2 border-black py-3"
                                        >
                                            <span
                                                v-if="locale === 'en'"
                                                class="text-teaser-lg"
                                                >Artist</span
                                            >
                                            <span v-else class="text-teaser-lg">
                                                Artista
                                            </span>
                                            <span
                                                class="text-teaser-lg normal-case tracking-[0.05em]"
                                            >
                                                {{
                                                    exhibition.artists?.[0]
                                                        ?.Name
                                                }}
                                            </span>
                                        </li>
                                        <li
                                            class="flex justify-between border-b-2 border-black py-3"
                                        >
                                            <span
                                                v-if="locale === 'en'"
                                                class="text-teaser-lg"
                                                >Width</span
                                            >
                                            <span v-else class="text-teaser-lg"
                                                >Largura</span
                                            >
                                            <span
                                                class="text-teaser-lg normal-case tracking-[0.05em]"
                                                >{{ obra.Width }}
                                            </span>
                                        </li>
                                        <li
                                            class="flex justify-between border-b-2 border-black py-3"
                                        >
                                            <span
                                                v-if="locale === 'en'"
                                                class="text-teaser-lg"
                                                >Height</span
                                            >
                                            <span v-else class="text-teaser-lg"
                                                >Altura</span
                                            >
                                            <span
                                                class="text-teaser-lg normal-case tracking-[0.05em]"
                                                >{{ obra.Height }}
                                            </span>
                                        </li>
                                        <li
                                            class="flex justify-between border-b-2 border-black py-3"
                                        >
                                            <span
                                                v-if="locale === 'en'"
                                                class="text-teaser-lg"
                                                >Depth</span
                                            >
                                            <span v-else class="text-teaser-lg"
                                                >Profundidade</span
                                            >
                                            <span
                                                class="text-teaser-lg normal-case tracking-[0.05em]"
                                                >{{ obra.Depth }}</span
                                            >
                                        </li>
                                        <li
                                            class="flex justify-between border-b-2 border-black py-3"
                                        >
                                            <span
                                                v-if="locale === 'en'"
                                                class="text-teaser-lg"
                                                >Medium</span
                                            >
                                            <span v-else class="text-teaser-lg"
                                                >Meio</span
                                            >
                                            <span
                                                class="text-teaser-lg normal-case tracking-[0.05em]"
                                                >{{ obra.Medium }}</span
                                            >
                                        </li>
                                    </ul>
                                    <p
                                        class="text-sm py-5 border-b-2 border-black"
                                    >
                                        {{ obra.Description }}
                                    </p>

                                    <button
                                        class="text-teaser-lg font-bold text-red text-center mt-5 w-full"
                                    >
                                        <span v-if="locale === 'en'">
                                            Contact us for purchase
                                        </span>
                                        <span v-else>
                                            Contactar para compra
                                        </span>
                                    </button>
                                </div>

                                <button
                                    class="absolute top-0 right-10 title-lg"
                                    @click="closePopup(obra.id)"
                                >
                                    X
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="md:w-2/6 md:sticky top-10 h-fit text-sm pr-5">
                    <!-- <h3>{{ exhibition.Name }}</h3> -->
                    <!-- <p>{{ exhibition.artists[0].Name }}</p> -->
                    <div
                        class="tracking-[0.1em] uppercase text-white flex gap-10"
                    >
                        <Dates
                            :start-date="exhibition.StartDate"
                            :end-date="exhibition.EndDate"
                            :date-range="true"
                        />
                    </div>
                    <RichText class="mt-10" :blocks="exhibition.Description" />

                    <NuxtLink
                        :to="`${localePath(
                            `/tattoos/${exhibition.artists?.[0]?.slug}`
                        )}`"
                        class="button button--solid button--blue mt-5"
                    >
                        Flash designs
                    </NuxtLink>
                </div>
            </div>
        </section>

        <!-- <section class="mt-20">
            <h2 class="title-full">Other Exhibitions</h2>
            <div class="mt-12">
                <div
                    v-for="exhibition in exhibitionsLoaded"
                    :key="exhibition.id"
                    class="">
                    <NuxtLink
                        :to="{
                            name: 'exhibitions-slug',
                            params: {
                                id: exhibition.id,
                                slug: exhibition.slug,
                            },
                        }"
                        class="flex flex-col md:flex-row justify-between px-3 md:px-10 items-center border-b-2 border-white py-4 relative"
                        :class="textColor">
                        <div class="title-md mb-5 md:mb-0">
                            {{ exhibition.Name }}
                        </div>

                        <div class="text-detail text-center md:text-right">
                            <div class="font-bold mb-2 md:mb-0">
                                {{ exhibition.artists?.[0]?.Name }}
                            </div>
                            <div class="tracking-[0.1em]">
                                <Dates
                                    :start-date="exhibition.StartDate"
                                    :end-date="exhibition.EndDate"
                                    :date-range="true" />
                            </div>
                        </div>
                        <NuxtImg
                            class="absolute right-0 top-0 opacity-0 pointer-events-none"
                            v-if="exhibition.cover_img"
                            :src="
                                `${config.public.strapiUrl}` +
                                exhibition.cover_img.url
                            "
                            :alt="exhibition.Name + ' exhibition cover'" />
                    </NuxtLink>
                </div>
            </div>
        </section> -->
    </div>

    <MainFooter></MainFooter>
</template>

<script lang="ts" setup>
import type { Exhibition } from '~/types/strapi'

const config = useRuntimeConfig()
const route = useRoute()
const { find } = useStrapi()
const client = useStrapiClient()

const { locale } = useI18n()
const localePath = useLocalePath()

const response = await find<Exhibition>('exhibitions', {
    filters: { slug: route.params.slug },
    locale: locale.value,
    populate: {
        artists: {
            populate: '*',
        },
        piece: {
            populate: '*',
        },
        cover_img: {
            populate: '*',
        },
    },
}).catch(() => ({ data: [] }))

const exhibition = response?.data?.[0]

if (!exhibition) {
    throw createError({ statusCode: 404, message: 'Exhibition not found' })
}

const length = ref(10)
const loadMore = () => {
    length.value += 10
}
const exhibitionsResponse = await client<{ data: Exhibition[] }>(
    'exhibitions',
    {
        params: {
            populate: ['artists', 'cover_img'],
        },
    }
).catch(() => ({ data: [] }))

const exhibitions = exhibitionsResponse?.data || []

const exhibitionsLoaded = computed(() => {
    if (!exhibitions || !Array.isArray(exhibitions)) return []
    return exhibitions
        .filter((ex) => ex.id !== exhibition.id)
        .sort((a, b) => {
            const dateA = new Date(a?.StartDate || 0).getTime()
            const dateB = new Date(b?.StartDate || 0).getTime()
            return dateB - dateA
        })
        .slice(0, length.value)
})

const selectedObra = ref(null)

const openPopup = (obraId: string) => {
    const popup = document.querySelector(`[data-name="popup-${obraId}"]`)
    document.body.classList.add('overflow-y-hidden')
    if (popup) {
        popup.classList.remove('hidden')
    }
}

const closePopup = (obraId: string) => {
    const popup = document.querySelector(`[data-name="popup-${obraId}"]`)
    if (popup) {
        popup.classList.add('hidden')
    }
    document.body.classList.remove('overflow-y-hidden')
}

// Add event listener for ESC key
onMounted(() => {
    window.addEventListener('keydown', handleEscKey)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleEscKey)
})

const handleEscKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
        // Find any popup that's currently visible
        const openPopup = document.querySelector(
            '[data-name^="popup-"]:not(.hidden)'
        )
        if (openPopup) {
            // Extract the obra ID from the data-name attribute
            const obraId = openPopup.getAttribute('data-name').split('-')[1]
            closePopup(obraId)
        }
    }
}
</script>

<style></style>
