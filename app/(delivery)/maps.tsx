import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';


export default function MapsRouter(){

const [location, setLocation] = useState<Location.LocationObject>();
const [isLocationActive,setIsLocationActive] = useState(false)
const destination = { latitude: 10.1964308, longitude: -71.3263331 };
const [ApiKey,setApiKey] = useState<string|null>(null)
useEffect(() => {
    async function getCurrentLocation() {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permiso denegado",'El permiso para la ubicacion fue denegado');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      if(location.coords){
        setIsLocationActive(true)
      }
      console.log(location)
    }

    async function getApiKey(){
        const response = await fetch(`${process.env.EXPO_PUBLIC_HOST}/api/keys/googleapi`)
        const data = await response.json()
        setApiKey(data.message) 
    }
    getApiKey()
    getCurrentLocation();
  }, []);

return(<View>
    { isLocationActive && location && ApiKey ? 
    <MapView
      style={{ height:"100%",width:"100%" }}
      initialRegion={{
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      {/* <Marker coordinate={{
        latitude: location!.coords.latitude,
        longitude: location!.coords.longitude,
        }}/> */}
      <Marker coordinate={destination} />

      <MapViewDirections
        origin={{
            latitude: location!.coords.latitude,
            longitude: location!.coords.longitude,
        }}
        destination={destination}
        apikey={ApiKey}
        strokeWidth={4}
        strokeColor="blue"
      />
    </MapView>
    :
    <View><Text>Hola</Text></View>
        
}
</View>)

}