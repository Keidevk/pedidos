import {
  Inter_300Light,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { getItem } from "../utils";

export type RootStackParamList = {
  sellerOrder: undefined; // o `undefined` si no recibe params
  sellerRequests: undefined;
  sellerStats: undefined;
  sellerReviews: undefined;
};

type Shop = {
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
  fotosTienda: string[]; // si luego agregas imágenes, ajusta el tipo si es necesario
};

export default function MenuPrincipal() {
  useFonts({
    Inter_600SemiBold,
    Inter_300Light,
    Inter_400Regular,
    Inter_700Bold,
  });
  const [shop, setShop] = useState<Shop | null>(null);

  const formatearHora = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString("es-VE", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Hora inválida";
    }
  };

  const [shopId, setShopId] = useState("0");

  console.warn(shopId);

  useEffect(() => {
    getItem("@userId", setShopId);
    const fetchShop = async () => {
      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_HOST}/api/shop/${shopId}`
        );
        if (!res.ok) throw new Error("Error al traer datos");
        console.warn(`${process.env.EXPO_HOST_URL}/api/shop/${shopId}`);
        const data = await res.json();
        console.warn(data);

        setShop(data);
      } catch (err) {
        console.error("❌ Error al traer tienda", err);
      }
    };

    if (shopId !== "0") {
      fetchShop();
    }
  }, []);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <ScrollView contentContainerStyle={{ gap: 2 }}>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 14,
          }}
        >
          Tienda
        </Text>
      </View>
      <View style={{}}>
        <Image
          source={require("../../assets/images/seller-dashboard-icon.svg")}
          style={{
            height: 300,
            width: 250,
          }}
        />
        <View style={{ borderBottomWidth: 1, borderBottomColor: "#9F9F9F" }}>
          <Text style={{ fontFamily: "Inter_400Regular", fontSize: 16 }}>
            <Text>{shop?.nombre ?? "Cargando..."}</Text>
          </Text>
          <Text style={{ fontFamily: "Inter_400Regular", fontSize: 16 }}>
            <Text>{shop?.descripcion ?? "Sin descripción aún"}</Text>
          </Text>
          <View style={{ flexDirection: "row", gap: 2 }}>
            <Image
              source={require("../../assets/images/seller-dashboard-icon.svg")}
              style={{
                height: 25,
                width: 23,
              }}
            />
            <Text
              style={{
                color: "#E94B64",
                fontFamily: "Inter_400Regular",
                fontSize: 12,
              }}
            >
              <Text>{shop?.ubicacion ?? "Ubicación no disponible"}</Text>{" "}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 2 }}>
            <Image
              source={require("../../assets/images/timer-requests-icon.svg")}
              style={{
                height: 25,
                width: 23,
              }}
            />
            <Text
              style={{
                color: "#E94B64",
                fontFamily: "Inter_400Regular",
                fontSize: 12,
              }}
            >
              <Text>
                {shop?.horarioApertura
                  ? `${formatearHora(
                      shop.horarioApertura
                    )} hasta las ${formatearHora(shop.horarioCierre)}`
                  : "Sin horario aún"}
              </Text>
            </Text>
            <Text>{shop?.ubicacion ?? "Ubicación no disponible"}</Text>
          </View>
          <View style={{}}>
            <TouchableOpacity
              style={{ flexDirection: "row", gap: 2 }}
              //   onPress={() => navigation.navigate("")}
            >
              <Text style={{ fontFamily: "Inter_400Regular" }}>
                Mi lista de comidas
              </Text>
              <Image
                source={require("../../assets/images/seller-chevron-icon.svg")}
                style={{
                  height: 14,
                  width: 7,
                }}
              />
            </TouchableOpacity>
            <ScrollView horizontal contentContainerStyle={{}}>
              <View style={{}}>
                <View style={{ backgroundColor: "#D61355" }}>
                  <TouchableOpacity>
                    <Text
                      style={{ fontFamily: "Inter_300Light", color: "#fff" }}
                    >
                      Desayunos
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{ backgroundColor: "#fff" }}>
                  <TouchableOpacity>
                    <Text
                      style={{ fontFamily: "Inter_300Light", color: "#000" }}
                    >
                      Almuerzos
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{ backgroundColor: "#fff" }}>
                  <TouchableOpacity>
                    <Text
                      style={{ fontFamily: "Inter_300Light", color: "#000" }}
                    >
                      Cenas
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{ backgroundColor: "#fff" }}>
                  <TouchableOpacity>
                    <Text
                      style={{ fontFamily: "Inter_300Light", color: "#000" }}
                    >
                      Postres
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{ backgroundColor: "#fff" }}>
                  <TouchableOpacity>
                    <Text
                      style={{ fontFamily: "Inter_300Light", color: "#000" }}
                    >
                      Bebidas
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
            <TouchableOpacity style={{ flexDirection: "row", gap: 2 }}>
              <Image
                source={require("../../assets/images/seller-add-icon.svg")}
                style={{
                  height: 25,
                  width: 24,
                }}
              />
              <Text style={{}}>Añadir Nuevo Producto al Catálago</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* <View style={{}}>
          <TouchableOpacity style={{}}>
            <Image
              source={require("../../assets/images/seller-soporte-icon.svg")}
              style={{
                height: 32,
                width: 32,
              }}
            />
            <Text style={{ fontFamily: "Inter_600SemiBold", color: "#D61355" }}>
              Contactar a soporte
            </Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </ScrollView>
  );
}
