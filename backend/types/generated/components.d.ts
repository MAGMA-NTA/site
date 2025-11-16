import type { Attribute, Schema } from '@strapi/strapi';

export interface ArtistArtPiece extends Schema.Component {
  collectionName: 'components_artist_art_pieces';
  info: {
    description: '';
    displayName: 'Art Piece';
    icon: 'brush';
  };
  attributes: {
    Available: Attribute.Boolean;
    Depth: Attribute.String;
    Description: Attribute.Text;
    Detail: Attribute.Component<'artist.piece-details', true>;
    Height: Attribute.String;
    HideFromWebsite: Attribute.Boolean & Attribute.DefaultTo<false>;
    Image: Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Medium: Attribute.String;
    Title: Attribute.String;
    Width: Attribute.String;
  };
}

export interface ArtistFlashTattoos extends Schema.Component {
  collectionName: 'components_flash_flash_tattoos';
  info: {
    description: '';
    displayName: 'Flash Tattoos';
    icon: 'brush';
  };
  attributes: {
    Dimensions: Attribute.String;
    exhibition: Attribute.Relation<
      'artist.flash-tattoos',
      'oneToOne',
      'api::exhibition.exhibition'
    >;
    Image: Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Price: Attribute.String;
  };
}

export interface ArtistPieceDetails extends Schema.Component {
  collectionName: 'components_artist_piece_details';
  info: {
    description: '';
    displayName: 'Piece details';
    icon: 'bulletList';
  };
  attributes: {
    Select: Attribute.Enumeration<
      ['Title', 'Author', 'Dimensions', 'Technique', 'Year']
    >;
    Value: Attribute.String;
  };
}

export interface GlobalFaQs extends Schema.Component {
  collectionName: 'components_global_fa_qs';
  info: {
    displayName: 'FAQs';
    icon: 'information';
  };
  attributes: {
    Answer: Attribute.Blocks;
    Question: Attribute.String;
  };
}

export interface GlobalMetaSocial extends Schema.Component {
  collectionName: 'components_shared_meta_socials';
  info: {
    description: '';
    displayName: 'metaSocial';
    icon: 'project-diagram';
  };
  attributes: {
    description: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 65;
      }>;
    image: Attribute.Media<'images' | 'files' | 'videos'>;
    socialNetwork: Attribute.Enumeration<['Facebook', 'Twitter']> &
      Attribute.Required;
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
  };
}

export interface GlobalSeo extends Schema.Component {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'seo';
    icon: 'search';
  };
  attributes: {
    canonicalURL: Attribute.String;
    keywords: Attribute.Text;
    metaDescription: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 160;
        minLength: 50;
      }>;
    metaImage: Attribute.Media<'images' | 'files' | 'videos'>;
    metaRobots: Attribute.String;
    metaSocial: Attribute.Component<'global.meta-social', true>;
    metaTitle: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    metaViewport: Attribute.String;
    structuredData: Attribute.JSON;
  };
}

export interface HomeMoodImage extends Schema.Component {
  collectionName: 'components_home_mood_images';
  info: {
    description: '';
    displayName: 'Mood image';
    icon: 'picture';
  };
  attributes: {
    Image: Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface HomeTestimonial extends Schema.Component {
  collectionName: 'components_home_testimonials';
  info: {
    description: '';
    displayName: 'Testimonial';
    icon: 'quote';
  };
  attributes: {
    Name: Attribute.String;
    Quote: Attribute.Text;
    URL: Attribute.Text;
  };
}

export interface MagmaPerson extends Schema.Component {
  collectionName: 'components_magma_people';
  info: {
    description: '';
    displayName: 'Person';
    icon: 'alien';
  };
  attributes: {
    Bio: Attribute.Text;
    Name: Attribute.String & Attribute.Required;
    Photo: Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Role: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'artist.art-piece': ArtistArtPiece;
      'artist.flash-tattoos': ArtistFlashTattoos;
      'artist.piece-details': ArtistPieceDetails;
      'global.fa-qs': GlobalFaQs;
      'global.meta-social': GlobalMetaSocial;
      'global.seo': GlobalSeo;
      'home.mood-image': HomeMoodImage;
      'home.testimonial': HomeTestimonial;
      'magma.person': MagmaPerson;
    }
  }
}
