import * as Location from 'expo-location';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

interface Coordenadas {
  accuracy: number;
  altitude: number;
  altitudeAccuracy: number;
  heading: number;
  latitude: number;
  longitude: number;
  speed: number;
}

interface DireccionGeografica {
  coords: Coordenadas;
  mocked: boolean;
  timestamp: number;
}

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  contraseña: string;
  tipo: "cliente" | "tienda";
  fechaRegistro: string;
  activo: boolean;
  fotoPerfil: string;
  direccion: string; // JSON string, parse to DireccionGeografica
  documento_identidad: string;
}

interface Cliente {
  id: string;
  userId: number;
  user: Usuario;
}

interface Tienda {
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
  user: Usuario;
}

interface Producto {
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

interface DetallePedido {
  id: string;
  cantidad: number;
  precioUnitario: number;
  pedidoId: string;
  productoId: string;
  instruccionesEspeciales: string | null;
  producto: Producto;
}

interface PedidoConDetalles {
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

interface PedidoResponse {
  details: PedidoConDetalles;
  code: number;
}

export default function MapsRouter(){

const {orderId} = useLocalSearchParams()

const [orderData,setOrderData] = useState<PedidoResponse>()
const [userLocation,setUserLocation] = useState<Location.LocationObject>()
const [shopLocation,setShopLocation] = useState<Location.LocationObject>()
const [destination,setDestination] = useState<Location.LocationObject>()
const [isArriveAtClient,setIsArriveAtClient] = useState(false)
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
    setOrderData(data);
    const direccionUsuarioRaw = data.details.cliente.user.direccion;
    const direccionTiendaRaw = data.details.tienda.user.direccion;
    const direccionUsuarioParsed:Location.LocationObject = JSON.parse(direccionUsuarioRaw);
    const direccionTiendaParsed:Location.LocationObject = JSON.parse(direccionTiendaRaw)
    console.log("Location User:")
    console.log(direccionUsuarioParsed)
    setUserLocation(direccionUsuarioParsed);
    console.log("Location Shop:")
    console.log(direccionTiendaParsed)
    setShopLocation(direccionTiendaParsed)
    setDestination(direccionTiendaParsed)
  }
  getOrderData();
  getApiKey();
  startWatchingLocation();
  // console.log(!isLocationActive +" "+ location +" "+ shopLocation +" "+ userLocation +" "+ ApiKey)

  return () => {
    if (locationSubscription) {
      locationSubscription.remove();
    }
  };
}, []);

return(<View>
    { isLocationActive && location && destination && ApiKey ? 
    <MapView
      style={{ height:"100%",width:"100%" }}
      initialRegion={{
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02 
      }}
    >
      {/* <Marker coordinate={{
        latitude: location!.coords.latitude,
        longitude: location!.coords.longitude,
        }}/> */}
      <Marker coordinate={{
        latitude:destination.coords.latitude,
        longitude:destination.coords.longitude
      }} />

      <MapViewDirections
        origin={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        }}
        destination={{
        latitude:destination.coords.latitude,
        longitude:destination.coords.longitude
      }}
        onReady={(e)=>{
          if(e.distance < 0.01){
            if(!isArriveAtClient){
              Alert.alert("Llegaste al restaurante","Retira el pedido")
              setIsArriveAtClient(true)
            }
            if(isArriveAtClient){
              Alert.alert("Llegaste al la ubicación del cliente","Entrega el pedido")
            }
          userLocation && setDestination(userLocation)
          console.log(userLocation)
          }
        }}
        apikey={ApiKey}
        strokeWidth={4}
        strokeColor="blue"
      />
    </MapView>
    :
    <View style={{marginTop:45}}>
      {location && location.coords && <View>
        {/* <Text>shop:{shopLocation!.coords.altitude},{shopLocation!.coords.longitude}</Text> */}
      {/* <Text>User:{userLocation!.coords.altitude},{userLocation!.coords.longitude}</Text> */}
      {/* <Text>Delivery:{location!.coords.altitude},{location!.coords.longitude}</Text> */}
        </View>}
      
      </View>
        
}
</View>)

}