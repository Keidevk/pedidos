import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import React, { useRef } from 'react';
import { CarritoItem } from '../types';



const useCargarCarritosPorTienda = (
  setCart: React.Dispatch<React.SetStateAction<CarritoItem[]>>,
  clienteId: string // Añadir clienteId como parámetro
) => {
  const hasRunRef = useRef(false);

  const obtenerTodosLosCarritos = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      // Filtrar claves que comienzan con 'carrito_' y contienen el clienteId
      const carritoKeys = keys.filter(key => 
        key.startsWith(`carrito_${clienteId}_`) // Cambiar el formato de la clave
      );

      const carritosRaw = await AsyncStorage.multiGet(carritoKeys);

      const todosLosItems: CarritoItem[] = carritosRaw.flatMap(([key, value]) => {
        if (value) {
          try {
            const items: Omit<CarritoItem, 'tiendaId' | 'clienteId'>[] = JSON.parse(value);
            // Extraer tiendaId de la clave (formato: carrito_[clienteId]_[tiendaId])
            const parts = key.split('_');
            const tiendaId = parts[2];
            return items.map(item => ({
              ...item,
              tiendaId,
              clienteId // Añadir clienteId a cada item
            }));
          } catch (e) {
            console.error(`❌ Error parseando ${key}:`, e);
            return [];
          }
        }
        return [];
      });
      setCart(todosLosItems);
      console.log('✅ Todos los carritos cargados:', todosLosItems);
      hasRunRef.current = true;
    } catch (error) {
      console.error('❌ Error al cargar los carritos por tienda', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (clienteId) { // Solo ejecutar si tenemos clienteId
        obtenerTodosLosCarritos();
      }
      return () => {
        hasRunRef.current = false;
      };
    }, [clienteId]) // Dependencia del clienteId
  );
};

export default useCargarCarritosPorTienda;