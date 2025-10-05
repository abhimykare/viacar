import { Loader } from "@googlemaps/js-api-loader";

interface Coordinates {
  lat: number;
  lng: number;
  address?: string;
}

interface GoogleMapProps {
  startCoordinates: Coordinates;
  endCoordinates: Coordinates;
  mapContainerId: string;
  height?: string;
}

// Type-safe Google Maps window interface
interface GoogleMapsWindow extends Window {
  google?: {
    maps: {
      Map: new (container: HTMLElement, options?: any) => any;
      DirectionsService: new () => any;
      DirectionsRenderer: new (options?: any) => any;
      Marker: new (options?: any) => any;
      LatLngBounds: new () => any;
      event: {
        addListener: (
          target: any,
          event: string,
          handler: () => void
        ) => { remove: () => void };
        removeListener: (listener: any) => void;
      };
      Size: new (width: number, height: number) => any;
      Point: new (x: number, y: number) => any;
    };
  };
}

// Type assertion for window
const getGoogleMaps = (): GoogleMapsWindow["google"]["maps"] => {
  const win = window as GoogleMapsWindow;
  if (!win.google?.maps) {
    throw new Error("Google Maps not loaded");
  }
  return win.google.maps;
};

export class GoogleMapService {
  private loader: Loader;
  private map: any = null;
  private directionsService: any = null;
  private directionsRenderer: any = null;

  constructor(apiKey: string) {
    this.loader = new Loader({
      apiKey,
      version: "weekly",
      libraries: ["places"],
    });
  }

  async initializeMap({
    startCoordinates,
    endCoordinates,
    mapContainerId,
    height = "400px",
  }: GoogleMapProps): Promise<void> {
    try {
      await this.loader.load();

      const mapContainer = document.getElementById(mapContainerId);
      if (!mapContainer) {
        throw new Error(`Map container with id '${mapContainerId}' not found`);
      }

      mapContainer.style.height = height;

      const maps = getGoogleMaps();

      const mapOptions = {
        center: startCoordinates,
        zoom: 12,
        mapTypeId: "roadmap",
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      };

      this.map = new maps.Map(mapContainer, mapOptions);
      this.directionsService = new maps.DirectionsService();
      this.directionsRenderer = new maps.DirectionsRenderer({
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: "#00665A",
          strokeWeight: 4,
          strokeOpacity: 0.8,
        },
      });

      this.directionsRenderer.setMap(this.map);

      await this.displayRoute(startCoordinates, endCoordinates, maps);
    } catch (error) {
      console.error("Error initializing Google Map:", error);

      // Display error message in the map container
      const mapContainer = document.getElementById(mapContainerId);
      if (mapContainer) {
        mapContainer.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: center; height: 100%; background-color: #f5f5f5; padding: 20px; text-align: center;">
            <div>
              <p style="color: #FF4848; font-weight: 600; margin-bottom: 8px;">Map Loading Error</p>
              <p style="color: #666; font-size: 14px;">Please check your API key configuration.</p>
              <p style="color: #999; font-size: 12px; margin-top: 8px;">Error: ${
                error instanceof Error ? error.message : "Unknown error"
              }</p>
            </div>
          </div>
        `;
      }

      throw error;
    }
  }

  private async displayRoute(
    start: Coordinates,
    end: Coordinates,
    maps: GoogleMapsWindow["google"]["maps"]
  ): Promise<void> {
    if (!this.directionsService || !this.directionsRenderer) {
      throw new Error("Directions service not initialized");
    }

    const request = {
      origin: start,
      destination: end,
      travelMode: "DRIVING",
      optimizeWaypoints: true,
    };

    return new Promise((resolve, reject) => {
      this.directionsService!.route(request, (result: any, status: string) => {
        if (status === "OK" && result) {
          this.directionsRenderer!.setDirections(result);

          // Add custom markers
          this.addCustomMarkers(start, end, maps);

          // Fit map to show the entire route
          if (this.map && result.routes[0]) {
            const bounds = new maps.LatLngBounds();
            const route = result.routes[0];

            if (route.bounds) {
              bounds.union(route.bounds);
            }

            this.map.fitBounds(bounds);

            // Ensure reasonable zoom level
            const listener = maps.event.addListener(
              this.map,
              "bounds_changed",
              () => {
                if (this.map!.getZoom() && this.map!.getZoom()! > 15) {
                  this.map!.setZoom(15);
                }
                maps.event.removeListener(listener);
              }
            );
          }

          resolve();
        } else {
          reject(new Error(`Directions request failed: ${status}`));
        }
      });
    });
  }

  private addCustomMarkers(
    start: Coordinates,
    end: Coordinates,
    maps: GoogleMapsWindow["google"]["maps"]
  ): void {
    if (!this.map) return;

    // Start marker (green)
    new maps.Marker({
      position: start,
      map: this.map,
      title: start.address || "Pickup Location",
      icon: {
        url:
          "data:image/svg+xml;charset=UTF-8," +
          encodeURIComponent(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="8" fill="#00665A" stroke="white" stroke-width="2"/>
          </svg>
        `),
        scaledSize: new maps.Size(24, 24),
        anchor: new maps.Point(12, 12),
      },
    });

    // End marker (red)
    new maps.Marker({
      position: end,
      map: this.map,
      title: end.address || "Drop Location",
      icon: {
        url:
          "data:image/svg+xml;charset=UTF-8," +
          encodeURIComponent(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="8" fill="#FF4848" stroke="white" stroke-width="2"/>
          </svg>
        `),
        scaledSize: new maps.Size(24, 24),
        anchor: new maps.Point(12, 12),
      },
    });
  }

  destroy(): void {
    if (this.directionsRenderer) {
      this.directionsRenderer.setMap(null);
      this.directionsRenderer = null;
    }
    if (this.map) {
      this.map = null;
    }
  }
}

// Convenience function for creating a map instance
export async function createGoogleMap(
  startCoordinates: Coordinates,
  endCoordinates: Coordinates,
  mapContainerId: string,
  height?: string
): Promise<GoogleMapService> {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    throw new Error("Google Maps API key not found in environment variables");
  }

  const mapService = new GoogleMapService(apiKey);
  await mapService.initializeMap({
    startCoordinates,
    endCoordinates,
    mapContainerId,
    height,
  });

  return mapService;
}
