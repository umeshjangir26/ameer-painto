// components/store-locator/store-list.tsx - WITH TRANSLATIONS
"use client";

import { motion } from "framer-motion";
import {
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  NavigationIcon,
  StarIcon,
  ServerIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Store } from "@/app/stores/page";
import { cn } from "@/utils";

interface StoreListProps {
  stores: Store[];
  selectedStore: Store | null;
  onStoreSelect: (store: Store) => void;
  t: (key: string, fallback: string) => string; // ✅ Add translation function
  isRTL: boolean; // ✅ Add RTL support
}

export function StoreList({
  stores,
  selectedStore,
  onStoreSelect,
  t,
  isRTL,
}: StoreListProps) {
  const handleCall = (phone: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`tel:${phone}`);
  };

  const handleDirections = (store: Store, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `https://www.google.com/maps/dir/?api=1&destination=${store.coordinates.lat},${store.coordinates.lng}`;
    window.open(url, "_blank");
  };

  if (stores.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-12 text-center">
        <div className="space-y-6">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <MapPinIcon className="w-10 h-10 text-gray-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-800">
              {t("stores.list.noStoresTitle", "No stores found")}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {t(
                "stores.list.noStoresDescription",
                "Try adjusting your search criteria or removing filters to see more results."
              )}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <h2 className="text-2xl font-bold mb-2">
          {t("stores.list.authorizedDealers", "Authorized Dealers")} (
          {stores.length})
        </h2>
        <p className="text-blue-100">
          {t(
            "stores.list.clickInfo",
            "Click on any store to view details and location on map"
          )}
        </p>
      </div>

      {/* Store List */}
      <div className="max-h-[600px] overflow-y-auto">
        {stores.map((store, index) => (
          <motion.div
            key={store.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              "m-5 p-6 border border-gray-800 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-blue-50",
              selectedStore?.id === store.id && "bg-blue-50 border-blue-600"
            )}
            onClick={() => onStoreSelect(store)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="space-y-4">
              {/* Store Header */}
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
                      {store.name}
                    </h3>
                    {store.rating && (
                      <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full">
                        <StarIcon className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-semibold text-yellow-700">
                          {store.rating}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-start gap-2 text-gray-600 mb-2">
                    <MapPinIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{store.address}</span>
                  </div>
                  {store.description && (
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {store.description}
                    </p>
                  )}
                </div>

                {store.distance && (
                  <div className="bg-green-600 text-white px-3 py-2 rounded-full text-sm font-bold shadow-lg whitespace-nowrap">
                    {store.distance.toFixed(1)} km
                  </div>
                )}
              </div>

              {/* Store Info Grid */}
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <PhoneIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800" dir="ltr">
                      {store.phone}
                    </div>
                    <div className="text-xs text-gray-500">
                      {t("stores.list.tapToCall", "Tap to call")}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <ClockIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">
                      {store.hours?.Sunday
                        ? `${t("stores.list.today", "Today")}: ${
                            store.hours.Sunday
                          }`
                        : t("stores.list.callForHours", "Call for hours")}
                    </div>
                    <div className="text-xs text-gray-500">
                      {t("stores.list.businessHours", "Business hours")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Services */}
              {store.services && store.services.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ServerIcon className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-semibold text-gray-700">
                      {t("stores.list.servicesAvailable", "Services Available")}
                    </span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {store.services.map((service) => (
                      <span
                        key={service}
                        className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => handleCall(store.phone, e)}
                  className="flex-1 bg-white hover:bg-blue-50 border-blue-200 text-blue-700 hover:text-blue-800"
                >
                  <PhoneIcon
                    className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")}
                  />
                  {t("stores.list.callStore", "Call Store")}
                </Button>
                <Button
                  size="sm"
                  onClick={(e) => handleDirections(store, e)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <NavigationIcon
                    className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")}
                  />
                  {t("stores.list.getDirections", "Get Directions")}
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
