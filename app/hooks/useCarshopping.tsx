import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import React, { useRef } from 'react';

type CarritoItem = {
  tiendaId: string;
  productoId: string;
  cantidad: number;
};


const useCargarCarritosPorTienda = (
  setCart: React.Dispatch<React.SetStateAction<CarritoItem[]>>
) => {
  const hasRunRef = useRef(false);

  const obtenerTodosLosCarritos = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        // 👇 Filtra solo las claves que comienzan con 'carrito_'
        const carritoKeys = keys.filter(key => key.startsWith('carrito_'));

        const carritosRaw = await AsyncStorage.multiGet(carritoKeys);

        // 👇 Combina todos los arrays en uno solo
        const todosLosItems: CarritoItem[] = carritosRaw.flatMap(([key, value]) => {
          if (value) {
            try {
              const items: Omit<CarritoItem, 'tiendaId'>[] = JSON.parse(value);
              const tiendaId = key.replace('carrito_', '');
              return items.map(item => ({
                ...item,
                tiendaId, // 👈 Añadimos tiendaId desde la clave
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
        hasRunRef.current = true
      } catch (error) {
        console.error('❌ Error al cargar los carritos por tienda', error);
      }
    };

  useFocusEffect(
    React.useCallback(() => {
      // AsyncStorage.clear()
      obtenerTodosLosCarritos();
      return () => {
        hasRunRef.current = false
      };
    }, [])
  );
}
export default useCargarCarritosPorTienda;