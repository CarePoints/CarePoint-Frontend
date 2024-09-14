

'use client'

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { LatLngTuple, Icon, DivIcon, point } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'; // Import Routing Machine styles
import L from 'leaflet'; // Import Leaflet
import 'leaflet-routing-machine'; // Import Routing Machine
import location from '../../../public/images/location.png'; 
import MarkerClusterGroup from 'react-leaflet-cluster';
import { useSearchParams } from 'next/navigation';
import axiosInstance from '../hooks/useApi';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const MapContainers = () => {
  const [userLocation, setUserLocation] = useState<LatLngTuple | null>(null);
  const [doctorLocation, setDoctorLocation] = useState<LatLngTuple | null>(null);
  const locationSearchValue = useSelector((state: RootState) => state.search.locationSearchValue);

  const searchParams = useSearchParams();
  const doctorEmail = searchParams.get('email');

  


  const fetchCoordinates = async (address: string): Promise<LatLngTuple | null> => {
    try {
      const apiKey = 'b45c5dc54e0c4256ab1e9c3953b72210';
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`
      );
      const result = response.data.results[0];
      if (result) {
        const { lat, lng } = result.geometry;
        return [lat, lng];
      }
      return null;
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchDoctorLocation = async () => {
      try {
        // const demoLocation: LatLngTuple = [8.4910, 76.9538]; // Thampanoor demo location
        // setDoctorLocation(demoLocation);

        const response = await axiosInstance.post('/doctor-service/selectedDoctorForMapTracking',{doctorEmail});
        const doctorAddress = response.data.result.practiceAddress;
        console.log('Doctor address:', response.data.result.practiceAddress);
        const coordinates = await fetchCoordinates(doctorAddress);
        if (coordinates) {
          console.log('Doctor coordinates:', coordinates);
          setDoctorLocation(coordinates);
        } else {
          console.error('Unable to fetch coordinates for the address');
        }
        
      } catch (error) {
        console.error('Error fetching doctor location:', error);
      }
    };

    fetchDoctorLocation();
  }, [doctorEmail]);

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Error watching user location:', error);
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  const customIcon = new Icon({
    iconUrl: location.src,
    iconSize: [38, 38],
  });

  const createCustomClusterIcon = (cluster: any) => {
    const count = cluster.getChildCount();
    let sizeClass = 'bg-white text-black';

    if (count > 10 && count <= 50) {
      sizeClass = 'bg-gray-200 text-black';
    } else if (count > 50) {
      sizeClass = 'bg-gray-400 text-white';
    }

    return new DivIcon({
      html: `<div class="flex items-center justify-center w-12 h-12 rounded-full ${sizeClass} text-xs font-bold border border-gray-300">${count}</div>`,
      className: 'custom-cluster',
      iconSize: point(40, 40, true),
    });
  };

  const MapUpdater = ({ location }: { location: LatLngTuple | null }) => {
    const map = useMap();

    useEffect(() => {
      if (location) {
        map.setView(location, map.getZoom(), { animate: true });
      }
    }, [location, map]);

    return null;
  };

  const AddRoutingControl = () => {
    const map = useMap();

    useEffect(() => {
      if (userLocation && doctorLocation) {
        // Remove existing routing control if it exists
        map.eachLayer((layer) => {
          if (layer instanceof L.Routing.Control) {
            map.removeLayer(layer);
          }
        });

        // Add new routing control
        L.Routing.control({
          waypoints: [
            L.latLng(userLocation),
            L.latLng(doctorLocation),
          ],
          lineOptions: {
            styles: [{ color: 'blue', weight: 5 }],
            extendToWaypoints: true,
            missingRouteTolerance: 0.001,
          },
        }).addTo(map);
      }
    }, [userLocation, doctorLocation, map]);

    return null;
  };

  return (
    <MapContainer center={userLocation || [8.4910, 76.9538]} zoom={13} className='h-[100vh] mt-5 w-[90%] xl:w-[95%] xl:ml-9 ml-[5%] rounded-xl' id='map'>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MarkerClusterGroup chunkedLoading iconCreateFunction={createCustomClusterIcon}>
        {userLocation && (
          <Marker position={userLocation} icon={customIcon}>
            <Popup>Your location</Popup>
          </Marker>
        )}
        {doctorLocation && (
          <Marker position={doctorLocation} icon={customIcon}>
            <Popup>Doctor's location</Popup>
          </Marker>
        )}
      </MarkerClusterGroup>

      <MapUpdater location={userLocation} />
      <AddRoutingControl />
    </MapContainer>
  );
};

export default MapContainers;
