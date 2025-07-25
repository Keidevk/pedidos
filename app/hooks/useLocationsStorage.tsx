import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export type Location = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

type UseLocationsStorageResult = {
  locations: Location[];
  loading: boolean;
  saveLocation: (location: Location) => Promise<void>;
  updateLocation: (id: string, updatedData: Partial<Location>) => Promise<void>;
  getLocationById: (id: string) => Location | undefined;
  reload: () => Promise<void>;
};

const STORAGE_KEY = 'LOCATIONS_LIST';

export const useLocationsStorage = (): UseLocationsStorageResult => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async (): Promise<void> => {
    try {
      setLoading(true);
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const parsed: Location[] = stored ? JSON.parse(stored) : [];
      setLocations(parsed);
    } catch (error) {
      console.error('Error cargando ubicaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveLocation = async (newLocation: Location): Promise<void> => {
    try {
      const updated = [...locations, newLocation];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setLocations(updated);
    } catch (error) {
      console.error('Error guardando ubicación:', error);
    }
  };

  const updateLocation = async (id: string, updatedData: Partial<Location>): Promise<void> => {
    try {
      const updated = locations.map(loc =>
        loc.id === id ? { ...loc, ...updatedData } : loc
      );
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setLocations(updated);
    } catch (error) {
      console.error('Error actualizando ubicación:', error);
    }
  };

  const getLocationById = (id: string): Location | undefined => {
    return locations.find(loc => loc.id === id);
  };

  return {
    locations,
    loading,
    saveLocation,
    updateLocation,
    getLocationById,
    reload: loadLocations
  };
};