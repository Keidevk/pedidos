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


export default function Pedidos(){
    const insent = useSafeAreaInsets()
    const { id,repartidorId } = useLocalSearchParams()
    const [detailsOrder,setDetailsOrder] = useState<Details>()
    const [fecha,setFecha] = useState<Date>()
    
    const steps = [
    { label: 'Solicitado', estado: 'pendiente' },
    { label: 'En Proceso', estado: 'recibido' },
    { label: 'Listo para Retirar', estado: 'preparando' },
    { label: 'Despachado', estado: 'listo' },
    { label: 'Entregado', estado: 'entregado' },
  ];



    useFocusEffect(
        React.useCallback(() => {
            async function getDetails(){
                const response = await fetch(`${process.env.EXPO_PUBLIC_HOST}/api/order/details/${id}`)
                const result = await response.json();
                // console.log("🔥🔥🔥🔥🔥")
                // console.log(result.details)
                setDetailsOrder(result.details)
                const date = new Date(result.details.fecha)
                setFecha(date)
                console.log(result.details.estado)
                // console.log("Detalles \n")
                // console.log(detailsOrder)
            }
            getDetails()
            return () => {

            };
        }, []));
    
    
    
    return(
        <View style={{paddingTop:insent.top}}>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                <Text style={{marginLeft:10}}>Order ID: {id?.slice(0,6)}</Text>
                <Text style={{marginRight:10}}>Fecha: {fecha?.getDay()}/{fecha?.getMonth()}/{fecha?.getFullYear()}</Text>
            </View>
             <View style={{flexDirection: 'column', alignItems: 'flex-start', padding: 20 }}>
                {steps.map((step, index) => {
                    const isActive = detailsOrder?.estado === step.estado;
                    return (
                  <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                    <Text style={{ width: 70, textAlign: 'right', marginRight: 10, fontSize: 20, color: '#333' }}>
                      {index === 0 && fecha ? `${fecha.getHours()}:${fecha.getMinutes().toString().padStart(2, '0')}` : ''}
                    </Text>
                    <View style={{ alignItems: 'center' }}>
                      <View
                        style={{
                            width: 30,
                            height: 30,
                            borderRadius: 100,
                            backgroundColor: "#EC2578",
                            opacity:isActive ? 1 : 0.5
                        }}
                      />
                      {index < steps.length - 1 && (
                        <View
                          style={{
                            width: 2,
                            height:50,
                            backgroundColor: '#D61355',
                            marginTop: 2,
                          }}
                        />
                      )}
                    </View>
              <Text style={{ marginLeft: 10, fontSize: 20, color: '#333' }}>{step.label}</Text>
            </View>
          )})}
        </View>
        <View style={{backgroundColor:"#E94B64",height:150,marginHorizontal:0.1,borderRadius:12}}>
            <View style={{backgroundColor:'white',flexDirection:'row',marginHorizontal:20,marginTop:20,padding:10,borderRadius:25}}>
                <View style={{backgroundColor:'gray',height:40,width:40,borderRadius:100,marginRight:10}}></View>
                <View>
                    <Text>Repartidor</Text>
                    <Text style={{opacity:0.5}}>ID {repartidorId?.slice(0,6)}</Text>
                </View>
            </View>
        </View>



        </View>
    )
}