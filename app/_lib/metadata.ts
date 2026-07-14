import type { Metadata } from "next";

interface PageMetadataOptions {
  title?: string;
  description?: string;
  imageUrl?: string;
  path?: string;
}

const BASE_URL = "http://iraap.com.ng";

export function generatePageMetadata({
  title,
  description,
  imageUrl,
  path = "",
}: PageMetadataOptions): Metadata {
  const finalTitle = title || "IRAP · Institutional Repository";
  const finalDescription =
    description ||
    "IRAP is a digital institutional repository for accessing academic research, publications, and scholarly resources.";

  const finalImage = imageUrl ? imageUrl : `${BASE_URL}/irap-logo.png`;

  const url = `${BASE_URL}${path}`;

  return {
    metadataBase: new URL(BASE_URL),

    title: finalTitle,
    description: finalDescription,

    alternates: {
      canonical: url,
    },

    icons: {
      icon: [
        { url: "/favicon.ico" },
        {
          url: "/favicon-16x16.png",
          sizes: "16x16",
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
      siteName: "IRAP",
      type: "website",
      images: [
        {
          url: finalImage,
          width: 1200,
          height: 630,
          alt: "IRAP Repository",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}
