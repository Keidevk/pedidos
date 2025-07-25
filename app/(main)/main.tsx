import {
  Inter_300Light,
  Inter_400Regular,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';
import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Dispatch, useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
interface Tienda {
  id: string;
  userId:number;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  horarioApertura: string; // ISO 8601 format
  horarioCierre: string;   // ISO 8601 format
  tiempoEntregaPromedio: number; // en horas
  costoEnvio: string; // podría cambiar a number si se prefiere precisión decimal
  rating: string;     // lo mismo aquí si planeas hacer cálculos, puede convertirse a number
  fotosTienda: string[];
}

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
async function getItem(item: string, setState: Dispatch<string>) {
  await AsyncStorage.getItem(item)
    .then((res) => {
      if (!res) return null;
      setState(res);
    })
    .catch((error) => {
      console.error(error);
    });
}

async function getShops(setState:Dispatch<Tienda[]>){
    const response = await fetch(`${process.env.EXPO_PUBLIC_HOST}/api/shop/`)
    const data = await response.json()
    setState(data)
}

async function getOrders(userId:string|null,setState:Dispatch<Pedido[]>){
  if(!userId) return;
  const response = await fetch(`${process.env.EXPO_PUBLIC_HOST}/api/order/${userId}`)
    const data = await response.json()
    setState(data.data)
}

export default function MenuPrincipal() {
  const insets = useSafeAreaInsets();
  const [isLogged, setLogged] = useState<string | null>(null);
  const [shops, setShops] = useState<Tienda[] | null>(null);
  const [orders,setOrders] = useState<Pedido[]>()
  const [userId,setUserId] = useState<string|null>(null)
  useFonts({ Inter_600SemiBold, Inter_300Light, Inter_400Regular });
  

useFocusEffect(
  useCallback(() => {
    let isActive = true;


    async function initial() {
      getItem('@userId',setUserId);
      getItem('@auth_token',setLogged);
      if(!isActive) return; 
      getOrders(userId, setOrders);
      getShops(setShops);
    }
    initial();
    return () => {
      isActive = false;
    };
  }, [])
);

  const handlerCategory = async (category: string) => {
    router.push({
      pathname: "/(main)/category/[category]",
      params: { category },
    });
  };

    const handlerShopById = async (id:string) => {
        router.push({pathname:`/(main)/shop/[id]`,params:{id}});
    };
    function handlerShops(){
        router.push('/(main)/shops')
    }

  return (
    <View style={{ paddingTop: insets.top }}>
      {isLogged ? (
        <View>
            <View style={style.container_input}>
            <Image 
                style={style.image_input}
                contentFit="cover"
                source={require("../../assets/images/search.svg")}/>
            <TextInput
                style={style.text_input}
                placeholder="Buscar"
            ></TextInput>
            </View>
            <View style={{flexDirection:'row',marginLeft:'4%'}}>
                <TouchableOpacity onPress={(()=>handlerCategory('Almuerzo'))} style={style.button_etiqueta}>
                    <Image
                    contentFit="cover"
                    style={style.image_etiqueta}
                    source={require('../../assets/images/tenedor.png')}></Image>
                    <Text style={style.text_etiqueta}>Almuerzos</Text>
                </TouchableOpacity> 
                <TouchableOpacity onPress={(()=>handlerCategory('Postres'))} style={style.button_etiqueta}>
                    <Image
                    contentFit="cover"
                    style={style.image_etiqueta}
                    source={require('../../assets/images/cookies-32-regular.svg')}></Image>
                    <Text style={style.text_etiqueta}>Postres</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={(()=>handlerCategory('Cena'))} style={style.button_etiqueta}>
                    <Image
                    contentFit="cover"
                    style={style.image_etiqueta}
                    source={require('../../assets/images/hamburguesas.png')}></Image>
                    <Text style={style.text_etiqueta}>Cena</Text>
                </TouchableOpacity>
            </View>
            <View style={style.promo}>
                <Image
                    contentFit="fill"
                    style={{height:160}}
                    source={require('../../assets/images/promo.png')}></Image>

            </View>
            <TouchableOpacity onPress={handlerShops} style={style.subtitle}>
                <Text style={style.text_etiqueta}>Tiendas</Text>
                <Image
                style={style.chevron}
                contentFit="cover"
                source={require('../../assets/images/chevron.svg')}></Image>
            </TouchableOpacity>
            <View style={style.shops}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {
                shops && shops.map((value,index)=>{
                    return (
                    <TouchableOpacity onPress={()=>handlerShopById(value.id)} style={{margin:5,alignItems:'center'}} key={index}>
                        <Image
                        style={{backgroundColor:"#ccc",height:60,width:60,borderRadius:100}}
                        source={value.fotosTienda[0]}
                        ></Image>
                        <Text style={{color:'white',fontFamily:'Inter_400Regular'}}>{value.nombre}</Text>   
                    </TouchableOpacity>)
                })    
                }
                </ScrollView>
            </View>
          <TouchableOpacity onPress={()=>{router.navigate('/(main)/pedidos')}} style={style.subtitle}>
            <Text style={style.text_etiqueta}>Más Pedidos</Text>
            <Image
              style={style.chevron}
              contentFit="cover"
              source={require('../../assets/images/chevron.svg')}></Image>
          </TouchableOpacity>
          <ScrollView>
            {Array.isArray(orders) &&
             orders.map((item,index)=>{
              const tienda = Array.isArray(shops)
      ? shops.find(s => s.id === item.tiendaId)
      : undefined;
              return( 
              <View style={{ flexDirection: "row" }} key={index}>
                 <View style={{backgroundColor: "#E94B64",height: 225,width: 150,borderRadius: 15,marginLeft: 10,}}>
              <Image style={{backgroundColor: "#ccc",height: 115,margin: 12,borderRadius: 10,}}></Image>
              <Text style={{color: "white",marginLeft: 10,fontFamily: "Inter_400Regular",}}>
                {tienda?.nombre}
              </Text>
              <Text style={{color: "white",marginLeft: 10,fontFamily: "Inter_400Regular",}}>
                ${item.total}
              </Text>
            </View>
              </View>)
             })
          }
          </ScrollView>
          
        </View>
      ) : (
        <View>
          <Text></Text>
        </View>
      )}
    </View>
  );
}
const style = StyleSheet.create({
  subtitle: {
    flexDirection: "row",
    marginLeft: 15,
    marginTop: 10,
    marginBottom: 5,
  },
  chevron: {
    height: 16,
    width: 16,
    marginLeft: 5,
    margin: "auto",
  },
  button_etiqueta: {
    borderColor: "#E6E6E6",
    borderWidth: 1,
    marginVertical: 10,
    marginRight: 5,
    padding: 5,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  image_etiqueta: {
    height: 16,
    width: 16,
    marginRight: 5,
  },
  text_etiqueta: {
    fontFamily: "Inter_600SemiBold",
  },
  container_input: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "4%",
    paddingVertical: 3,
    width: "90%",
    backgroundColor: "#ddd",
    borderRadius: 10,
  },
  image_input: {
    height: 32,
    width: 32,
    marginLeft: 10,
  },
  text_input: {
    marginLeft: 10,
    fontSize: 16,
    width: "75%",
  },
  promo: {
    height: 160,
    backgroundColor: "#444",
  },
  shops: {
    height: 100,
    marginLeft: 5,
    borderRadius: 15,
    backgroundColor: "#E94B64",
    flexDirection: "row",
    alignItems: "center",
  },
});
