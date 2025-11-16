<template>
    <Header />
    <section class="bg-gray pt-40 pb-20 overflow-x-hidden">
        <h1 v-if="locale === 'en'" class="title-full"> Upcoming events </h1>
        <h1 v-else class="title-full"> Próximos eventos </h1>

        <div
            class="flex overflow-x-auto hide-scrollbar touch-pan-x cursor-grab active:cursor-grabbing gap-4 mt-20 container"
            ref="categoryContainer"
            @mousedown="startDragging"
            @mousemove="onDragging"
            @mouseup="stopDragging"
            @mouseleave="stopDragging"
            @touchstart="startDragging"
            @touchmove="onDragging"
            @touchend="stopDragging"
        >
            <div>
                <button
                    @click="clearCategories"
                    :class="[
                        'button-small group hover:bg-black hover:text-white [&.active]:bg-red [&.active]:text-white whitespace-nowrap',
                        { active: selectedCategories.length === 0 },
                    ]"
                >
                    <span v-if="locale === 'en'" class="text-nav-sm">All</span>
                    <span v-else class="text-nav-sm">Todos</span>
                </button>
            </div>
            <div v-for="category in categories">
                <button
                    @click="toggleCategory(category.id)"
                    :class="[
                        'button-small group hover:bg-black hover:text-white [&.active]:bg-red [&.active]:text-white whitespace-nowrap',
                        { active: selectedCategories.includes(category.id) },
                    ]"
                >
                    <span class="text-nav-sm">{{ category.TagName }}</span>
                </button>
            </div>
        </div>

        <div
            class="grid grid-cols-1 md:grid-cols-3 gap-10 mt-20 px-5 md:px-0 container"
        >
            <div v-for="event in upcomingEvents" :key="event.id" class="">
                <NuxtLink :to="localePath(`/events/${event.id}`)">
                    <div
                        class="flex justify-between items-center text-teaser bg-black text-white px-4 py-1"
                    >
                        <Dates
                            class=""
                            v-if="event.StartDate && event.EndDate"
                            :start-date="event.StartDate"
                            :end-date="event.EndDate"
                            :date-range="true"
                            :abbreviate="true"
                            :year="true"
                        />
                        <Dates
                            v-else-if="event.StartDate"
                            :start-date="event.StartDate"
                            :abbreviate="true"
                            :hour="true"
                            :date-range="false"
                            :year="true"
                        />

                        <span v-for="category in event.event_categories">
                            {{ category.tag }}
                        </span>
                    </div>
                    <div class="text-center aspect-[492/701]">
                        <NuxtImg
                            v-if="event.Cover?.url"
                            provider="strapi"
                            format="webp"
                            class="w-full h-full object-cover"
                            :src="event.Cover.url"
                            :alt="event.Cover.alternativeText"
                        />
                        <h2 class="title-md text-center">{{ event.Name }}</h2>
                    </div>
                </NuxtLink>
            </div>
        </div>
    </section>

    <section class="bg-black py-20 text-white overflow-x-hidden">
        <h2 v-if="locale === 'en'" class="title-full">Past events</h2>
        <h2 v-else class="title-full">Eventos pasados</h2>

        <ul
            class="flex overflow-x-auto hide-scrollbar touch-pan-x cursor-grab active:cursor-grabbing gap-4 mt-20 container-xl"
            ref="yearContainer"
            @mousedown="startDraggingYears"
            @mousemove="onDraggingYears"
            @mouseup="stopDraggingYears"
            @mouseleave="stopDraggingYears"
            @touchstart="startDraggingYears"
            @touchmove="onDraggingYears"
            @touchend="stopDraggingYears"
        >
            <li v-for="year in eventYears" :key="year">
                <button
                    @click="setActiveYear(year)"
                    :class="[
                        'button-small group border-white hover:bg-white hover:text-black',
                        { 'bg-white text-black': activeYear === year },
                    ]"
                >
                    <span class="text-nav-sm">{{ year }}</span>
                </button>
            </li>
        </ul>

        <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-10 mt-20 container"
        >
            <div v-for="event in pastEvents" :key="event.id" class="">
                <NuxtLink :to="localePath(`/events/${event.id}`)">
                    <div
                        class="flex justify-between items-center text-date bg-black text-white px-2 py-1 border border-gray"
                    >
                        <Dates
                            class="text-center"
                            :start-date="event.StartDate"
                            :end-date="event.EndDate"
                            :date-range="true"
                            :abbreviate="true"
                            :year="false"
                        />
                    </div>
                    <div class="text-center aspect-[492/701]">
                        <NuxtImg
                            v-if="event.Cover?.url"
                            provider="strapi"
                            format="webp"
                            class="w-full h-full object-cover"
                            :src="event.Cover.url"
                            :alt="event.Cover.alternativeText"
                        />
                        <h2 class="title-md text-center">{{ event.Name }}</h2>
                    </div>
                </NuxtLink>
            </div>
        </div>
    </section>

    <Faqs :faqs="events[0]?.events_faqs?.faqsList || []" />

    <MainFooter></MainFooter>
</template>

<script lang="ts" setup>
const config = useRuntimeConfig()
const { find } = useStrapi()
const { locale } = useI18n()
const localePath = useLocalePath()

const getCategories = await find<EventCategory[]>('event-categories', {
    locale: locale.value,
})

const categories = getCategories.data

const response = await find<Event[]>('events', {
    populate: {
        events_faqs: {
            populate: '*',
        },
        event_categories: {
            populate: '*',
        },
        Cover: {
            populate: '*',
        },
        location: {
            populate: '*',
        },
    },
    locale: locale.value,
}).catch(() => ({ data: [] }))

const events = response?.data || []

const length = ref(10)
const loadMore = () => {
    length.value += 10
}

const selectedCategories = ref<number[]>([])

const toggleCategory = (categoryId: number) => {
    const index = selectedCategories.value.indexOf(categoryId)
    if (index === -1) {
        selectedCategories.value.push(categoryId)
    } else {
        selectedCategories.value.splice(index, 1)
    }
}

const clearCategories = () => {
    selectedCategories.value = []
}

const sortedEvents = computed(() => {
    return events
        .sort((a, b) => {
            const dateA = new Date(a.StartDate).getTime()
            const dateB = new Date(b.StartDate).getTime()
            return dateB - dateA
        })
        .slice(0, 6)
})

const eventYears = computed(() => {
    const now = new Date().getTime()
    const years = [
        ...new Set(
            events
                .filter((event) => {
                    const startDate = new Date(event.StartDate).getTime()
                    return !isNaN(startDate) && startDate < now
                })
                .map((event) => new Date(event.StartDate).getFullYear())
        ),
    ]
    return years.sort((a, b) => b - a)
})

// Change to nullable type to allow deselection
const activeYear = ref<number | null>(eventYears.value?.[0] ?? null)

const setActiveYear = (year: number) => {
    // Toggle the year: if it's already selected, deselect it
    activeYear.value = activeYear.value === year ? null : year
}

const pastEvents = computed(() => {
    const now = new Date().getTime()
    let filtered = events
        .filter((event) => {
            const startDate = new Date(event.StartDate)
            return !isNaN(startDate.getTime()) && startDate.getTime() < now
        })
        .sort((a, b) => {
            const dateA = new Date(a.StartDate).getTime()
            const dateB = new Date(b.StartDate).getTime()
            return dateB - dateA
        })

    if (activeYear.value) {
        filtered = filtered.filter(
            (event) =>
                new Date(event.StartDate).getFullYear() === activeYear.value
        )
    }

    return filtered
})

const upcomingEvents = computed(() => {
    const now = new Date().getTime()
    let filtered = events
        .filter((event) => {
            const startDate = new Date(event.StartDate)
            return !isNaN(startDate.getTime()) && startDate.getTime() >= now
        })
        .sort((a, b) => {
            const dateA = new Date(a.StartDate).getTime()
            const dateB = new Date(b.StartDate).getTime()
            return dateB - dateA
        })

    if (selectedCategories.value.length > 0) {
        filtered = filtered.filter((event) =>
            event.event_categories.some((cat) =>
                selectedCategories.value.includes(cat.id)
            )
        )
    }

    return filtered
})

// Add these new refs and methods for year scrolling
const yearContainer = ref<HTMLElement | null>(null)
const isDraggingYears = ref(false)
const startXYears = ref(0)
const scrollLeftYears = ref(0)

const startDraggingYears = (e: MouseEvent | TouchEvent) => {
    isDraggingYears.value = true
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    startXYears.value = clientX - (yearContainer.value?.offsetLeft || 0)
    scrollLeftYears.value = yearContainer.value?.scrollLeft || 0
}

const onDraggingYears = (e: MouseEvent | TouchEvent) => {
    if (!isDraggingYears.value) return
    e.preventDefault()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const x = clientX - (yearContainer.value?.offsetLeft || 0)
    const walk = (x - startXYears.value) * 2
    if (yearContainer.value) {
        yearContainer.value.scrollLeft = scrollLeftYears.value - walk
    }
}

const stopDraggingYears = () => {
    isDraggingYears.value = false
}

// Add this to your template section, temporarily
</script>
