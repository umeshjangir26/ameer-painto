"use client";

import Link from "next/link";
import { Eye as ViewIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/utils";

interface ViewProductLinkProps {
  handle?: string | null;
  href?: string;
  label?: string;
  isRTL?: boolean;
  className?: string;
  delay?: number;
}

export function ViewProductLink({
  handle,
  href,
  label = "View Product Details",
  isRTL = false,
  className,
  delay = 0.2,
}: ViewProductLinkProps) {
  const hasValidHandle = typeof handle === "string" && handle.trim().length > 0;

  const productUrl =
    href ??
    (hasValidHandle ? `https://shop.painto.co.il/products/${handle}` : null);

  // Safety: if no URL, don’t render anything clickable
  if (!productUrl) return null;

  const isExternal = productUrl.startsWith("http");

  const content = (
    <>
      {/* Hover Overlay Glow */}
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity z-0" />

      {/* Icon */}
      <ViewIcon
        className={cn(
          "w-5 h-5 relative z-10 transition-transform group-hover:scale-110",
          isRTL ? "ml-2" : "mr-2",
        )}
      />

      {/* Text */}
      <span className="relative z-10">{label}</span>
    </>
  );

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ delay, duration: 0.2 }}
      className="group relative z-50"
    >
      {isExternal ? (
        <a
          href={productUrl}
          target="_self" // change to _blank if needed
          rel="noopener noreferrer"
          className={cn(
            "w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold",
            "backdrop-blur-sm bg-white/5 border border-white/30 text-white",
            "hover:bg-white/10 hover:border-white/50 transition-all",
            "relative overflow-hidden cursor-pointer",
            className,
          )}
        >
          {content}
        </a>
      ) : (
        <Link
          href={productUrl}
          className={cn(
            "w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold",
            "backdrop-blur-sm bg-white/5 border border-white/30 text-white",
            "hover:bg-white/10 hover:border-white/50 transition-all",
            "relative overflow-hidden cursor-pointer",
            className,
          )}
        >
          {content}
        </Link>
      )}
    </motion.div>
  );
}
