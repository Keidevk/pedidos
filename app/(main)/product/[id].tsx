import { Inter_300Light, Inter_400Regular, Inter_600SemiBold } from "@expo-google-fonts/inter";
import { useFonts } from "expo-font";
import { useLocalSearchParams } from "expo-router";
import { Dispatch, useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Producto {
  id: number;
  tiendaId: number;
  nombre: string;
  descripcion: string;
  precio: string;
  precioPromocion: string;
  categoria: string;
  ingrediente: string;
  disponibilidad: boolean;
  tiempoPreparacion: number;
  fotosProducto: string[];
  destacado: boolean;
}

async function getProductData(id:string|string[],setState:Dispatch<Producto>){
    const response = await fetch(`http://192.168.3.6:3000/api/product/getproduct/${id}`)
    const data = await response.json()
    setState(data)
}

export default function Products(){
    const { id } = useLocalSearchParams();
        const insets = useSafeAreaInsets();
        useFonts({Inter_600SemiBold,Inter_300Light,Inter_400Regular});
        
        const [isLoading,setLoad] = useState(true)
        const [productData,setProductData] = useState<Producto|null>(null)
        const [select,setSelect] = useState(false)
    
        useEffect(()=>{
            getProductData(id,setProductData)
            setLoad(false)
        },[isLoading,id])
    
        if(isLoading){
            return(<View><Text>Loading....</Text></View>)
        }
        if(!productData){
            return(<View><Text>No cargo</Text></View>)
        }
    return(
    <View>
        <View style={{backgroundColor:'#ccc',height:250}}></View>
        <View style={{flexDirection:'row',marginVertical:10}}>
            <Text style={{marginLeft:20,fontSize:20,fontFamily:'Inter_600SemiBold'}}>{productData.nombre}</Text>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
                <Text style={{fontSize:20,fontFamily:'Inter_600SemiBold',color:'#FF6B57',marginRight:20}}>${productData.precio}</Text>
            </View>
        </View>
        <View>
            {/* Estrellas */}
        </View>
        <Text style={{fontSize:16,marginHorizontal:20,fontFamily:'Inter_300Light',marginBottom:20}}>{productData.descripcion}</Text>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{backgroundColor:'#FF627BAB',paddingHorizontal:10,borderTopStartRadius:20,borderTopEndRadius:20,paddingLeft:20,paddingRight:10,paddingBottom:375,}}>
            <Text style={{fontSize:20,marginTop:20,marginBottom:20}}>Toping</Text>
            <View>
                <View style={{height:50,flexDirection:'row',}}>
                    <View style={{height:50,width:50,backgroundColor:'#ccc',borderRadius:100}}></View>
                    <Text style={{marginVertical:'auto',marginLeft:20,fontSize:18}}>Toping name</Text>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
                        <TouchableOpacity onPress={()=>{setSelect(!select)}} style={[{height:25,width:25,borderColor:'#000',borderWidth:1,borderRadius:100,marginVertical:'auto'},select && {backgroundColor: '#DA114C'} ]}></TouchableOpacity>
                    </View>
                    
                </View>
            </View>
            
        </ScrollView>
    </View>)
}