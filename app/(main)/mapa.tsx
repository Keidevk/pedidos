import { Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { useFonts } from 'expo-font';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { handlerMain } from '../utils';

import { Location, useLocationsStorage } from '../hooks/useLocationsStorage'; // ajusta el path según tu estructura

// Dentro de tu componente App


export default function App() {
  const {latitude,longitude} = useLocalSearchParams()
  const { saveLocation } = useLocationsStorage();

  useFonts({Inter_700Bold,Inter_600SemiBold,Inter_500Medium,Inter_400Regular,Inter_300Light});
  const insets = useSafeAreaInsets();
  
  const [nameUbication,setNameUbication] = useState('')
  
  const lat = Array.isArray(latitude) ? latitude[0] : latitude;
  const lon = Array.isArray(longitude) ? longitude[0] : longitude;
  const mapRef = useRef<MapView>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);


  const handleSaveLocation = async () => {
    if (selectedLocation && nameUbication) {
      const nueva: Location = {
        id: Date.now().toString(),
        name: nameUbication,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude
      };
      console.log(nueva)
      await saveLocation(nueva);
      router.navigate({pathname:"/(main)/carrito"})
    }
  };


  useEffect(() => {
  if (lat && lon) {
    mapRef.current?.fitToCoordinates(
      [{
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
      }],
      {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      }
    );
  }
}, [lat, lon]);
 return (
    <View style={{flex: 1, paddingTop: insets.top}}> 
  <TouchableOpacity onPress={handlerMain} style={{flexDirection:'row',alignItems:'center',marginBottom:10}}>
    <Image
      style={{height:32,width:32,marginLeft:5}}
      contentFit="cover"
      source={require('../../assets/images/arrowback.svg')}
    />
    <Text style={{fontFamily:'Inter_600SemiBold'}}>Pagar</Text>    
  </TouchableOpacity>

  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={{flex: 1}}
    keyboardVerticalOffset={10}
  >
    <ScrollView
      contentContainerStyle={{flexGrow: 1, }}
      keyboardShouldPersistTaps="handled"
    >
      <MapView
        ref={mapRef}
        initialRegion={{
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
          latitudeDelta: 0.0002,
          longitudeDelta: 0.0002 / Math.cos(parseFloat(lat) * (Math.PI / 180)),
        }}
        style={styles.map}
        onPress={(e) => {
          const { latitude, longitude } = e.nativeEvent.coordinate;
          setSelectedLocation({ latitude, longitude });
        }}
      >
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            title="Ubicación seleccionada"
            description="Guarda esta ubicación"
          />
        )}
      </MapView>

      <View style={{
        position:'relative',
        top: -200,
        backgroundColor:'#FFFFFF',
        zIndex:100,
        height:181,
        width:"90%",
        paddingLeft:10,
        marginHorizontal:'auto',
        borderRadius:7,
        boxShadow:[{blurRadius:4, offsetX:1,offsetY:2,color:'#828282'}],
        padding:20

      }}>
        <Text style={{fontFamily:'Inter_500Medium'}}>Tú Ubicación</Text>
        <TextInput
          style={{fontFamily:'Inter_500Medium'}}
          value={nameUbication}
          onChangeText={setNameUbication}
          placeholder='Nombre de la ubicación'
        />
        <TouchableOpacity onPress={handleSaveLocation} style={{width:'100%',height:60,backgroundColor:'#D61355',borderRadius:20}}>
          <Text style={{color:'white',textAlign:'center',marginVertical:'auto',fontFamily:'Inter_700Bold'}}>Establecer Ubicación</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
</View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});