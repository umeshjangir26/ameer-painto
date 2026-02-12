// app/stores/page.tsx - Translation Ready + RTL Safe
"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { MapPinIcon, PhoneIcon, ClockIcon, SearchIcon } from "lucide-react";
import {
  MaxWidthWrapper,
  AnimationContainer,
  Navbar,
  Footer,
} from "@/components";
import MagicBadge from "@/components/ui/magic-badge";
import { StoreFilters } from "@/components/store-locator/store-filters";
import { StoreList } from "@/components/store-locator/store-list";
import dynamic from "next/dynamic";
import { cn } from "@/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslations } from "@/app/hooks/useTranslations";

// Import Leaflet CSS - CRITICAL for map display
import "leaflet/dist/leaflet.css";

// Dynamic import for map
const StoreMap = dynamic(
  () =>
    import("@/components/store-locator/store-map").then((mod) => ({
      default: mod.StoreMap,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] bg-muted/20 rounded-2xl flex items-center justify-center border border-border">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              Loading Interactive Map
            </h3>
            <p className="text-muted-foreground">
              Preparing store locations...
            </p>
          </div>
        </div>
      </div>
    ),
  }
);

// Store interface
export interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  coordinates: { lat: number; lng: number };
  hours: Record<string, string>;
  isActive: boolean;
  services: string[];
  distance?: number;
  rating?: number;
  description?: string;
}
const MOCK_STORES: Store[] = [
  {
    id: "1",
    name: "Decorz",
    address: "אזור התעשייה ירכא, רחוב התעשייה",
    city: "ירכא",
    phone: "+972-50-400-1023",
    coordinates: { lat: 32.953865, lng: 35.188194 },
    hours: {
      Sunday: "8:00-20:00",
      Monday: "8:00-20:00",
      Tuesday: "8:00-20:00",
      Wednesday: "8:00-20:00",
      Thursday: "8:00-20:00",
      Friday: "8:00-20:00",
      Saturday: "8:00-20:00",
    },
    isActive: true,
    services: ["חיפויי קירות", "פרקט לרצפה"],
    description: "כל סוגי החפויים פנים וחוץ וגם פרקט לרצפה.",
  },
  {
    id: "2",
    name: "מרכז החיפויים כאבול",
    address: "מרכז החיפויים כאבול בוויז",
    city: "כאבול",
    phone: "+972 54-642-5430",
    coordinates: { lat: 32.869522, lng: 35.201876 },
    hours: {
      Sunday: "9:00-19:00",
      Monday: "9:00-19:00",
      Tuesday: "9:00-19:00",
      Wednesday: "9:00-19:00",
      Thursday: "9:00-19:00",
      Friday: "9:00-19:00",
      Saturday: "9:00-19:00",
    },
    isActive: true,
    services: [
      "דמוי שיש",
      "דמוי עץ",
      "פרקט",
      "מראות",
      "קרניזים",
      "פנלים",
      "דמוי חיצוני",
    ],
    description:
      "חנות דקורציה לבית ולמשרדים ובתי עסק חיפויים למיניהם. חיפויים משנים את העיצוב של כל בית ומשרד .",
  },
  {
    id: "3",
    name: 'פיאר דיזיין בע"מ',
    address: "מושב פורת משק 14",
    city: "מושב פורת",
    phone: "+972 50-979-8399",
    coordinates: { lat: 32.275719, lng: 34.94553 },
    hours: {
      Sunday: "9:00-17:00",
      Monday: "9:00-17:00",
      Tuesday: "9:00-17:00",
      Wednesday: "9:00-17:00",
      Thursday: "9:00-17:00",
      Friday: "9:00-13:00",
      Saturday: "סגור",
    },
    isActive: true,
    services: [
      "חיפוי קירות",
      "סרגלים פולימריים",
      "סרגלים אקוסטיים",
      "לוחות SPC",
      "לוחות PVC",
      "מראות ואביזרים לעיצוב הבית",
    ],
    description:
      "חברתנו מתמחה בייבוא ושיווק חיפוי קירות במגוון סוגים — לוחות SPC (אבן היברידית), לוחות PVC (פולימרי), סרגלים אקוסטיים, סרגלים פולימריים ועוד מגוון של מראות ואיבזור לעיצוב הבית.",
  },
  {
    id: "4",
    name: "A.h.lamasat",
    address: "אלנאפורה מול מרפאת מאוחדת",
    city: "ירכא",
    phone: "+972 54-634-4622",
    coordinates: { lat: 32.953271, lng: 35.195915 },
    hours: {
      Sunday: "10:00-19:00",
      Monday: "10:00-19:00",
      Tuesday: "10:00-19:00",
      Wednesday: "10:00-19:00",
      Thursday: "10:00-19:00",
      Friday: "10:00-19:00",
      Saturday: "סגור",
    },
    isActive: true,
    services: [
      "דיקור פנים",
      "פרקט לרצפה",
      "דמוי אבן",
      "דמוי שיש",
      "דמוי עץ",
      "יבואן רשמי",
    ],
    description:
      "דיקור פנים, פרקט לרצפה, דמוי אבן, דמוי שיש, דמוי עץ, יבואן רשמי, פתרונות לחיפוי פנים וחוץ, חומרי הדבקה לכל סוגי החיפוים",
  },
  {
    id: "5",
    name: "עצי אלברכה",
    address: "עצי אלברכה בויז",
    city: "נחף",
    phone: "+972 52-817-9906",
    coordinates: { lat: 32.953865, lng: 35.327675 },
    hours: {
      Sunday: "08:00-18:00",
      Monday: "08:00-18:00",
      Tuesday: "08:00-18:00",
      Wednesday: "08:00-18:00",
      Thursday: "08:00-18:00",
      Friday: "08:00-18:00",
      Saturday: "08:00-18:00",
    },
    isActive: true,
    services: ["דיקור פנים", "עצים", "דמוי שיש", "דמוי עץ"],
    description:
      "עצים לפרגולה, עצים לבניין, דק סינתטי, בריכות, לא PVC, דמוי עץ, דמוי שיש פלומרי, דשא סינתטי, שטיחים, PVC לעיצוב וריצוף",
  },
  {
    id: "6",
    name: "פטרה דיזיין",
    address: "פטרה דיזיין בויז",
    city: "כפר מנדא",
    phone: "+972 53-589-9692",
    coordinates: { lat: 32.807716, lng: 35.267231 },
    hours: {
      Sunday: "09:00-18:00",
      Monday: "09:00-18:00",
      Tuesday: "09:00-18:00",
      Wednesday: "09:00-18:00",
      Thursday: "09:00-18:00",
      Friday: "09:00-18:00",
      Saturday: "09:00-18:00",
    },
    isActive: true,
    services: ["חיפויים", "פרקט", "ריהוט גן"],
    description:
      "פטרה דיזיין כפר מנדא — עולם שלם של חיפוי קירות לבית ולעסק בעיצובים ברמה גבוהה.",
  },
];

export default function StoreLocatorPage() {
  // Translation and RTL
  const { currentLang, isRTL, isLoading: langLoading } = useLanguage();
  const { t, loading: translationLoading } = useTranslations(currentLang);
  const loading = langLoading || translationLoading;

  const [stores, setStores] = useState<Store[]>(MOCK_STORES);
  const [filteredStores, setFilteredStores] = useState<Store[]>(MOCK_STORES);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Distance calculation
  useEffect(() => {
    if (userLocation) {
      const storesWithDistance = filteredStores
        .map((store) => ({
          ...store,
          distance: calculateDistance(
            userLocation.lat,
            userLocation.lng,
            store.coordinates.lat,
            store.coordinates.lng
          ),
        }))
        .sort((a, b) => (a.distance || 0) - (b.distance || 0));

      setFilteredStores(storesWithDistance);
    }
  }, [userLocation]);

  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleLocationRequest = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLoading(false);
        },
        () => {
          alert(
            t(
              "stores.location.accessDenied",
              "Location access denied. Please enable location services."
            )
          );
          setIsLoading(false);
        }
      );
    } else {
      alert(
        t(
          "stores.location.notSupported",
          "Geolocation not supported by this browser."
        )
      );
    }
  };

  return (
    <div className={cn("min-h-screen bg-background", isRTL && "rtl")}>
      <Navbar />

      <MaxWidthWrapper className="py-12">
        {/* Header */}
        <AnimationContainer className="text-center mb-16">
          <MagicBadge title={t("stores.badge", "Store Locator")} />

          <motion.h1
            className="text-4xl md:text-6xl font-bold text-whitetext mt-6 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="block">
              {t("stores.hero.title", "Find Your Nearest")}
            </span>
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t("stores.hero.subtitle", "Authorized Dealer")}
            </span>
          </motion.h1>

          <motion.p
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t(
              "stores.hero.description",
              "Locate professional dealers across Israel who stock our complete range of SUPER products. Get expert advice, technical support, and professional installation services."
            )}
          </motion.p>
        </AnimationContainer>

        {/* Filters */}
        <AnimationContainer delay={0.4} className="mb-12">
          <StoreFilters
            stores={MOCK_STORES}
            onFilter={setFilteredStores}
            onLocationRequest={handleLocationRequest}
            isLoadingLocation={isLoading}
            userLocation={userLocation}
            t={t}
            isRTL={isRTL}
          />
        </AnimationContainer>

        {/* Main Grid */}
        <AnimationContainer delay={0.6}>
          <div
            className={cn(
              "grid lg:grid-cols-12 gap-8 min-h-[700px]",
              isRTL && "rtl:space-x-reverse"
            )}
          >
            {/* List */}
            <div className="lg:col-span-5">
              <StoreList
                stores={filteredStores}
                selectedStore={selectedStore}
                onStoreSelect={setSelectedStore}
                isRTL={isRTL}
                t={t}
              />
            </div>

            {/* Map */}
            <div className="lg:col-span-7">
              <div className="sticky top-4">
                <Suspense
                  fallback={
                    <div className="h-[600px] bg-muted/20 rounded-2xl flex items-center justify-center border border-border">
                      <div
                        className={cn(
                          "text-center space-y-4",
                          isRTL && "rtl:text-right"
                        )}
                      >
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold text-foreground">
                            {t(
                              "stores.map.loading.title",
                              "Loading Interactive Map"
                            )}
                          </h3>
                          <p className="text-muted-foreground">
                            {t(
                              "stores.map.loading.description",
                              "Preparing store locations..."
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  }
                >
                  <StoreMap
                    stores={filteredStores}
                    selectedStore={selectedStore}
                    onStoreSelect={setSelectedStore}
                    userLocation={userLocation}
                    onLocationRequest={handleLocationRequest}
                  />
                </Suspense>
              </div>
            </div>
          </div>
        </AnimationContainer>

        {/* Quick Stats */}
        <AnimationContainer delay={0.8} className="mt-20">
          <div
            className={cn(
              "grid md:grid-cols-4 gap-6 text-center",
              isRTL && "rtl:space-x-reverse"
            )}
          >
            <motion.div
              className="p-8 bg-card rounded-2xl shadow-lg border border-border hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <MapPinIcon className="w-10 h-10 text-blue-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-whitetext mb-2">
                {MOCK_STORES.length}
              </div>
              <div className="text-muted-foreground font-medium">
                {t("stores.stats.authorizedDealers", "Authorized Dealers")}
              </div>
            </motion.div>

            <motion.div
              className="p-8 bg-card rounded-2xl shadow-lg border border-border hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <PhoneIcon className="w-10 h-10 text-green-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-whitetext mb-2">24/7</div>
              <div className="text-muted-foreground font-medium">
                {t("stores.stats.supportAvailable", "Support Available")}
              </div>
            </motion.div>

            <motion.div
              className="p-8 bg-card rounded-2xl shadow-lg border border-border hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <ClockIcon className="w-10 h-10 text-purple-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-whitetext mb-2">
                {t("stores.stats.sameDayValue", "Same Day")}
              </div>
              <div className="text-muted-foreground font-medium">
                {t("stores.stats.deliveryAvailable", "Delivery Available")}
              </div>
            </motion.div>

            <motion.div
              className="p-8 bg-card rounded-2xl shadow-lg border border-border hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <SearchIcon className="w-10 h-10 text-orange-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-whitetext mb-2">
                {t("stores.stats.expertAdvice", "Expert Advice")}
              </div>
              <div className="text-muted-foreground font-medium">
                {t("stores.stats.averageResponse", "Average Response")}
              </div>
            </motion.div>
          </div>
        </AnimationContainer>
      </MaxWidthWrapper>
      <Footer />
    </div>
  );
}
