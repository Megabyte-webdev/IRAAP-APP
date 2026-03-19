// app/_lib/metadata.ts
import type { Metadata } from "next";

interface PageMetadataOptions {
  title?: string;
  description?: string;
  imageUrl?: string;
}

export function generatePageMetadata({
  title,
  description,
  imageUrl,
}: PageMetadataOptions): Metadata {
  return {
    title: title || "OOU · Institutional Repository",
    description: description || "The official digital repository...",
    openGraph: {
      title: title,
      description: description,
      type: "website",
      images: [
        {
          url: "/irap-logo.png",
          alt: "IRAP",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: imageUrl ? [imageUrl] : ["/irap-logo.png"],
    },
  };
}
