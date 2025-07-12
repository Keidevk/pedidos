import { Producto } from "@/app/types";
import { Inter_300Light, Inter_400Regular, Inter_600SemiBold } from "@expo-google-fonts/inter";
import { useFonts } from "expo-font";
import { useLocalSearchParams } from "expo-router";
import { Dispatch, useEffect, useState } from "react";
import { Text, View } from "react-native";



async function getProductData(id:string|string[],setState:Dispatch<Producto>){
    const response = await fetch(`http://192.168.3.6:3000/api/product/getproduct/${id}`)
    const data = await response.json()
    setState(data)
}

export default function Products(){
    const { id } = useLocalSearchParams();
    useFonts({Inter_600SemiBold,Inter_300Light,Inter_400Regular});
    
    const [isLoading,setLoad] = useState(true)
    const [productData,setProductData] = useState<Producto|null>(null)

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
    </View>)
}