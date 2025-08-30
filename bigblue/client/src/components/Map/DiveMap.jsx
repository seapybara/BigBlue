import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import LocationPopup from './LocationPopup';
import { createRoot } from 'react-dom/client';
import { getDifficultyMarkerColor, getMarkerSize } from '../../utils/difficultyUtils';

// Add custom CSS for markers
const markerStyles = `
  .dive-marker {
    /* Ensure markers are clickable and positioned correctly */
    display: block !important;
    position: relative !important;
    pointer-events: auto !important;
    cursor: pointer !important;
    z-index: 100;
  }
  .dive-marker:hover {
    z-index: 1000;
  }
  .marker-dot {
    pointer-events: none !important;
  }
  .dive-location-popup .mapboxgl-popup-content {
    padding: 0;
    border-radius: 12px;
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(59, 130, 246, 0.3);
    background: transparent;
  }
  .dive-location-popup .mapboxgl-popup-tip {
    border-top-color: rgb(30 41 59 / 0.95);
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
  }
  .dive-location-popup .mapboxgl-popup-close-button {
    color: #ffffff;
    font-size: 24px;
    font-weight: bold;
    top: 8px;
    right: 8px;
    padding: 4px;
  }
  .dive-location-popup .mapboxgl-popup-close-button:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
`;

// Inject styles into head
if (typeof document !== 'undefined' && !document.getElementById('dive-map-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'dive-map-styles';
  styleSheet.textContent = markerStyles;
  document.head.appendChild(styleSheet);
}

// Set Mapbox token
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const DiveMap = ({ locations = [], onLocationClick, selectedLocation }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return; // Wait for container
    if (map.current) return; // Initialize only once

    // Check if token exists
    if (!mapboxgl.accessToken) {
      setMapError('Mapbox token is missing. Please check your .env file.');
      console.error('Mapbox token is missing');
      return;
    }

    try {
      // Create map instance
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: [0, 20], // Center on Atlantic Ocean
        zoom: 2.5,
        pitch: 0,
        bearing: 0
        // Temporarily remove globe projection to test marker positioning
        // projection: 'globe'
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Add fullscreen control
      map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

      // Handle map load event
      map.current.on('load', () => {
        setMapLoaded(true);
        
        // Add 3D terrain (temporarily disabled for debugging)
        // try {
        //   map.current.addSource('mapbox-dem', {
        //     'type': 'raster-dem',
        //     'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        //     'tileSize': 512,
        //     'maxzoom': 14
        //   });
        //   
        //   map.current.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
        // } catch (terrainError) {
        //   console.warn('Could not add 3D terrain:', terrainError);
        // }
      });
      
      // Map is ready for markers

      // Handle map errors
      map.current.on('error', (e) => {
        if (e.error && e.error.status === 401) {
          setMapError('Invalid Mapbox token. Please check your API key.');
        } else {
          setMapError('Error loading map. Please check console for details.');
        }
      });

    } catch (error) {
      setMapError('Failed to initialize map. Check console for details.');
    }

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []); // Empty dependency array - only run once

  // Add markers for locations
  useEffect(() => {
    if (!mapLoaded || !locations || locations.length === 0 || !map.current) {
      return;
    }

    // Loading markers

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add new markers
    locations.forEach((location, index) => {
      // Extract coordinates consistently
      let coordinates;
      if (location.coordinates && location.coordinates.coordinates) {
        coordinates = location.coordinates.coordinates;
      } else if (location.coordinates && Array.isArray(location.coordinates)) {
        coordinates = location.coordinates;
      } else if (location.lng && location.lat) {
        coordinates = [location.lng, location.lat];
      } else if (location.longitude && location.latitude) {
        coordinates = [location.longitude, location.latitude];
      } else {
        return;
      }
      
      // Ensure coordinates are valid numbers
      if (!Array.isArray(coordinates) || coordinates.length !== 2 || 
          isNaN(coordinates[0]) || isNaN(coordinates[1])) {
        return;
      }

      // Store normalized coordinates on location object for consistent access
      location._normalizedCoordinates = coordinates;

      // Get color and size using utilities
      const markerColor = getDifficultyMarkerColor(location.difficulty);
      const markerSize = getMarkerSize(location.depth);

      // Create marker using the same teardrop pin design as the legend
      const el = document.createElement('div');
      el.className = 'dive-marker';
      el.style.cssText = `
        width: ${markerSize}px;
        height: ${markerSize}px;
        background: ${markerColor};
        border: 2px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        cursor: pointer;
        box-shadow: 0 4px 8px rgba(0,0,0,0.4);
        transition: box-shadow 0.2s ease, filter 0.2s ease;
        position: relative;
      `;
      
      // Create inner location dot (same as in FontAwesome location icons)
      const locationDot = document.createElement('div');
      locationDot.className = 'marker-dot';
      locationDot.style.cssText = `
        position: absolute;
        top: 35%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(45deg);
        width: 6px;
        height: 6px;
        background: white;
        border-radius: 50%;
        pointer-events: none;
      `;
      el.appendChild(locationDot);
      
      // Add title for tooltip
      el.title = `${location.name}\n${location.difficulty || 'Unknown'} • ${location.depth?.min || 0}-${location.depth?.max || 0}m`;
      
      // Add stable hover effect that matches the legend design
      el.addEventListener('mouseenter', () => {
        el.style.boxShadow = '0 6px 16px rgba(0,0,0,0.6)';
        el.style.filter = 'brightness(1.1)';
        el.style.zIndex = '1000';
      });
      el.addEventListener('mouseleave', () => {
        el.style.boxShadow = '0 4px 8px rgba(0,0,0,0.4)';
        el.style.filter = 'brightness(1)';
        el.style.zIndex = 'auto';
      });
      
      // Add visual feedback for click attempts
      el.addEventListener('mousedown', () => {
        el.style.transform = 'rotate(-45deg) scale(0.95)';
      });
      el.addEventListener('mouseup', () => {
        el.style.transform = 'rotate(-45deg) scale(1)';
      });

      // Create popup
      const popupNode = document.createElement('div');
      const root = createRoot(popupNode);
      
      root.render(
        <LocationPopup 
          location={location} 
          onDetailsClick={() => {
            if (onLocationClick) {
              onLocationClick(location);
            }
          }}
        />
      );

      const popup = new mapboxgl.Popup({
        offset: [0, -30], // Offset to account for marker height
        closeButton: true,
        closeOnClick: false,
        maxWidth: '320px',
        className: 'dive-location-popup',
        focusAfterOpen: false // Prevent focus issues that might affect positioning
      }).setDOMContent(popupNode);

      // Create marker with proper positioning
      try {
        const marker = new mapboxgl.Marker(el)
          .setLngLat(coordinates)
          .setPopup(popup)
          .addTo(map.current);
        
        // Add multiple click event handlers to ensure clicks work
        const handleMarkerClick = (e) => {
          e.stopPropagation();
          e.preventDefault();
          
          // Open the popup
          marker.togglePopup();
          
          // Fly to location with consistent coordinate access
          map.current.flyTo({
            center: coordinates,
            zoom: 12,
            pitch: 45,
            bearing: 0,
            essential: true,
            duration: 2000
          });
        };
        
        // Add click events to both the marker element and its children
        el.addEventListener('click', handleMarkerClick, true);
        el.addEventListener('mousedown', handleMarkerClick, true);
        
        // Also add click event to the inner dot
        const innerDot = el.querySelector('div');
        if (innerDot) {
          innerDot.addEventListener('click', handleMarkerClick, true);
        }
        
        // Make sure the marker element is clickable
        el.style.pointerEvents = 'auto';
        el.style.cursor = 'pointer';
        
        markers.current.push(marker);
        
      } catch (markerError) {
        // Silently skip invalid markers
      }
    });

    // Markers loaded
  }, [locations, mapLoaded, onLocationClick]);

  // Fly to selected location
  useEffect(() => {
    if (selectedLocation && map.current && mapLoaded) {
      // Use normalized coordinates for consistent access
      const coordinates = selectedLocation._normalizedCoordinates || 
                         selectedLocation.coordinates?.coordinates || 
                         [selectedLocation.lng, selectedLocation.lat] ||
                         [selectedLocation.longitude, selectedLocation.latitude];
                         
      if (coordinates && coordinates.length === 2) {
        map.current.flyTo({
          center: coordinates,
          zoom: 12,
          pitch: 45,
          bearing: 0,
          essential: true,
          duration: 2000
        });

        // Open the popup for selected location
        const marker = markers.current.find(m => {
          const lngLat = m.getLngLat();
          return Math.abs(lngLat.lng - coordinates[0]) < 0.0001 &&
                 Math.abs(lngLat.lat - coordinates[1]) < 0.0001;
        });
        if (marker) {
          marker.togglePopup();
        }
      }
    }
  }, [selectedLocation, mapLoaded]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Map Legend */}
      {mapLoaded && (
        <div className="absolute bottom-10 left-4 bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm border border-blue-500/20 rounded-lg shadow-xl p-4">
          <h3 className="font-semibold text-sm mb-3 text-white">Difficulty Levels</h3>
          <div className="space-y-2">
            {[
              { level: 'Beginner', color: '#22d3ee', desc: '0-18m depths', size: 22 },
              { level: 'Intermediate', color: '#fbbf24', desc: '18-30m depths', size: 24 },
              { level: 'Advanced', color: '#f87171', desc: '30-40m depths', size: 26 },
              { level: 'Expert', color: '#dc2626', desc: '40m+ depths', size: 28 }
            ].map(({ level, color, desc, size }) => (
              <div key={level} className="flex items-center space-x-3">
                <div className="relative flex items-center justify-center">
                  <div 
                    className="border-2 border-white/70 shadow-md relative"
                    style={{
                      width: `${Math.max(16, size * 0.7)}px`,
                      height: `${Math.max(16, size * 0.7)}px`,
                      background: color,
                      borderRadius: '50% 50% 50% 0',
                      transform: 'rotate(-45deg)'
                    }}
                  >
                    <div 
                      className="absolute bg-white rounded-full"
                      style={{
                        width: '4px',
                        height: '4px',
                        top: '35%',
                        left: '50%',
                        transform: 'translate(-50%, -50%) rotate(45deg)'
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-white font-medium">{level}</span>
                  <div className="text-xs text-gray-400">{desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-2 border-t border-slate-600/50">
            <div className="text-xs text-gray-400">
              <div>Click markers for details</div>
              <div>Hover for quick info</div>
            </div>
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {!mapLoaded && !mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-900 bg-opacity-50">
          <div className="text-white text-lg">Loading map...</div>
        </div>
      )}

      {/* Error display */}
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50">
          <div className="text-center p-4">
            <div className="text-red-600 text-lg font-semibold mb-2">Map Error</div>
            <div className="text-gray-700">{mapError}</div>
            <div className="text-sm text-gray-500 mt-2">Check browser console for details</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiveMap;