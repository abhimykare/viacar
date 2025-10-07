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

// Global loader instance to prevent conflicts
let globalLoader: Loader | null = null;
let globalApiKey: string | null = null;

export class GoogleMapService {
  private loader: Loader;
  private map: any = null;
  private directionsService: any = null;
  private directionsRenderer: any = null;
  private routePolylines: Map<string, any> = new Map(); // Store route polylines by ID

  constructor(apiKey: string) {
    // Use existing global loader if API key matches, otherwise create new one
    if (globalLoader && globalApiKey === apiKey) {
      this.loader = globalLoader;
    } else {
      this.loader = new Loader({
        apiKey,
        version: "weekly",
        libraries: ["places"],
      });
      globalLoader = this.loader;
      globalApiKey = apiKey;
    }
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
    // Clear all stored route polylines
    this.routePolylines.clear();
  }

  // Display a route polyline with custom styling
  displayRoute(polyline: string, color: string = "#00665A", strokeWeight: number = 4, routeId?: string): void {
    if (!this.map) return;

    const maps = getGoogleMaps();
    
    try {
      // Decode the polyline
      const decodedPath = this.decodePolyline(polyline);
      
      // Create the polyline
      const routePolyline = new maps.Polyline({
        path: decodedPath,
        geodesic: true,
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: strokeWeight,
      });

      // Add to map
      routePolyline.setMap(this.map);

      // Store reference if routeId is provided
      if (routeId) {
        // Remove existing route with same ID if it exists
        this.removeRoute(routeId);
        this.routePolylines.set(routeId, routePolyline);
      }

      // Fit map to show the route
      const bounds = new maps.LatLngBounds();
      decodedPath.forEach((point: any) => {
        bounds.extend(point);
      });
      this.map.fitBounds(bounds);

    } catch (error) {
      console.error("Error displaying route:", error);
    }
  }

  // Remove a specific route by ID
  removeRoute(routeId: string): void {
    const existingRoute = this.routePolylines.get(routeId);
    if (existingRoute) {
      existingRoute.setMap(null); // Remove from map
      this.routePolylines.delete(routeId); // Remove from storage
    }
  }

  // Decode Google Maps polyline encoding
  private decodePolyline(encoded: string): any[] {
    const maps = getGoogleMaps();
    const path = [];
    let index = 0;
    let lat = 0;
    let lng = 0;

    while (index < encoded.length) {
      let b;
      let shift = 0;
      let result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      path.push(new maps.LatLng(lat / 1e5, lng / 1e5));
    }

    return path;
  }

  async initializeLocationMap({
    coordinates,
    mapContainerId,
    onMapClick,
    height = "400px",
  }: {
    coordinates: Coordinates;
    mapContainerId: string;
    onMapClick?: (event: google.maps.MapMouseEvent) => void;
    height?: string;
  }): Promise<void> {
    try {
      await this.loader.load();

      const mapContainer = document.getElementById(mapContainerId);
      if (!mapContainer) {
        throw new Error(`Map container with id '${mapContainerId}' not found`);
      }

      mapContainer.style.height = height;

      const maps = getGoogleMaps();

      const mapOptions = {
        center: coordinates,
        zoom: 15,
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

      // Add single marker for the location
      this.addSingleMarker(coordinates, maps);

      // Add click listener if provided
      if (onMapClick) {
        this.map.addListener("click", onMapClick);
      }
    } catch (error) {
      console.error("Error initializing location map:", error);

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

  private addSingleMarker(
    coordinates: Coordinates,
    maps: GoogleMapsWindow["google"]["maps"]
  ): void {
    if (!this.map) return;

    // Single marker (green for pickup, red for dropoff based on context)
    new maps.Marker({
      position: coordinates,
      map: this.map,
      title: coordinates.address || "Selected Location",
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
  }

  private draggableMarker: any = null;

  addDraggableMarker(coordinates: Coordinates, onDragEnd?: (lat: number, lng: number) => void): void {
    if (!this.map) return;

    const maps = getGoogleMaps();

    // Remove existing draggable marker if any
    if (this.draggableMarker) {
      this.draggableMarker.setMap(null);
    }

    // Create draggable marker with a different icon (larger and more prominent)
    this.draggableMarker = new maps.Marker({
      position: coordinates,
      map: this.map,
      title: "Drag to select exact location",
      draggable: true,
      icon: {
        url:
          "data:image/svg+xml;charset=UTF-8," +
          encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="12" fill="#FF4848" stroke="white" stroke-width="3"/>
            <circle cx="16" cy="16" r="4" fill="white"/>
          </svg>
        `),
        scaledSize: new maps.Size(32, 32),
        anchor: new maps.Point(16, 16),
      },
      animation: maps.Animation.DROP,
    });

    // Add drag end listener
    if (onDragEnd) {
      this.draggableMarker.addListener('dragend', (event: any) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        onDragEnd(lat, lng);
      });
    }

    // Center map on the marker
    this.map.setCenter(coordinates);
    this.map.setZoom(16);
  }

  removeDraggableMarker(): void {
    if (this.draggableMarker) {
      this.draggableMarker.setMap(null);
      this.draggableMarker = null;
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

// Function to create a single location map with click handler
export async function createLocationMap(
  coordinates: Coordinates,
  mapContainerId: string,
  onMapClick?: (event: google.maps.MapMouseEvent) => void,
  height?: string
): Promise<GoogleMapService> {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    throw new Error("Google Maps API key not found in environment variables");
  }

  const mapService = new GoogleMapService(apiKey);
  await mapService.initializeLocationMap({
    coordinates,
    mapContainerId,
    onMapClick,
    height,
  });

  return mapService;
}
