import { CarritoItem, Producto } from "@/app/types";
import { Inter_300Light, Inter_400Regular, Inter_600SemiBold } from "@expo-google-fonts/inter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { Dispatch, useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";



async function getProductData(id:string|string[],setState:Dispatch<Producto>){
    const response = await fetch(`${process.env.EXPO_PUBLIC_HOST}/api/product/getproduct/${id}`)
    const data = await response.json()
    setState(data)
}

export default function Products(){
    const { id } = useLocalSearchParams();
    const [cantidad,setCantidad] = useState(1)
    const insets = useSafeAreaInsets();
    
    useFonts({Inter_600SemiBold,Inter_300Light,Inter_400Regular});
    
    const [isLoading,setLoad] = useState(true)
    const [productData,setProductData] = useState<Producto|null>(null)

    function addOrRemoveProduct(type:string){
        if(cantidad === 1 && type === "-"){
            Alert.alert("Error","No se puede agregar productos con cantidad negativa")
            return;
        }
        if(type === "+"){
            setCantidad(cantidad+1)
        }
        else if(type === "-"){
            setCantidad(cantidad-1)
        }
        
    }

    
const agregarAlCarrito = async (
  nuevoId: string,
  tiendaId: string,
  cantidad:number
) => {
  try {
    const carritoRaw = await AsyncStorage.getItem(`carrito_${tiendaId}`);
    const carritoTienda: CarritoItem[] = carritoRaw ? JSON.parse(carritoRaw) : [];

    // 👇 Buscar solo dentro del carrito de esa tienda
    const existe = carritoTienda.find(item => item.productoId === nuevoId);

    let actualizado: CarritoItem[];

    if (existe) {
      actualizado = carritoTienda.map(item =>
        item.productoId === nuevoId
          ? { ...item, cantidad: item.cantidad + cantidad }
          : item
      );
    } else {
      actualizado = [...carritoTienda, { productoId: nuevoId, cantidad: cantidad, tiendaId }];
    }

    await AsyncStorage.setItem(`carrito_${tiendaId}`, JSON.stringify(actualizado));
    console.log('🛒 Producto agregado al carrito de tienda', tiendaId);


  } catch (error) {
    console.error('❌ Error en agregarAlCarrito:', error);
  }
};


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
        <TouchableOpacity
          onPress={()=>router.back()}
          style={{position:'relative', flexDirection: "row", alignItems: "center", top:insets.top,zIndex:100 }}
        >
            <Image
              style={{ height: 32, width: 32, marginLeft: 5 }}
              contentFit="cover"
              source={require("../../../assets/images/arrowback.svg")}
            ></Image>
            <Text style={{ fontFamily: "Inter_600SemiBold" }}>Carrito</Text>
        </TouchableOpacity>
        <View style={{backgroundColor:'#ccc',height:250}}></View>
        <View style={{flexDirection:'row',marginVertical:10}}>
            <Text style={{marginLeft:20,fontSize:20,fontFamily:'Inter_600SemiBold'}}>{productData.nombre}</Text>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
                <Text style={{fontSize:20,fontFamily:'Inter_600SemiBold',color:'#FF6B57',marginRight:20}}>
                    ${productData.precio}
                </Text>
            </View>
        </View>
        <View>
            {/* Estrellas */}
        </View>
        <Text style={{fontSize:16,marginHorizontal:20,fontFamily:'Inter_300Light',marginBottom:20}}>{productData.descripcion}</Text>
        <View style={{justifyContent: 'flex-end', alignItems: 'center',height:380,}}>
            <View style={{backgroundColor:'#DA114C',flex:1,maxHeight:90,width:360,borderRadius:20,flexDirection:'row'}} >
                <View style={{flexDirection:'row',marginVertical:'auto',marginLeft:10}}>
                    <TouchableOpacity onPress={()=>addOrRemoveProduct("-")} style={{backgroundColor:'white',height:30,width:30,borderRadius:100,}}>
                        <Text style={{fontSize:20,fontWeight:'black',color:'#DA114C',textAlign:'center'}}>-</Text>
                    </TouchableOpacity>
                    <Text style={{width:25,marginVertical:'auto',color:'white',fontSize:20,marginHorizontal:15}}>{cantidad}</Text>
                    <TouchableOpacity onPress={()=>addOrRemoveProduct("+")} style={{backgroundColor:'white',height:30,width:30,borderRadius:100,}}>
                        <Text style={{fontSize:20,fontWeight:'black',color:'#DA114C',textAlign:'center'}}>+</Text>
                    </TouchableOpacity>
                </View>
                <View style={{marginVertical:'auto',paddingLeft:10}}>
                    <TouchableOpacity onPress={()=>agregarAlCarrito(productData.id.toString(),productData.tiendaId.toString(),cantidad)} style={{width:200,flexDirection:'row',backgroundColor:'white',paddingVertical:20,paddingHorizontal:10,borderRadius:28.5}}>
                        <Text style={{color:'#5B5B5B',fontSize:14,fontWeight:"medium"}}>Añadir al Carrito</Text>
                        <Text style={{color:'#5B5B5B',paddingLeft:5,fontWeight:'bold'}}>${productData.precio * cantidad}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>

    </View>)
}