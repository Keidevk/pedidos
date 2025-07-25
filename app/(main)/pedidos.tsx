import { Inter_300Light, Inter_400Regular, Inter_600SemiBold, useFonts } from "@expo-google-fonts/inter";
import { Image } from "expo-image";
import { router, useFocusEffect } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Tienda } from "../types";
import { getItem, getShopById } from "../utils";

type Pedido = {
  id: string;
  fecha: string;
  estado: 'pendiente' | 'listo';
  total: number;
  metodoPago: string;
  clienteId: string;
  tiendaId: string;
  repartidorId?: string | null;
};

type Categoria = 'pendiente' | 'listo';

export default function Pedidos(){
    const insets = useSafeAreaInsets();
    const [userId,setUserId] = useState<string>()
    const [categoriaActual, setCategoriaActual] = useState<Categoria>('pendiente');
    const [pendientes, setPendientes] = useState<Pedido[]>([]);
    const [listos, setListos] = useState<Pedido[]>([]);
    const [shopData,setShopData] = useState<Tienda[]>()
    useFonts({Inter_600SemiBold,Inter_300Light,Inter_400Regular});    


    const fetchAllShopData = async (tiendaIds: string[]) => {
    try {
      const results: Tienda[] = [];

      for (const id of tiendaIds) {
        const shop = await getShopById(id);
        if (shop) results.push(shop);
      }

      setShopData(results);
    } catch (error) {
      console.error('Error al cargar tiendas:', error);
    }
  };

  


    const fetchOrders = async (): Promise<{
      pendientes: Pedido[];
      listos: Pedido[];
    }> => {
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_HOST}/api/order/${userId}`);
        const result = await response.json();
        const pedidos: Pedido[] = result.data;
        const tiendas = pedidos.map(p=>p.tiendaId)
        fetchAllShopData(tiendas);

        
        
        const pendientes = pedidos.filter(p => p.estado === 'pendiente');
        const listos = pedidos.filter(p => p.estado === 'listo');
        
        return { pendientes, listos };
      } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        return { pendientes: [], listos: [] };
      }
    };

    
    useFocusEffect(
      React.useCallback(() => {
        const cargarPedidos = async () => {
          await getItem('@userId',setUserId)
          const { pendientes, listos } = await fetchOrders();
          setPendientes(pendientes);
          setListos(listos);

        };
        
    cargarPedidos();

      return () => {

            };
          }, [])
          );


    useEffect(() => {
   


  }, []);

    const renderPedidos = categoriaActual === 'pendiente' ? pendientes : listos;



        
    
    const handlerMain = async () => {
                router.replace('/(main)/main');
    };
    return(
        <View style={{paddingTop:insets.top}}>
            <TouchableOpacity onPress={handlerMain} style={{flexDirection:'row',alignItems:'center',marginBottom:10}}>
                <Image
                style={{height:32,width:32,marginLeft:5,}}
                contentFit="cover"
                source={require('../../assets/images/arrowback.svg')}></Image>
                <Text style={{fontFamily:'Inter_600SemiBold'}}>Pedidos</Text>    
            </TouchableOpacity>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }}>
        <TouchableOpacity
          onPress={() => setCategoriaActual('pendiente')}
          style={{
            paddingVertical: 10,
            paddingHorizontal: 20,
            opacity: categoriaActual === 'pendiente' ? 1 : 0.5,
            borderBottomWidth:2,
            borderBottomColor:categoriaActual === 'pendiente' ?  '#E94B64' : "#A5A7B9"
          }}
        >
          <Text style={{ color: categoriaActual === 'pendiente' ? '#E94B64' : "#A5A7B9", fontWeight: 'bold' }}>Pendientes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setCategoriaActual('listo')}
          style={{
            borderBottomColor: categoriaActual === 'listo' ?  '#E94B64' : "#A5A7B9",
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderBottomWidth:2,
            opacity: categoriaActual === 'listo' ? 1 : 0.5
          }}
        >
          <Text style={{ color: categoriaActual === 'listo' ?  '#E94B64' : "#A5A7B9", fontWeight: 'bold' }}>Completados</Text>
        </TouchableOpacity>
      </View>

      {renderPedidos.length === 0 ? (
        <Text>No hay pedidos en esta categoría.</Text>
        ) : (
    renderPedidos.map(p => {
    
    const tienda = Array.isArray(shopData)
      ? shopData.find(s => s.id === p.tiendaId)
      : undefined;

    return (
      <View key={p.id} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
        <View style={{ height: 50, width: 50, backgroundColor: '#A5A7B9', borderRadius: 10 }} />
        <View style={{ marginLeft: 10 }}>
            <Text style={{ fontWeight: 'bold' }}>{tienda?.nombre || 'Tienda desconocida'}</Text>
            <Text>{`Pedido #${p.id.slice(0, 6)}`}</Text>
            <Text style={{}}>${p.total}</Text>
        </View>
      </View>
    );
  })
)}



        </View>)
}