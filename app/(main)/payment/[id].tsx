import { handlerMain } from "@/app/utils";
import { Inter_300Light, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
import { useFonts } from "expo-font";
import { Image } from "expo-image";
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Payment(){
    const {
    id,
    tiendaId,
    metodoPago,
    total,
    detalles,
    notas,
  } = useLocalSearchParams()
    const insets = useSafeAreaInsets();
    useFonts({Inter_700Bold,Inter_600SemiBold,Inter_400Regular,Inter_300Light});
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    
    
  

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
      <ScrollView contentContainerStyle={{flexDirection:'row'}}>
        <View>
          <View style={{ backgroundColor: '#dfdee2ff', borderRadius: 9.27, marginHorizontal: 10, alignItems: 'center' }}>
            <Image
              style={{ height: 60, width: 60, margin: 5 }}
              contentFit="contain"
              source={require('../../../assets/images/pagomovil.svg')}
            />
          </View>
          <Text style={style.paymentText}>Pago Móvil</Text>
        </View>
        <View>
          <View style={{ backgroundColor: '#dfdee2ff', borderRadius: 9.27, marginHorizontal: 10, alignItems: 'center' }}>
            <Image
              style={{ height: 60, width: 60, margin: 5 }}
              contentFit="contain"
              source={require('../../../assets/images/zelle.svg')}
            />
          </View>
          <Text style={style.paymentText}>Zelle</Text>
        </View>
        <View>
          <View style={{ backgroundColor: '#dfdee2ff', borderRadius: 9.27, marginHorizontal: 10, alignItems: 'center' }}>
            <Image
              style={{ height: 60, width: 60, margin: 5 }}
              contentFit="contain"
              source={require('../../../assets/images/Binance.svg')}
            />
          </View>
          <Text style={style.paymentText}>Binance</Text>
        </View>
        <View>
          <View style={{backgroundColor:'#dfdee2ff',borderRadius:9.27,marginHorizontal:10,alignItems:'center'}}>
            <Image
            style={{height:60,width:60,margin:5,}}
            contentFit="contain"
            source={require('../../../assets/images/Efectivo.svg')}
            />
          </View>
          <Text style={style.paymentText}>Efectivo</Text>
        </View>
      </ScrollView>
      <View style={{marginHorizontal:15,marginTop:20,backgroundColor:'#dfdee2ff',padding:10,borderRadius:10}}>
        <View>
          <Text style={{fontFamily:'Inter_700Bold'}}>Ubicación</Text>
        </View>
        <View style={{flexDirection:'row'}}>
          <Image
            style={{height:33,width:33,marginTop:5}}
            contentFit="contain"
            source={require('../../../assets/images/Icon Location.svg')}
            />
            <Text style={{marginVertical:'auto',color:'#32343E',opacity:0.5,marginLeft:5}}>Ubicación</Text>
        </View>
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
    </View>)
}

const style = StyleSheet.create({
  paymentText:{
    textAlign:'center',
    fontFamily:'Inter_400Regular',
    fontSize:14
  }
})