import * as Location from 'expo-location';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

export interface PedidoResponse {
  details: PedidoDetails;
  code: number;
}

export interface PedidoDetails {
  id: string;
  fecha: string;
  estado: string;
  total: number;
  metodoPago: string;
  clienteId: string;
  tiendaId: string;
  repartidorId: string;
  cliente: Cliente;
  tienda: Tienda;
  detalles: DetallePedido[];
}

export interface Cliente {
  id: string;
  userId: number;
  user: Usuario;
}

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  contraseña: string;
  tipo: string;
  fechaRegistro: string;
  activo: boolean;
  fotoPerfil: string;
  direccion: string; // JSON string
  documento_identidad: string;
}

export interface Tienda {
  id: string;
  userId: number;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  horarioApertura: string;
  horarioCierre: string;
  tiempoEntregaPromedio: number;
  costoEnvio: string;
  rating: string;
  fotosTienda: string[];
}

export interface DetallePedido {
  id: string;
  cantidad: number;
  precioUnitario: number;
  pedidoId: string;
  productoId: string;
  instruccionesEspeciales: string | null;
  producto: Producto;
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock_actual: number;
  stock_minimo: number;
  imagen_url: string;
  activo: boolean;
  tiendaId: string;
  categoriaId: string;
}

export interface DireccionCoords {
  coords: {
    accuracy: number;
    altitude: number;
    altitudeAccuracy: number;
    heading: number;
    latitude: number;
    longitude: number;
    speed: number;
  };
  mocked: boolean;
  timestamp: number;
}

export default function MapsRouter(){

const {orderId} = useLocalSearchParams()

const [orderData,setOrderData] = useState<PedidoResponse>()
const [userLocation,setUserLocation] = useState<Location.LocationObject>()
const [shopLocation,setShopLocation] = useState<Location.LocationObject>()
const [location, setLocation] = useState<Location.LocationObject>();
const [isLocationActive,setIsLocationActive] = useState(false)
// const destination = { latitude: 10.22634799864273, longitude: -71.34536347394993 };

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
        console.log("🥀🥀Ubicación actualizada:", location.coords);
      }
    );
  }

  async function getApiKey() {
    const response = await fetch(`${process.env.EXPO_PUBLIC_HOST}/api/keys/googleapi`);
    const data = await response.json();
    setApiKey(data.message);
  }
  async function getOrderData(){
    console.log('HOLAAAAAAAAAAA')
    const response = await fetch(`${process.env.EXPO_PUBLIC_HOST}/api/order/details/${orderId}`)
    const data:PedidoResponse = await response.json();
    console.log(data)
    setOrderData(data);
    const direccionUsuarioRaw = data.details.cliente.user.direccion;
    const ubicacionTiendaRaw = data.details.tienda.ubicacion;
    console.log(ubicacionTiendaRaw)
    console.log(direccionUsuarioRaw)
    const direccionUsuarioParsed: Location.LocationObject = JSON.parse(direccionUsuarioRaw);
    const direccionTiendaParsed:Location.LocationObject = JSON.parse(ubicacionTiendaRaw)
    console.log("🐺🐺"+direccionUsuarioParsed)
    setUserLocation(direccionUsuarioParsed);
    console.log("😭😭"+direccionTiendaParsed)
    setShopLocation(direccionTiendaParsed)
  }
  getOrderData();
  getApiKey();
  startWatchingLocation();
  console.log(isLocationActive +" "+ location +" "+ shopLocation +" "+ userLocation +" "+ ApiKey)

  return () => {
    if (locationSubscription) {
      locationSubscription.remove();
    }
  };
}, []);

return(<View>
    { isLocationActive && location && shopLocation && userLocation && ApiKey ? 
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
      <Marker coordinate={{
        latitude:shopLocation.coords.latitude,
        longitude:shopLocation.coords.latitude
      }} />

      <MapViewDirections
        origin={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        }}
        destination={{
        latitude:shopLocation.coords.latitude,
        longitude:shopLocation.coords.latitude
      }}
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