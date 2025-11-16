<template>
    <Head :seo="home?.data?.seo" />
    <Header />
    <div id="page-wrap" class="home overflow-x-hidden">
        <section
            id="intro"
            class="w-full min-h-screen container flex flex-col items-center justify-center pb-20"
        >
            <div
                class="relative flex flex-col min-[1112px]:flex-row xl:flex-col mt-40 mx-40 md:px-0 min-[1112px]:mt-0 lg:mt-[7rem] xl:mt-20 md:ml-10 xl:ml-[10.995vw]"
            >
                <h1 v-if="home?.data?.BigTitle" class="title-xl md:w-8/12">
                    {{ home?.data?.BigTitle }}
                </h1>
                <div
                    class="text-body mt-5 min-[1112px]:mt-10 w-10/12 sm:w-4/12 md:w-7/12 min-[1112px]:w-4/12 ml-10 md:ml-10 xl:ml-[30.613vw]"
                >
                    <RichText
                        v-if="home?.data?.Intro"
                        :blocks="home?.data?.Intro"
                    />
                </div>
            </div>

            <div
                class="absolute bottom-5 2xl:bottom-10 left-0 right-0 hidden md:flex flex-col md:flex-row gap-6 xl:gap-12 justify-center pointer-events-none items-end mt-5 xl:mt-20"
            >
                <nuxt-link
                    class="button button--green"
                    :class="{ active: $route.path.includes('exhibitions') }"
                    :to="localePath('/exhibitions')"
                    ><span v-if="i18n.locale.value === 'en'"> Gallery </span>
                    <span v-else> Galeria </span></nuxt-link
                >
                <nuxt-link
                    class="button button--red"
                    :class="{ active: $route.path.includes('events') }"
                    :to="localePath('/events')"
                    ><span v-if="i18n.locale.value === 'en'"> Events </span>
                    <span v-else> Eventos </span></nuxt-link
                >
                <nuxt-link
                    class="button button--blue"
                    :class="{ active: $route.path.includes('tattoos') }"
                    :to="localePath('/tattoos')"
                    ><span v-if="i18n.locale.value === 'en'"> Tattoos </span>
                    <span v-else> Tatuagens </span></nuxt-link
                >
            </div>

            <div class="w-full">
                <div
                    class="sm:max-w-[30vw] min-[1112px]:max-w-[18.634vw] md:absolute right-5 bottom-10 md:bottom-20 2xl:bottom-10 mt-10 md:mt-0"
                >
                    <ul
                        class="text-rotating-xs border border-black bg-black [&_li]:text-yellow py-2 overflow-hidden"
                    >
                        <li>
                            <ul class="flex gap-2 loop" data-speed="fastest">
                                <li v-if="i18n.locale.value === 'en'"
                                    >Upcoming</li
                                >
                                <li v-else>Próximos</li>
                                <li v-if="i18n.locale.value === 'en'"
                                    >Upcoming</li
                                >
                                <li v-else>Próximos</li>
                                <li v-if="i18n.locale.value === 'en'"
                                    >Upcoming</li
                                >
                                <li v-else>Próximos</li>
                                <li v-if="i18n.locale.value === 'en'"
                                    >Upcoming</li
                                >
                                <li v-else>Próximos</li>
                                <li v-if="i18n.locale.value === 'en'"
                                    >Upcoming</li
                                >
                                <li v-else>Próximos</li>
                            </ul>
                        </li>
                    </ul>
                    <Swiper
                        v-if="sortedEvents.length > 0"
                        :space-between="0.15"
                        :modules="[Autoplay, Pagination]"
                        :autoplay="{ delay: 4000, disableOnInteraction: false }"
                        :speed="400"
                        :pagination="{
                            el: '.pagination',
                            bulletClass: 'swiper-pagination-bullet',
                            clickable: true,
                        }"
                        class="text-center children:px-5"
                    >
                        <SwiperSlide
                            v-for="event in sortedEvents"
                            :key="event.id"
                        >
                            <nuxt-link :to="'/events/' + event.id">
                                <p
                                    class="text-teaser-lg border-2 border-black py-5"
                                >
                                    {{ event.Name }}
                                </p>

                                <div
                                    class="text-date py-2 border-2 -mt-[2px] border-black font-medium"
                                >
                                    <Dates :start-date="event.StartDate" />
                                </div>
                            </nuxt-link>
                        </SwiperSlide>
                    </Swiper>
                    <div class="relative pagination">
                        <div class="swiper-pagination-bullets"></div>
                    </div>
                </div>
            </div>
        </section>

        <section class="bg-black pb-24 overflow-x-hidden">
            <div class="loop flex gap-10 flex-nowrap w-fit" data-speed="slow">
                <div
                    class="w-full overflow-hidden flex flex-nowrap text-nowrap gap-10 py-5"
                >
                    <div
                        v-if="latestExhibition"
                        v-for="i in 4"
                        :key="i"
                        class="text-rotating-lg text-yellow flex gap-10"
                    >
                        <span>
                            {{ latestExhibition.Name }}
                        </span>
                        <Dates :start-date="latestExhibition.StartDate" />
                        <span>
                            {{ latestExhibition.artists?.[0]?.Name }}
                        </span>
                    </div>
                </div>
            </div>

            <h2 v-if="i18n.locale.value === 'en'" class="title-full text-white">
                Current Exhibition
            </h2>
            <h2 v-else class="title-full text-white">Exposição Atual</h2>
            <div v-if="latestExhibition" class="container mt-12 md:mt-24">
                <NuxtLink
                    :to="`${localePath(
                        `/exhibitions/${latestExhibition.slug}`
                    )}`"
                    class=""
                >
                    <NuxtImg
                        v-if="latestExhibition.cover_img?.url"
                        provider="strapi"
                        format="webp"
                        class="w-full aspect-[210/297] object-cover"
                        :src="latestExhibition.cover_img.url"
                    />
                </NuxtLink>
            </div>
        </section>

        <section
            v-if="exhibitions && exhibitions.length > 0"
            class="mt-10 md:mt-24"
        >
            <h2 v-if="i18n.locale.value === 'en'" class="title-full">
                Past Exhibitions
            </h2>
            <h2 v-else class="title-full">Exposições Passadas</h2>
            <div class="mt-12">
                <div
                    v-for="exhibition in exhibitionsLoaded"
                    :key="exhibition.id"
                    class="exhibition_link"
                    ref="exhibitionItem"
                >
                    <NuxtLink
                        v-if="exhibition.slug"
                        :to="`${localePath(`/exhibitions/${exhibition.slug}`)}`"
                        class="flex flex-col md:flex-row justify-between px-3 md:px-10 items-center border-b-2 border-black py-4 relative"
                        :class="
                            exhibition.Color
                                ? `hover:text-${
                                      exhibition.Color === 'yellow' ||
                                      exhibition.Color === 'orange'
                                          ? 'black'
                                          : 'white'
                                  } hover:bg-${exhibition.Color}`
                                : ''
                        "
                        data-name="exhibition_link"
                    >
                        <div class="title-md mb-5 md:mb-0">
                            {{ exhibition.Name }}
                        </div>

                        <div class="text-detail text-center md:text-right">
                            <div class="font-bold">
                                {{ exhibition.artists?.[0]?.Name }}
                            </div>
                            <div class="tracking-[0.1em]">
                                <Dates
                                    :start-date="exhibition.StartDate"
                                    :end-date="exhibition.EndDate"
                                    :date-range="true"
                                />
                            </div>
                        </div>
                        <NuxtImg
                            v-if="exhibition.cover_img?.url"
                            provider="strapi"
                            format="webp"
                            class="absolute left-0 bottom-0 opacity-0 pointer-events-none w-[200px] h-[200px]"
                            :src="exhibition.cover_img.url"
                            :alt="exhibition.Name + ' exhibition cover'"
                            data-name="exhibition_cover"
                        />
                    </NuxtLink>
                </div>
            </div>
            <button
                class="w-full text-center py-10 border border-black uppercase text-teaser-lg"
                @click="loadMore"
                v-if="exhibitionsLoaded.length < exhibitions.length"
                >Load More</button
            >
        </section>

        <section
            v-if="home?.data?.Mood && home.data.Mood.length > 0"
            class="min-h-screen bg-green overflow-hidden relative flex"
        >
            <div
                class="flex gap-[5vw] items-center h-full w-max inset-0 absolute loop"
                data-speed="fast"
            >
                <div
                    v-for="mood in home?.data?.Mood"
                    :key="mood.id"
                    class="h-fit flex items-center aspect-square my-20"
                >
                    <div
                        class="w-[80vw] min-h-[80vw] md:w-[30rem] md:min-h-[30rem] relative"
                    >
                        <div
                            v-if="mood.Quote || mood.Name || mood.URL"
                            :class="[
                                'bg-yellow border-[20px] md:border-[3em] border-white absolute top-0 left-0 w-full h-full flex flex-col justify-end p-5 md:px-20 md:pb-10',
                                { 'cursor-pointer': mood.URL },
                            ]"
                            @click="mood.URL && openLink(mood.URL)"
                        >
                            <div v-if="mood.Quote" class="text-base">
                                {{ mood.Quote }}
                            </div>
                            <div v-if="mood.Name" class="text-base font-bold">
                                {{ mood.Name }}
                            </div>
                        </div>

                        <div
                            v-if="mood.Image && mood.Image.url"
                            class="w-full h-full"
                        >
                            <NuxtImg
                                provider="strapi"
                                format="webp"
                                class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-auto object-cover"
                                :src="mood.Image.url"
                                :alt="mood.Title + ' image'"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <MainFooter></MainFooter>
    </div>
</template>

<script lang="ts" setup>
import type { Home, Event, Exhibition } from '~/types/strapi'
import { Pagination, Autoplay } from 'swiper/modules'
import { loop } from '~/composables/loop'
import { useExhibitions } from '~/composables/exhibitions'

const config = useRuntimeConfig()
const client = useStrapiClient()
const { find } = useStrapi()
const i18n = useI18n()
const localePath = useLocalePath()

const home = await find<Home>('home', {
    populate: {
        exhibitions: {
            populate: '*',
        },
        Mood: {
            populate: '*',
        },
        seo: {
            populate: '*',
        },
    },
    locale: i18n.locale.value,
}).catch(() => ({ data: null }))

const events = await find<Event[]>('events', {
    populate: '*',
    locale: i18n.locale.value,
}).catch(() => ({ data: [] }))

const length = ref(10)
const { initExhibitions } = useExhibitions()
const loadMore = () => {
    length.value += 10
    nextTick(() => {
        initExhibitions()
    })
}

const sortedEvents = computed(() => {
    if (!events?.data || events.data.length === 0) return []
    return events.data
        .slice()
        .sort((a, b) => {
            const dateA = new Date(a.attributes?.StartDate || 0).getTime()
            const dateB = new Date(b.attributes?.StartDate || 0).getTime()
            return dateB - dateA
        })
        .slice(0, 5)
})

const exhibitionsResponse = await client<{ data: Exhibition[] }>(
    'exhibitions',
    {
        params: {
            populate: '*',
        },
        locale: i18n.locale.value,
    }
).catch(() => ({ data: [] }))

const exhibitions = exhibitionsResponse?.data || []

const latestExhibition = computed(() => {
    if (!exhibitions || exhibitions.length === 0) return null
    return exhibitions.slice().sort((a, b) => {
        const dateA = new Date(a?.StartDate || 0).getTime()
        const dateB = new Date(b?.StartDate || 0).getTime()
        return dateB - dateA
    })[0]
})

const exhibitionsLoaded = computed(() => {
    if (!exhibitions || exhibitions.length === 0) return []
    return exhibitions
        .slice()
        .sort((a, b) => {
            const dateA = new Date(a?.StartDate || 0).getTime()
            const dateB = new Date(b?.StartDate || 0).getTime()
            return dateB - dateA
        })
        .slice(0, length.value)
})

const openLink = (url) => {
    window.open(url, '_blank')
}

onMounted(() => {
    loop('.loop')
    nextTick(() => {
        initExhibitions()
    })
})
</script>

<style></style>
