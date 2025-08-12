import React, { useEffect, useRef, useState } from "react";

// Add global declaration for Google Maps
declare global {
  interface Window {
    google: any;
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
  const [map, setMap] = useState<any>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        const { Loader } = await import("@googlemaps/js-api-loader");

        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        
        console.log("🔍 Checking API key:", apiKey ? "Found" : "Missing");
        console.log("🔍 API key value:", apiKey ? `${apiKey.substring(0, 10)}...` : "No key");
        
        if (!apiKey || apiKey === "YOUR_GOOGLE_MAPS_API_KEY" || apiKey === "your_valid_google_maps_api_key_here" || apiKey.length < 20) {
          throw new Error(`Google Maps API key is invalid: "${apiKey}". Please get a valid key from https://console.cloud.google.com/`);
        }

        const loader = new Loader({
          apiKey: apiKey,
          version: "weekly",
        });

        await loader.load();

        // Import required libraries
        const { Map } = await window.google.maps.importLibrary('maps');
        const { DirectionsService, DirectionsRenderer } = await window.google.maps.importLibrary('routes');

        if (mapRef.current) {
          const mapInstance = new Map(mapRef.current, {
            center: {
              lat: (startLocation.lat + endLocation.lat) / 2,
              lng: (startLocation.lng + endLocation.lng) / 2,
            },
            zoom: 10,
            mapTypeId: 'roadmap',
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }],
              },
            ],
          });

          const renderer = new DirectionsRenderer({
            suppressMarkers: false,
            polylineOptions: {
              strokeColor: '#00665A',
              strokeWeight: 4,
              strokeOpacity: 0.8,
            },
          });

          const directionsService = new DirectionsService();

          const request = {
            origin: startLocation,
            destination: endLocation,
            travelMode: 'DRIVING',
            optimizeWaypoints: true,
          };

          directionsService.route(request, (result: any, status: string) => {
            if (status === 'OK' && result) {
              renderer.setDirections(result);
              renderer.setMap(mapInstance);
              if (result.routes && result.routes[0]) {
                const bounds = new window.google.maps.LatLngBounds();
                result.routes[0].overview_path.forEach((point: any) => {
                  bounds.extend(point);
                });
                mapInstance.fitBounds(bounds);
              }
            } else {
              console.error('Directions request failed:', status);
              setError(`Directions failed: ${status}`);
            }
          });

          setMap(mapInstance);
          setDirectionsRenderer(renderer);
        }
      } catch (error) {
        console.error("🚨 Google Maps Error:", error);
        let errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        
        // Check for specific API key errors
        if (errorMessage.includes('InvalidKey') || errorMessage.includes('API key')) {
          errorMessage = "Invalid Google Maps API key. Please check your .env file and ensure you have a valid API key from Google Cloud Console.";
        } else if (errorMessage.includes('ApiNotActivated')) {
          errorMessage = "Google Maps APIs are not enabled. Please enable Maps JavaScript API and Directions API in your Google Cloud Console.";
        }
        
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    initMap();

    return () => {
      if (directionsRenderer) {
        directionsRenderer.setMap(null);
      }
    };
  }, [startLocation, endLocation]);

  if (isLoading) {
    return (
      <div
        className="w-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center"
        style={{ height, width }}
      >
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="w-full bg-gray-100 rounded-lg flex items-center justify-center"
        style={{ height, width }}
      >
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className="w-full rounded-lg overflow-hidden"
      style={{ height, width }}
    />
  );
};

export default GoogleMap;
