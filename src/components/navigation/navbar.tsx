// components/layout/navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import MaxWidthWrapper from "@/components/global/max-width-wrapper";
import AnimationContainer from "@/components/global/animation-container";
import { cn } from "@/utils";
import { MapPinIcon, SparklesIcon, HomeIcon, PhoneIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext"; // ✅ Use Context
import MobileNavbarMinimal from "./mobile-navbar-minimal";
import { useTranslations } from "@/app/hooks/useTranslations";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // ✅ FIXED: Use Context instead of local state
  const {
    currentLang,
    setCurrentLang,
    isRTL,
    isLoading: langLoading,
  } = useLanguage();
  const { t, loading: translationLoading } = useTranslations(currentLang);

  // Combined loading state
  const loading = langLoading || translationLoading;

  // Enhanced scroll listener with smooth transition
  useEffect(() => {
    const onScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 20);
    };

    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ✅ FIXED: Navigation links with context translations
  const NAV_LINKS = [
    {
      href: "/",
      label: loading ? "Home" : t("navigation.home", "Home"),
      icon: HomeIcon,
      description: loading
        ? "Return to homepage"
        : t("navigation.home_description", "Return to homepage"),
    },
    {
      href: "/contact",
      label: loading ? "Contact Us" : t("navigation.contact", "Contact Us"),
      icon: PhoneIcon,
      description: loading
        ? "Get in touch"
        : t("navigation.contact_description", "Get in touch"),
    },
    {
      href: "/stores",
      label: loading ? "Find Store" : t("navigation.stores", "Find Store"),
      icon: MapPinIcon,
      description: loading
        ? "Find our stores"
        : t("navigation.stores_description", "Find our stores"),
    },
  ];

  const isActive = (path: string) => pathname === path;

  const handleStoreLocator = () => {
    if (pathname === "/") {
      const element = document.getElementById("store-locator");
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } else {
      router.push("/stores");
    }
  };

  // ✅ FIXED: Use context function instead of local handler
  const handleLanguageSwitch = (lang: "en" | "he") => {
    setCurrentLang(lang); // ✅ This will update context and trigger all listeners
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "sticky top-0 inset-x-0 h-16 w-full border-b z-[99999] select-none transition-all duration-300",
        scrolled
          ? "border-border/80 bg-background/95 backdrop-blur-xl shadow-lg"
          : "border-transparent bg-background/50",
        isRTL && "rtl",
      )}
    >
      <AnimationContainer reverse delay={0.1} className="size-full">
        <MaxWidthWrapper
          className={cn(
            "flex items-center justify-between h-full",
            isRTL && "rtl:flex-row-reverse",
          )}
        >
          <Link href="/" className="flex items-center group">
            {/* ✅ CLEAN SIMPLE LOGO */}
            <motion.div
              className="relative"
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Image
                src="/products/navbar-painto.png"
                alt="Painto"
                width={180}
                height={72}
                className="
        h-32          
        w-auto
        object-contain
        transition-all
        duration-200
        group-hover:opacity-95
      "
                priority
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList
              className={cn("gap-1", isRTL && "rtl:flex-row-reverse")}
            >
              {NAV_LINKS.map((link, index) => {
                const IconComponent = link.icon;
                return (
                  <NavigationMenuItem key={link.href}>
                    <Link href={link.href} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "relative group px-4 py-2 font-medium transition-all duration-300 hover:bg-primary/10",
                          isActive(link.href)
                            ? "text-primary bg-primary/10"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <motion.div
                          className={cn(
                            "flex items-center gap-2",
                            isRTL && "rtl:flex-row-reverse",
                          )}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <IconComponent className="w-4 h-4" />
                          {link.label}
                        </motion.div>

                        {isActive(link.href) && (
                          <motion.div
                            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                            layoutId="activeIndicator"
                            transition={{ duration: 0.2 }}
                          />
                        )}

                        <motion.div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Desktop CTA with Language Switcher */}
          <div
            className={cn(
              "hidden lg:flex items-center gap-3",
              isRTL && "rtl:flex-row-reverse",
            )}
          >
            {/* ✅ FIXED: Language Switcher with context */}
            <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1 border border-border">
              <motion.button
                onClick={() => handleLanguageSwitch("en")}
                disabled={loading}
                className={cn(
                  "flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 disabled:opacity-50",
                  currentLang === "en"
                    ? "bg-background text-whitetext shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50",
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-sm">🇺🇸</span>
                <span>EN</span>
                {loading && currentLang === "en" && (
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                )}
              </motion.button>

              <motion.button
                onClick={() => handleLanguageSwitch("he")}
                disabled={loading}
                className={cn(
                  "flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 disabled:opacity-50",
                  currentLang === "he"
                    ? "bg-background text-whitetext shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50",
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-sm">🇮🇱</span>
                <span>עב</span>
                {loading && currentLang === "he" && (
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu */}
          <MobileNavbarMinimal
            navLinks={NAV_LINKS}
            onStoreClick={handleStoreLocator}
            currentLang={currentLang}
            onLanguageSwitch={handleLanguageSwitch}
            isRTL={isRTL}
            loading={loading}
          />
        </MaxWidthWrapper>
      </AnimationContainer>
    </motion.header>
  );
};

export default Navbar;
