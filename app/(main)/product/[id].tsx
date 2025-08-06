import useCargarCarritosPorTienda from "@/app/hooks/useCarshopping";
import { CarritoItem, Producto } from "@/app/types";
import { getItem } from "@/app/utils";
import { Inter_300Light, Inter_400Regular, Inter_600SemiBold } from "@expo-google-fonts/inter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { Dispatch, useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

async function getProductData(id: string | string[], setState: Dispatch<Producto>) {
    try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_HOST}/api/product/getproduct/${id}`);
        if (!response.ok) throw new Error("Error al obtener producto");
        const data = await response.json();
        setState(data);
    } catch (error) {
        console.error("Error fetching product:", error);
    }
}

export default function Products() {
    const { id } = useLocalSearchParams();
    const [cantidad, setCantidad] = useState(1);
    const insets = useSafeAreaInsets();
    
    useFonts({ Inter_600SemiBold, Inter_300Light, Inter_400Regular });
    
    const [isLoading, setLoad] = useState(true);
    const [productData, setProductData] = useState<Producto | null>(null);
    const [userId, setUserId] = useState(''); // Reemplaza con el ID real del usuario
    
    useEffect(()=>{
        getItem('@userId',setUserId)
    },[])

    // Usamos el hook del carrito
    const [carrito, setCarrito] = useState<CarritoItem[]>([]);
    useCargarCarritosPorTienda(setCarrito, userId);

    function addOrRemoveProduct(type: string) {
        if (cantidad === 1 && type === "-") {
            Alert.alert("Error", "No se puede agregar productos con cantidad negativa");
            return;
        }
        setCantidad(prev => type === "+" ? prev + 1 : prev - 1);
    }

    const agregarAlCarrito = async (
  nuevoId: string,
  tiendaId: string,
  cantidad: number
) => {
  try {
    const carritoKey = `carrito_${userId}_${tiendaId}`;
    const carritoRaw = await AsyncStorage.getItem(carritoKey);
    const carritoTienda: Omit<CarritoItem, 'tiendaId' | 'clienteId'>[] = carritoRaw 
      ? JSON.parse(carritoRaw) 
      : [];

    const existeIndex = carritoTienda.findIndex(item => item.productoId === nuevoId);
    let actualizado: Omit<CarritoItem, 'tiendaId' | 'clienteId'>[];

    if (existeIndex !== -1) {
      actualizado = [...carritoTienda];
      actualizado[existeIndex] = {
        ...actualizado[existeIndex],
        cantidad: actualizado[existeIndex].cantidad + cantidad
      };
    } else {
      actualizado = [
        ...carritoTienda, 
        { 
          productoId: nuevoId, 
          cantidad,
          // No necesitas incluir tiendaId y clienteId aquí porque están en la clave
        }
      ];
    }

    await AsyncStorage.setItem(carritoKey, JSON.stringify(actualizado));
    
    Alert.alert("Éxito", "Producto agregado al carrito");
    console.log('🛒 Producto agregado al carrito');
  } catch (error) {
    console.error('❌ Error en agregarAlCarrito:', error);
    Alert.alert("Error", "No se pudo agregar al carrito");
  }
};

    useEffect(() => {
        getProductData(id, setProductData);
        setLoad(false);
    }, [id]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Cargando...</Text>
            </View>
        );
    }

    if (!productData) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>No se pudo cargar el producto</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <TouchableOpacity
                onPress={() => router.back()}
                style={{
                    position: 'relative',
                    flexDirection: "row",
                    alignItems: "center",
                    top: insets.top,
                    zIndex: 100,
                }}
            >
                <Image
                    style={{ height: 32, width: 32, marginLeft: 5 }}
                    contentFit="cover"
                    source={require("../../../assets/images/arrowback.svg")}
                />
                <Text style={{ fontFamily: "Inter_600SemiBold" }}>Volver</Text>
            </TouchableOpacity>

            <View style={{ backgroundColor: '#ccc', height: 250 }} />

            <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                <Text style={{ marginLeft: 20, fontSize: 20, fontFamily: 'Inter_600SemiBold' }}>
                    {productData.nombre}
                </Text>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 20, fontFamily: 'Inter_600SemiBold', color: '#FF6B57', marginRight: 20 }}>
                        ${productData.precio}
                    </Text>
                </View>
            </View>

            <Text style={{ fontSize: 16, marginHorizontal: 20, fontFamily: 'Inter_300Light', marginBottom: 20 }}>
                {productData.descripcion}
            </Text>

            <View style={{ justifyContent: 'flex-end', alignItems: 'center', height: 380 }}>
                <View style={{
                    backgroundColor: '#DA114C',
                    flex: 1,
                    maxHeight: 90,
                    width: '100%',
                    borderRadius: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 20,
                    marginBottom:10
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => addOrRemoveProduct("-")}
                            style={{
                                backgroundColor: 'white',
                                height: 30,
                                width: 30,
                                borderRadius: 100,
                                justifyContent: 'center'
                            }}
                        >
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#DA114C', textAlign: 'center' }}>
                                -
                            </Text>
                        </TouchableOpacity>
                        <Text style={{
                            width: 25,
                            color: 'white',
                            fontSize: 20,
                            marginHorizontal: 15,
                            textAlign: 'center'
                        }}>
                            {cantidad}
                        </Text>
                        <TouchableOpacity
                            onPress={() => addOrRemoveProduct("+")}
                            style={{
                                backgroundColor: 'white',
                                height: 30,
                                width: 30,
                                borderRadius: 100,
                                justifyContent: 'center'
                            }}
                        >
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#DA114C', textAlign: 'center' }}>
                                +
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginLeft: 'auto' }}>
                        <TouchableOpacity
                            onPress={() => agregarAlCarrito(
                                productData.id.toString(),
                                productData.tiendaId.toString(),
                                cantidad
                            )}
                            style={{
                                flexDirection: 'row',
                                backgroundColor: 'white',
                                paddingVertical: 10,
                                paddingHorizontal: 20,
                                borderRadius: 28.5,
                                alignItems: 'center'
                            }}
                        >
                            <Text style={{ color: '#5B5B5B', fontSize: 14, fontWeight: "500" }}>
                                Añadir al Carrito
                            </Text>
                            <Text style={{ color: '#5B5B5B', paddingLeft: 5, fontWeight: 'bold' }}>
                                ${(productData.precio * cantidad).toFixed(2)}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}