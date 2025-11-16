<template>
    <Header />
    <section class="pt-40">
        <h2 v-if="locale === 'en'" class="title-full">All exhibitions</h2>
        <h2 v-else class="title-full">Todas as exposições</h2>
        <div v-if="exhibitions.length > 0" class="mt-12">
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
                            {{
                                exhibition.artists &&
                                exhibition.artists.length > 1
                                    ? locale === 'en'
                                        ? 'Collective exhibition'
                                        : 'Exposição coletiva'
                                    : exhibition.artists?.[0]?.Name
                            }}
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
                        format="webp"
                        class="absolute left-0 bottom-0 opacity-0 pointer-events-none w-[200px] h-[200px]"
                        :src="exhibition.cover_img.url"
                        :alt="exhibition.Name + ' exhibition cover'"
                        data-name="exhibition_cover"
                    />
                </NuxtLink>
            </div>
        </div>
        <div v-else>
            <h2 v-if="locale === 'en'" class="title-full">No exhibitions</h2>
            <h2 v-else class="title-full">Nenhuma exposição</h2>
        </div>
        <button
            class="w-full text-center py-10 border border-black uppercase text-teaser-lg"
            @click="loadMore"
            v-if="exhibitionsLoaded.length < exhibitions.length"
            >Load More</button
        >
    </section>

    <MainFooter></MainFooter>
</template>

<script lang="ts" setup>
import type { Exhibition } from '@/types/strapi'
import { useExhibitions } from '@/composables/exhibitions'

const config = useRuntimeConfig()
const client = useStrapiClient()
const { locale } = useI18n()
const localePath = useLocalePath()

const length = ref(10)
const { initExhibitions } = useExhibitions()
const loadMore = () => {
    length.value += 10
    nextTick(() => {
        initExhibitions()
    })
}

const { data: exhibitions } = await client<{ data: Exhibition[] }>(
    'exhibitions',
    {
        params: {
            populate: ['artists', 'cover_img'],
        },
        locale: locale.value,
    }
)

const exhibitionsLoaded = computed(() => {
    return exhibitions
        .slice()
        .sort((a, b) => {
            const dateA = new Date(a.StartDate).getTime()
            const dateB = new Date(b.StartDate).getTime()
            return dateB - dateA
        })
        .slice(0, length.value)
})

const textColor = computed(() => {
    return 'hover:text-black' // or whatever default color class you want
})

onMounted(() => {
    nextTick(() => {
        initExhibitions()
    })
})
</script>

<style></style>
