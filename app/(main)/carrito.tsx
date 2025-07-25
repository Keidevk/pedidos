import {
  Inter_300Light,
  Inter_400Regular,
  Inter_600SemiBold,
  useFonts,
} from "@expo-google-fonts/inter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useCargarCarritosPorTienda from "../hooks/useCarshopping";
import { CarritoItem } from "../types";
import { getShopById } from "../utils";

interface Tienda {
  id: string;
  userId:number;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  horarioApertura: string; // ISO 8601 format
  horarioCierre: string;   // ISO 8601 format
  tiempoEntregaPromedio: number; // en horas
  costoEnvio: string; // podría cambiar a number si se prefiere precisión decimal
  rating: string;     // lo mismo aquí si planeas hacer cálculos, puede convertirse a number
  fotosTienda: string[];
}

const fetchTiendas = async (ids: string[]): Promise<Tienda[]> => {
  const tiendas = await Promise.all(
    ids.map(async (id) => {
      try {
        const tienda = await getShopById(id);
        return tienda;
      } catch (error) {
        console.error(`Error al obtener tienda con ID ${id}:`, error);
        return null;
      }
    })
  );
  return tiendas.filter((t): t is Tienda => t !== null);
};

export default function CarShop() {
  const [carshopping, setCarshopping] = useState<CarritoItem[]>([]);
  const [shopData, setShopData] = useState<Tienda[]>();
  const insets = useSafeAreaInsets();
  useFonts({ Inter_600SemiBold, Inter_300Light, Inter_400Regular });
  // useCargarCarrito(setCarshopping);
  useCargarCarritosPorTienda(setCarshopping);

  useEffect(() => {
    const tiendaIds = Array.from(
      new Set(carshopping.map((item) => item.tiendaId))
    );
    fetchTiendas(tiendaIds).then((data) => {
      setShopData(data);
    });
  }, [carshopping]);

    function handlerCarrito(id:string){
        router.push({pathname:'/carrito/[id]',params:{id}})
    }
  const groupedByTienda: Record<string, number> = carshopping.reduce(
    (acc: Record<string, number>, item: CarritoItem) => {
      const { tiendaId, cantidad } = item;
      acc[tiendaId] = (acc[tiendaId] || 0) + cantidad;
      return acc;
    },
    {}
  );

  return (
    <View style={{ paddingTop: insets.top }}>
      <TouchableOpacity
        onPress={()=>router.back}
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
      >
        <Image
          style={{ height: 32, width: 32, marginLeft: 5 }}
          contentFit="cover"
          source={require("../../assets/images/arrowback.svg")}
        ></Image>
        <Text style={{ fontFamily: "Inter_600SemiBold" }}>Carrito</Text>
      </TouchableOpacity>
      <View>
        <View>
          {shopData &&
            shopData.map((shop, index) => {
              const cantidad = groupedByTienda[shop.id.toString()] || 0;
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    margin: 10,
                    borderRadius: 10,
                    shadowRadius: 10,
                    boxShadow: [
                      {
                        blurRadius: 4,
                        offsetX: 1,
                        offsetY: 2,
                        color: "#828282",
                      },
                    ],
                    padding: 10,
                  }}
                >
                  <View
                    style={{ height: 75, width: 80, backgroundColor: "#ccc" }}
                  ></View>
                  <View style={{ flexDirection: "column", marginLeft: 10 }}>
                    <Text
                      style={{ fontSize: 20, fontFamily: "Inter_600SemiBold" }}
                    >
                      {shop.nombre}
                    </Text>
                    <Text
                      style={{ color: "#aaa", fontFamily: "Inter_300Light" }}
                    >
                      {cantidad} Items
                    </Text>
                    <View style={{ flexDirection: "row", marginTop: 5 }}>
                      <TouchableOpacity
                        onPress={async () => {
                          await AsyncStorage.removeItem(`carrito_${shop.id}`);
                          // eslint-disable-next-line react-hooks/rules-of-hooks
                          useCargarCarritosPorTienda(setCarshopping); // válido aquí dentro del componente
                        }}

                        style={{
                          width: 75,
                          alignItems: "center",
                          borderWidth: 1,
                          borderRadius: 10,
                          marginRight: 10,
                        }}
                      >
                        <Text>Cancelar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handlerCarrito(shop.id)}
                        style={{
                          width: 75,
                          alignItems: "center",
                          borderRadius: 10,
                          backgroundColor: "#E94B64",
                        }}
                      >
                        <Text style={{ color: "white" }}>Ver</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
        </View>
      </View>
    </View>
  );
}
