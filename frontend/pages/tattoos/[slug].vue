<template>
    <Header />
    <div class="bg-black text-white">
        <section class="pt-40 pb-20">
            <div
                v-if="locale === 'en'"
                class="tracking-[0.1em] text-rotating-lg text-yellow w-full text-center"
            >
                Artist page
            </div>
            <div
                v-else
                class="tracking-[0.1em] text-rotating-lg text-yellow w-full text-center"
            >
                Página do artista
            </div>
            <div class="flex gap-10 items-center overflow-hidden leading-none">
                <div
                    v-for="i in 5"
                    class="text-[7.313rem] uppercase tracking-[0.15em] text-nowrap"
                >
                    {{ artist?.Name }}
                </div>
            </div>
            <div
                v-if="artist?.Description"
                class="mt-10 w-full px-10 max-w-[700px] text-center mx-auto text-body"
            >
                <RichText :blocks="artist?.Description" />
            </div>
            <h2 class="title-full mb-5 mt-40">
                <span v-if="locale === 'en'">Tattoos</span>
                <span v-else>Tatuagens</span>
            </h2>

            <div class="columns-2 gap-4 space-y-4 container-xl mt-20">
                <div
                    class="break-inside-avoid"
                    v-for="(tattoo, index) in artist?.Tattoos || []"
                    :key="tattoo?.id || index"
                >
                    <NuxtImg
                        v-if="tattoo.Image?.url"
                        provider="strapi"
                        format="webp"
                        @click="openPopup(tattoo?.id)"
                        class="w-full h-auto cursor-pointer"
                        :src="tattoo?.Image?.url"
                        :alt="(tattoo?.Title || '') + ' tattoo'"
                    />

                    <div
                        :data-name="`popup-${tattoo?.id}`"
                        class="fixed bg-gray w-full h-full top-0 left-0 z-40 text-black hidden overflow-y-auto md:overflow-hidden"
                        data-name="popup"
                    >
                        <div
                            class="flex flex-col md:flex-row justify-between h-full items-center"
                        >
                            <NuxtImg
                                class="w-full md:w-1/2 h-full max-h-[500px] object-cover"
                                v-if="tattoo.Image?.url"
                                provider="strapi"
                                format="webp"
                                :src="tattoo?.Image?.url"
                                :alt="(tattoo?.Title || '') + ' tattoo'"
                            />
                            <div
                                class="w-full md:w-1/2 px-10 lg:px-20 2xl:px-30"
                            >
                                <h3 class="title-lg text-center leading-[1.5]">
                                    <p class="text-teaser">
                                        <span v-if="locale === 'en'">Name</span>
                                        <span v-else>Nome</span>
                                    </p>
                                    Tattoo #{{ index + 1 }}
                                </h3>
                                <ul>
                                    <li
                                        class="flex justify-between border-b-2 border-black py-3"
                                    >
                                        <span
                                            v-if="locale === 'pt'"
                                            class="text-teaser-lg"
                                            >Artista</span
                                        >
                                        <span v-else class="text-teaser-lg"
                                            >Artist</span
                                        >
                                        <span
                                            class="text-teaser-lg normal-case tracking-[0.05em]"
                                        >
                                            {{ artist?.Name }}
                                        </span>
                                    </li>
                                    <li
                                        class="flex justify-between border-b-2 border-black py-3"
                                    >
                                        <span
                                            v-if="locale === 'pt'"
                                            class="text-teaser-lg"
                                            >Dimensões</span
                                        >
                                        <span v-else class="text-teaser-lg"
                                            >Dimensions</span
                                        >
                                        <span
                                            class="text-teaser-lg normal-case tracking-[0.05em]"
                                            >{{ tattoo?.Dimensions }}
                                        </span>
                                    </li>
                                    <li
                                        class="flex justify-between border-b-2 border-black py-3"
                                    >
                                        <span
                                            v-if="locale === 'pt'"
                                            class="text-teaser-lg"
                                            >Exposição</span
                                        >
                                        <span v-else class="text-teaser-lg"
                                            >Exhibition</span
                                        >
                                        <span
                                            class="text-teaser-lg normal-case tracking-[0.05em]"
                                        >
                                            {{ tattoo?.exhibition?.Name }}
                                        </span>
                                    </li>
                                    <li
                                        class="flex justify-between border-b-2 border-black py-3"
                                    >
                                        <span
                                            v-if="locale === 'pt'"
                                            class="text-teaser-lg"
                                            >Preço</span
                                        >
                                        <span v-else class="text-teaser-lg"
                                            >Price</span
                                        >
                                        <span
                                            class="text-teaser-lg normal-case tracking-[0.05em]"
                                            >{{ tattoo?.Price }}
                                        </span>
                                    </li>
                                </ul>

                                <button
                                    class="text-teaser-lg font-bold text-red text-center mt-5 w-full"
                                >
                                    <span v-if="locale === 'en'"
                                        >Contact us for purchase</span
                                    >
                                    <span v-else>Contatar para compra</span>
                                </button>
                            </div>

                            <button
                                class="absolute top-0 right-10 title-lg"
                                @click="closePopup(tattoo?.id)"
                            >
                                X
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section class="py-20">
            <h2 class="title-full mb-10">Exhibitions</h2>
            <div
                v-for="exhibition in exhibitionsLoaded"
                :key="exhibition?.id"
                class="exhibition_link"
            >
                <NuxtLink
                    :to="`${localePath(`/exhibitions/${exhibition?.slug}`)}`"
                    class="flex flex-col md:flex-row justify-between px-3 md:px-10 items-center border-b-2 border-white py-4 relative"
                    :class="
                        exhibition?.Color
                            ? `hover:text-${
                                  exhibition?.Color === 'yellow' ||
                                  exhibition?.Color === 'orange'
                                      ? 'black'
                                      : 'white'
                              } hover:bg-${
                                  exhibition?.Color
                              } hover:border-black`
                            : ''
                    "
                    data-name="exhibition_link"
                >
                    <div class="title-md mb-5 md:mb-0">
                        {{ exhibition?.Name }}
                    </div>

                    <div class="text-detail text-center md:text-right">
                        <div class="font-bold">
                            {{ exhibition.artists?.[0]?.Name }}
                        </div>
                        <div class="tracking-[0.1em]">
                            <Dates
                                :start-date="exhibition?.StartDate"
                                :end-date="exhibition?.EndDate"
                                :date-range="true"
                            />
                        </div>
                    </div>
                    <NuxtImg
                        v-if="exhibition.cover_img?.url"
                        format="webp"
                        class="absolute left-0 bottom-0 opacity-0 pointer-events-none w-[200px] h-[200px]"
                        :src="exhibition?.cover_img?.url"
                        :alt="(exhibition?.Name || '') + ' exhibition cover'"
                        data-name="exhibition_cover"
                    />
                </NuxtLink>
            </div>
        </section>
    </div>

    <MainFooter />
</template>

<script lang="ts" setup>
import type { Artist } from '~/types/strapi'
import type { Exhibition } from '~/types/strapi'
import { useExhibitions } from '~/composables/exhibitions'

const config = useRuntimeConfig()
const route = useRoute()
const { find } = useStrapi()
const { locale } = useI18n()
const localePath = useLocalePath()

const response = await find<Artist>('artists', {
    filters: { slug: route.params.slug },
    populate: {
        exhibitions: {
            populate: '*',
        },
        Tattoos: {
            populate: {
                exhibition: {
                    populate: '*',
                },
                Image: {
                    populate: '*',
                },
                Tattoo: {
                    populate: '*',
                },
            },
        },
    },
    locale: locale.value,
}).catch(() => ({ data: [] }))

const artist = response?.data?.[0]

if (!artist) {
    throw createError({ statusCode: 404, message: 'Artist not found' })
}

const openPopup = (tattooId: string | undefined) => {
    if (!tattooId) return
    const popup = document.querySelector(`[data-name="popup-${tattooId}"]`)
    if (popup) {
        popup.classList.remove('hidden')
        document.body.style.overflow = 'hidden'
    }
}

const closePopup = (tattooId: string | undefined) => {
    if (!tattooId) return
    const popup = document.querySelector(`[data-name="popup-${tattooId}"]`)
    if (popup) {
        popup.classList.add('hidden')
        document.body.style.overflow = 'auto'
    }
}

const length = ref(10)
const { initExhibitions } = useExhibitions()

const exhibitionsLoaded = computed(() => {
    if (!artist?.exhibitions) return []
    return artist.exhibitions.slice(0, length.value)
})

const loadMore = () => {
    length.value += 10
    nextTick(() => {
        initExhibitions()
    })
}

onMounted(() => {
    nextTick(() => {
        initExhibitions()
    })
})
</script>

<style></style>
