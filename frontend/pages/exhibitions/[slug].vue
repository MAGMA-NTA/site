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
                        {{
                            exhibition.artists && exhibition.artists.length > 1
                                ? locale === 'en'
                                    ? 'Collective exhibition'
                                    : 'Exposição coletiva'
                                : exhibition.artists?.[0]?.Name
                        }}
                        -
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
                        v-for="obra in visiblePieces"
                        :key="obra.id"
                    >
                        <NuxtImg
                            v-if="obra.Image?.url"
                            provider="strapi"
                            format="webp"
                            width="800"
                            quality="75"
                            loading="lazy"
                            @click="openPopup(obra.id)"
                            class="w-full h-auto cursor-pointer"
                            :src="obra.Image.url"
                            :alt="obra.Title + ' obra'"
                        />
                    </div>
                </div>

                <!-- Single popup container -->
                <div
                    v-if="currentObraId"
                    class="fixed bg-gray w-full h-full top-0 left-0 z-40 text-black overflow-hidden"
                >
                    <div
                        v-if="currentObra"
                        class="flex flex-col md:flex-row justify-between h-full items-center relative"
                    >
                        <button
                            class="fixed left-1 top-1/2 -translate-y-1/2 title-lg text-white mix-blend-difference z-50 cursor-pointer"
                            @click.stop="previousImage(currentObraId)"
                        >
                            <
                        </button>

                        <div
                            ref="imageContainer"
                            class="w-full md:w-2/3 h-full overflow-hidden relative p-5 bg-black"
                            :class="{
                                'cursor-grab': isZoomed && !isDragging,
                                'cursor-grabbing': isDragging,
                                'cursor-zoom-in': !isZoomed,
                                'cursor-zoom-out': isZoomed,
                            }"
                            @click="handleImageClick"
                            @mousedown.prevent="handleMouseDown"
                        >
                            <NuxtImg
                                v-if="currentObra.Image?.url"
                                ref="currentImage"
                                provider="strapi"
                                format="webp"
                                width="2400"
                                quality="95"
                                :class="[
                                    'w-full h-full object-contain select-none pointer-events-none',
                                    isDragging
                                        ? ''
                                        : 'transition-transform duration-200',
                                ]"
                                :style="getImageTransform()"
                                :src="currentObra.Image.url"
                                :alt="currentObra.Title + ' obra'"
                                @load="handleImageLoad"
                            />
                        </div>
                        <div
                            class="w-full md:w-1/3 px-10 lg:px-16 mt-10 md:mt-0"
                        >
                            <ul>
                                <li
                                    v-for="detail in currentObra.Detail"
                                    :key="detail.id"
                                    class="flex flex-col lg:flex-row lg:justify-between border-b-[1.5px] border-black py-3"
                                >
                                    <span class="text-date">
                                        {{ detail.Select }}
                                    </span>
                                    <span
                                        class="text-teaser normal-case tracking-[0.05em]"
                                    >
                                        {{ detail.Value }}
                                    </span>
                                </li>
                            </ul>

                            <button
                                v-if="isAvailable(currentObra)"
                                class="text-teaser font-bold text-red text-center mt-5 w-full"
                            >
                                <span v-if="locale === 'en'">
                                    Contact us for purchase
                                </span>
                                <span v-else> Contactar para compra </span>
                            </button>
                            <div
                                v-else
                                class="text-teaser text-center mt-5 w-full text-black opacity-30"
                            >
                                <span v-if="locale === 'en'">
                                    Not available for purchase
                                </span>
                                <span v-else> Não disponível para compra </span>
                            </div>
                        </div>

                        <button
                            class="fixed right-1 top-1/2 -translate-y-1/2 title-lg text-white mix-blend-difference z-50 cursor-pointer"
                            @click.stop="nextImage(currentObraId)"
                        >
                            >
                        </button>

                        <button
                            class="fixed top-5 right-10 title-lg text-white mix-blend-difference z-50"
                            @click="closePopup(currentObraId)"
                        >
                            X
                        </button>
                    </div>
                </div>

                <div class="md:w-2/6 md:sticky top-10 h-fit text-sm pr-5">
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
                        v-if="
                            exhibition.artists &&
                            exhibition.artists.length === 1 &&
                            exhibition.artists[0]?.slug
                        "
                        :to="`${localePath(
                            `/tattoos/${exhibition.artists[0].slug}`
                        )}`"
                        class="button button--solid button--blue mt-5"
                    >
                        Flash designs
                    </NuxtLink>
                </div>
            </div>
        </section>
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
            populate: {
                Image: '*',
                Detail: '*',
            },
            fields: ['*'], // Explicitly request all fields including Available
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

const visiblePieces = computed(() => {
    if (!exhibition?.piece || !Array.isArray(exhibition.piece)) return []
    return exhibition.piece.filter((obra: any) => {
        const hideFromWebsite =
            obra.HideFromWebsite ??
            obra.hideFromWebsite ??
            obra.Hide_from_website ??
            obra.hide_from_website
        return !(
            hideFromWebsite === true ||
            hideFromWebsite === 'true' ||
            hideFromWebsite === 1
        )
    })
})

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
const currentObraId = ref<string | null>(null)

// Zoom and drag state
const imageContainer = ref<HTMLElement | null>(null)
const currentImage = ref<HTMLElement | null>(null)
const isZoomed = ref(false)
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const translate = ref({ x: 0, y: 0 })
const lastTranslate = ref({ x: 0, y: 0 })
const zoomScale = ref(2) // 2x zoom
const imageDimensions = ref({
    width: 0,
    height: 0,
    naturalWidth: 0,
    naturalHeight: 0,
})
const hasMoved = ref(false) // Track if mouse moved during drag

const currentObra = computed(() => {
    if (!currentObraId.value) return null
    return visiblePieces.value.find(
        (obra: any) => obra.id === currentObraId.value
    )
})

const isAvailable = (obra: any) => {
    const available =
        obra.Available ??
        obra.available ??
        obra.Available_for_purchase ??
        obra.available_for_purchase ??
        obra.AvailableForPurchase ??
        obra.availableForPurchase ??
        obra.attributes?.Available ??
        obra.attributes?.available

    return (
        available === true ||
        available === 'true' ||
        available === 1 ||
        available === '1'
    )
}

const openPopup = (obraId: string) => {
    currentObraId.value = obraId
    document.body.classList.add('overflow-y-hidden')
    document.addEventListener('keydown', handleKeyPress)

    // Reset zoom and drag state
    isZoomed.value = false
    isDragging.value = false
    translate.value = { x: 0, y: 0 }
    lastTranslate.value = { x: 0, y: 0 }
    hasMoved.value = false
}

const closePopup = (obraId: string) => {
    currentObraId.value = null
    document.body.classList.remove('overflow-y-hidden')
    document.removeEventListener('keydown', handleKeyPress)

    // Reset zoom and drag state
    isZoomed.value = false
    isDragging.value = false
    translate.value = { x: 0, y: 0 }
    lastTranslate.value = { x: 0, y: 0 }
    hasMoved.value = false

    // Clean up drag listeners
    handleMouseUp()
}

const nextImage = (currentId: string) => {
    const currentIndex = visiblePieces.value.findIndex(
        (obra: any) => obra.id === currentId
    )
    if (currentIndex === -1) return

    const nextIndex = (currentIndex + 1) % visiblePieces.value.length
    const nextObra = visiblePieces.value[nextIndex]

    // Update to next obra - no closing/opening, just update the ID
    currentObraId.value = nextObra.id

    // Reset zoom and drag state when switching images
    isZoomed.value = false
    isDragging.value = false
    translate.value = { x: 0, y: 0 }
    lastTranslate.value = { x: 0, y: 0 }
    hasMoved.value = false
    handleMouseUp()
}

const previousImage = (currentId: string) => {
    const currentIndex = visiblePieces.value.findIndex(
        (obra: any) => obra.id === currentId
    )
    if (currentIndex === -1) return

    const previousIndex =
        (currentIndex - 1 + visiblePieces.value.length) %
        visiblePieces.value.length
    const previousObra = visiblePieces.value[previousIndex]

    // Update to previous obra - no closing/opening, just update the ID
    currentObraId.value = previousObra.id

    // Reset zoom and drag state when switching images
    isZoomed.value = false
    isDragging.value = false
    translate.value = { x: 0, y: 0 }
    lastTranslate.value = { x: 0, y: 0 }
    hasMoved.value = false
    handleMouseUp()
}

const handleKeyPress = (event: KeyboardEvent) => {
    if (!currentObraId.value) return

    switch (event.key) {
        case 'ArrowRight':
            nextImage(currentObraId.value)
            break
        case 'ArrowLeft':
            previousImage(currentObraId.value)
            break
        case 'Escape':
            closePopup(currentObraId.value)
            break
    }
}

const handleImageLoad = () => {
    nextTick(() => {
        if (!currentImage.value || !imageContainer.value) return

        const img = imageContainer.value.querySelector(
            'img'
        ) as HTMLImageElement
        if (!img) return

        const container = imageContainer.value
        imageDimensions.value = {
            width: container.offsetWidth,
            height: container.offsetHeight,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
        }
    })
}

const getImageTransform = () => {
    if (!isZoomed.value) {
        return {}
    }

    const scale = zoomScale.value
    const x = translate.value.x
    const y = translate.value.y

    return {
        transform: `translate(${x}px, ${y}px) scale(${scale})`,
        transformOrigin: 'center center',
    }
}

const handleImageClick = (event: MouseEvent) => {
    // Only toggle zoom if it wasn't a drag
    if (hasMoved.value) {
        hasMoved.value = false
        return
    }

    if (!imageContainer.value) return

    const container = imageContainer.value
    const containerRect = container.getBoundingClientRect()

    // Get click position relative to container
    const clickX = event.clientX - containerRect.left
    const clickY = event.clientY - containerRect.top

    // Container center
    const centerX = containerRect.width / 2
    const centerY = containerRect.height / 2

    // Offset from center
    const offsetX = clickX - centerX
    const offsetY = clickY - centerY

    if (!isZoomed.value) {
        // Zoom in at click position
        // With transform-origin center, scaling happens from center
        // To keep clicked point under cursor, translate by -offset * (scale - 1)
        isZoomed.value = true
        const initialTranslateX = -offsetX * (zoomScale.value - 1)
        const initialTranslateY = -offsetY * (zoomScale.value - 1)

        translate.value = {
            x: initialTranslateX,
            y: initialTranslateY,
        }
        lastTranslate.value = { ...translate.value }

        // Clamp to boundaries after setting initial position
        nextTick(() => {
            const bounds = getPanBounds()
            translate.value = {
                x: Math.max(
                    bounds.minX,
                    Math.min(bounds.maxX, translate.value.x)
                ),
                y: Math.max(
                    bounds.minY,
                    Math.min(bounds.maxY, translate.value.y)
                ),
            }
            lastTranslate.value = { ...translate.value }
        })
    } else {
        // Zoom out - reset to center
        isZoomed.value = false
        translate.value = { x: 0, y: 0 }
        lastTranslate.value = { x: 0, y: 0 }
    }
}

const handleMouseDown = (event: MouseEvent) => {
    // Store initial mouse position
    dragStart.value = { x: event.clientX, y: event.clientY }
    hasMoved.value = false

    if (isZoomed.value) {
        event.preventDefault()
        event.stopPropagation()

        // Start dragging when zoomed
        isDragging.value = true
        lastTranslate.value = { ...translate.value }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
        document.addEventListener('mouseleave', handleMouseUp)
    }
}

const handleMouseMove = (event: MouseEvent) => {
    if (!isDragging.value || !isZoomed.value) return

    event.preventDefault()
    event.stopPropagation()

    // Check if mouse has moved significantly (more than 3px)
    const moved =
        Math.abs(event.clientX - dragStart.value.x) > 3 ||
        Math.abs(event.clientY - dragStart.value.y) > 3

    if (moved) {
        hasMoved.value = true
    }

    const deltaX = event.clientX - dragStart.value.x
    const deltaY = event.clientY - dragStart.value.y

    const newX = lastTranslate.value.x + deltaX
    const newY = lastTranslate.value.y + deltaY

    // Calculate boundaries based on zoomed image size
    const bounds = getPanBounds()

    // Clamp values to boundaries - update immediately for smooth dragging
    translate.value = {
        x: Math.max(bounds.minX, Math.min(bounds.maxX, newX)),
        y: Math.max(bounds.minY, Math.min(bounds.maxY, newY)),
    }
}

const handleMouseUp = () => {
    if (isDragging.value) {
        lastTranslate.value = { ...translate.value }
        isDragging.value = false
    }

    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    document.removeEventListener('mouseleave', handleMouseUp)
}

const getPanBounds = () => {
    if (!imageContainer.value || !isZoomed.value) {
        return { minX: 0, maxX: 0, minY: 0, maxY: 0 }
    }

    const container = imageContainer.value
    // Get container dimensions excluding padding
    const containerRect = container.getBoundingClientRect()
    const containerWidth = containerRect.width
    const containerHeight = containerRect.height

    // Get actual rendered image dimensions with object-contain
    const img = container.querySelector('img') as HTMLImageElement
    if (!img) {
        return { minX: 0, maxX: 0, minY: 0, maxY: 0 }
    }

    const naturalWidth = img.naturalWidth
    const naturalHeight = img.naturalHeight

    if (!naturalWidth || !naturalHeight) {
        return { minX: 0, maxX: 0, minY: 0, maxY: 0 }
    }

    const aspectRatio = naturalWidth / naturalHeight

    // Calculate rendered size with object-contain (actual displayed size)
    let renderedWidth = containerWidth
    let renderedHeight = containerHeight

    if (containerWidth / containerHeight > aspectRatio) {
        // Container is wider, image fits height
        renderedHeight = containerHeight
        renderedWidth = containerHeight * aspectRatio
    } else {
        // Container is taller, image fits width
        renderedWidth = containerWidth
        renderedHeight = containerWidth / aspectRatio
    }

    // Calculate zoomed dimensions
    const zoomedWidth = renderedWidth * zoomScale.value
    const zoomedHeight = renderedHeight * zoomScale.value

    // Calculate how much we can pan (half of the overflow on each side)
    // When zoomed, the image extends beyond the container by (zoomedSize - containerSize) / 2 on each side
    const overflowX = zoomedWidth - containerWidth
    const overflowY = zoomedHeight - containerHeight

    // Only allow panning if there's overflow
    const maxPanX = overflowX > 0 ? overflowX / 2 : 0
    const maxPanY = overflowY > 0 ? overflowY / 2 : 0

    return {
        minX: -maxPanX,
        maxX: maxPanX,
        minY: -maxPanY,
        maxY: maxPanY,
    }
}
</script>

<style></style>
