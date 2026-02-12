"use client";

import { AnimationContainer, MaxWidthWrapper } from "@/components";
import { AddToCartButton } from "@/components/AddToCartButton";
import { BuyNowButton } from "@/components/BuyNowButton";
import { Button } from "@/components/ui/button";
import { ViewProductLink } from "@/components/ViewProductLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/utils";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  ArrowRightIcon,
  AwardIcon,
  CheckCircle2,
  CheckIcon,
  Clock,
  ClockIcon,
  Contact2,
  DiamondIcon,
  Gift,
  Globe,
  Hammer,
  HardHat,
  HeadphonesIcon,
  MapPinIcon,
  PackageIcon,
  ShieldCheckIcon,
  ShieldIcon,
  SparklesIcon,
  Store,
  TrendingUpIcon,
  ZapIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "../hooks/useTranslations";
// import homepagevideo from "../../../public/homepage-video.mp4";

/* ─────────────────────────
  ENHANCED COMPONENTS
────────────────────────── */

// Enhanced SectionIntro component with RTL support
const SectionIntro = ({
  badge,
  title,
  desc,
  isRTL,
}: {
  badge: string;
  title: string;
  desc: string;
  isRTL: boolean;
}) => (
  <div className="text-center space-y-4 mb-16">
    {/* ✅ Removed: isRTL && "rtl:text-right" */}

    <motion.div
      className="inline-block"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-primary/10 text-foreground px-4 py-2 rounded-full text-sm font-semibold border border-black/20 hover:bg-primary/20 transition-colors">
        {badge}
      </div>
    </motion.div>
    <motion.h2
      className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {title}
    </motion.h2>
    <motion.p
      className="text-lg text-black max-w-3xl mx-auto leading-relaxed"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      {desc}
    </motion.p>
  </div>
);

/* Slides data (place this just above the section in page.tsx) */
type Slide = { src: string; title: string; caption: string };

const baseSlides: Slide[] = [
  {
    src: "/products/withtools.JPG",
    title: "עבודה באתר",
    caption: "טכנאים בעבודה עם דבקי Painto",
  },
  {
    src: "/products/use.JPG",
    title: "בשימוש",
    caption: "יישום מדויק והדבקה איכותית",
  },
  {
    src: "/products/finised.JPG",
    title: "מראה סופי",
    caption: "גימור נקי ותוצאות מקצועיות",
  },
  {
    src: "/products/bulk.JPG",
    title: "כמות ואריזה",
    caption: "מלאי, משטחים ולוגיסטיקה",
  },
  {
    src: "/products/allinone.JPG",
    title: "סדרה מלאה",
    caption: "קו המוצרים השלם מסדרת Super",
  },
];

const slides: Slide[] = [
  ...baseSlides,
  ...baseSlides,
  ...baseSlides,
  ...baseSlides,
]; // no undefined holes
const HomePage = () => {
  const [activeProduct, setActiveProduct] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const { currentLang, isRTL, isLoading: langLoading } = useLanguage();
  const { t, loading: translationLoading } = useTranslations(currentLang);
  const [productsLoading, setProductsLoading] = useState(true);

  const [shopifyProductsData, setShopifyProductsData] = useState<any[]>([]);
  const [rawShopifyData, setRawShopifyData] = useState<any[]>([]);

  // ✅ ALL HOOKS FIRST
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const handleImageError = useCallback((productId: any) => {
    setImageErrors((prev) => ({ ...prev, [productId]: true }));
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // ✅ staticConfigs OUTSIDE useEffect - updates with language change
  const staticConfigs = [
    {
      // SUPER EXTREME (Blue) - Index 0
      badge: t("products.badges.universal", "אוניברסלי"),
      badgeColor: "bg-blue-600",
      gradient: "from-[#1d1d1d] to-[#1d1d1d]",
      color: "blue",
      savings: "21% OFF",
      features: [
        t("products.specs.flexibility", "מתאים לעץ, נירוסטה, בטון"),
        t("products.specs.strongTack", "עוצמה קיצונית למשקולות כבדות"),
        t("products.specs.uvResistant", "עמיד לקרינת UV, פנים וחוץ"),
      ],
    },
    {
      // SUPER CRYSTAL (Red) - Index 1
      badge: t("products.badges.crystalClear", "שקוף קריסטלי"),
      badgeColor: "bg-red-600",
      gradient: "from-[#1d1d1d] to-[#1d1d1d]",
      color: "red",
      savings: "19% OFF",
      features: [
        t("products.specs.crystalClear", "התייבשות שקופה"),
        t("products.specs.msPolymerBased", "תוצאה אסתטית ונקייה"),
        t(
          "products.specs.strongFlexible",
          "מתאים במיוחד לחיפויים קלים וזכוכית",
        ),
      ],
    },
    {
      // SUPER HIGH TACK (Brown) - Index 2
      badge: t("products.badges.highTack", "הדבקה גבוהה"),
      badgeColor: "bg-[#deb07d]",
      gradient: "from-[#1d1d1d] to-[#1d1d1d]",
      color: "brown",
      savings: "20% OFF",
      features: [
        t("products.specs.highTack", "כוח הדבקה גבוה במיוחד"),
        t("products.specs.claddingDesign", "הדבקה מהירה, עמידה לאורך זמן"),
        t(
          "products.specs.vibrationResistant",
          "אידיאלי לפאנלים דמויי עץ, קירות פנימיים",
        ),
      ],
    },
  ];

  // ✅ Fetch products effect - ONCE only
  useEffect(() => {
    async function fetchShopifyProducts() {
      try {
        setProductsLoading(true);

        const response = await fetch("/api/test-shopify", {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
          },
        });
        const data = await response.json();

        if (data.success && data.products && data.products.length > 0) {
          setRawShopifyData(data.products.slice(0, 3));
        } else {
          console.error("❌ No products received from Shopify API");
        }
      } catch (error) {
        console.error("❌ Error fetching Shopify products:", error);
      } finally {
        setProductsLoading(false);
      }
    }

    fetchShopifyProducts();
  }, []);

  // ✅ Map products when language changes OR raw data updates
  // ✅ Map products when language changes OR raw data updates
  useEffect(() => {
    if (rawShopifyData.length === 0) return;

    // ✅ FIX: Define staticConfigs with product identifiers
    const staticConfigsMap = {
      extreme: {
        badge: t("products.badges.universal", "אוניברסלי"),
        badgeColor: "bg-blue-600",
        gradient: "from-[#1d1d1d] to-[#1d1d1d]",
        color: "blue",
        icon: "🔥",
        fallbackImage: "/products/blue.png",
        features: [
          t("products.specs.flexibility", "מתאים לעץ, נירוסטה, בטון"),
          t("products.specs.strongTack", "עוצמה קיצונית למשקולות כבדות"),
          t("products.specs.uvResistant", "עמיד לקרינת UV, פנים וחוץ"),
        ],
      },
      crystal: {
        badge: t("products.badges.crystalClear", "שקוף קריסטלי"),
        badgeColor: "bg-red-600",
        gradient: "from-[#1d1d1d] to-[#1d1d1d]",
        color: "red",
        icon: "💎",
        fallbackImage: "/products/red.png",
        features: [
          t("products.specs.crystalClear", "התייבשות שקופה"),
          t("products.specs.msPolymerBased", "תוצאה אסתטית ונקייה"),
          t(
            "products.specs.strongFlexible",
            "מתאים במיוחד לחיפויים קלים וזכוכית",
          ),
        ],
      },
      highTack: {
        badge: t("products.badges.highTack", "הדבקה גבוהה"),
        badgeColor: "bg-[#deb07d]",
        gradient: "from-[#1d1d1d] to-[#1d1d1d]",
        color: "brown",
        icon: "⚡",
        fallbackImage: "/products/brown.png",
        features: [
          t("products.specs.highTack", "כוח הדבקה גבוה במיוחד"),
          t("products.specs.claddingDesign", "הדבקה מהירה, עמידה לאורך זמן"),
          t(
            "products.specs.vibrationResistant",
            "אידיאלי לפאנלים דמויי עץ, קירות פנימיים",
          ),
        ],
      },
    };

    const mappedProducts = rawShopifyData.map((p: any, index: number) => {
      const priceMatch = p.price?.toString().match(/[\d.]+/);
      const comparePriceMatch = p.compareAtPrice?.toString().match(/[\d.]+/);

      const price = parseFloat(priceMatch?.[0] || "0");
      const comparePrice = parseFloat(comparePriceMatch?.[0] || price);
      const savingsPercent =
        comparePrice > price
          ? Math.round(((comparePrice - price) / comparePrice) * 100)
          : 0;

      const productHandle = p.handle || "";
      const title = p.title.toLowerCase();

      // ✅ FIX: Detect product type by handle AND title
      let translationKey: "extreme" | "crystal" | "highTack" = "extreme";

      if (
        productHandle.includes("extreme") ||
        title.includes("extreme") ||
        title.includes("אקסטרים")
      ) {
        translationKey = "extreme";
      } else if (
        productHandle.includes("crystal") ||
        title.includes("crystal") ||
        productHandle.includes("קריסטל") ||
        title.includes("קריסטל")
      ) {
        translationKey = "crystal";
      } else if (
        productHandle.includes("high-tack") ||
        title.includes("high tack") ||
        title.includes("היי") ||
        title.includes("high-tack")
      ) {
        translationKey = "highTack";
      }

      // ✅ Get correct config based on product type, NOT index
      const config = staticConfigsMap[translationKey];

      const mappedProduct = {
        id: p.id,
        name: t(`products.catalog.${translationKey}.name`, p.title),
        subtitle: t(
          `products.catalog.${translationKey}.subtitle`,
          p.description?.slice(0, 100) +
            (p.description?.length > 100 ? "..." : "") || "",
        ),
        // ✅ FIX: Use Shopify image first, then product-specific fallback
        image: p.image || config.fallbackImage,
        price: `₪${Math.round(price)}`,
        originalPrice: `₪${Math.round(comparePrice)}`,
        variantId: p.variantId,
        handle: productHandle,
        // ✅ All properties from correct config
        badge: config.badge,
        badgeColor: config.badgeColor,
        gradient: config.gradient,
        color: config.color,
        icon: config.icon,
        savings: savingsPercent > 0 ? `${savingsPercent}% OFF` : null,
        features: config.features,
      };

      return mappedProduct;
    });

    console.log(
      "✅ Final Mapped Products (Language:",
      currentLang,
      "):",
      mappedProducts,
    );
    setShopifyProductsData(mappedProducts);
  }, [rawShopifyData, currentLang, t]);

  const HERO_PRODUCTS = shopifyProductsData;

  console.log("🏷️ HERO_PRODUCTS:", HERO_PRODUCTS);
  // Auto-rotate hero products
  useEffect(() => {
    if (HERO_PRODUCTS.length === 0) return;
    const interval = setInterval(() => {
      setActiveProduct((prev) => (prev + 1) % HERO_PRODUCTS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [HERO_PRODUCTS.length]);

  const loading = langLoading || translationLoading || productsLoading;

  if (loading || HERO_PRODUCTS.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-white text-xl">טוען מוצרים מ-Shopify...</p>
        </div>
      </div>
    );
  }

  // ✅ Rest of your JSX return statement...

  return (
    <div
      className={cn(
        "overflow-x-hidden scrollbar-hide size-full relative",
        isRTL && "rtl",
      )}
    >
      {/* ══════════════════════════════════════════
          🚀 HERO SECTION - Main Landing 
      ══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* BRAND-ALIGNED ANIMATED BACKGROUND - Blue, Gray, White only */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-gray-500/3 to-transparent"
            style={{ y }}
          />
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-600/20 rounded-full"
                animate={{
                  x: [0, Math.random() * 1920],
                  y: [0, Math.random() * 1080],
                  opacity: [0, 0.7, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 8 + Math.random() * 12,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "easeInOut",
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
        </div>

        <MaxWidthWrapper className="relative z-10">
          <div
            className={cn(
              "grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-screen py-16 lg:py-20",
              isRTL && "lg:grid-cols-2 rtl:space-x-reverse",
            )}
          >
            {/* LEFT: Enhanced Content with RTL Support */}
            <AnimationContainer
              className={cn(
                "space-y-6 lg:space-y-8",
                isRTL && "rtl:text-right",
              )}
            >
              {/* UPDATED BADGE - Israeli Market Adaptation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full blur-lg opacity-30 animate-pulse" />
                  <div
                    className={cn(
                      "relative bg-gradient-to-r from-blue-600 to-blue-800 text-white px-5 py-2.5 lg:px-6 lg:py-3 rounded-full font-semibold text-xs lg:text-sm flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer",
                      isRTL && "rtl:flex-row-reverse",
                    )}
                  >
                    <ShieldIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="leading-tight">
                      {loading
                        ? "Developed for Israeli Market Requirements"
                        : t(
                            "hero.badge",
                            "Developed for Israeli Market Requirements",
                          )}
                    </span>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <AwardIcon className="w-4 h-4 flex-shrink-0" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* UPDATED MAIN HEADING - Painto's SUPER Series */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="space-y-3 lg:space-y-4"
              >
                <h1 className="text-5xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-tight">
                  <motion.span
                    className="block text-whitetext"
                    animate={{
                      textShadow: [
                        "0 0 10px rgba(59, 130, 246, 0)",
                        "0 0 20px rgba(59, 130, 246, 0.3)",
                        "0 0 10px rgba(59, 130, 246, 0)",
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    {loading
                      ? "Painto's SUPER"
                      : t("hero.title", "Painto's SUPER")}
                  </motion.span>
                  <motion.span
                    className="block bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                    style={{ backgroundSize: "200% 200%" }}
                  >
                    {loading ? "series" : t("hero.titleSecond", "series")}
                  </motion.span>
                </h1>
                <h2 className="text-xl lg:text-2xl xl:text-3xl font-semibold text-muted-foreground">
                  {loading
                    ? "An adhesive for every task"
                    : t("hero.subtitle", "An adhesive for every task")}
                  <motion.span
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-block ml-2 text-blue-600"
                  >
                    ✦
                  </motion.span>
                </h2>
              </motion.div>

              {/* UPDATED DESCRIPTION - Key Competitive Advantages */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl"
              >
                {t(
                  "hero.fullDescription",
                  "Adapted to field conditions. Designed for cladding, installations, design and precise projects",
                )}
              </motion.p>
              {/* KEY FEATURES - Brand Colors Only (localized) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4"
              >
                {[
                  {
                    icon: ZapIcon,
                    key: "instantGrip",
                    fallback: "Fast Adhesion",
                    color: "text-blue-600",
                  },
                  {
                    icon: ShieldIcon,
                    key: "weatherResistant",
                    fallback: "UV Resistant",
                    color: "text-blue-600",
                  },
                  {
                    icon: DiamondIcon,
                    key: "noDrilling",
                    fallback: "No Drilling Required",
                    color: "text-blue-600",
                  },
                  {
                    icon: AwardIcon,
                    key: "fieldTested",
                    fallback: "Field Tested & Proven",
                    color: "text-blue-600",
                  },
                ].map((feature, i) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={feature.key}
                      className="flex items-center gap-3 p-3 lg:p-4 bg-muted/50 text-white rounded-xl backdrop-blur-sm hover:bg-muted/70 transition-all duration-300 group cursor-pointer border border-gray-200/50"
                      whileHover={{ scale: 1.05 }}
                      initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                    >
                      <Icon
                        className={cn(
                          "w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform",
                          feature.color,
                          isRTL ? "ms-0 me-3" : "mr-3 ml-0",
                        )}
                      />
                      <span className="font-medium text-sm lg:text-base group-hover:text-blue-600 transition-colors">
                        {loading
                          ? feature.fallback
                          : t(`heroFeatures.${feature.key}`, feature.fallback)}
                      </span>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* UNIFIED BLUE CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className={cn(
                  "flex flex-col sm:flex-row gap-3 lg:gap-4 pt-2",
                  isRTL && "sm:rtl:flex-row-reverse",
                )}
              >
                <Link href="/contact" passHref>
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 lg:px-8 py-5 lg:py-6 text-base lg:text-lg font-semibold shadow-xl hover:shadow-blue-500/30 transition-all duration-300 group relative overflow-hidden border-none"
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/20 "
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                    <Contact2
                      className={cn(
                        "w-5 h-5 group-hover:animate-pulse relative z-10 flex-shrink-0 ",
                        isRTL ? "me-2" : "mr-2",
                      )}
                    />
                    <span className="relative z-10  ">
                      {loading
                        ? "Get Wholesale Quote"
                        : t("hero.primaryCTA", "Get Wholesale Quote")}
                    </span>
                  </Button>
                </Link>

                <Link href="/stores" passHref>
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-6 lg:px-8 py-5 lg:py-6 text-base lg:text-lg font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 group"
                  >
                    <MapPinIcon
                      className={cn(
                        "w-5 h-5 group-hover:animate-bounce flex-shrink-0",
                        isRTL ? "me-2" : "mr-2",
                      )}
                    />
                    {loading
                      ? "Find Nearby Store"
                      : t("hero.secondaryCTA", "Find Nearby Store")}
                  </Button>
                </Link>
              </motion.div>

              {/* UPDATED STATS - Emphasizing Field Testing */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="grid grid-cols-3 gap-4 lg:gap-6 pt-6 lg:pt-8 border-t border-border/30"
              >
                {[
                  {
                    value: "5,000+",
                    key: "installations",
                    fallback: "Installations Completed",
                    icon: AwardIcon,
                  },
                  {
                    value: "3+",
                    key: "years",
                    fallback: "Years Field Tested",
                    icon: ShieldIcon,
                  },
                  {
                    value: "100%",
                    key: "standards",
                    fallback: "Israeli Standards",
                    icon: ZapIcon,
                  },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    className="text-center group cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + i * 0.1 }}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center mb-2",
                        isRTL && "rtl:flex-row-reverse",
                      )}
                    >
                      <stat.icon
                        className={cn(
                          "w-4 h-4 lg:w-5 lg:h-5 text-blue-600 group-hover:animate-pulse flex-shrink-0",
                          isRTL ? "ml-2" : "mr-2",
                        )}
                      />
                      <div className="text-2xl lg:text-3xl font-bold text-blue-600">
                        {stat.value}
                      </div>
                    </div>
                    <div className="text-xs lg:text-sm text-muted-foreground group-hover:text-blue-600 transition-colors px-1">
                      {loading
                        ? stat.fallback
                        : t(`stats.${stat.key}`, stat.fallback)}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimationContainer>

            {/* RIGHT: Product Showcase - Same structure, cleaner animations */}
            <AnimationContainer delay={0.4} className="relative">
              <div className="relative">
                <motion.div
                  key={activeProduct}
                  initial={{
                    opacity: 0,
                    scale: 0.8,
                    rotateY: isRTL ? 30 : -30,
                  }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotateY: isRTL ? -30 : 30 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="relative"
                >
                  <div className="relative group perspective-1000">
                    <motion.div
                      className="relative transform-gpu transition-transform duration-700 preserve-3d"
                      whileHover={{ rotateY: isRTL ? -8 : 8, scale: 1.02 }}
                    >
                      <div
                        className={`relative bg-gradient-to-br ${HERO_PRODUCTS[activeProduct].gradient} rounded-3xl p-8 lg:p-12 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden backdrop-blur-sm`}
                      >
                        {/* Subtle holographic effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 rounded-3xl opacity-0 group-hover:opacity-100"
                          animate={{ x: ["-100%", "100%"] }}
                          transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            repeatDelay: 4,
                          }}
                        />

                        {/* Product image */}
                        <div className="relative mb-8 lg:mb-12 transform group-hover:scale-105 transition-all duration-700">
                          <div className="absolute inset-0 bg-white/20 rounded-3xl blur-3xl group-hover:blur-4xl transition-all duration-500" />
                          {!imageErrors[HERO_PRODUCTS[activeProduct].id] ? (
                            <Image
                              src={HERO_PRODUCTS[activeProduct].image}
                              alt={HERO_PRODUCTS[activeProduct].name}
                              width={450}
                              height={550}
                              className="relative z-10 mx-auto drop-shadow-2xl filter group-hover:brightness-110 transition-all duration-500 w-full max-w-xs lg:max-w-md"
                              onError={() =>
                                handleImageError(
                                  HERO_PRODUCTS[activeProduct].id,
                                )
                              }
                              priority
                            />
                          ) : (
                            <div className="relative z-10 mx-auto w-64 lg:w-96 h-72 lg:h-[28rem] bg-gradient-to-br from-muted to-muted/50 rounded-3xl flex items-center justify-center">
                              <PackageIcon className="w-16 lg:w-20 h-16 lg:h-20 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Product info */}
                        <div
                          className={cn(
                            "text-center text-white space-y-4 lg:space-y-6",
                            isRTL && "rtl:text-center",
                          )}
                        >
                          <motion.h3
                            className="text-3xl lg:text-5xl font-bold tracking-wide"
                            animate={{
                              textShadow: [
                                "0 0 15px rgba(255,255,255,0.3)",
                                "0 0 25px rgba(255,255,255,0.6)",
                                "0 0 15px rgba(255,255,255,0.3)",
                              ],
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                          >
                            {HERO_PRODUCTS[activeProduct].name}
                          </motion.h3>
                          <p className="text-white/95 text-lg lg:text-2xl font-semibold">
                            {HERO_PRODUCTS[activeProduct].subtitle}
                          </p>

                          {/* Product features */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 mt-6 lg:mt-8">
                            {HERO_PRODUCTS[activeProduct].features?.map(
                              (feature: string, i: number) => (
                                <motion.div
                                  key={i}
                                  className="bg-white/20 backdrop-blur-md rounded-xl px-3 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm font-semibold border border-white/20"
                                  initial={{ opacity: 0, y: 15 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 1.5 + i * 0.15 }}
                                  whileHover={{
                                    scale: 1.05,
                                    backgroundColor: "rgba(255,255,255,0.30)",
                                  }}
                                >
                                  {feature}
                                </motion.div>
                              ),
                            )}
                          </div>

                          {/* ✅ CTA BUTTONS - PRIMARY & SECONDARY */}
                          {HERO_PRODUCTS[activeProduct].variantId && (
                            <motion.div
                              className="mt-8 lg:mt-10 space-y-3 max-w-md mx-auto"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.6, duration: 0.5 }}
                            >
                              {/* Primary CTA - Buy Now (Solid, Bold) */}
                              <motion.div
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                              >
                                <BuyNowButton
                                  variantId={
                                    HERO_PRODUCTS[activeProduct].variantId
                                  }
                                  productName={
                                    HERO_PRODUCTS[activeProduct].name
                                  }
                                  isRTL={isRTL}
                                  className="shadow-2xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-shadow"
                                />
                              </motion.div>

                              {/* Secondary CTA - Add to Cart (Outline, Subtle) */}
                              <motion.div
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ delay: 0.1 }}
                              >
                                <AddToCartButton
                                  variantId={
                                    HERO_PRODUCTS[activeProduct].variantId
                                  }
                                  productName={
                                    HERO_PRODUCTS[activeProduct].name
                                  }
                                  isRTL={isRTL}
                                  className="backdrop-blur-md bg-white/10 border-2 border-white/40 text-white hover:bg-white/20 hover:border-white/60 transition-all"
                                />
                              </motion.div>
                              <motion.div
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ delay: 0.1 }}
                              >
                                {/* Tertiary CTA - View Product (Link) */}
                                <ViewProductLink
                                  handle={HERO_PRODUCTS[activeProduct].handle}
                                  isRTL={isRTL}
                                  delay={0.2}
                                  label={t(
                                    "products.newCTA",
                                    "View Product Details",
                                  )}
                                  className="backdrop-blur-md bg-white/10 border-2 border-white/40 text-white hover:bg-white/20 hover:border-white/60 transition-all"
                                />
                              </motion.div>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Product selector dots */}
                <div className="flex justify-center gap-3 mt-8 lg:mt-12">
                  {HERO_PRODUCTS.map((product, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setActiveProduct(index)}
                      className={`relative w-3 h-3 lg:w-4 lg:h-4 rounded-full transition-all duration-300 ${
                        activeProduct === index
                          ? "bg-blue-600 scale-125 shadow-lg shadow-blue-600/50"
                          : "bg-gray-400 hover:bg-blue-400"
                      }`}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={`View ${product.name}`}
                    >
                      {activeProduct === index && (
                        <motion.div
                          className="absolute inset-0 rounded-full bg-blue-600"
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>

                {/* Background glow - Blue only */}
                <motion.div
                  className=""
                  animate={{ opacity: [0.15, 0.3, 0.15] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
              </div>
            </AnimationContainer>
          </div>
        </MaxWidthWrapper>
      </section>

      {/* ===== Product Shoot — CSS Auto Slider (no hooks) ===== */}
      <section className="bg-black" dir="ltr">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-screen-xl py-16 lg:py-24">
          {/* Intro */}
          <div className="text-center space-y-4 mb-10 lg:mb-12">
            <div className="inline-block px-4 py-2 rounded-full text-sm font-semibold border bg-white/10 text-white border-white/20">
              {t("showcase.badge", "Product in Action")}
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              {t("showcase.heading", "Real Work. Real Results.")}
            </h2>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              {t("showcase.subheading", "Real Results.")}
            </h2>
            <p className="text-lg max-w-3xl mx-auto leading-relaxed text-white/70">
              {t(
                "showcase.description",
                "On-site use, application details, finished looks, and bulk readiness.",
              )}
            </p>
          </div>

          {/* Carousel */}
          <div className="relative overflow-hidden rounded-xl bg-gray-800 border border-gray-700">
            {/* Edge fades */}

            {/* Scrolling track */}
            <div className="py-8">
              <div
                className="flex gap-6 scroll-pingpong"
                style={{ width: "max-content" }}
              >
                {[...slides, ...slides].map((slide, i) => (
                  <div
                    key={i}
                    className="shrink-0 w-80 bg-gray-700 rounded-lg overflow-hidden border border-gray-600 hover:border-gray-500 transition-colors"
                  >
                    {/* Image */}
                    <div className="relative w-full h-64 bg-gray-600">
                      <Image
                        src={slide.src}
                        alt={`${slide.title} - ${slide.caption}`}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 80vw"
                      />
                    </div>
                    {/* Caption */}
                    <figcaption className="px-4 py-3">
                      <div className="text-white font-semibold">
                        {slide.title}
                      </div>
                      <div className="text-white/75 text-sm">
                        {slide.caption}
                      </div>
                    </figcaption>
                  </div>
                ))}
              </div>
            </div>

            <style jsx>{`
              @keyframes scrollPingpong {
                0% {
                  transform: translateX(0);
                }
                45% {
                  transform: translateX(-45%);
                }
                55% {
                  transform: translateX(-47%);
                }
                100% {
                  transform: translateX(0);
                }
              }

              .scroll-pingpong {
                animation: scrollPingpong 60s ease-in-out infinite;
                will-change: transform;
              }

              .scroll-pingpong:hover {
                animation-play-state: paused;
              }
            `}</style>
          </div>
        </div>
      </section>

      {/* ===== Painto Proof + Super High Tack (gradient) ===== */}
      <section className="bg-gradient-to-b from-blue-50 via-indigo-50 to-white">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-screen-xl py-16 lg:py-24">
          {/* Hero band: headline + CTA */}
          <div className="text-center space-y-5 mb-12 lg:mb-16">
            {/* ✅ Removed: isRTL && "rtl:text-right" - ab sab center mein rahega */}

            <div className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-white text-blue-700 border border-blue-200 shadow-sm">
              {t("proof.badge", "Why choose Painto?")}
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              {t("proof.heading", "Built for Israel.")}
            </h2>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              {t("proof.subheading", " Trusted by professionals.")}
            </h2>
            <p className="text-lg max-w-3xl mx-auto leading-relaxed text-gray-700">
              {t(
                "proof.description",
                "Developed to Israeli standards and proven across 5,000+ real installations.",
              )}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="#contact" className="w-full sm:w-auto">
                <Button className="h-11 w-full sm:w-auto px-6 bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                  {t(
                    "proof.cta.primary",
                    "Wholesale price quote — leave details",
                  )}
                </Button>
              </Link>
              <Link href="#contact" className="w-full sm:w-auto">
                <Button className="h-11 w-full sm:w-auto px-6 bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                  {t("proof.cta.secondary", "Fill form for a profitable offer")}
                </Button>
              </Link>
            </div>
          </div>

          {/* Row 1: 3 Proof cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-10">
            {["1", "2", "3"].map((id, i) => (
              <motion.div
                key={`proof-${id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.08 * i }}
                className="rounded-2xl p-6 bg-white/80 backdrop-blur-sm border border-blue-100 shadow-sm hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-9 h-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center">
                    <CheckIcon className="w-4.5 h-4.5 text-blue-600" />
                  </div>
                  <p className="text-gray-800">{t(`proof.points.${id}`, "")}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Row 2: Super High Tack focus */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Focus card (spans 2) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2 rounded-2xl p-6 md:p-8 bg-white border border-indigo-100 shadow-sm"
            >
              <div className="space-y-4">
                {/* ✅ Removed: isRTL && "rtl:text-right" - yeh bhi center default rahega */}

                <div className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {t("proof.focus.badge", "Super High Tack (for coverings)")}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {t(
                    "proof.focus.title",
                    "Professional adhesive for wall coverings – no compromises",
                  )}
                </h3>
                <p className="text-gray-700">
                  {t(
                    "proof.focus.description",
                    "Advanced MS polymer, specially adapted for the covering industry in Israel. Tested and verified by thousands of professionals.",
                  )}
                </p>
                <div className="flex flex-wrap gap-2">
                  {["1", "2", "3"].map((id) => (
                    <span
                      key={id}
                      className="bg-blue-50 text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-200"
                    >
                      {t(`proof.focus.chips.${id}`, "")}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Visual / CTA card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-2xl overflow-hidden bg-white border border-indigo-100 shadow-sm flex flex-col"
            >
              <Image
                src="/products/allinone.JPG"
                alt={t("proof.focus.imageAlt", "Super High Tack product")}
                width={900}
                height={700}
                className="w-full h-48 md:h-56 object-cover"
              />
              <div className="p-5 flex-1 flex flex-col justify-between">
                <ul className="space-y-2">
                  {["1", "2", "3", "4", "5"].map((id) => (
                    <li
                      key={id}
                      className="flex items-start gap-2 text-sm text-gray-800"
                    >
                      <CheckIcon className="w-4 h-4 text-indigo-600 mt-0.5" />
                      <span>{t(`proof.focus.advantages.${id}`, "")}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-4">
                  <Link href="/super-high-tack">
                    <Button className="h-10 px-5 bg-indigo-600 hover:bg-indigo-700 text-white w-full">
                      {t(
                        "proof.focus.link",
                        "View dedicated Super High Tack page",
                      )}
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
    🌑 DARK THEME PRODUCT SHOWCASE SECTION
══════════════════════════════════════════ */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-[#0a0a0a] via-[#121212] to-[#1a1a1a] relative overflow-hidden">
        {/* Subtle gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />

        <MaxWidthWrapper className="relative z-10">
          {/* Section Header */}
          <div className="text-center space-y-4 mb-12 lg:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-blue-600/10 text-blue-400 border border-blue-500/20 backdrop-blur-sm"
            >
              {t("products.badge", "Our Products")}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white"
            >
              {t("products.heading", "Professional Adhesive Solutions")}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg max-w-3xl mx-auto leading-relaxed text-gray-400"
            >
              {t(
                "products.description",
                "Engineered for Israeli professionals. Choose your perfect adhesive.",
              )}
            </motion.p>
          </div>

          {/* Product Cards Grid */}
          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {shopifyProductsData.length > 0
              ? shopifyProductsData.map((product, index) => {
                  // ✅ FIX: Map colors based on product.color, not index
                  const colorMap = {
                    blue: {
                      accent: "from-blue-500 to-cyan-600",
                      border: "border-blue-500/30",
                      glow: "bg-blue-500/20",
                      button: "bg-blue-600 hover:bg-blue-700",
                      icon: "🔥",
                    },
                    red: {
                      accent: "from-red-500 to-pink-600",
                      glow: "bg-red-500/20",
                      border: "border-red-500/30",
                      button: "bg-red-600 hover:bg-red-700",
                      icon: "💎",
                    },
                    brown: {
                      accent: "from-amber-500 to-orange-600",
                      glow: "bg-amber-500/20",
                      border: "border-amber-500/30",
                      button: "bg-amber-600 hover:bg-amber-700",
                      icon: "⚡",
                    },
                  };

                  // ✅ Get colors by product.color property (from staticConfigs)
                  const colors =
                    colorMap[product.color as keyof typeof colorMap] ||
                    colorMap.blue;

                  // Validate handle
                  const hasValidHandle =
                    product.handle && product.handle.trim() !== "";
                  const productUrl = hasValidHandle
                    ? `https://shop.painto.co.il/products/${product.handle}`
                    : "#";

                  return (
                    <motion.div
                      key={product.id || index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.15 }}
                      whileHover={{ y: -8, transition: { duration: 0.3 } }}
                      className="group"
                    >
                      {hasValidHandle ? (
                        <Link
                          href={productUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block h-full"
                        >
                          <div
                            className={cn(
                              "relative bg-[#1a1a1a] rounded-3xl overflow-hidden border",
                              colors.border,
                              "backdrop-blur-sm transition-all duration-500",
                              "hover:border-opacity-60 hover:shadow-2xl",
                              "h-full flex flex-col",
                            )}
                          >
                            {/* Gradient glow */}
                            <div
                              className={cn(
                                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                                colors.glow,
                                "blur-2xl",
                              )}
                            />

                            {/* Product Image Container */}
                            <div className="relative h-64 lg:h-72 p-6 flex items-center justify-center bg-gradient-to-b from-[#1a1a1a] to-[#121212] flex-shrink-0">
                              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1a1a1a]/80" />
                              <div className="relative z-10 w-full h-full flex items-center justify-center">
                                <Image
                                  src={
                                    product.image || "/products/placeholder.png"
                                  }
                                  alt={product.name}
                                  width={250}
                                  height={250}
                                  className="object-contain max-h-full max-w-full transform group-hover:scale-110 transition-transform duration-700 drop-shadow-2xl"
                                />
                              </div>
                            </div>

                            {/* Product Info */}
                            <div className="relative p-6 space-y-3 bg-gradient-to-b from-[#1a1a1a] to-[#121212] flex-grow flex flex-col">
                              {/* Icon + Badge */}
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">{colors.icon}</span>
                                <span
                                  className={cn(
                                    "px-2.5 py-1 rounded-lg text-xs font-semibold",
                                    colors.border,
                                    "bg-white/5 text-gray-300",
                                  )}
                                >
                                  {product.badge}
                                </span>
                              </div>

                              {/* Product Name */}
                              <h3 className="text-xl lg:text-2xl font-bold text-white line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all duration-300 min-h-[3.5rem]">
                                {product.name}
                              </h3>

                              {/* Subtitle */}
                              <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed min-h-[2.5rem]">
                                {product.subtitle}
                              </p>

                              {/* Features */}
                              <div className="space-y-2 pt-2 flex-grow">
                                {product.features
                                  ?.slice(0, 2)
                                  .map((feature: string, i: number) => (
                                    <div
                                      key={i}
                                      className="flex items-start gap-2"
                                    >
                                      <CheckCircle2
                                        className={cn(
                                          "w-4 h-4 flex-shrink-0 mt-0.5",
                                          // ✅ FIX: Use product.color instead of index
                                          product.color === "blue"
                                            ? "text-blue-500"
                                            : product.color === "red"
                                              ? "text-red-500"
                                              : "text-amber-500",
                                        )}
                                      />
                                      <span className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                                        {feature}
                                      </span>
                                    </div>
                                  ))}
                              </div>

                              {/* Price + CTA */}
                              <div className="pt-4 space-y-3 border-t border-gray-800 mt-auto">
                                <div className="flex items-baseline justify-between">
                                  <div className="flex items-baseline gap-2">
                                    <span className="text-2xl lg:text-3xl font-bold text-white">
                                      {product.price}
                                    </span>
                                    {product.originalPrice !==
                                      product.price && (
                                      <span className="text-sm text-gray-500 line-through">
                                        {product.originalPrice}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    ILS
                                  </span>
                                </div>

                                <button
                                  className={cn(
                                    "w-full py-3 px-4 rounded-xl font-semibold text-white",
                                    "transition-all duration-300 transform",
                                    "group-hover:scale-105 group-hover:shadow-xl",
                                    colors.button,
                                    "flex items-center justify-center gap-2",
                                  )}
                                >
                                  <span>{t("products.cta", "צפה במוצר")}</span>
                                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ) : (
                        <div
                          className="block cursor-not-allowed opacity-60 h-full"
                          onClick={() => {
                            console.error("❌ No handle for product:", product);
                            alert(
                              `Product "${product.name}" link is not available. Handle: ${
                                product.handle || "missing"
                              }`,
                            );
                          }}
                        >
                          {/* Disabled state - SAME structure */}
                          <div
                            className={cn(
                              "relative bg-[#1a1a1a] rounded-3xl overflow-hidden border",
                              colors.border,
                              "backdrop-blur-sm h-full flex flex-col",
                            )}
                          >
                            <div
                              className={cn(
                                "absolute inset-0 opacity-50",
                                colors.glow,
                                "blur-2xl",
                              )}
                            />

                            <div className="absolute top-4 right-4 z-10">
                              {product.savings && (
                                <span
                                  className={cn(
                                    "px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r",
                                    colors.accent,
                                    "text-white shadow-lg opacity-50",
                                  )}
                                >
                                  {product.savings}
                                </span>
                              )}
                            </div>

                            <div className="relative h-64 lg:h-72 p-6 flex items-center justify-center bg-gradient-to-b from-[#1a1a1a] to-[#121212] flex-shrink-0">
                              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1a1a1a]/80" />
                              <Image
                                src={
                                  product.image || "/products/placeholder.png"
                                }
                                alt={product.name}
                                width={250}
                                height={250}
                                className="object-contain max-h-full max-w-full opacity-50 drop-shadow-2xl"
                              />
                            </div>

                            <div className="relative p-6 space-y-3 bg-gradient-to-b from-[#1a1a1a] to-[#121212] flex-grow flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl opacity-50">
                                  {colors.icon}
                                </span>
                                <span
                                  className={cn(
                                    "px-2.5 py-1 rounded-lg text-xs font-semibold",
                                    colors.border,
                                    "bg-white/5 text-gray-300 opacity-50",
                                  )}
                                >
                                  {product.badge}
                                </span>
                              </div>

                              <h3 className="text-xl lg:text-2xl font-bold text-white opacity-50 line-clamp-2 min-h-[3.5rem]">
                                {product.name}
                              </h3>

                              <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed opacity-50 min-h-[2.5rem]">
                                {product.subtitle}
                              </p>

                              <div className="space-y-2 pt-2 opacity-50 flex-grow">
                                {product.features
                                  ?.slice(0, 2)
                                  .map((feature: string, i: number) => (
                                    <div
                                      key={i}
                                      className="flex items-start gap-2"
                                    >
                                      <CheckCircle2
                                        className={cn(
                                          "w-4 h-4 flex-shrink-0 mt-0.5",
                                          product.color === "blue"
                                            ? "text-blue-500"
                                            : product.color === "red"
                                              ? "text-red-500"
                                              : "text-amber-500",
                                        )}
                                      />
                                      <span className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                                        {feature}
                                      </span>
                                    </div>
                                  ))}
                              </div>

                              <div className="pt-4 space-y-3 border-t border-gray-800 mt-auto">
                                <div className="flex items-baseline justify-between opacity-50">
                                  <div className="flex items-baseline gap-2">
                                    <span className="text-2xl lg:text-3xl font-bold text-white">
                                      {product.price}
                                    </span>
                                    {product.originalPrice !==
                                      product.price && (
                                      <span className="text-sm text-gray-500 line-through">
                                        {product.originalPrice}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    ILS
                                  </span>
                                </div>

                                <button
                                  disabled
                                  className={cn(
                                    "w-full py-3 px-4 rounded-xl font-semibold text-white",
                                    "bg-gray-700 cursor-not-allowed opacity-50",
                                    "flex items-center justify-center gap-2",
                                  )}
                                >
                                  <span>קישור לא זמין</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })
              : // Loading skeleton
                [...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#1a1a1a] rounded-3xl border border-gray-800 p-6 animate-pulse"
                  >
                    <div className="h-72 bg-gray-800 rounded-2xl mb-6" />
                    <div className="h-6 bg-gray-800 rounded mb-3" />
                    <div className="h-4 bg-gray-800 rounded mb-4 w-3/4" />
                    <div className="h-12 bg-gray-800 rounded" />
                  </div>
                ))}
          </div>
        </MaxWidthWrapper>
      </section>

      {/* ══════════════════════════════════════════
    📊 PRODUCT COMPARISON TABLE SECTION
══════════════════════════════════════════ */}
      {/* ══════════════════════════════════════════
    📊 PRODUCT COMPARISON TABLE SECTION (UPDATED)
══════════════════════════════════════════ */}
      <section
        id="comparison"
        className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white"
      >
        <MaxWidthWrapper>
          <SectionIntro
            badge={t("comparison.badge", "Product Comparison")}
            title={t("comparison.title", "Choose the Right Adhesive")}
            desc={t(
              "comparison.desc",
              "Compare all three Painto SUPER products to find the perfect match for your specific application",
            )}
            isRTL={isRTL}
          />

          {/* Desktop Table */}
          <AnimationContainer>
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-2xl overflow-hidden shadow-xl">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-blue-700">
                    <th className="p-6 text-start text-white font-bold text-lg">
                      {t("comparison.feature", "Feature")}
                    </th>

                    {/* ✅ FIX: Find products by type, not index */}
                    {(() => {
                      const highTackProduct = shopifyProductsData.find(
                        (p) =>
                          p.color === "brown" ||
                          p.handle?.includes("high-tack"),
                      );
                      const crystalProduct = shopifyProductsData.find(
                        (p) =>
                          p.color === "red" ||
                          p.handle?.includes("crystal") ||
                          p.handle?.includes("קריסטל"),
                      );
                      const extremeProduct = shopifyProductsData.find(
                        (p) =>
                          p.color === "blue" || p.handle?.includes("extreme"),
                      );

                      return (
                        <>
                          {/* Column: High Tack */}
                          <th className="p-6 text-center bg-amber-50/10 ltr:border-l-4 rtl:border-r-4 border-amber-500">
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center">
                                <PackageIcon className="w-8 h-8 text-white" />
                              </div>
                              <span className="text-white font-bold text-xl">
                                {t(
                                  "comparison.products.highTack.name",
                                  "Super High Tack",
                                )}
                              </span>
                              <span className="text-blue-100 text-sm font-normal">
                                {t(
                                  "comparison.products.highTack.color",
                                  "Beige",
                                )}
                              </span>

                              {highTackProduct?.handle && (
                                <Link
                                  href={`https://shop.painto.co.il/products/${highTackProduct.handle}`}
                                  target="_blank"
                                  className="mt-2"
                                >
                                  <Button
                                    size="sm"
                                    className="bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                                  >
                                    {t("comparison.buyNow", "קנו עכשיו")} →
                                  </Button>
                                </Link>
                              )}
                            </div>
                          </th>

                          {/* Column: Crystal */}
                          <th className="text-center bg-red-50/10 ltr:border-l-4 rtl:border-r-4 border-red-500">
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                                <DiamondIcon className="w-8 h-8 text-white" />
                              </div>
                              <span className="text-white font-bold text-xl">
                                {t(
                                  "comparison.products.crystal.name",
                                  "Super Crystal",
                                )}
                              </span>
                              <span className="text-blue-100 text-sm font-normal">
                                {t("comparison.products.crystal.color", "Red")}
                              </span>

                              {crystalProduct?.handle && (
                                <Link
                                  href={`https://shop.painto.co.il/products/${crystalProduct.handle}`}
                                  target="_blank"
                                  className="mt-2"
                                >
                                  <Button
                                    size="sm"
                                    className="bg-red-500 hover:bg-red-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                                  >
                                    {t("comparison.buyNow", "קנו עכשיו")} →
                                  </Button>
                                </Link>
                              )}
                            </div>
                          </th>

                          {/* Column: Extreme */}
                          <th className="p-6 text-center bg-blue-50/10 ltr:border-l-4 rtl:border-r-4 border-blue-500">
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                                <ZapIcon className="w-8 h-8 text-white" />
                              </div>
                              <span className="text-white font-bold text-xl">
                                {t(
                                  "comparison.products.extreme.name",
                                  "Super Extreme",
                                )}
                              </span>
                              <span className="text-blue-100 text-sm font-normal">
                                {t("comparison.products.extreme.color", "Blue")}
                              </span>

                              {extremeProduct?.handle && (
                                <Link
                                  href={`https://shop.painto.co.il/products/${extremeProduct.handle}`}
                                  target="_blank"
                                  className="mt-2"
                                >
                                  <Button
                                    size="sm"
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                                  >
                                    {t("comparison.buyNow", "קנו עכשיו")} →
                                  </Button>
                                </Link>
                              )}
                            </div>
                          </th>
                        </>
                      );
                    })()}
                  </tr>
                </thead>

                <tbody>
                  {[
                    "bestFor",
                    "adhesiveStrength",
                    "transparency",
                    "idealMaterials",
                    "dryingTime",
                    "uvResistance",
                    "noDrilling",
                    "aesthetics",
                  ].map((key, i) => (
                    <motion.tr
                      key={key}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-5 font-semibold text-gray-700">
                        {t(`comparison.rows.${key}.feature`, "")}
                      </td>
                      <td className="p-5 text-center ltr:border-l-2 rtl:border-r-2 border-amber-100">
                        {t(`comparison.rows.${key}.highTack`, "")}
                      </td>
                      <td className="p-5 text-center ltr:border-l-2 rtl:border-r-2 border-red-100">
                        {t(`comparison.rows.${key}.crystal`, "")}
                      </td>
                      <td className="p-5 text-center ltr:border-l-2 rtl:border-r-2 border-blue-100">
                        {t(`comparison.rows.${key}.extreme`, "")}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimationContainer>

          {/* ✅ FIXED: Mobile Accordion */}
          <div className="lg:hidden space-y-4">
            {(() => {
              // Find products by type
              const productsMap = [
                {
                  key: "highTack",
                  color: "amber",
                  icon: PackageIcon,
                  product: shopifyProductsData.find(
                    (p) =>
                      p.color === "brown" || p.handle?.includes("high-tack"),
                  ),
                },
                {
                  key: "crystal",
                  color: "red",
                  icon: DiamondIcon,
                  product: shopifyProductsData.find(
                    (p) =>
                      p.color === "red" ||
                      p.handle?.includes("crystal") ||
                      p.handle?.includes("קריסטל"),
                  ),
                },
                {
                  key: "extreme",
                  color: "blue",
                  icon: ZapIcon,
                  product: shopifyProductsData.find(
                    (p) => p.color === "blue" || p.handle?.includes("extreme"),
                  ),
                },
              ];

              const colorMap = {
                amber: {
                  border: "border-amber-500",
                  bg: "bg-amber-500",
                  text: "text-amber-600",
                  button: "bg-amber-500 hover:bg-amber-600",
                },
                red: {
                  border: "border-red-500",
                  bg: "bg-red-500",
                  text: "text-red-600",
                  button: "bg-red-500 hover:bg-red-600",
                },
                blue: {
                  border: "border-blue-500",
                  bg: "bg-blue-500",
                  text: "text-blue-600",
                  button: "bg-blue-500 hover:bg-blue-600",
                },
              } as const;

              return productsMap.map((p, i) => {
                const C = colorMap[p.color as keyof typeof colorMap];
                const Icon = p.icon;

                return (
                  <AnimationContainer key={i} delay={i * 0.15}>
                    <motion.div
                      className={cn(
                        "p-6 bg-white rounded-2xl shadow-lg border-l-4",
                        C.border,
                      )}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center",
                            C.bg,
                          )}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold">
                          {t(`comparison.products.${p.key}.name`, "")}
                        </h3>
                      </div>

                      <ul className="space-y-2 mb-4">
                        {["1", "2", "3", "4", "5"]
                          .map((n) =>
                            t(`comparison.mobile.${p.key}.features.${n}`, ""),
                          )
                          .filter(Boolean)
                          .map((text, j) => (
                            <li key={j} className="flex items-start gap-2">
                              <CheckCircle2
                                className={cn(
                                  "w-5 h-5 flex-shrink-0 mt-0.5",
                                  C.text,
                                )}
                              />
                              <span className="text-sm text-gray-700">
                                {text}
                              </span>
                            </li>
                          ))}
                      </ul>

                      {/* ✅ FIXED: Mobile Buy Button with correct product */}
                      {p.product?.handle && (
                        <Link
                          href={`https://shop.painto.co.il/products/${p.product.handle}`}
                          target="_blank"
                          className="block"
                        >
                          <Button
                            size="lg"
                            className={cn(
                              "w-full text-white font-semibold",
                              C.button,
                            )}
                          >
                            {t("comparison.buyNow", "קנו עכשיו")} →
                          </Button>
                        </Link>
                      )}
                    </motion.div>
                  </AnimationContainer>
                );
              });
            })()}
          </div>
        </MaxWidthWrapper>
      </section>

      {/* ══════════════════════════════════════════
    🎁 SPECIAL OFFERS SECTION (localized)
══════════════════════════════════════════ */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <MaxWidthWrapper className="relative z-10">
          <AnimationContainer>
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-full text-sm font-semibold mb-6 backdrop-blur-sm"
              >
                <SparklesIcon className="w-4 h-4" />
                {loading
                  ? "Limited Time Offer"
                  : t("offers.badge", "Limited Time Offer")}
              </motion.div>
              <h2 className="text-4xl lg:text-6xl font-black text-white mb-4">
                {loading
                  ? "Exclusive Benefits for Partners"
                  : t("offers.title", "Exclusive Benefits for Partners")}
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                {loading
                  ? "Join our growing network of professional contractors and get exclusive advantages"
                  : t(
                      "offers.desc",
                      "Join our growing network of professional contractors and get exclusive advantages",
                    )}
              </p>
            </div>
          </AnimationContainer>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Gift,
                titleKey: "offers.stand.title",
                titleFallback: "Free Display Stand",
                descKey: "offers.stand.desc",
                descFallback: "Professional branded display for your store",
                badgeKey: "offers.stand.badge",
                badgeFallback: "New",
              },
              {
                icon: Globe,
                titleKey: "offers.web.title",
                titleFallback: "Free Website Exposure",
                descKey: "offers.web.desc",
                descFallback: "Listed on our official dealer locator",
                badgeKey: "offers.web.badge",
                badgeFallback: "Popular",
              },
              {
                icon: TrendingUpIcon,
                titleKey: "offers.price.title",
                titleFallback: "Wholesale Pricing",
                descKey: "offers.price.desc",
                descFallback: "Competitive rates for bulk orders",
                badgeKey: "offers.price.badge",
                badgeFallback: "Best Value",
              },
              {
                icon: HeadphonesIcon,
                titleKey: "offers.support.title",
                titleFallback: "Priority Support",
                descKey: "offers.support.desc",
                descFallback: "24/7 technical assistance",
                badgeKey: "offers.support.badge",
                badgeFallback: "24/7",
              },
            ].map((offer, i) => (
              <AnimationContainer key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.05 }}
                  className="relative p-6 bg-white rounded-2xl shadow-xl h-full"
                >
                  {/* Badge with RTL-safe position */}
                  <div className="absolute -top-3 ltr:right-4 rtl:left-4 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
                    {t(offer.badgeKey, offer.badgeFallback)}
                  </div>

                  <div className="flex flex-col items-center text-center h-full">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                      <offer.icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {loading
                        ? offer.titleFallback
                        : t(offer.titleKey, offer.titleFallback)}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {loading
                        ? offer.descFallback
                        : t(offer.descKey, offer.descFallback)}
                    </p>
                  </div>
                </motion.div>
              </AnimationContainer>
            ))}
          </div>

          {/* CTA */}
          <AnimationContainer delay={0.5}>
            <div className="text-center mt-12">
              <Link href="/contact" passHref>
                <Button
                  size="lg"
                  className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-10 py-7 text-lg shadow-2xl hover:shadow-white/30 transition-all duration-300"
                >
                  {loading
                    ? "Get This Offer"
                    : t("offers.cta", "Get This Offer")}
                  <ArrowRightIcon className="w-5 h-5 ltr:ml-2 rtl:mr-2" />
                </Button>
              </Link>
            </div>
          </AnimationContainer>
        </MaxWidthWrapper>
      </section>

      {/* ══════════════════════════════════════════
    👥 WHO THIS IS FOR SECTION (localized)
══════════════════════════════════════════ */}
      <section className="py-16 lg:py-24 bg-white">
        <MaxWidthWrapper>
          <SectionIntro
            badge={
              loading
                ? "Target Audience"
                : t("audience.badge", "Target Audience")
            }
            title={
              loading
                ? "Who Should Use Painto SUPER?"
                : t("audience.title", "Who Should Use Painto SUPER?")
            }
            desc={
              loading
                ? "Designed for professionals who demand reliability, speed, and quality in every project"
                : t(
                    "audience.desc",
                    "Designed for professionals who demand reliability, speed, and quality in every project",
                  )
            }
            isRTL={isRTL}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                key: "contractors",
                icon: HardHat,
              },
              {
                key: "installers",
                icon: Hammer,
              },
              {
                key: "stores",
                icon: Store,
              },
            ].map((aud, i) => {
              const Icon = aud.icon;
              return (
                <AnimationContainer key={aud.key} delay={i * 0.15}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 h-full"
                  >
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {loading ? "" : t(`audience.${aud.key}.title`, "")}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {loading ? "" : t(`audience.${aud.key}.desc`, "")}
                    </p>
                    <ul className="space-y-3">
                      {["b1", "b2", "b3"].map((b) => (
                        <li key={b} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">
                            {loading ? "" : t(`audience.${aud.key}.${b}`, "")}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </AnimationContainer>
              );
            })}
          </div>
        </MaxWidthWrapper>
      </section>

      {/* ══════════════════════════════════════════
    🎬 VIDEO DEMONSTRATION SECTION (localized)
══════════════════════════════════════════ */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
        <MaxWidthWrapper>
          <SectionIntro
            badge={
              loading
                ? "See It In Action"
                : t("video.badge", "See It In Action")
            }
            title={
              loading
                ? "Installing Real Cladding in 30 Seconds"
                : t("video.title", "Installing Real Cladding in 30 Seconds")
            }
            desc={
              loading
                ? "Watch how Super High Tack revolutionizes wall covering installations with instant adhesion and no drilling required"
                : t(
                    "video.desc",
                    "Watch how Super High Tack revolutionizes wall covering installations with instant adhesion and no drilling required",
                  )
            }
            isRTL={isRTL}
          />

          <AnimationContainer>
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative rounded-3xl overflow-hidden shadow-2xl bg-gray-900"
                style={{ paddingBottom: "56.25%" }} // 16:9 aspect ratio
              >
                <video
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  src="/homepage-video.mp4"
                  controls
                  autoPlay={false}
                  loop={false}
                  muted={false}
                />
              </motion.div>

              {/* Video highlights */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {[
                  { icon: ZapIcon, key: "f1", fallback: "Instant adhesion" },
                  { icon: ShieldIcon, key: "f2", fallback: "No drilling" },
                  { icon: ClockIcon, key: "f3", fallback: "30-second install" },
                  { icon: CheckCircle2, key: "f4", fallback: "Clean finish" },
                ].map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <motion.div
                      key={f.key}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl"
                    >
                      <Icon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span className="text-sm font-semibold text-gray-700">
                        {loading ? f.fallback : t(`video.${f.key}`, f.fallback)}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </AnimationContainer>
        </MaxWidthWrapper>
      </section>

      {/* ══════════════════════════════════════════
    🚀 FINAL CTA SECTION - Professional B2B (ctaFinal)
══════════════════════════════════════════ */}
      <section className="relative py-16 lg:py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 overflow-hidden">
        {/* Clean animated background - Blue only */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                          radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)`,
            }}
            animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />

          {/* Subtle floating particles - Reduced */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-white/20 rounded-full"
              animate={{
                x: [0, Math.random() * 300 - 150],
                y: [0, Math.random() * 300 - 150],
                opacity: [0, 0.6, 0],
                scale: [0, 1.2, 0],
              }}
              transition={{
                duration: 8 + Math.random() * 6,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: "easeInOut",
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <MaxWidthWrapper className="relative z-10">
          <div
            className={cn(
              "text-center px-4 sm:px-6 lg:px-0 max-w-4xl mx-auto",
              isRTL && "rtl:text-center",
            )}
          >
            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-8 lg:mb-12"
            >
              <h2 className="font-black tracking-tight leading-tight mb-4 lg:mb-6">
                <span className="block text-3xl sm:text-4xl lg:text-6xl xl:text-7xl text-white drop-shadow-2xl mb-3 lg:mb-4">
                  {loading
                    ? "Ready to Experience"
                    : t("ctaFinal.readyToExperience", "Ready to Experience")}
                </span>
                <span className="block text-4xl sm:text-5xl lg:text-7xl xl:text-8xl text-blue-100 font-extrabold">
                  {loading
                    ? "Professional Excellence?"
                    : t(
                        "ctaFinal.professionalExcellence",
                        "Professional Excellence?",
                      )}
                </span>
              </h2>

              {/* Decorative underline */}
              <motion.div
                className="w-32 sm:w-48 lg:w-64 h-1 bg-blue-400 rounded-full mx-auto"
                initial={{ width: 0 }}
                whileInView={{ width: "auto" }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </motion.div>

            {/* Description */}
            <motion.p
              className="text-blue-50 text-lg sm:text-xl lg:text-2xl leading-relaxed mb-10 lg:mb-12 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <>
                {t("ctaFinal.joinOver", "Join over")}{" "}
                <span className="text-white font-bold">
                  {t(
                    "ctaFinal.professionalCount",
                    "5,000 professional contractors",
                  )}
                </span>{" "}
                {t(
                  "ctaFinal.acrossIsrael",
                  "across Israel who trust Painto SUPER products for demanding cladding and installation projects.",
                )}
              </>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className={cn(
                "flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center items-center mb-12 lg:mb-16",
                isRTL && "sm:rtl:flex-row-reverse",
              )}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link href="/contact" passHref>
                <Button
                  size="lg"
                  className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-6 text-base lg:text-lg font-bold shadow-2xl hover:shadow-white/20 transition-all duration-300 group border-none"
                >
                  <Contact2 className="w-5 h-5 group-hover:animate-pulse ltr:mr-2 rtl:ml-2" />
                  <span>
                    {loading
                      ? "Request Pricing"
                      : t("ctaFinal.primaryButton", "Request Pricing")}
                  </span>
                </Button>
              </Link>

              <Link href="/stores" passHref>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/40 text-white hover:bg-white/10 hover:border-white px-8 py-6 text-base lg:text-lg font-semibold backdrop-blur-sm transition-all duration-300 group"
                >
                  <MapPinIcon className="w-5 h-5 group-hover:animate-bounce ltr:mr-2 rtl:ml-2" />
                  {loading
                    ? "Locate a Dealer"
                    : t("ctaFinal.secondaryButton", "Locate a Dealer")}
                </Button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {[
                {
                  value: "5,000+",
                  labelKey: "ctaFinal.stat1",
                  fallback: "Professional Installations",
                  icon: CheckCircle2,
                },
                {
                  value: "3+",
                  labelKey: "ctaFinal.stat2",
                  fallback: "Years Field Tested",
                  icon: Clock,
                },
                {
                  value: "100%",
                  labelKey: "ctaFinal.stat3",
                  fallback: "Israeli Standards",
                  icon: ShieldCheckIcon,
                },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={i}
                    className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.9 + i * 0.1 }}
                  >
                    <Icon className="w-8 h-8 text-blue-200 mx-auto mb-3" />
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm lg:text-base text-blue-100 font-medium">
                      {t(stat.labelKey, stat.fallback)}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </MaxWidthWrapper>
      </section>
    </div>
  );
};

export default HomePage;
