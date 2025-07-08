import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

type CarritoItem = {
  tiendaId:string;
  productoId: string;
  cantidad: number;
};

const useCargarCarrito = (setCart: React.Dispatch<React.SetStateAction<CarritoItem[]>>) => {
  useEffect(() => {
    const obtenerCarrito = async () => {
      try {
        const jsonCarrito = await AsyncStorage.getItem('carrito');
        if (jsonCarrito !== null) {
          const carritoParseado: CarritoItem[] = JSON.parse(jsonCarrito);
          setCart(carritoParseado);
          console.log('✅ Carrito cargado desde AsyncStorage');
        } else {
          console.log('📭 Carrito vacío en AsyncStorage');
        }
      } catch (error) {
        console.error('❌ Error al cargar el carrito', error);
      }
    };

    obtenerCarrito();
  },[]);
};

export default useCargarCarrito;