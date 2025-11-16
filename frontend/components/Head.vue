<template>
    <Head>
        <!-- Basic Meta Tags -->
        <title>{{ seo?.metaTitle || title }}</title>
        <meta
            name="description"
            :content="seo?.metaDescription || description" />

        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website" />
        <meta property="og:url" :content="currentUrl" />
        <meta property="og:title" :content="seo?.metaTitle || title" />
        <meta
            property="og:description"
            :content="seo?.metaDescription || description" />
        <meta
            property="og:image"
            :content="seo?.metaImage?.data?.attributes?.url || image" />

        <!-- Twitter -->
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" :content="currentUrl" />
        <meta property="twitter:title" :content="seo?.metaTitle || title" />
        <meta
            property="twitter:description"
            :content="seo?.metaDescription || description" />
        <meta
            property="twitter:image"
            :content="seo?.metaImage?.data?.attributes?.url || image" />

        <!-- Additional Meta Tags -->
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" :href="currentUrl" />
    </Head>
</template>

<script lang="ts" setup>
const props = defineProps({
    image: {
        type: String,
        default: '/default-og-image.jpg',
    },
    currentUrl: {
        type: String,
        default: () => (process.client ? window.location.href : ''),
    },
    seo: {
        type: Object,
        default: () => null,
    },
    title: {
        type: String,
        default: 'Your Website Name | Default Title',
    },
    description: {
        type: String,
        default:
            'Default description of your website. Make it compelling and under 160 characters.',
    },
})

onMounted(() => {
    console.log(props.seo)
})
</script>
