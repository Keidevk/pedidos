import { useLocationsStorage } from "@/app/hooks/useLocationsStorage";
import { Inter_300Light, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { Image } from "expo-image";
import * as Location from 'expo-location';
import { router, useLocalSearchParams, useSegments } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const paymentOptions = [
  { id: 'pagoMovil', label: 'Pago Móvil', icon: require('../../../assets/images/pagomovil.svg') },
  { id: 'efectivo', label: 'Efectivo', icon: require('../../../assets/images/Efectivo.svg') },
]

const CACHED_PAYMENT_STATE_KEY = 'cached_payment_state';

export default function Payment() {
  const {
    id,
    tiendaId,
    isDelivery,
    total,
    detalles,
    notas,
    fromMap,
    selectedLocationId
  } = useLocalSearchParams();

  const insets = useSafeAreaInsets();
  useFonts({ Inter_700Bold, Inter_600SemiBold, Inter_400Regular, Inter_300Light });
  
  // Estados
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [cachedState, setCachedState] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const currentPath = useSegments().join('/')
  
  // Obtener userId al iniciar
  useEffect(() => {
    const getUserId = async () => {
      const storedUserId = await AsyncStorage.getItem('@userId');
      setUserId(storedUserId);
    };
    getUserId();
  }, []);

  useEffect(() => {
  const initialize = async () => {
    // 1. Manejar el caso de venir del mapa
    if (fromMap === 'true') {
      const savedState = await loadCachedState();
      if (savedState) {
        setSelectedPayment(savedState.selectedPayment);
        setCachedState(savedState);
      }
      await reloadLocations();
    }

    // 2. Cargar ubicación actual siempre
    await loadCurrentLocation();

    // 3. Recargar ubicaciones si:
    // - Hay userId Y (estamos en payment O el userId acaba de cambiar)
    if (userId && (currentPath.includes('payment') || fromMap !== 'true')) {
      await reloadLocations();
    }
  };

  initialize();
}, [userId, currentPath]); // Dependencias claras

  // Hook de ubicaciones
  const {
    locations,
    loading: loadingLocations,
    getLocationById,
    reload: reloadLocations,
    saveLocation
  } = useLocationsStorage();

  // Ubicación seleccionada
  const selectedLocation = selectedLocationId ? getLocationById(selectedLocationId as string) : null;

  // Guardar estado en caché
  const cachePaymentState = useCallback(async () => {
    const paymentState = {
      id,
      tiendaId,
      isDelivery,
      total,
      detalles,
      notas,
      selectedPayment,
      selectedLocationId,
      timestamp: Date.now()
    };
    await AsyncStorage.setItem(CACHED_PAYMENT_STATE_KEY, JSON.stringify(paymentState));
  }, [id, tiendaId, isDelivery, total, detalles, notas, selectedPayment, selectedLocationId]);

  // Cargar estado desde caché
  const loadCachedState = useCallback(async () => {
    try {
      const cached = await AsyncStorage.getItem(CACHED_PAYMENT_STATE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        await AsyncStorage.removeItem(CACHED_PAYMENT_STATE_KEY);
        return parsed;
      }
      return null;
    } catch (error) {
      console.error('Error loading cached state:', error);
      return null;
    }
  }, []);

  // Cargar ubicación actual
  const loadCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permiso denegado", 'El permiso para la ubicación fue denegado');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const handleBack = () => {
    router.replace({
      pathname: "/(main)/carrito/[id]",
      params: { id: `${tiendaId}` }
    });
  };

  const handleGoToMap = async () => {
    await cachePaymentState();
    router.push({
      pathname: '/(main)/mapa',
      params: {
        latitude: `${location?.coords.latitude}`,
        longitude: `${location?.coords.longitude}`,
        fromPayment: 'true',
        tiendaId: tiendaId as string
      }
    });
  };

  // Función para manejar cuando se guarda una nueva ubicación desde el mapa
  const handleLocationSaved = async (newLocation: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
  }) => {
    if (userId) {
      await saveLocation(newLocation);
      await reloadLocations();
    }
  };

  const handlePayment = async () => {
    if (!selectedPayment) {
      Alert.alert('Error', 'Por favor selecciona un método de pago');
      return;
    }

    if (isDelivery === 'true' && !selectedLocationId) {
      Alert.alert('Error', 'Por favor selecciona una ubicación de entrega');
      return;
    }

    try {
      const paymentData = {
        total,
        metodoPago: selectedPayment,
        clienteId: id,
        tiendaId,
        detalles,
        notas: cachedState?.notas || notas,
        ubicacion: isDelivery === 'true' ? selectedLocationId : null,
        coordenadas: isDelivery === 'true' && selectedLocation ? {
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude
        } : null
      };

      const response = await fetch(`${process.env.EXPO_PUBLIC_HOST}/api/order/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });

      const data = await response.json();
      
      if (response.status === 201) {
        await AsyncStorage.removeItem(CACHED_PAYMENT_STATE_KEY);
        Alert.alert('Éxito', data.message);
        router.replace('/(main)/main');
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo completar el pago');
      console.error('Payment error:', error);
    }
  };

  // Datos a mostrar
  const displayData = fromMap === 'true' && cachedState ? cachedState : {
    id,
    tiendaId,
    isDelivery,
    total,
    detalles,
    notas,
    selectedLocationId
  };

  return (
    <View style={{ paddingTop: insets.top, flex: 1 }}>
      <TouchableOpacity onPress={handleBack} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <Image
          style={{ height: 32, width: 32, marginLeft: 5 }}
          contentFit="cover"
          source={require('../../../assets/images/arrowback.svg')}
        />
        <Text style={{ fontFamily: 'Inter_600SemiBold' }}>Pagar</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ paddingBottom: 250 }}>
        <ScrollView horizontal contentContainerStyle={{ flexDirection: 'row', paddingHorizontal: 10 }}>
          {paymentOptions.map(option => (
            <TouchableOpacity 
              key={option.id} 
              onPress={() => setSelectedPayment(option.id)}
              disabled={loadingLocations}
            >
              <View style={{
                backgroundColor: '#dfdee2ff',
                borderRadius: 9.27,
                marginHorizontal: 10,
                alignItems: 'center',
                borderWidth: selectedPayment === option.id ? 2 : 0,
                borderColor: selectedPayment === option.id ? '#D61355' : 'transparent',
                opacity: loadingLocations ? 0.5 : 1
              }}>
                <Image
                  style={{ height: 60, width: 60, margin: 5 }}
                  contentFit="contain"
                  source={option.icon}
                />
              </View>
              <Text style={{ 
                textAlign: 'center', 
                marginTop: 5, 
                fontFamily: 'Inter_500Medium',
                opacity: loadingLocations ? 0.5 : 1
              }}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {isDelivery === 'true' && (
          <View style={{ marginHorizontal: 15, marginTop: 20, backgroundColor: '#dfdee2ff', padding: 10, borderRadius: 10 }}>
            <Text style={{ fontFamily: 'Inter_700Bold' }}>Ubicación de entrega</Text>
            
            {loadingLocations ? (
              <Text style={{ marginTop: 10 }}>Cargando ubicaciones...</Text>
            ) : (
              <>
                {locations.slice(0, 3).map((loc) => (
                  <TouchableOpacity 
                    key={loc.id} 
                    onPress={() => router.setParams({ selectedLocationId: loc.id })}
                    style={{ flexDirection: 'row', marginTop: 10 }}
                  >
                    <Image
                      style={{ height: 33, width: 33, marginTop: 5 }}
                      contentFit="contain"
                      source={require('../../../assets/images/Icon Location.svg')}
                    />
                    <Text style={{
                      marginVertical: 'auto',
                      color: '#32343E',
                      opacity: selectedLocationId === loc.id ? 1 : 0.5,
                      marginLeft: 5,
                      fontFamily: 'Inter_500Medium'
                    }}>
                      {loc.name}
                    </Text>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity 
                  onPress={handleGoToMap} 
                  style={{ marginTop: 20, height: 50, borderColor: '#010101ff', padding: 10, borderRadius: 10, borderWidth: 1, justifyContent: 'center' }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Image
                      style={{ height: 20, width: 20, marginRight: 10 }}
                      contentFit="contain"
                      source={require('../../../assets/images/pluslocation.svg')}
                    />
                    <Text style={{ color: '#E94B64', fontSize: 14, fontFamily: 'Inter_700Bold' }}>
                      {locations.length > 0 ? 'AGREGAR OTRA UBICACIÓN' : 'AGREGAR UBICACIÓN'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </ScrollView>

      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <View style={{ backgroundColor: '#D61355', borderRadius: 20, padding: 10, flexDirection: 'row' }}>
          <View style={{ flex: 1, flexDirection: 'row', paddingBottom: 30 }}>
            <Text style={{ color: 'white', fontSize: 14, marginRight: 10, marginVertical: 'auto' }}>Total</Text>
            <Text style={{ color: 'white', fontSize: 24, fontWeight: 'medium', marginVertical: 'auto' }}>
              ${displayData.total}
            </Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', paddingBottom: 30 }}>
            <TouchableOpacity 
              onPress={handlePayment} 
              style={{ flex: 1, marginVertical: 'auto', backgroundColor: '#FFE8EC', height: 50, borderRadius: 20 }}
              disabled={!selectedPayment || (isDelivery === 'true' && !selectedLocationId)}
            >
              <Text style={{ 
                textAlign: 'center', 
                marginVertical: 'auto', 
                fontSize: 16, 
                fontWeight: 'semibold', 
                color: (!selectedPayment || (isDelivery === 'true' && !selectedLocationId)) ? '#cccccc' : '#000000ff' 
              }}>
                Pagar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}