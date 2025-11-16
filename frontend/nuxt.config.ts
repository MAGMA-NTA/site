// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: { enabled: true },
    modules: [
        '@nuxtjs/strapi',
        '@nuxt/image',
        '@nuxtjs/tailwindcss',
        'nuxt-swiper',
        '@nuxtjs/i18n',
    ],
    strapi: {
        url: process.env.STRAPI_URL,
        prefix: '/api',
        admin: '/admin',
        version: 'v4',
        cookie: {},
        cookieName: 'strapi_jwt',
    },
    i18n: {
        locales: ['en', 'pt'],
        defaultLocale: 'en',
    },
    css: ['~/assets/css/main.css'],
    runtimeConfig: {
        public: {
            strapiUrl: process.env.STRAPI_URL,
        },
    },

    generate: {
        routes: async () => {
            const { find } = useStrapi()
            const response = await find('exhibitions', { fields: ['slug'] })
            return response.data.map(
                (exhibition) => `/exhibitions/${exhibition.attributes.slug}`
            )
        },
    },

    image: {
        strapi: {
            baseURL: process.env.STRAPI_URL,
        },
        provider: 'strapi',
        domains: ['localhost'],
        quality: 80,
        format: ['webp', 'jpg', 'png'],
        screens: {
            xs: 320,
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280,
            xxl: 1536,
        },
    },

    tailwindcss: {
        config: {
            safelist: [
                {
                    pattern: /bg-(red|blue|green|yellow|orange|pink|purple)/,
                    variants: ['hover'],
                },
                {
                    pattern: /text-(white|black)/,
                    variants: ['hover'],
                },
            ],
            theme: {
                colors: {
                    red: '#C9383D',
                    blue: '#3E44B9',
                    green: '#226F54',
                    yellow: '#F3CF21',
                    orange: '#DF7446',
                    pink: '#D484A1',
                    purple: '#4F345A',
                    white: '#FFFFFF',
                    black: '#000000',
                    gray: '#CDD7D6',
                },
                fontSize: {
                    full: 'calc(117px_*_((100vw_-_1728px)_/_1728))',
                    xs: '0.75rem',
                    sm: '0.875rem',
                    lg: '1.125rem',
                    base: '1.15rem',
                    xl: '1.675rem',
                    '2xl': '2.25rem',
                    '3xl': '3.375rem',
                    '4xl': '8rem',
                    '5xl': '',
                },
                extend: {
                    boxShadow: {
                        button: '0px 5px 0px #000000',
                    },

                    container: {
                        center: true,
                    },
                },
            },
        },
    },
})
