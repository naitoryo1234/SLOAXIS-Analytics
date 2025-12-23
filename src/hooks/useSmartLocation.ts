import { useState } from 'react';
import { getSavedStores } from '@/lib/storage';
import { SavedStore } from '@/types';

// Haversine formula to calculate distance in meters
const getDistanceFromLatLonInM = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d * 1000; // Distance in meters
};

const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
};

export const useSmartLocation = () => {
    const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [suggestedStore, setSuggestedStore] = useState<SavedStore | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const detectLocation = () => {
        setLoading(true);
        setError(null);

        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCurrentLocation({ lat: latitude, lng: longitude });

                // Logic to find nearest store
                const savedStores = getSavedStores();
                let nearestStore: SavedStore | null = null;
                let minDistance = Infinity;

                savedStores.forEach((store) => {
                    const distance = getDistanceFromLatLonInM(latitude, longitude, store.lat, store.lng);
                    if (distance < 500 && distance < minDistance) { // 500m threshold
                        minDistance = distance;
                        nearestStore = store;
                    }
                });

                if (nearestStore) {
                    setSuggestedStore(nearestStore);
                }

                setLoading(false);
            },
            (err) => {
                setError('Unable to retrieve your location');
                setLoading(false);
                console.error(err);
            }
        );
    };

    return { currentLocation, suggestedStore, loading, error, detectLocation };
};
