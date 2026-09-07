import type { Metadata } from "next";

interface PageMetadataOptions {
  title?: string;
  description?: string;
  imageUrl?: string;
  path?: string;
  type?: "website" | "article";
}

const BASE_URL = "https://iraap.com.ng";

export function generatePageMetadata({
  title,
  description,
  imageUrl,
  path = "",
  type = "website",
}: PageMetadataOptions): Metadata {
  const finalTitle = title || "IRAAP · Institutional Repository";
  const finalDescription =
    description ||
    "IRAAP is a research and academic collaboration platform for discovering, managing, publishing, and collaborating on scholarly work.";

  const finalImage = imageUrl ? imageUrl : `${BASE_URL}/irap-logo.png`;

  const url = `${BASE_URL}${path}`;

  return {
    metadataBase: new URL(BASE_URL),
    applicationName: "IRAAP",
    manifest: "/manifest.webmanifest",
    title: finalTitle,
    description: finalDescription,

    keywords: [
    "Institutional Repository",
    "Research Projects",
    "Academic Research",
    "Scholarly Publications",
    "Research Repository",
    "Academic Repository",
    "Student Projects",
    "IRAAP",
  ],

    robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

    alternates: {
      canonical: url,
    },
    authors: [
    {
      name: "IRAAP Research Platform",
    },
      {
        name:"Afolabi Mubarak"
      },
      {
        name:"Abiola Olamilekan"
      },
      {
        name:"Abdulwasiu Billal"
      },
  ],

    creator: "IRAAP Research Platform",
  publisher: "IRAAP Research Platform",
    

    icons: {
      icon: [
        { url: "/favicon.ico" },
        {
          url: "/favicon-16x16.png",
          sizes:"16x16",
          type: "image/png",
        },
        {
          url: "/favicon-32x32.png",
          sizes: "32x32",
          type: "image/png",
        },
        {
          url: "/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          url: "/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
      apple: [
        {
          url: "/apple-touch-icon.png",
          sizes: "180x180",
          type: "image/png",
        },
      ],
      shortcut: "/favicon.ico",
    },
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url,
      siteName: "IRAAP",
      type,
      images: [
        {
          url: finalImage,
          width: 1200,
          height: 630,
          alt: "IRAAP Repository",
        },
      ],
    },

    twitter: {
  card: "summary_large_image",
  title: finalTitle,
  description: finalDescription,
  images: [finalImage],
},
    }
}
