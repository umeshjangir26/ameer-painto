import { Metadata } from "next";

export const generateMetadata = ({
  title = `Painto  - New age of Adhesives`,
  description = `Painto is a new age of adhesives, offering professional-grade solutions for all your bonding needs. Discover the future of adhesives with Painto.`,
  image = "/thumbnail-new.png",
  icons = [
    {
      rel: "apple-touch-icon",
      sizes: "32x32",
      url: "/apple-touch-icon.png",
    },
    {
      rel: "icon",
      sizes: "32x32",
      url: "/thumbnail-new.png",
    },
    {
      rel: "icon",
      sizes: "16x16",
      url: "/thumbnail-new.png",
    },
  ],
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string | null;
  icons?: Metadata["icons"];
  noIndex?: boolean;
} = {}): Metadata => ({
  title,
  description,
  icons,
  openGraph: {
    title,
    description,
    ...(image && { images: [{ url: image }] }),
  },
  twitter: {
    title,
    description,
    ...(image && { card: "summary_large_image", images: [image] }),
    creator: "@shreyassihasane",
  },
  // metadataBase: new URL(process.env.APP_DOMAIN!),
  ...(noIndex && { robots: { index: false, follow: false } }),
});
