// components/store-locator/store-map.tsx
"use client";

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { motion } from 'framer-motion';
import { MapPinIcon, PhoneIcon, NavigationIcon, StarIcon, ClockIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Store } from '@/app/stores/page';

// CRITICAL: Fix for marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface StoreMapProps {
  stores: Store[];
  selectedStore?: Store | null;
  onStoreSelect: (store: Store) => void;
  userLocation?: { lat: number; lng: number } | null;
  onLocationRequest: () => void;
}

const MapController = ({ selectedStore }: { selectedStore?: Store | null }) => {
  const map = useMap();
  
  useEffect(() => {
    if (selectedStore) {
      map.setView([selectedStore.coordinates.lat, selectedStore.coordinates.lng], 15, {
        animate: true,
        duration: 1.5
      });
    }
  }, [selectedStore, map]);
  
  return null;
};

export function StoreMap({ 
  stores, 
  selectedStore, 
  onStoreSelect, 
  userLocation, 
  onLocationRequest 
}: StoreMapProps) {
  
  // Enhanced map center calculation
  const getMapCenter = (): [number, number] => {
    if (selectedStore) {
      return [selectedStore.coordinates.lat, selectedStore.coordinates.lng];
    }
    
    if (userLocation) {
      return [userLocation.lat, userLocation.lng];
    }

    if (stores.length > 0) {
      const avgLat = stores.reduce((sum, store) => sum + store.coordinates.lat, 0) / stores.length;
      const avgLng = stores.reduce((sum, store) => sum + store.coordinates.lng, 0) / stores.length;
      return [avgLat, avgLng];
    }

    // Default to Israel center
    return [31.0461, 34.8516];
  };

  // Enhanced zoom calculation
  const getInitialZoom = (): number => {
    if (selectedStore) return 15;
    if (userLocation) return 12;
    return stores.length > 0 ? 8 : 7;
  };

  // Enhanced store icon with better visibility
  const createStoreIcon = (store: Store, isSelected: boolean) => {
    const color = isSelected ? '#DC2626' : '#2563EB';
    const size = isSelected ? 50 : 40;
    
    return L.divIcon({
      html: `
        <div style="
          background: ${color};
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          border: 4px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: ${isSelected ? '24px' : '18px'};
          box-shadow: 0 6px 16px rgba(0,0,0,0.4);
          transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          z-index: ${isSelected ? '1000' : '999'};
        ">
          🏪
          ${isSelected ? `
            <div style="
              position: absolute;
              top: -6px;
              right: -6px;
              width: 20px;
              height: 20px;
              background: #10B981;
              border-radius: 50%;
              border: 3px solid white;
              animation: pulse 2s infinite;
            "></div>
          ` : ''}
        </div>
        <style>
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.7; }
          }
        </style>
      `,
      iconSize: [size, size],
      iconAnchor: [size/2, size/2],
      popupAnchor: [0, -size/2],
      className: 'custom-store-marker'
    });
  };

  // Enhanced user location icon
  const createUserIcon = () => {
    return L.divIcon({
      html: `
        <div style="
          position: relative;
          width: 40px;
          height: 40px;
        ">
          <div style="
            background: #3B82F6;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 4px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            position: absolute;
            top: 8px;
            left: 8px;
            z-index: 1001;
          "></div>
          <div style="
            position: absolute;
            top: 0;
            left: 0;
            width: 40px;
            height: 40px;
            border: 3px solid #3B82F6;
            border-radius: 50%;
            animation: pulse 2s infinite;
            opacity: 0.6;
          "></div>
        </div>
        <style>
          @keyframes pulse {
            0% { transform: scale(1); opacity: 0.6; }
            70% { transform: scale(1.8); opacity: 0.1; }
            100% { transform: scale(2.2); opacity: 0; }
          }
        </style>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      className: 'user-location-marker'
    });
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  const handleDirections = (store: Store) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${store.coordinates.lat},${store.coordinates.lng}`;
    window.open(url, '_blank');
  };

  if (stores.length === 0) {
    return (
      <div className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <div className="h-[600px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="text-center space-y-4">
            <MapPinIcon className="w-16 h-16 text-gray-400 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-600">No stores to display</h3>
            <p className="text-gray-500">Adjust your search filters to see store locations.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden">
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-[1000] space-y-3">
        <Button
          onClick={onLocationRequest}
          className="bg-white/95 hover:bg-white text-gray-800 shadow-lg border border-gray-200 backdrop-blur-sm font-semibold"
        >
          <MapPinIcon className="w-4 h-4 mr-2" />
          Find My Location
        </Button>
      </div>

      {/* Enhanced Map Container with explicit dimensions */}
      <div 
        className="w-full rounded-2xl overflow-hidden"
        style={{ 
          height: '600px',
          minHeight: '600px',
          position: 'relative',
          zIndex: 1
        }}
      >
        <MapContainer
          center={getMapCenter()}
          zoom={getInitialZoom()}
          scrollWheelZoom={true}
          style={{ 
            height: '100%', 
            width: '100%',
            minHeight: '600px'
          }}
          className="rounded-2xl z-0"
          key={`map-${stores.length}-${userLocation?.lat}-${userLocation?.lng}`}
        >
          <MapController selectedStore={selectedStore} />
          
          {/* Enhanced Tile Layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
            className="map-tiles"
          />

          {/* User Location Marker */}
          {userLocation && (
            <Marker 
              position={[userLocation.lat, userLocation.lng]}
              icon={createUserIcon()}
              zIndexOffset={1000}
            >
              <Popup>
                <div className="p-3 min-w-[220px]">
                  <div className="flex items-center gap-3 font-bold text-blue-600 text-lg mb-2">
                    <MapPinIcon className="w-5 h-5" />
                    Your Current Location
                  </div>
                  <p className="text-sm text-gray-600">
                    Stores are sorted by distance from this location
                  </p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Enhanced Store Markers */}
          {stores.map((store) => (
            <Marker
              key={store.id}
              position={[store.coordinates.lat, store.coordinates.lng]}
              icon={createStoreIcon(store, selectedStore?.id === store.id)}
              zIndexOffset={selectedStore?.id === store.id ? 1000 : 100}
              eventHandlers={{
                click: () => onStoreSelect(store),
              }}
            >
              <Popup 
   maxWidth={window.innerWidth > 768 ? 280 : 250}  // ✅ Smaller on mobile
  minWidth={window.innerWidth > 768 ? 220 : 200}  // ✅ Mobile responsive
  maxHeight={280}                          // ✅ Height limit
  autoPan={true}
  closeButton={true}
  className="custom-compact-popup"
>
  <div className="p-3 space-y-3 w-full">
    {/* ✅ COMPACT Store Header */}
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold text-base text-gray-800 leading-tight flex-1">
          {store.name}
        </h3>
        {store.rating && (
          <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full">
            <StarIcon className="w-3 h-3 text-yellow-500 fill-current" />
            <span className="text-xs font-bold text-yellow-700">{store.rating}</span>
          </div>
        )}
      </div>
      
      <div className="flex items-start gap-2 text-gray-600">
        <MapPinIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
        <span className="text-xs leading-relaxed">{store.address}</span>
      </div>
    </div>

    {/* ✅ COMPACT Contact Info */}
    <div className="space-y-2">
      <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
        <PhoneIcon className="w-4 h-4 text-blue-600" />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm text-gray-800 truncate">{store.phone}</div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
        <ClockIcon className="w-4 h-4 text-green-600" />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm text-gray-800 truncate">
            {store.hours?.Sunday ? `Today: ${store.hours.Sunday}` : 'Call for hours'}
          </div>
        </div>
      </div>

      {/* ✅ Distance Badge - Only if available */}
      {store.distance && (
        <div className="text-center">
          <span className="inline-block bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">
            📍 {store.distance.toFixed(1)} km away
          </span>
        </div>
      )}
    </div>
    
    {/* ✅ COMPACT Services - Max 3 shown */}
    {store.services && store.services.length > 0 && (
      <div className="space-y-2">
        <div className="text-xs font-bold text-gray-700 flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
          Services
        </div>
        <div className="flex gap-1 flex-wrap">
          {store.services.slice(0, 3).map(service => (
            <span 
              key={service}
              className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium"
            >
              {service}
            </span>
          ))}
          {store.services.length > 3 && (
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
              +{store.services.length - 3} more
            </span>
          )}
        </div>
      </div>
    )}
    
    {/* ✅ COMPACT Action Buttons */}
    <div className="flex gap-2 pt-2 border-t border-gray-200">
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleCall(store.phone)}
        className="flex-1 h-8 text-xs bg-white hover:bg-blue-50 border-blue-200 text-blue-700 font-medium"
      >
        <PhoneIcon className="w-3 h-3 mr-1" />
        Call
      </Button>
      <Button
        size="sm"
        onClick={() => handleDirections(store)}
        className="flex-1 h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium"
      >
        <NavigationIcon className="w-3 h-3 mr-1" />
        Directions
      </Button>
    </div>
  </div>
</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Enhanced Map Legend */}
      <div className="absolute bottom-4 left-4 z-[1000]">
        <div className="bg-white/98 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-200">
          <div className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            Map Legend
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs border-2 border-white shadow-lg">🏪</div>
              <span className="text-gray-700 font-medium">Store Location</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-7 h-7 bg-red-600 rounded-full flex items-center justify-center text-white text-xs border-2 border-white shadow-lg">🏪</div>
              <span className="text-gray-700 font-medium">Selected Store</span>
            </div>
            {userLocation && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-7 h-7 bg-blue-500 rounded-full border-3 border-white shadow-lg relative">
                  <div className="absolute inset-1 bg-blue-500 rounded-full"></div>
                </div>
                <span className="text-gray-700 font-medium">Your Location</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Store Counter */}
      <div className="absolute top-4 left-4 z-[1000]">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-gray-200">
          <div className="text-sm font-bold text-gray-700">
            {stores.length} Store{stores.length !== 1 ? 's' : ''} Found
          </div>
        </div>
      </div>
    </div>
  );
}
