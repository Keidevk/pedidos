import { useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type MetodoPago = "efectivo" | "pagoMovil";

type Estado =
  | "pendiente"
  | "recibido"
  | "preparando"
  | "listo"
  | "enCamino"
  | "entregado"
  | "cancelado";

interface Details {
  id: string; 
  fecha: string; 
  estado: Estado;
  total: number;
  metodoPago: MetodoPago;
  clienteId: string; // UUID
  tiendaId: string; // UUID
  repartidorId: string; // UUID
}

// Función para formatear la fecha correctamente
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    
    // Si la fecha es inválida, devuelve el string original
    if (isNaN(date.getTime())) {
      return dateString;
    }
    
    // Formatea como DD/MM/YYYY
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return dateString;
  }
};

// Función para formatear la hora
const formatTime = (dateString: string) => {
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return '';
    }
    
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  } catch (error) {
    console.error('Error al formatear hora:', error);
    return '';
  }
};

export default function Pedidos() {
    const insets = useSafeAreaInsets();
    const { id, repartidorId } = useLocalSearchParams();
    const [detailsOrder, setDetailsOrder] = useState<Details>();
    const [fecha, setFecha] = useState<Date>();
    
    const steps = [
      { label: 'Solicitado', estado: 'pendiente' },
      { label: 'En Proceso', estado: 'recibido' },
      { label: 'Listo para Retirar', estado: 'preparando' },
      { label: 'Despachado', estado: 'listo' },
      { label: 'Entregado', estado: 'entregado' },
    ];

    useFocusEffect(
      React.useCallback(() => {
        async function getDetails() {
          try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_HOST}/api/order/details/${id}`);
            const result = await response.json();
            
            if (result.details) {
              setDetailsOrder(result.details);
              const date = new Date(result.details.fecha);
              
              // Verifica si la fecha es válida antes de guardarla
              if (!isNaN(date.getTime())) {
                setFecha(date);
              } else {
                console.warn('Fecha inválida recibida:', result.details.fecha);
              }
            }
          } catch (error) {
            console.error('Error al obtener detalles del pedido:', error);
          }
        }
        
        getDetails();
        
        return () => {
          // Limpieza si es necesaria
        };
      }, [id])
    );
    
    return (
      <View style={{ paddingTop: insets.top, flex: 1, backgroundColor: 'white' }}>
        {/* Encabezado con ID y fecha */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          padding: 15,
          borderBottomWidth: 1,
          borderBottomColor: '#f0f0f0'
        }}>
          <Text style={{ fontSize: 16 }}>Order ID: {id?.toString().slice(0,6)}</Text>
          <Text style={{ fontSize: 16 }}>
            Fecha: {detailsOrder?.fecha ? formatDate(detailsOrder.fecha) : '--/--/----'}
          </Text>
        </View>
        
        {/* Progreso del pedido */}
        <View style={{ padding: 20 }}>
          {steps.map((step, index) => {
            const isActive = detailsOrder?.estado === step.estado;
            const isCompleted = steps.findIndex(s => s.estado === detailsOrder?.estado) > index;
            
            return (
              <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                <Text style={{ 
                  width: 70, 
                  textAlign: 'right', 
                  marginRight: 10, 
                  fontSize: 16, 
                  color: '#333' 
                }}>
                  {index === 0 && detailsOrder?.fecha ? formatTime(detailsOrder.fecha) : ''}
                </Text>
                
                <View style={{ alignItems: 'center' }}>
                  <View
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 100,
                      backgroundColor: isActive || isCompleted ? "#EC2578" : "#ff4646ff",
                      opacity: isActive ? 1 : isCompleted ? 0.7 : 0.3,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    {isCompleted && (
                      <Text style={{ color: 'white', fontWeight: 'bold' }}>✓</Text>
                    )}
                  </View>
                  
                  {index < steps.length - 1 && (
                    <View
                      style={{
                        width: 2,
                        height: 50,
                        backgroundColor: isCompleted ? '#D61355' : '#f56d6dff',
                        marginTop: 2,
                      }}
                    />
                  )}
                </View>
                
                <Text style={{ 
                  marginLeft: 10, 
                  fontSize: 16, 
                  color: '#333',
                  fontWeight: isActive ? 'bold' : 'normal'
                }}>
                  {step.label}
                </Text>
              </View>
            );
          })}
        </View>
        
        {/* Información del repartidor */}
        <View style={{
          backgroundColor: "#E94B64",
          height: 150,
          marginHorizontal: 15,
          borderRadius: 12,
          marginTop: 20,
          padding: 15,
          justifyContent: 'center'
        }}>
          <View style={{
            backgroundColor: 'white',
            flexDirection: 'row',
            padding: 15,
            borderRadius: 25,
            alignItems: 'center'
          }}>
            <View style={{
              backgroundColor: '#A5A7B9',
              height: 50,
              width: 50,
              borderRadius: 25,
              marginRight: 10,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>R</Text>
            </View>
            
            <View>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Repartidor</Text>
              <Text style={{ opacity: 0.5 }}>ID {repartidorId ? repartidorId.toString().slice(0,6): "Repartidor no asignado"}</Text>
            </View>
          </View>
        </View>
      </View>
    );
}