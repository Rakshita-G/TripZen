import React, { useState, useMemo, useEffect, useRef } from "react";
import PlaceCardItem from "./PlaceCardItem";
import { Button } from '@/components/ui/button';
import { MapPin, List } from 'lucide-react';

const googleMapsApiKey = 'AIzaSyBJUi3dOGR3t7VHRO9UypAnBPn-vFutEew';

const containerStyle = {
  width: '100%',
  height: '600px',
  borderRadius: '0.75rem',
  marginTop: '1rem'
};

const defaultCenter = {
  lat: 20.5937,
  lng: 78.9629 // Default to India
};

function MapView({ itinerary }) {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const mapInstance = useRef(null);
  const mapContainerRef = useRef(null);

  // Initialize map when component mounts
  useEffect(() => {
    // Check if script is already loaded
    if (window.google && window.google.maps) {
      initMap();
    } else {
      // Load Google Maps script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      script.onerror = (error) => {
        console.error('Error loading Google Maps:', error);
        setLoadError(new Error('Failed to load Google Maps'));
      };
      document.head.appendChild(script);
    }

    // Cleanup function
    return () => {
      // Clear markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
      
      // Clear map instance
      if (mapInstance.current) {
        mapInstance.current = null;
      }
    };
  }, []);

  const initMap = () => {
    try {
      if (!mapContainerRef.current) return;
      
      const center = defaultCenter;
      mapInstance.current = new window.google.maps.Map(mapContainerRef.current, {
        center,
        zoom: 5,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true,
        zoomControl: true,
        maxZoom: 18,
        minZoom: 3,
      });
      
      // Trigger a resize event to fix rendering issues
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 100);
      
    } catch (error) {
      console.error('Error initializing map:', error);
      setLoadError(new Error('Failed to initialize map'));
    }
  };

  // Add markers to map when places change
  useEffect(() => {
    if (!mapInstance.current || !itinerary) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    const days = Array.isArray(itinerary) ? itinerary : itinerary?.dailyPlan || [];
    const places = days.flatMap((day, dayIndex) => 
      (day.plan || []).map(place => ({
        ...place,
        day: day.day || `Day ${dayIndex + 1}`,
        dayIndex
      }))
    ).filter(place => place.geoCoordinates);

    // Add markers
    const bounds = new window.google.maps.LatLngBounds();
    let hasValidMarkers = false;

    places.forEach((place) => {
      try {
        const [lat, lng] = place.geoCoordinates.map(Number);
        if (isNaN(lat) || isNaN(lng)) return;

        const position = { lat, lng };
        bounds.extend(position);
        hasValidMarkers = true;

        const marker = new window.google.maps.Marker({
          position,
          map: mapInstance.current,
          title: place.place,
          label: {
            text: (place.dayIndex + 1).toString(),
            color: 'white',
            fontWeight: 'bold'
          },
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            labelOrigin: new window.google.maps.Point(12, 12)
          }
        });

        marker.addListener('click', () => {
          setSelectedPlace(place);
        });

        markersRef.current.push(marker);
      } catch (error) {
        console.error('Error adding marker:', error);
      }
    });

    // Fit bounds if we have valid markers
    if (hasValidMarkers) {
      const padding = 100; // pixels
      mapInstance.current.fitBounds(bounds, padding);
    }
  }, [itinerary]);

  if (loadError) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        <p>Error loading map: {loadError.message}</p>
        <p>Please try refreshing the page or check your internet connection.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div 
        ref={mapContainerRef}
        style={containerStyle}
        className="bg-gray-100 rounded-lg overflow-hidden"
      >
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-gray-500">Loading map...</div>
        </div>
      </div>
      {selectedPlace && (
        <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg z-10 max-w-md mx-auto">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg">{selectedPlace.place}</h3>
              <p className="text-sm text-gray-600">{selectedPlace.day} • {selectedPlace.time}</p>
              {selectedPlace.rating && (
                <p className="text-sm text-yellow-600 mt-1">★ {selectedPlace.rating}</p>
              )}
            </div>
            <button 
              onClick={() => setSelectedPlace(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailView({ itinerary }) {
  return (
    <div>
      {(Array.isArray(itinerary) 
          ? itinerary 
          : itinerary?.dailyPlan || []
      ).map((item, index) => (
        <React.Fragment key={`day-${index}`}>
          <div className="mt-2">
            <h2 className="font-bold text-lg">{`${item.day}`}</h2>
            <div className="grid md:grid-cols-2 gap-5">
              {(item.plan || []).map((place, placeIndex) => (
                <div key={`place-${index}-${placeIndex}`} className="my-2">
                  {place.time && <h2 className="font-medium text-sm text-orange-600">{place.time}</h2>}
                  <PlaceCardItem place={place}/>
                </div>
              ))}
            </div>
            <hr className="my-4"/>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

function PlacesToVisit({ trip }) {
  const [view, setView] = useState('detail');
  const itinerary = trip?.tripData?.itinerary;

  if (!itinerary) return <div>Loading itinerary...</div>;

  return (
    <div>
      <div className="flex justify-end mb-4 space-x-2">
        <Button 
          variant={view === 'detail' ? 'default' : 'outline'} 
          onClick={() => setView('detail')}
          className="flex items-center gap-2"
        >
          <List size={16} /> List View
        </Button>
        <Button 
          variant={view === 'map' ? 'default' : 'outline'} 
          onClick={() => setView('map')}
          className="flex items-center gap-2"
        >
          <MapPin size={16} /> Map View
        </Button>
      </div>

      {view === 'detail' ? (
        <DetailView itinerary={itinerary} />
      ) : (
        <MapView itinerary={itinerary} />
      )}
    </div>
  );
}

export default PlacesToVisit;
