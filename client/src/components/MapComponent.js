import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapComponent = ({ selectedAddress }) => {
  const [location, setLocation] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    if (selectedAddress) {
      const geocodeAddress = async (address) => {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyB727k_b7A6TPwQQKos6T4JuanmijXy5wM`
        );
        const data = await response.json();
        if (data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          setLocation({ lat, lng });
        }
      };

      geocodeAddress(selectedAddress);
    }
  }, [selectedAddress]);

  return (
    <LoadScript googleMapsApiKey="AIzaSyB727k_b7A6TPwQQKos6T4JuanmijXy5wM">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%', borderRadius: '1rem' }}
        center={location}
        zoom={12}
      >
        {location.lat !== 0 && <Marker position={location} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
