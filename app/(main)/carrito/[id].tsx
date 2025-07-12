import { Producto } from "@/app/types";
import { handlerMain } from "@/app/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type FilteredData = { 
  tiendaId: number; 
  ids: string[]; 
}

type CarritoItem = {
    productoId: string;
    cantidad: number;
};



export default function ItemCarrito(){
    const {id} = useLocalSearchParams()
    const insets = useSafeAreaInsets();
    const [cantidad,setCantidad] = useState<CarritoItem[]>([])
    const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>([]);
    const [price,setPrice] = useState<number>(0)

    const hasRunRef = useRef(false);
    
    

     const obtenerProductos = async () => {
        const carritoRaw = await AsyncStorage.getItem(`carrito_${id}`);
        if (!carritoRaw) return;    
        const carrito: CarritoItem[] = JSON.parse(carritoRaw);
        setCantidad(carrito)
        console.log(carrito)
        
        const filterData = {
          tiendaId: parseInt(id[0]),
          ids: carrito.map(item => item.productoId),
        };
        console.log(filterData)
        try {
          const response = await fetch(`${process.env.EXPO_PUBLIC_HOST}/api/product/preorder/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(filterData),
          });
      
          if (!response.ok) throw new Error('Error en la petición');
      
          const data = await response.json();
          setProductosFiltrados(data)
          hasRunRef.current = true

          
        } catch (error) {
          console.error('Error al obtener productos:', error);
          return null;
        }
      };

    useFocusEffect(
    React.useCallback(() => {
       obtenerProductos();
      const total = productosFiltrados.reduce((sum, product) => {
        return sum + parseFloat(product.precio) 
      }, 0);

      setPrice(total);
    return () => {
        hasRunRef.current = false
      };
    }, [id[0],price])
  );

    return(
    <View style={{paddingTop:insets.top}}>
        <TouchableOpacity onPress={handlerMain} style={{flexDirection:'row',alignItems:'center',marginBottom:10}}>
                    <Image
                    style={{height:32,width:32,marginLeft:5,}}
                    contentFit="cover"
                    source={require('../../../assets/images/arrowback.svg')}></Image>
                    <Text style={{fontFamily:'Inter_600SemiBold'}}>Carrito</Text>    
                </TouchableOpacity>
        <Text>{id}</Text>
        <ScrollView>
            {productosFiltrados && productosFiltrados.map((product,index)=>{
              const cantidadItem = cantidad.find(item => parseInt(item.productoId) === product.id);
              const amount = cantidadItem?.cantidad ?? 0;
                // setPrice(prevTotal => prevTotal + parseFloat(product.precio));
                return(<View key={index} style={{marginBottom:10}}>
                    <Text>Index:{product.id}</Text>
                    <Text>Nombre: {product.nombre}</Text>
                    <Text>Descripcion: {product.descripcion}</Text>
                    <Text>Precio individual: {product.precio}</Text>
                    <Text>Cantidad: {amount}</Text>
                </View>)
            })}
            <View>
                <Text>Total: {price}</Text>
            </View>
        </ScrollView>
    </View>)
}