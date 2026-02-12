"use client";
import Link from "next/link";
import { AnimationContainer } from "@/components";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { HomeIcon, PhoneIcon, MapPinIcon, MailIcon } from "lucide-react";
import { cn } from "@/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslations } from "@/app/hooks/useTranslations";
import { motion } from "framer-motion";

const Footer = () => {
  // Translation and RTL support
  const { currentLang, isRTL, isLoading: langLoading } = useLanguage();
  const { t, loading: translationLoading } = useTranslations(currentLang);
  const loading = langLoading || translationLoading;

  return (
    <footer
      className={cn(
        "flex flex-col relative items-center justify-center border-t border-border pb-8 md:pb-0 px-6 lg:px-8 w-full max-w-6xl mx-auto lg:pt-32 bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.white/8%),transparent)]",
        isRTL && "rtl"
      )}
    >
      <div className="absolute top-0 left-1/2 right-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-1.5 bg-foreground rounded-full"></div>

      <div
        className={cn(
          "grid lg:grid-cols-3 lg:gap-8 w-full",
          isRTL && "rtl:space-x-reverse"
        )}
      >
        {/* ✅ ENHANCED: Brand Section with Translation */}
        <Link
          href="/"
          className="flex items-center gap-4 group"
          //   onMouseEnter={() => setIsHovered(true)}
          //   onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            className="relative"
            whileHover={{ scale: 1.08, rotate: isRTL ? -3 : 3 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <motion.div
              className="relative p-3 flex items-center justify-center min-w-[72px] min-h-[72px]"
              whileHover={{
                filter: "drop-shadow(0 12px 35px rgba(59, 130, 246, 0.5))",
              }}
              transition={{ duration: 0.3 }}
            >
              {/* ✅ STYLIZED PAINTO TEXT LOGO */}
              <motion.div
                className="relative"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-lg blur-sm opacity-20 group-hover:opacity-40 transition-opacity duration-300" />

                {/* Main PAINTO text */}
                <div className="relative px-2 py-1 bg-gradient-to-br from-gray-900/80 to-black/90 rounded-lg border border-gray-700/50 group-hover:border-primary/30 transition-all duration-300">
                  <motion.span
                    className="block text-2xl font-black tracking-tight bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                    style={{
                      fontFamily:
                        "'Inter', 'Helvetica Neue', 'Arial', sans-serif",
                      textShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
                      backgroundSize: "200% 200%",
                    }}
                    animate={
                      {
                        //   backgroundPosition: isHovered ? ["0% 50%", "100% 50%", "0% 50%"] : "0% 50%"
                      }
                    }
                    transition={{
                      duration: 2,
                      //   repeat: isHovered ? Infinity : 0,
                      ease: "easeInOut",
                    }}
                  >
                    PAINTO
                  </motion.span>

                  {/* Accent dot */}
                  <motion.div
                    className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                    animate={{
                      //   scale: isHovered ? [1, 1.3, 1] : 1,
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* <div className={cn(
    "hidden sm:flex flex-col",
    isRTL && "rtl:text-right"
  )}>
    <motion.span 
      className="text-xl font-bold font-heading text-foreground group-hover:text-primary transition-colors duration-300"
      animate={{ opacity: isHovered ? 1 : 0.9 }}
    >
      {loading ? "SUPER HIGH TACK" : t('hero.title', 'SUPER HIGH TACK')}
    </motion.span>
    <motion.span 
      className="text-xs text-muted-foreground font-medium"
      animate={{ opacity: isHovered ? 1 : 0.7 }}
    >
      {loading ? "Professional Adhesive Solutions" : t('hero.subtitle', 'Professional Adhesive Solutions')}
    </motion.span>
  </div> */}
        </Link>

        {/* ✅ ENHANCED: Quick Links & Contact with RTL */}
        <div
          className={cn(
            "grid-cols-1 md:grid-cols-2 grid mt-16 lg:col-span-2 lg:mt-0",
            isRTL && "rtl:space-x-reverse"
          )}
        >
          {/* Quick Links with Translation */}
          <AnimationContainer delay={0.2}>
            <div>
              {/* Heading */}
              <h3
                className={cn(
                  "text-base font-medium text-white mb-4",
                  isRTL && "rtl:text-right"
                )}
              >
                {loading
                  ? "Quick Links"
                  : t("footer.quickLinks", "Quick Links")}
              </h3>

              {/* UL List */}
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/"
                    className={cn(
                      "hover:text-foreground transition-all duration-300 flex items-center gap-2 group",
                      isRTL
                        ? "flex-row-reverse text-right"
                        : "flex-row text-left"
                    )}
                  >
                    <HomeIcon className="w-4 h-4 group-hover:text-primary transition-colors" />
                    {loading ? "Home" : t("navigation.home", "Home")}
                  </Link>
                </li>

                <li>
                  <Link
                    href="/stores"
                    className={cn(
                      "hover:text-foreground transition-all duration-300 flex items-center gap-2 group",
                      isRTL
                        ? "flex-row-reverse text-right"
                        : "flex-row text-left"
                    )}
                  >
                    <MapPinIcon className="w-4 h-4 group-hover:text-primary transition-colors" />
                    {loading
                      ? "Find Store"
                      : t("navigation.stores", "Find Store")}
                  </Link>
                </li>

                <li>
                  <Link
                    href="/contact"
                    className={cn(
                      "hover:text-foreground transition-all duration-300 flex items-center gap-2 group",
                      isRTL
                        ? "flex-row-reverse text-right"
                        : "flex-row text-left"
                    )}
                  >
                    <PhoneIcon className="w-4 h-4 group-hover:text-primary transition-colors" />
                    {loading
                      ? "Contact Us"
                      : t("navigation.contact", "Contact Us")}
                  </Link>
                </li>
              </ul>
            </div>
          </AnimationContainer>

          {/* Contact Info with Translation */}
          <AnimationContainer delay={0.3}>
            <div className="mt-10 md:mt-0">
              <h3
                className={cn(
                  "text-base font-medium text-white mb-4",
                  isRTL && "rtl:text-right"
                )}
              >
                {loading
                  ? "Get in Touch"
                  : t("footer.getInTouch", "Get in Touch")}
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li
                  className={cn(
                    "flex items-center gap-2",
                    isRTL && "rtl:text-right"
                  )}
                >
                  <PhoneIcon className="w-4 h-4 text-primary" />
                  <span>
                    {loading
                      ? "Professional Support Available"
                      : t(
                          "footer.support.professional",
                          "Professional Support Available"
                        )}
                  </span>
                </li>
                <li
                  className={cn(
                    "flex items-center gap-2",
                    isRTL && "rtl:text-right"
                  )}
                >
                  <MapPinIcon className="w-4 h-4 text-primary" />
                  <span>
                    {loading
                      ? "Authorized Dealers Across Israel"
                      : t(
                          "footer.support.dealers",
                          "Authorized Dealers Across Israel"
                        )}
                  </span>
                </li>
                <li
                  className={cn(
                    "flex items-center gap-2",
                    isRTL && "rtl:text-right"
                  )}
                >
                  <MailIcon className="w-4 h-4 text-primary" />
                  <span>
                    {loading
                      ? "Technical Documentation Available"
                      : t(
                          "footer.support.documentation",
                          "Technical Documentation Available"
                        )}
                  </span>
                </li>
              </ul>
            </div>
          </AnimationContainer>
        </div>
      </div>

      {/* ✅ ENHANCED: Copyright with Translation */}
      <div
        className={cn(
          "mt-8 border-t border-border/40 pt-4 md:pt-8 md:flex md:items-center md:justify-between w-full",
          isRTL && "md:rtl:flex-row-reverse"
        )}
      >
        <AnimationContainer delay={0.4}>
          <p
            className={cn(
              "text-sm text-muted-foreground mt-8 md:mt-0",
              isRTL && "rtl:text-right md:rtl:text-center"
            )}
          >
            &copy; {new Date().getFullYear()}{" "}
            {loading
              ? "SUPER HIGH TACK. All rights reserved. Professional Adhesive Solutions."
              : t(
                  "footer.copyright",
                  "SUPER HIGH TACK. All rights reserved. Professional Adhesive Solutions."
                )}
          </p>
        </AnimationContainer>
      </div>

      {/* ✅ ENHANCED: Brand Text Effect with Translation */}
      <div className="h-[20rem] lg:h-[20rem] hidden md:flex items-center justify-center">
        <TextHoverEffect
          text={loading ? "SUPER" : t("footer.brandEffect", "SUPER")}
        />
      </div>
    </footer>
  );
};

export default Footer;
