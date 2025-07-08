import { Inter_300Light, Inter_400Regular, Inter_600SemiBold } from "@expo-google-fonts/inter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { Dispatch, useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface Tienda {
  id: number;
  Nombre: string;
  Descripcion: string;
  Ubicacion: string;
  HorarioApertura: string; // ISO 8601 format
  HorarioCierre: string;   // ISO 8601 format
  Categoria: string;
  TiempoEntregaPromedio: number; // en horas
  costoEnvio: string; // podría cambiar a number si se prefiere precisión decimal
  rating: string;     // lo mismo aquí si planeas hacer cálculos, puede convertirse a number
  fotos_tienda: string[];
}

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

async function getShopProducts(id:string|string[],setState:Dispatch<Producto[]>){
    const response = await fetch(`http://192.168.3.6:3000/api/product/getproducts/${id}`)
    const data = await response.json()
    setState(data)
}

async function getShopData(id:string|string[],setState:Dispatch<Tienda>){
    const response = await fetch(`http://192.168.3.6:3000/api/shop/${id}`)
    const data = await response.json()
    setState(data)
}

function handlerProduct(id:number){
  router.push({pathname:'/(main)/product/[id]',
      params:{id}
  })
}

type CarritoItem = {
  tiendaId:string;
  productoId: string;
  cantidad: number;
};

export default function Shops(){
  const { id } = useLocalSearchParams();
  // const insets = useSafeAreaInsets();
  useFonts({Inter_600SemiBold,Inter_300Light,Inter_400Regular});
  
  const [isLoading,setLoad] = useState(true)
  const [shopData,setShopData] = useState<Tienda|null>(null)
  const [productData,setProductData] = useState<Producto[]|null>(null)
  const [carshopping,setCarshopping] = useState<CarritoItem[]>([])

const agregarAlCarrito = async (
  nuevoId: string,
  tiendaId: string,
  cart: CarritoItem[],
  setCart: React.Dispatch<React.SetStateAction<CarritoItem[]>>
) => {
  const actualizado = (() => {
    const existe = cart.find(
      item => item.productoId === nuevoId && item.tiendaId === tiendaId
    );

    if (existe) {
      // Si el producto ya existe para esa tienda, aumenta la cantidad
      return cart.map(item =>
        item.productoId === nuevoId && item.tiendaId === tiendaId
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      );
    } else {
      // Si no existe, agrégalo
      return [...cart, { productoId: nuevoId, tiendaId, cantidad: 1 }];
    }
  })();

  setCart(actualizado);

  try {
    await AsyncStorage.setItem('carrito', JSON.stringify(actualizado));
    console.log('🛒 Carrito actualizado y guardado en AsyncStorage');
  } catch (error) {
    console.error('❌ Error guardando en AsyncStorage', error);
  }
};



  useEffect(()=>{
      getShopData(id,setShopData)
      getShopProducts(id,setProductData)
      setLoad(false)
  },[isLoading,id])
  if(isLoading){
      return(<View><Text>Loading....</Text></View>)
  }
  if(!shopData || !productData){
      return(<View><Text>No cargo</Text></View>)
  }
  return(
  <View>
    <View style={{marginHorizontal:-20,backgroundColor:'#aaa',height:200,borderBottomEndRadius:20,borderBottomStartRadius:20}}></View>
    <Text style={{paddingHorizontal:20,marginTop:10,fontSize:20,fontFamily:'Inter_600SemiBold'}}>{shopData.Nombre}</Text>
    <Text style={{paddingHorizontal:20,color:'#aaa',marginTop:10}}>{shopData.Descripcion}</Text>
    <Text style={{paddingHorizontal:20,fontFamily:'Inter_600SemiBold',marginTop:10,marginBottom:20}}>{shopData.Ubicacion}</Text>
    <ScrollView  showsVerticalScrollIndicator={false} contentContainerStyle={{backgroundColor:'#FF627B',paddingHorizontal:10,borderTopStartRadius:20,borderTopEndRadius:20,paddingLeft:10,paddingRight:10,paddingBottom:375,flexDirection:'row',flexWrap:'wrap'}}>
        {productData.map((product,index)=>{
        return(
          <View key={index}>
            <View style={{backgroundColor:'#ccc',height:90,width:125,borderRadius:10,marginHorizontal:10,position:'relative',bottom:-20,zIndex:100}}></View>
          <TouchableOpacity onPress={()=>{handlerProduct(product.id)}}>
          <View style={{marginRight:20,backgroundColor:'white',width:150,height:150,marginBottom:20,borderRadius:10,padding:5}}>
            <View style={{marginTop:25}}>
              <Text style={{fontFamily:'Inter_600SemiBold',height:45}}>{product.nombre}</Text>
              <Text style={{fontFamily:'Inter_300Light'}}>{product.descripcion.length > 25 ? product.descripcion.substring(0, 25) + '...': product.descripcion}</Text>
              <View style={{flexDirection:'row',marginTop:10,justifyContent:'flex-end'}}>
                <Text style={{fontFamily:'Inter_600SemiBold',fontSize:16}}>${product.precio}</Text>
                <TouchableOpacity onPress={()=>agregarAlCarrito(product.id.toString(),product.tiendaId.toString(),carshopping, setCarshopping)} style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
                  <Image
                  style={{height:16,width:16}}
                  source={require('../../../assets/images/Plus.svg')}
                  ></Image>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          </TouchableOpacity>
        </View>)})}
    </ScrollView>
  </View>)
    
}