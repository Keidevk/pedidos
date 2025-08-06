import { Inter_300Light, Inter_400Regular, Inter_600SemiBold, useFonts } from "@expo-google-fonts/inter";
import { Image } from "expo-image";
import { router, useFocusEffect } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Tienda } from "../types";
import { getItem, getShopById } from "../utils";

type Pedido = {
  id: string;
  fecha: string;
  estado: 'pendiente' | 'listo' | 'entregado' | 'cancelado'; // Añadí más estados posibles
  total: number;
  metodoPago: string;
  clienteId: string;
  tiendaId: string;
  repartidorId?: string | null;
};

type Categoria = 'pendiente' | 'completado'; // Cambié 'listo' por 'completado' para mayor claridad

// Función para formatear la fecha
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return dateString;
  }
};

export default function Pedidos() {
    const insets = useSafeAreaInsets();
    const [categoriaActual, setCategoriaActual] = useState<Categoria>('pendiente');
    const [pendientes, setPendientes] = useState<Pedido[]>([]);
    const [completados, setCompletados] = useState<Pedido[]>([]);
    const [shopData, setShopData] = useState<Tienda[]>();
    useFonts({Inter_600SemiBold, Inter_300Light, Inter_400Regular});    

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

    const fetchOrders = async (userId: string): Promise<{
      pendientes: Pedido[];
      completados: Pedido[];
    }> => {
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_HOST}/api/order/${userId}`);
        const result = await response.json();
        const pedidos: Pedido[] = result.data || [];
        
        // Filtramos los pedidos pendientes (estado 'pendiente')
        const pendientes = pedidos.filter(p => p.estado === 'pendiente');
        
        // Filtramos los pedidos completados (estados 'listo', 'entregado')
        const completados = pedidos.filter(p => p.estado === 'listo' || p.estado === 'entregado');
        
        const tiendas = [...pendientes, ...completados].map(p => p.tiendaId);
        fetchAllShopData(tiendas);
        
        return { pendientes, completados };
      } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        return { pendientes: [], completados: [] };
      }
    };

    useFocusEffect(
      React.useCallback(() => {
        const cargarPedidos = async () => {
          await getItem('@userId', async (userId) => {
            const { pendientes, completados } = await fetchOrders(userId);
            setPendientes(pendientes);
            setCompletados(completados);
          });
        };
        
        cargarPedidos();

        return () => {
          // Limpieza si es necesaria
        };
      }, [])
    );

    const renderPedidos = categoriaActual === 'pendiente' ? pendientes : completados;

    const handlerMain = async () => {
      router.replace('/(main)/main');
    };

    return (
      <View style={{ paddingTop: insets.top, flex: 1, backgroundColor: 'white' }}>
        {/* Header */}
        <TouchableOpacity 
          onPress={handlerMain} 
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, padding: 15 }}
        >
          <Image
            style={{ height: 32, width: 32, marginLeft: 5 }}
            contentFit="cover"
            source={require('../../assets/images/arrowback.svg')}
          />
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 20, marginLeft: 10 }}>Pedidos</Text>    
        </TouchableOpacity>

        {/* Pestañas */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }}>
          <TouchableOpacity
            onPress={() => setCategoriaActual('pendiente')}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 20,
              opacity: categoriaActual === 'pendiente' ? 1 : 0.5,
              borderBottomWidth: 2,
              borderBottomColor: categoriaActual === 'pendiente' ? '#E94B64' : "#A5A7B9"
            }}
          >
            <Text style={{ 
              color: categoriaActual === 'pendiente' ? '#E94B64' : "#A5A7B9", 
              fontFamily: 'Inter_600SemiBold' 
            }}>
              Pendientes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setCategoriaActual('completado')}
            style={{
              borderBottomColor: categoriaActual === 'completado' ? '#E94B64' : "#A5A7B9",
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderBottomWidth: 2,
              opacity: categoriaActual === 'completado' ? 1 : 0.5
            }}
          >
            <Text style={{ 
              color: categoriaActual === 'completado' ? '#E94B64' : "#A5A7B9", 
              fontFamily: 'Inter_600SemiBold' 
            }}>
              Completados
            </Text>
          </TouchableOpacity>
        </View>

        {/* Lista de pedidos */}
        <View style={{ paddingHorizontal: 15 }}>
          {renderPedidos.length === 0 ? (
            <View style={{ alignItems: 'center', marginTop: 50 }}>
              <Text style={{ fontFamily: 'Inter_400Regular', color: '#A5A7B9' }}>
                No hay pedidos {categoriaActual === 'pendiente' ? 'pendientes' : 'completados'}
              </Text>
            </View>
          ) : (
            renderPedidos.map(p => {
              const tienda = Array.isArray(shopData)
                ? shopData.find(s => s.id === p.tiendaId)
                : undefined;

              return (
                <TouchableOpacity 
                  key={p.id} 
                  onPress={() => {
                    router.push({
                      pathname: '/(main)/pedidos/[id]',
                      params: { id: p.id, repartidorId: p.repartidorId || '' }
                    });
                  }}
                  style={{ 
                    backgroundColor: 'white',
                    borderRadius: 10,
                    padding: 15,
                    marginBottom: 15,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 16 }}>
                      {tienda?.nombre || 'Tienda desconocida'}
                    </Text>
                    <Text style={{ fontFamily: 'Inter_300Light', color: '#A5A7B9' }}>
                      {formatDate(p.fecha)}
                    </Text>
                  </View>

                  <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View>
                      <Text style={{ fontFamily: 'Inter_400Regular', color: '#A5A7B9' }}>
                        Pedido #{p.id.slice(0, 6)}
                      </Text>
                      <Text style={{ 
                        fontFamily: 'Inter_600SemiBold',
                        color: p.estado === 'pendiente' ? '#E94B64' : 
                              p.estado === 'listo' ? '#FFA500' : '#4CAF50'
                      }}>
                        {p.estado === 'pendiente' ? 'Pendiente' : 
                         p.estado === 'listo' ? 'Listo para entregar' : 'Entregado'}
                      </Text>
                    </View>
                    <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 18 }}>
                      ${p.total.toFixed(2)}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </View>
    );
}