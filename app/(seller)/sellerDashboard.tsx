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
  sellerDashboardCreateProduct: undefined;
  sellerDashboardProducts: undefined;
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
    getItem("@userId", (id) => {
      if (!id || id === "0") {
        console.warn("🟡 ID inválido o no encontrado");
        return;
      }

      setShopId(id);

      const fetchShop = async () => {
        try {
          const res = await fetch(
            `${process.env.EXPO_PUBLIC_HOST}/api/shop/userid/${id}`
          );
          if (!res.ok) {
            console.error("⚠️ Falló el fetch con status:", res.status);
            throw new Error("Error al traer tienda");
          }

          const data = await res.json();
          console.log("✅ Datos de tienda recibidos:", data);
          setShop(data);
        } catch (err) {
          console.error("❌ Error al traer datos de tienda:", err);
        }
      };

      fetchShop();
    });
  }, []);

  const SelectorCategorias = () => {
    const [categorias, setCategorias] = useState<
      { id: string; nombre: string; icono?: string }[]
    >([]);

    useEffect(() => {
      const obtenerCategorias = async () => {
        try {
          const res = await fetch(
            `${process.env.EXPO_PUBLIC_HOST}/api/product/getcategory`
          );
          const data = await res.json();
          setCategorias(data);
        } catch (error) {
          console.error("Error al obtener categorías:", error);
        }
      };

      obtenerCategorias();
    }, []);

    return (
      <View style={{ marginVertical: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 10 }}>
          Categorías disponibles:
        </Text>

        <View style={{ flexWrap: "wrap", flexDirection: "row", gap: 8 }}>
          {categorias.length > 0 ? (
            categorias.map(({ id, nombre }) => (
              <Text
                key={id}
                style={{
                  backgroundColor: "#F4F4F4",
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 6,
                  fontSize: 14,
                  fontFamily: "Inter_400Regular",
                }}
              >
                {nombre}
              </Text>
            ))
          ) : (
            <Text style={{ color: "#888" }}>
              No hay categorías disponibles.
            </Text>
          )}
        </View>
      </View>
    );
  };

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <ScrollView contentContainerStyle={{ gap: 16, padding: 20 }}>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          borderBottomWidth: 1,
          borderBottomColor: "#9F9F9F9E",
          paddingBottom: 20,
        }}
      >
        <Text
          style={{
            fontFamily: "Inter_600SemiBold",
            fontSize: 16,
          }}
        >
          Tu tienda
        </Text>
      </View>
      <View style={{ gap: 20 }}>
        <Image
          source={require("../../assets/images/seller-dashboard-icon.svg")}
          style={{
            height: 250,
            width: "100%",
            borderRadius: 30,
          }}
        />
        <View
          style={{
            gap: 5,
          }}
        >
          <Text style={{ fontFamily: "Inter_700Bold", fontSize: 18 }}>
            {shop?.nombre ?? "Cargando..."}
          </Text>
          <Text style={{ fontFamily: "Inter_400Regular", fontSize: 16 }}>
            <Text>{shop?.descripcion ?? "Sin descripción aún"}</Text>
          </Text>
          <View style={{ flexDirection: "row", gap: 2, alignItems: "center" }}>
            <Image
              source={require("../../assets/images/location-requests-icon.svg")}
              style={{
                height: 25,
                width: 23,
                tintColor: "#E94B64",
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
          <View
            style={{
              flexDirection: "row",
              gap: 2,
              alignItems: "center",
              borderBottomWidth: 1,
              borderBottomColor: "#9F9F9F",
              paddingBottom: 20,
            }}
          >
            <Image
              source={require("../../assets/images/timer-requests-icon.svg")}
              style={{
                height: 25,
                width: 23,
                tintColor: "#E94B64",
              }}
            />
            <Text
              style={{
                color: "#E94B64",
                fontFamily: "Inter_400Regular",
                fontSize: 12,
              }}
            >
              {shop?.horarioApertura
                ? `${formatearHora(
                    shop.horarioApertura
                  )} hasta las ${formatearHora(shop.horarioCierre)}`
                : "Sin horario aún"}
            </Text>
          </View>
          <View style={{ gap: 10, paddingTop: 15, paddingBottom: 20 }}>
            <TouchableOpacity
              style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
              onPress={() => navigation.navigate("sellerDashboardProducts")}
            >
              <Text style={{ fontFamily: "Inter_400Regular", fontSize: 15 }}>
                Mi lista de comidas
              </Text>
              <View
                style={{
                  backgroundColor: "#fff",
                  padding: 5,
                  borderRadius: 50,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={require("../../assets/images/seller-chevron-icon.svg")}
                  style={{
                    height: 14,
                    width: 7,
                  }}
                />
              </View>
            </TouchableOpacity>
            <ScrollView horizontal contentContainerStyle={{}}></ScrollView>
            <SelectorCategorias />
            <TouchableOpacity
              style={{
                flexDirection: "row",
                gap: 2,
                alignItems: "center",
                justifyContent: "center",
                borderLeftWidth: 1,
                borderLeftColor: "#000000",
              }}
              onPress={() =>
                navigation.navigate("sellerDashboardCreateProduct")
              }
            >
              <Image
                source={require("../../assets/images/seller-add-icon.svg")}
                style={{
                  height: 25,
                  width: 24,
                }}
              />
              <Text style={{}}>Añadir nuevo producto al catálago</Text>
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
