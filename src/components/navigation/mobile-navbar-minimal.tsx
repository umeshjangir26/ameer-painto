// components/layout/mobile-navbar-minimal.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils";
import {
  Menu,
  X,
  MapPinIcon,
  SparklesIcon,
  ChevronRightIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations } from "@/app/hooks/useTranslations";

interface Props {
  navLinks?: Array<{
    href: string;
    label: string;
    icon: any;
    description: string;
  }>;
  onStoreClick?: () => void;
  currentLang?: "en" | "he";
  onLanguageSwitch?: (lang: "en" | "he") => void;
  isRTL?: boolean;
  loading?: boolean;
}

const MobileNavbarMinimal: React.FC<Props> = ({
  navLinks = [],
  onStoreClick,
  currentLang = "en",
  onLanguageSwitch,
  isRTL = false,
  loading = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(0);
  const pathname = usePathname();
  const { t } = useTranslations(currentLang);

  // Dynamic viewport height calculation for mobile
  useEffect(() => {
    const updateViewportHeight = () => {
      // Use window.innerHeight for actual viewport height
      const vh = window.innerHeight;
      setViewportHeight(vh);

      // Set CSS custom property for consistent height
      document.documentElement.style.setProperty("--real-vh", `${vh}px`);
    };

    updateViewportHeight();
    window.addEventListener("resize", updateViewportHeight);
    window.addEventListener("orientationchange", updateViewportHeight);

    return () => {
      window.removeEventListener("resize", updateViewportHeight);
      window.removeEventListener("orientationchange", updateViewportHeight);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.height = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
    };
  }, [isOpen]);

  const isActive = (path: string) => pathname === path;

  const handleStoreClick = () => {
    if (onStoreClick) {
      onStoreClick();
    }
    setIsOpen(false);
  };

  const handleLanguageSwitch = (lang: "en" | "he") => {
    if (onLanguageSwitch) {
      onLanguageSwitch(lang);
    }
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <div
      className={cn(
        "flex lg:hidden items-center gap-2",
        isRTL && "flex-row-reverse",
      )}
    >
      {/* Language Switcher */}
      <div className="flex items-center gap-0.5 bg-white/90 rounded-lg p-0.5 border border-gray-200 shadow-sm">
        <button
          onClick={() => handleLanguageSwitch("en")}
          disabled={loading}
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all duration-200 disabled:opacity-50",
            currentLang === "en"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
          )}
        >
          <span className="text-xs">🇺🇸</span>
        </button>

        <button
          onClick={() => handleLanguageSwitch("he")}
          disabled={loading}
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all duration-200 disabled:opacity-50",
            currentLang === "he"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
          )}
        >
          <span className="text-xs">🇮🇱</span>
        </button>
      </div>

      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5 text-gray-700" />
      </button>

      {/* FIXED HEIGHT SIDEBAR - Always 100% Screen Height */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/30 z-[9998]"
              onClick={closeMenu}
              style={{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                position: "fixed",
              }}
            />

            {/* ALWAYS FULL HEIGHT SIDEBAR */}
            <motion.div
              initial={{ x: isRTL ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? "100%" : "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={cn(
                "fixed z-[9999] flex flex-col",
                "bg-white shadow-xl",
                "w-full sm:w-[350px]",
                isRTL
                  ? "right-0 border-l border-gray-200"
                  : "left-0 border-r border-gray-200",
              )}
              style={{
                // FORCE FULL SCREEN HEIGHT - No matter scroll position
                top: 0,
                bottom: 0,
                height: viewportHeight > 0 ? `${viewportHeight}px` : "100vh",
                maxHeight: viewportHeight > 0 ? `${viewportHeight}px` : "100vh",
                position: "fixed",
              }}
            >
              {/* Header - Fixed Height */}
              <div className="relative flex-shrink-0 p-4 border-b border-gray-200 bg-gray-50">
                <button
                  onClick={closeMenu}
                  className={cn(
                    "absolute top-3 p-2 rounded-lg transition-colors hover:bg-gray-200",
                    isRTL ? "left-3" : "right-3",
                  )}
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>

                {/* Brand */}
                <div
                  className={cn(
                    "flex items-center gap-3 pr-12",
                    isRTL && "text-right pl-12 pr-0", // no row reversal
                  )}
                  dir="ltr" // force LTR layout so logo stays left
                >
                  <Image
                    src="/products/logo.jpg"
                    alt="SUPER HIGH TACK logo"
                    width={48}
                    height={48}
                    className="rounded-lg"
                  />

                  <div
                    className={cn("flex-1", isRTL && "text-right")}
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    <h2 className="text-lg font-bold text-gray-900">
                      {loading ? "Painto" : t("brand.name", "Painto")}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {loading
                        ? "Professional Adhesive Solutions"
                        : t("brand.tagline", "Professional Adhesive Solutions")}
                    </p>
                  </div>
                </div>

                {/* Language Switcher */}
                <div className="flex items-center justify-center gap-0.5 bg-gray-200 rounded-lg p-0.5 mt-3">
                  <button
                    onClick={() => handleLanguageSwitch("en")}
                    disabled={loading}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex-1 justify-center disabled:opacity-50",
                      currentLang === "en"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-700 hover:text-gray-900 hover:bg-white",
                    )}
                  >
                    <span>🇺🇸</span>
                    <span>English</span>
                  </button>

                  <button
                    onClick={() => handleLanguageSwitch("he")}
                    disabled={loading}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex-1 justify-center disabled:opacity-50",
                      currentLang === "he"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-700 hover:text-gray-900 hover:bg-white",
                    )}
                  >
                    <span>🇮🇱</span>
                    <span>עברית</span>
                  </button>
                </div>
              </div>

              {/* Navigation Links - Scrollable Middle Section */}
              <nav className="flex-1 min-h-0 py-4 px-3 overflow-y-auto bg-white">
                <div className="space-y-1">
                  {navLinks.map((link, index) => {
                    const IconComponent = link.icon;
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.2 }}
                      >
                        <Link
                          href={link.href}
                          onClick={closeMenu}
                          className={cn(
                            "group flex items-center w-full p-3 rounded-lg font-medium transition-all duration-200 relative",
                            isActive(link.href)
                              ? "text-blue-700 bg-blue-50 border border-blue-200"
                              : "text-gray-700 hover:text-gray-900 hover:bg-gray-100",
                            isRTL && "flex-row-reverse",
                          )}
                        >
                          {isActive(link.href) && (
                            <div
                              className={cn(
                                "absolute top-1/2 transform -translate-y-1/2 w-0.5 h-6 bg-blue-600 rounded-full",
                                isRTL ? "right-1" : "left-1",
                              )}
                            />
                          )}

                          <div
                            className={cn(
                              "flex items-center gap-3 ml-2",
                              isRTL && "flex-row-reverse mr-2 ml-0",
                            )}
                          >
                            <div
                              className={cn(
                                "flex items-center justify-center w-8 h-8 rounded-lg",
                                isActive(link.href)
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-600 group-hover:bg-gray-200",
                              )}
                            >
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-sm">
                                {link.label}
                              </div>
                              <div className="text-xs text-gray-500">
                                {link.description}
                              </div>
                            </div>
                          </div>

                          <ChevronRightIcon
                            className={cn(
                              "w-4 h-4 transition-transform duration-200 opacity-40 group-hover:opacity-70",
                              isRTL && "rotate-180",
                            )}
                          />
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </nav>

              {/* Store Finder Button - Fixed Bottom */}
              {/* <div className="flex-shrink-0 p-4 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={handleStoreClick}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 group"
                >
                  <div
                    className={cn(
                      "flex items-center justify-center gap-2",
                      isRTL && "flex-row-reverse"
                    )}
                  >
                    <MapPinIcon className="w-5 h-5" />
                    <span>
                      {loading
                        ? "Find Store"
                        : t("navigation.stores", "Find Store")}
                    </span>
                    <SparklesIcon className="w-4 h-4 opacity-80" />
                  </div>
                </button>

                <p
                  className={cn(
                    "text-center text-xs text-gray-600 mt-2",
                    isRTL && "text-right"
                  )}
                >
                  {loading
                    ? "Locate dealers across Israel"
                    : t(
                        "navigation.stores_description",
                        "Locate dealers across Israel"
                      )}
                </p>
              </div> */}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add CSS for mobile viewport fix */}
      <style jsx global>{`
        :root {
          --real-vh: 100vh;
        }

        @supports (-webkit-touch-callout: none) {
          /* iOS Safari specific fix */
          .mobile-nav-full-height {
            height: -webkit-fill-available !important;
          }
        }
      `}</style>
    </div>
  );
};

export default MobileNavbarMinimal;
