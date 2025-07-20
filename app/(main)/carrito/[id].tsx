import { Producto, Tienda } from "@/app/types";
import { handlerMain } from "@/app/utils";
import { Inter_300Light, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type CarritoItem = {
    productoId: string;
    cantidad: number;
};

export default function ItemCarrito(){
    const {id} = useLocalSearchParams()
    const insets = useSafeAreaInsets();
    const [cantidad,setCantidad] = useState<CarritoItem[]>([])
    const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>([]);
    const [shopData, setShopData] = useState<Tienda|null>(null)
    const [price,setPrice] = useState<number>(0)
    const [isLoad,setLoad] = useState<boolean>(true)
    const [isDelivery,setDelivery] = useState<boolean>(true)
    useFonts({Inter_700Bold,Inter_600SemiBold,Inter_500Medium,Inter_300Light});
    

    const hasRunRef = useRef(false);

    
    
    const getShopName = async () => {
      try{
        const response = await fetch(`${process.env.EXPO_PUBLIC_HOST}/api/shop/${id}`)
        const data = await response.json()
        if(!response.ok)throw new Error('Error en la petición');
        setShopData(data)
        
      }catch(err){
        console.error(err);
      }
    }

    const obtenerProductos = async () => {
       const carritoRaw = await AsyncStorage.getItem(`carrito_${id}`);
       if (!carritoRaw) return;    
       const carrito: CarritoItem[] = JSON.parse(carritoRaw);
       setCantidad(carrito)
       
       const filterData = {
         tiendaId: parseInt(id[0]),
         ids: carrito.map(item => item.productoId),
       };
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
      useEffect(() => {
        const total = productosFiltrados.reduce((sum, product) => {
          return sum + parseFloat(product.precio);
        }, 0);
        setPrice(total);
      }, [productosFiltrados]);


      useFocusEffect(
      React.useCallback(() => {
          obtenerProductos();
          getShopName()
          setLoad(false)

      return () => {
          setLoad(true)
          hasRunRef.current = false
        };
      }, [id[0]])
      );

    return(
    <View style={{paddingTop:insets.top}}>
      {isLoad ? 
      <View><Text>Cargando</Text></View> 
      : 
      <View>
        <TouchableOpacity onPress={handlerMain} style={{flexDirection:'row',alignItems:'center',marginBottom:10}}>
          <Image
          style={{height:32,width:32,marginLeft:5,}}
          contentFit="cover"
          source={require('../../../assets/images/arrowback.svg')}></Image>
          <Text style={{fontFamily:'Inter_600SemiBold'}}>Carrito</Text>    
        </TouchableOpacity>
        <Text style={{marginLeft:10,fontFamily:'Inter_700Bold',fontSize:20}}>Detalles del Pedido</Text>
        <Text style={{marginLeft:10,fontFamily:'Inter_300Light',fontSize:15}}>{shopData ? shopData.Nombre:"Loading...."}</Text>
        <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView showsVerticalScrollIndicator={false} style={{height:340}}> 
            {productosFiltrados && productosFiltrados.map((product,index)=>{
              const cantidadItem = cantidad.find(item => parseInt(item.productoId) === product.id);
              const amount = cantidadItem?.cantidad ?? 0;
                return(<View key={index} style={{marginBottom:10,flexDirection:'row',height:103,paddingHorizontal:10,marginHorizontal:5,borderRadius:10,alignItems:'center',boxShadow:[{blurRadius:4, offsetX:1,offsetY:2,color:'#828282AA'}],}}>
                  <View style={{backgroundColor:"#ccc",height:62,width:62,borderRadius:10,marginRight:10}}>
                  {/* Image Product */}
                  </View>
                  <View style={{flexDirection:'row',}}>
                    <View style={{flexDirection:'column',maxWidth:150}}>
                      <Text style={{fontFamily:'Inter_500Medium',fontSize:15}}>{product.nombre}</Text>
                      <Text style={{fontFamily:'Inter_700Bold',fontSize:19,color:'#FF0000'}}>${product.precio}</Text>
                    </View>
                  </View>
                  <View style={{flex:1,justifyContent:'flex-end',flexDirection:'row',}}>
                        <TouchableOpacity style={{height:26,width:26}}>
                          <Text style={{textAlign:'center',color:'#FF0000',fontWeight:'bold'}}>+</Text>
                        </TouchableOpacity>
                        <Text style={{height:26,width:26,textAlign:'center'}}>{amount}</Text>
                        <TouchableOpacity style={{height:26,width:26,backgroundColor:'#FF0000',borderRadius:10}}>
                          <Text style={{textAlign:'center',color:'white',fontWeight:'bold'}}>-</Text>
                        </TouchableOpacity>
                    </View>
                </View>)
            })}            
        </ScrollView>
      
        <View>
            <View>
              <View style={{flexDirection:'row',height:73,}}>
                <TouchableOpacity onPress={()=>setDelivery(true)} style={{flex:1,flexDirection:'row',borderRadius:10,borderWidth:1,borderColor:isDelivery ? '#E94B64':'#828282',marginLeft:10}}>
                  <Text style={{marginVertical:'auto',marginLeft:5,fontSize:15,color:'#0000008A',fontFamily:'Inter_500Medium'}}>Delivery</Text>
                  <Image 
                  source={require('../../../assets/images/delivery.svg')}
                  contentFit="cover"
                  style={{height:50,width:62,margin:'auto',}}/>
                </TouchableOpacity>  
                <TouchableOpacity onPress={()=>setDelivery(false)} style={{flex:1,flexDirection:'row',borderRadius:10,borderWidth:1,borderColor:isDelivery ? '#828282':'#E94B64',marginLeft:8,marginRight:10}}>
                  <Text style={{marginVertical:'auto',marginLeft:5,fontSize:15,color:'#0000008A',fontFamily:'Inter_500Medium'}}>Retiro</Text>
                  <Image 
                  source={require('../../../assets/images/retiro.svg')}
                  contentFit="cover"
                  style={{height:50,width:62,margin:'auto'}}/>  
                </TouchableOpacity>  
              </View>
              <View style={{borderRadius:20,paddingLeft:10,borderWidth:1,borderColor:'#828282',marginHorizontal:13,marginTop:10,height:48,marginBottom:10}}>
                <TextInput style={{flex:1}} placeholder="Nota (Opcional)"></TextInput>
              </View>  
            </View> 
          </View>
        </KeyboardAvoidingView> 
        <View style={{backgroundColor:'#FF627B',borderRadius:20}}>
                <View style={{height:'20%',padding:10,paddingVertical:20}}>
                  <View style={{flexDirection:'row'}}>
                    <Text style={{flex:1}}>Sub-Total</Text>
                    <Text style={{flex:1,textAlign:'right'}}>{price}$</Text>
                  </View>
                  {
                    isDelivery ? 
                    <View style={{flexDirection:'row'}}>
                      <Text style={{flex:1}}>Delivery</Text>
                      <Text style={{flex:1,textAlign:'right'}}>3$</Text>
                    </View>
                    :
                    <></>
                  }
                  
                </View>
                <View style={{backgroundColor:'#D61355',height:'25%',borderRadius:20,padding:10,flexDirection:'row'}}>
                  <View style={{flex:1,flexDirection:'row',paddingBottom:30}}>
                    <Text style={{color:'white',fontSize:14,marginRight:10,marginVertical:'auto'}}>Total</Text>
                    <Text style={{color:'white',fontSize:24,fontWeight:'medium',marginVertical:'auto'}}>${isDelivery ? price + 3 : price}</Text>
                  </View>
                  <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end',paddingBottom:30}}>
                    <TouchableOpacity style={{flex:1,marginVertical:'auto',backgroundColor:'#FFE8EC',height:50,borderRadius:20}}>
                      <Text style={{textAlign:'center',marginVertical:'auto',fontSize:16,fontWeight:'semibold',color:'#828282'}}>Pagar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
            </View>
      </View>
      }
        
    </View>)
}
{/* <View key={index} style={{marginBottom:10}}>
                    <Text>Index:{product.id}</Text>
                    <Text>Nombre: {product.nombre}</Text>
                    <Text>Descripcion: {product.descripcion}</Text>
                    <Text>Precio individual: {product.precio}</Text>
                    <Text>Cantidad: {amount}</Text>
                </View> */}