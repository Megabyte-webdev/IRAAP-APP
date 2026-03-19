import type { Metadata } from "next";

interface PageMetadataOptions {
  title?: string;
  description?: string;
  imageUrl?: string;
  path?: string;
}

const BASE_URL = "http://iraap-app.vercel.app";

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

  const finalImage = imageUrl ? imageUrl : `${BASE_URL}/irap-logo.jpg`;

  const url = `${BASE_URL}${path}`;

  return {
    metadataBase: new URL(BASE_URL),

    title: finalTitle,
    description: finalDescription,

    alternates: {
      canonical: url,
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
