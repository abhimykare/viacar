import React, { useEffect, useRef, useState } from "react";

// Global declaration for Google Maps
declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
  }
}

interface GoogleMapProps {
  startLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  endLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  height?: string;
  width?: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  startLocation,
  endLocation,
  height = "300px",
  width = "100%",
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initializeMap = () => {
    if (!mapRef.current || !window.google) {
      setError("Google Maps failed to load");
      setIsLoading(false);
      return;
    }

    try {
      // Calculate center point
      const centerLat = (startLocation.lat + endLocation.lat) / 2;
      const centerLng = (startLocation.lng + endLocation.lng) / 2;

      // Create map
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: centerLat, lng: centerLng },
        zoom: 10,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      });

      // Create directions service and renderer
      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        polylineOptions: {
          strokeColor: "#00665A",
          strokeWeight: 4,
          strokeOpacity: 0.8,
        },
      });

      directionsRenderer.setMap(map);

      // Request directions
      const request = {
        origin: { lat: startLocation.lat, lng: startLocation.lng },
        destination: { lat: endLocation.lat, lng: endLocation.lng },
        travelMode: window.google.maps.TravelMode.DRIVING,
      };

      directionsService.route(request, (result: any, status: string) => {
        if (status === "OK") {
          directionsRenderer.setDirections(result);
        } else {
          // Show markers if directions fail
          new window.google.maps.Marker({
            position: { lat: startLocation.lat, lng: startLocation.lng },
            map: map,
            title: startLocation.address,
            icon: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
          });

          new window.google.maps.Marker({
            position: { lat: endLocation.lat, lng: endLocation.lng },
            map: map,
            title: endLocation.address,
            icon: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
          });

          // Fit bounds to show both markers
          const bounds = new window.google.maps.LatLngBounds();
          bounds.extend({ lat: startLocation.lat, lng: startLocation.lng });
          bounds.extend({ lat: endLocation.lat, lng: endLocation.lng });
          map.fitBounds(bounds);
        }
      });

      setIsLoading(false);
      setError(null);
    } catch (err) {
      console.error("Map initialization error:", err);
      setError("Failed to initialize map");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      initializeMap();
      return;
    }

    // Set up callback for when Google Maps loads
    window.initGoogleMaps = initializeMap;

    // Check if script is already being loaded
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com"]'
    );
    if (existingScript) {
      return;
    }

    // Load Google Maps script
    const script = document.createElement("script");
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      setError("Google Maps API key is missing");
      setIsLoading(false);
      return;
    }

    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;

    script.onerror = () => {
      setError("Failed to load Google Maps script");
      setIsLoading(false);
    };

    document.head.appendChild(script);

    // Cleanup
    return () => {
      if (window.initGoogleMaps) {
        delete window.initGoogleMaps;
      }
    };
  }, [startLocation, endLocation]);

  if (isLoading) {
    return (
      <div
        className="w-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center"
        style={{ height, width }}
      >
        <div className="text-gray-500 flex items-center gap-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500"></div>
          <span>Loading map...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="w-full bg-red-50 border border-red-200 rounded-lg flex flex-col items-center justify-center p-4"
        style={{ height, width }}
      >
        <div className="text-red-600 text-sm text-center">
          <div className="font-medium mb-2">⚠️ Map Error</div>
          <div className="text-xs">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className="w-full rounded-lg overflow-hidden shadow-sm border border-gray-200"
      style={{ height, width }}
    />
  );
};

export default GoogleMap;
