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

const STORAGE_KEY_PREFIX = 'USER_LOCATIONS_';

export const useLocationsStorage = (): UseLocationsStorageResult => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Obtener el userId de AsyncStorage
        const storedUserId = await AsyncStorage.getItem('@userId');
        if (storedUserId) {
          setUserId(storedUserId);
          await loadLocations(storedUserId);
        } else {
          setLoading(false);
          console.warn('No se encontró userId en AsyncStorage');
        }
      } catch (error) {
        console.error('Error obteniendo userId:', error);
        setLoading(false);
      }
    };
    
    initialize();
  }, []);

  const loadLocations = async (currentUserId: string): Promise<void> => {
    try {
      setLoading(true);
      const storageKey = `${STORAGE_KEY_PREFIX}${currentUserId}`;
      const stored = await AsyncStorage.getItem(storageKey);
      const parsed: Location[] = stored ? JSON.parse(stored) : [];
      setLocations(parsed);
    } catch (error) {
      console.error('Error cargando ubicaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveLocation = async (newLocation: Location): Promise<void> => {
    if (!userId) {
      console.error('No se puede guardar ubicación: userId no definido');
      return;
    }
    
    try {
      const storageKey = `${STORAGE_KEY_PREFIX}${userId}`;
      const updated = [...locations, newLocation];
      await AsyncStorage.setItem(storageKey, JSON.stringify(updated));
      setLocations(updated);
    } catch (error) {
      console.error('Error guardando ubicación:', error);
    }
  };

  // Resto de las funciones (updateLocation, getLocationById) deben ser modificadas similarmente
  // para usar el userId interno

  const updateLocation = async (id: string, updatedData: Partial<Location>): Promise<void> => {
    if (!userId) {
      console.error('No se puede actualizar ubicación: userId no definido');
      return;
    }
    
    try {
      const storageKey = `${STORAGE_KEY_PREFIX}${userId}`;
      const updated = locations.map(loc =>
        loc.id === id ? { ...loc, ...updatedData } : loc
      );
      await AsyncStorage.setItem(storageKey, JSON.stringify(updated));
      setLocations(updated);
    } catch (error) {
      console.error('Error actualizando ubicación:', error);
    }
  };

  const getLocationById = (id: string): Location | undefined => {
    return locations.find(loc => loc.id === id);
  };

  const reload = async (): Promise<void> => {
    if (userId) {
      await loadLocations(userId);
    }
  };

  return {
    locations,
    loading,
    saveLocation,
    updateLocation,
    getLocationById,
    reload
  };
};