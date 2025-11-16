// Reusable types
type StrapiImage = {
    data: {
        id: number
        attributes: {
            name: string
            alternativeText: string | null
            caption: string | null
            width: number
            height: number
            formats: {
                thumbnail: { url: string }
                small: { url: string }
                medium: { url: string }
                large: { url: string }
            }
            hash: string
            ext: string
            mime: string
            size: number
            url: string
            previewUrl: string | null
            provider: string
            provider_metadata: any | null
            createdAt: string
            updatedAt: string
        }
    }
}

type StrapiComponent<T> = {
    id: number
    __component: string
} & T

// SEO Component
type SEOComponent = {
    id: number
    metaTitle: string
    metaDescription: string
    metaImage: StrapiImage
    metaSocial: Array<{
        socialNetwork: 'Facebook' | 'Twitter'
        title: string
        description: string
        image: StrapiImage
    }>
    keywords: string
    metaRobots: string
    structuredData: any
    metaViewport: string
    canonicalURL: string
}

// FAQ Component
type FAQComponent = {
    id: number
    Question: string
    Answer: any // This is a "blocks" type in Strapi, which might be complex to type accurately
}

// Home
export interface Home {
    id: number
    attributes: {
        BigTitle: string
        slug: string
        Mood: Array<
            | StrapiComponent<{
                  Quote: string
                  Name: string
              }>
            | StrapiComponent<{
                  Image?: StrapiImage
              }>
        >
        Intro: any // This is a "blocks" type in Strapi
        FAQs: FAQComponent[]
        seo: SEOComponent
        createdAt: string
        updatedAt: string
        publishedAt: string
        locale: string
    }
}

// Tattoo
export interface Tattoo {
    id: number
    attributes: {
        BigTitle: string
        Intro: any // This is a "blocks" type in Strapi
        Instagram: StrapiImage[]
        ExhibitionTattoosTitle: string
        BeforeImage: StrapiImage
        AfterImage: StrapiImage[]
        exhibition: {
            data: Exhibition
        }
        ExhibitionTattoosDescription: any // This is a "blocks" type in Strapi
        FAQs: FAQComponent[]
        ADNTitle: string
        ADNSubtitle: string
        Team: Array<{
            id: number
            Name: string
            Role: string
            Bio: string
        }>
        seo: SEOComponent
        createdAt: string
        updatedAt: string
        publishedAt: string
        locale: string
    }
}

// Artist
export interface Artist {
    id: number
    attributes: {
        Name: string
        Description: any // This is a "blocks" type in Strapi
        Tattoos: Array<{
            id: number
            Dimensions: string
            Price: string
            Image: StrapiImage
        }>
        Pieces: Array<{
            id: number
            Title: string
            Width: string
            Height: string
            Depth: string
            Description: string
            Image: StrapiImage
        }>
        seo: SEOComponent
        createdAt: string
        updatedAt: string
        publishedAt: string
        locale: string
    }
}

// Event
export interface Event {
    id: number
    attributes: {
        Name: string
        StartDate: string
        EndDate: string
        event_categories: {
            data: EventCategory[]
        }
        Cover: StrapiImage
        Gallery: StrapiImage[]
        Description: any // This is a "blocks" type in Strapi
        FAQs: FAQComponent[]
        seo: SEOComponent
        createdAt: string
        updatedAt: string
        publishedAt: string
        locale: string
    }
}

// EventCategory
export interface EventCategory {
    id: number
    attributes: {
        TagName: string
        tag: string
        createdAt: string
        updatedAt: string
        publishedAt: string
    }
}

export interface Block {
    type: string
    date?: string
    children?: Block[]
    // Add other properties as needed
}

// StrapiResponse type for handling Strapi API responses
export type StrapiResponse<T> = {
    data: T
    meta: {
        pagination?: {
            page: number
            pageSize: number
            pageCount: number
            total: number
        }
    }
}

// Exhibition
export interface Exhibition {
    id: number
    attributes: {
        Name: string
        StartDate: string
        EndDate: string
        Description: Block[] // Using the existing Block type
        slug: string
        artists: Array<{
            id: number
            createdAt: string
            updatedAt: string
            publishedAt: string
            Description: Block[] // Using the existing Block type
            Name: string
            locale: string
        }>
        FAQs: FAQComponent[]
        seo: SEOComponent | null
        createdAt: string
        updatedAt: string
        publishedAt: string
        locale: string
        localizations: any[] // You might want to define a more specific type for localizations
    }
}
