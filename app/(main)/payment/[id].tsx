import { useLocationsStorage } from "@/app/hooks/useLocationsStorage";
import { handlerMain } from "@/app/utils";
import { Inter_300Light, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
import { useFonts } from "expo-font";
import { Image } from "expo-image";
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const paymentOptions = [
  { id: 'pagoMovil', label: 'Pago Móvil', icon: require('../../../assets/images/pagomovil.svg') },
  // { id: 'zelle', label: 'Zelle', icon: require('../../../assets/images/zelle.svg') },
  // { id: 'binance', label: 'Binance', icon: require('../../../assets/images/Binance.svg') },
  { id: 'efectivo', label: 'Efectivo', icon: require('../../../assets/images/Efectivo.svg') },
]

export default function Payment(){
    const {
    id,
    tiendaId,
    isDelivery,
    total,
    detalles,
    notas,
  } = useLocalSearchParams()
  console.log(`id:${id}\ntiendaId:${tiendaId}\ntotal:${total}\ndetalles:${detalles}\nnotas:${notas}`)
    const insets = useSafeAreaInsets();
    useFonts({Inter_700Bold,Inter_600SemiBold,Inter_400Regular,Inter_300Light});
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [selected, setSelected] = useState<string | null>(null);
    const { locations, loading } = useLocationsStorage();

  
    async function handlepayment(){
      const body = {
        "total":total,
        "metodoPago":selected,
        "clienteId":id,
        "tiendaId":tiendaId,
        "detalles":detalles
      }
      // console.log(body)
      const response = await fetch(`${process.env.EXPO_PUBLIC_HOST}/api/order/create`,{
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body:JSON.stringify({
        "total":total,
        "metodoPago":selected,
        "clienteId":id,
        "tiendaId":tiendaId,
        "detalles":detalles
      })
      })
      const data = await response.json();
      if(response.status === 201) {
      Alert.alert(`${response.status}`,data.message)
      router.replace('/(main)/main');
    }else{
      Alert.alert(`${response.status}`,data.message)
    }

    }

  const detallesPedido = typeof detalles === 'string'
    ? JSON.parse(detalles)
    : []


     useEffect(() => {
        async function getCurrentLocation() {
          
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert("Permiso denegado",'El permiso para la ubicacion fue denegado');
            return;
          }
    
          let location = await Location.getCurrentPositionAsync({});
          setLocation(location);
          console.log(location.coords.latitude)
          console.log(location.coords.longitude)
          console.log("location:" + location.coords.accuracy)
        }
    
        getCurrentLocation();
      }, []);

    return(
    <View style={{paddingTop:insets.top}}>
      <TouchableOpacity onPress={handlerMain} style={{flexDirection:'row',alignItems:'center',marginBottom:10}}>
        <Image
        style={{height:32,width:32,marginLeft:5,}}
        contentFit="cover"
        source={require('../../../assets/images/arrowback.svg')}></Image>
        <Text style={{fontFamily:'Inter_600SemiBold'}}>Pagar</Text>    
      </TouchableOpacity>
      <ScrollView contentContainerStyle={{ flexDirection: 'row', paddingHorizontal: 10 }}>
      {paymentOptions.map(option => (
        <TouchableOpacity key={option.id} onPress={() => setSelected(option.id)}>
          <View style={{
            backgroundColor: '#dfdee2ff',
            borderRadius: 9.27,
            marginHorizontal: 10,
            alignItems: 'center',
            borderWidth: selected === option.id ? 2 : 0,
            borderColor: selected === option.id ? '#D61355' : 'transparent'
          }}>
            <Image
              style={{ height: 60, width: 60, margin: 5 }}
              contentFit="contain"
              source={option.icon}
            />
          </View>
          <Text style={{ textAlign: 'center', marginTop: 5, fontFamily: 'Inter_500Medium' }}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>

      <View style={{marginHorizontal:15,marginTop:20,backgroundColor:'#dfdee2ff',padding:10,borderRadius:10}}>
        <View>
          <Text style={{fontFamily:'Inter_700Bold'}}>Ubicación</Text>
        </View>
        {locations.slice(0, 3).map((location) => (
        <View key={location.id} style={{flexDirection:'row', marginTop:10}}>
          <Image
            style={{height:33, width:33, marginTop:5}}
            contentFit="contain"
            source={require('../../../assets/images/Icon Location.svg')}
          />
          <Text style={{
            marginVertical:'auto',
            color:'#32343E',
            opacity:0.5,
            marginLeft:5,
            fontFamily: 'Inter_500Medium'
          }}>
            {location.name}
          </Text>
        </View>
      ))}

      </View>
      <TouchableOpacity onPress={()=>router.push({pathname:'/(main)/mapa',params:{latitude:`${location?.coords.latitude}`,longitude:`${location?.coords.longitude}`,}})} style={{marginHorizontal:15,marginTop:20,height:70,borderColor:'#010101ff',padding:10,borderRadius:10,borderWidth:1}}>
        <View style={{flexDirection:'row',margin:'auto'}}>
          <Image
            style={{height:20,width:20,marginRight:10}}
            contentFit="contain"
            source={require('../../../assets/images/pluslocation.svg')}
            />
            <Text style={{color:'#E94B64',fontSize:14,fontFamily:'Inter_700Bold'}}>AGREGAR NUEVA</Text>
        </View>
      </TouchableOpacity>
      <View style={{borderRadius:20,position:'relative',top:200}}>
        <View style={{backgroundColor:'#D61355',borderRadius:20,padding:10,flexDirection:'row'}}>
          <View style={{flex:1,flexDirection:'row',paddingBottom:30}}>
            <Text style={{color:'white',fontSize:14,marginRight:10,marginVertical:'auto'}}>Total</Text>
            <Text style={{color:'white',fontSize:24,fontWeight:'medium',marginVertical:'auto'}}>${total}</Text>
          </View>
          <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end',paddingBottom:30}}>
            <TouchableOpacity onPress={handlepayment} style={{flex:1,marginVertical:'auto',backgroundColor:'#FFE8EC',height:50,borderRadius:20}}>
              <Text style={{textAlign:'center',marginVertical:'auto',fontSize:16,fontWeight:'semibold',color:'#828282'}}>Pagar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>)
}

const style = StyleSheet.create({
  paymentText:{
    textAlign:'center',
    fontFamily:'Inter_400Regular',
    fontSize:14
  }
})