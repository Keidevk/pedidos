import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';


export default function MapsRouter(){

const [location, setLocation] = useState<Location.LocationObject>();
const [isLocationActive,setIsLocationActive] = useState(false)
const destination = { latitude: 10.22634799864273, longitude: -71.34536347394993 };

const [ApiKey,setApiKey] = useState<string|null>(null)
useEffect(() => {
  let locationSubscription:Location.LocationSubscription | undefined;
;

  async function startWatchingLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permiso denegado", "El permiso para la ubicación fue denegado");
      return;
    }

    locationSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 3000, // cada 3 segundos
        distanceInterval: 5, // o cada 5 metros
      },
      (location) => {
        setLocation(location);
        setIsLocationActive(true);
        console.log("Ubicación actualizada:", location.coords);
      }
    );
  }

  async function getApiKey() {
    const response = await fetch(`${process.env.EXPO_PUBLIC_HOST}/api/keys/googleapi`);
    const data = await response.json();
    setApiKey(data.message);
  }

  getApiKey();
  startWatchingLocation();

  return () => {
    if (locationSubscription) {
      locationSubscription.remove();
    }
  };
}, []);

return(<View>
    { isLocationActive && location && ApiKey ? 
    <MapView
      style={{ height:"100%",width:"100%" }}
      initialRegion={{
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0002,
          longitudeDelta: 0.0002 / Math.cos(location.coords.latitude) * (Math.PI / 180),
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