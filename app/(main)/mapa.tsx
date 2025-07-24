import { Inter_300Light, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { useFonts } from 'expo-font';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { handlerMain } from '../utils';

export default function App() {
  const {latitude,longitude} = useLocalSearchParams()
  useFonts({Inter_700Bold,Inter_600SemiBold,Inter_400Regular,Inter_300Light});
  const insets = useSafeAreaInsets();
  
  
  const lat = Array.isArray(latitude) ? latitude[0] : latitude;
  const lon = Array.isArray(longitude) ? longitude[0] : longitude;
  const mapRef = useRef<MapView>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
    address?: string;
  } | null>(null);


  const fetchAddress = async (lat: number, lng: number) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.EXPO_PUBLIC_API_KEY}`;
    // console.log(process.env.EXPO_PUBLIC_API_KEY)
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data)
      
      if (data && data.results[0]) {

        return data
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      Alert.alert("Error", "No se pudo obtener la dirección");
    }
    // return "Dirección no encontrada";
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
    <View style={{paddingTop:insets.top}}>
      <TouchableOpacity onPress={handlerMain} style={{flexDirection:'row',alignItems:'center',marginBottom:10}}>
              <Image
              style={{height:32,width:32,marginLeft:5,}}
              contentFit="cover"
              source={require('../../assets/images/arrowback.svg')}></Image>
              <Text style={{fontFamily:'Inter_600SemiBold'}}>Pagar</Text>    
            </TouchableOpacity>
      <MapView
      ref={mapRef}
      initialRegion={{
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
        latitudeDelta: 0.0002,
        longitudeDelta: 0.0002 / Math.cos(parseFloat(lat) * (Math.PI / 180)),}}
      style={styles.map}
      onPress={async (e) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
          const address = await fetchAddress(latitude, longitude);
          console.log(address)
          setSelectedLocation({ latitude, longitude, address });
      }}>
        {selectedLocation && (
        <Marker
          coordinate={selectedLocation}
          title="Ubicación seleccionada"
          description="Guarda esta ubicación"
        >
          <Callout>
              <Text>{selectedLocation.address || "Cargando dirección..."}</Text>
          </Callout>
        </Marker>
      )}
      </MapView>
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