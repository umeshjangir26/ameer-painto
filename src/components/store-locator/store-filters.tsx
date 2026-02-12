// components/store-locator/store-filters.tsx - WITH TRANSLATIONS
"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { SearchIcon, MapPinIcon, FilterIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Store } from "@/app/stores/page";

interface StoreFiltersProps {
  stores: Store[];
  onFilter: (filteredStores: Store[]) => void;
  onLocationRequest: () => void;
  isLoadingLocation: boolean;
  userLocation: { lat: number; lng: number } | null;
  t: (key: string, fallback: string) => string; // ✅ Add translation function
  isRTL: boolean; // ✅ Add RTL support
}

export function StoreFilters({
  stores,
  onFilter,
  onLocationRequest,
  isLoadingLocation,
  userLocation,
  t,
  isRTL,
}: StoreFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const cities = Array.from(new Set(stores.map((store) => store.city))).sort();

  const filterStores = useCallback(() => {
    let filtered = stores;

    if (selectedCity) {
      filtered = filtered.filter((store) => store.city === selectedCity);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (store) =>
          store.name.toLowerCase().includes(query) ||
          store.city.toLowerCase().includes(query) ||
          store.address.toLowerCase().includes(query) ||
          store.services.some((service) =>
            service.toLowerCase().includes(query)
          )
      );
    }

    onFilter(filtered);
  }, [searchQuery, selectedCity, stores, onFilter]);

  useEffect(() => {
    filterStores();
  }, [filterStores]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCity(null);
  };

  return (
    <div className="bg-card/90 backdrop-blur-md rounded-2xl shadow-xl border border-border p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="relative flex-1">
          <SearchIcon
            className={`absolute ${
              isRTL ? "right-3 sm:right-4" : "left-3 sm:left-4"
            } top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground`}
          />
          <Input
            type="text"
            placeholder={t(
              "stores.filters.searchPlaceholder",
              "Search stores, cities, or services..."
            )}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${
              isRTL ? "pr-10 sm:pr-12 pl-3" : "pl-10 sm:pl-12 pr-3"
            } h-12 sm:h-14 text-base sm:text-lg bg-background/80 border-border focus:border-primary focus:ring-primary/20 rounded-xl`}
            dir={isRTL ? "rtl" : "ltr"}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className={`absolute ${
                isRTL ? "left-3 sm:left-4" : "right-3 sm:right-4"
              } top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors`}
            >
              <XIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>
        <Button
          onClick={onLocationRequest}
          disabled={isLoadingLocation}
          className="h-12 sm:h-14 px-4 sm:px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
        >
          {isLoadingLocation ? (
            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <MapPinIcon
                className={`w-4 h-4 sm:w-5 sm:h-5 ${isRTL ? "ml-2" : "mr-2"}`}
              />
              <span className="hidden sm:inline">
                {t("stores.filters.useLocation", "Use My Location")}
              </span>
              <span className="sm:hidden">
                {t("stores.filters.locationShort", "Location")}
              </span>
            </>
          )}
        </Button>
      </div>

      {/* City Filters */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <FilterIcon className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            <span className="font-semibold text-whitetext text-sm sm:text-base">
              {t("stores.filters.filterByCity", "Filter by City")}
            </span>
          </div>
          {(selectedCity || searchQuery) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground self-start sm:self-auto"
            >
              <XIcon
                className={`w-3 h-3 sm:w-4 sm:h-4 ${isRTL ? "ml-1" : "mr-1"}`}
              />
              {t("stores.filters.clearFilters", "Clear Filters")}
            </Button>
          )}
        </div>

        <div className="flex gap-2 sm:gap-3 flex-wrap">
          <motion.button
            onClick={() => setSelectedCity(null)}
            className={`px-3 py-2 sm:px-5 sm:py-3 rounded-xl font-medium transition-all duration-300 text-xs sm:text-sm ${
              selectedCity === null
                ? "bg-blue-600 text-white shadow-lg scale-105"
                : "bg-muted hover:bg-muted/80 text-whitetext hover:text-foreground"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t("stores.filters.allCities", "All Cities")} ({stores.length})
          </motion.button>

          {cities.map((city) => {
            const storeCount = stores.filter(
              (store) => store.city === city
            ).length;
            return (
              <motion.button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-2 sm:px-5 sm:py-3 rounded-xl font-medium transition-all duration-300 text-xs sm:text-sm ${
                  selectedCity === city
                    ? "bg-blue-600 text-white shadow-lg scale-105"
                    : "bg-muted hover:bg-muted/80 text-whitetext hover:text-foreground"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {city} ({storeCount})
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Location Status */}
      {userLocation && (
        <motion.div
          className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse" />
          <span className="text-green-700 dark:text-green-400 font-medium text-xs sm:text-sm">
            {t(
              "stores.filters.locationDetected",
              "Location detected - stores sorted by distance"
            )}
          </span>
        </motion.div>
      )}
    </div>
  );
}
