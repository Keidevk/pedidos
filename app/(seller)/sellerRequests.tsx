import {
  Inter_300Light,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { getItem } from "../utils";

type Pedido = {
  id: string;
  fecha: string;
  estado: string;
  total: number;
  metodoPago: string;
  cliente: {
    user: {
      nombre: string;
      apellido: string;
    };
  };
  repartidor?: {
    user?: {
      nombre: string;
      apellido: string;
    };
  };
  detalles: {
    cantidad: number;
    producto: {
      nombre: string;
    };
  }[];
};

export default function ShopOrders() {
  useFonts({
    Inter_600SemiBold,
    Inter_300Light,
    Inter_400Regular,
    Inter_700Bold,
  });
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [shopId, setShopId] = useState("0");

  useEffect(() => {
    getItem("@userId", setShopId);
  }, []);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_HOST}/api/shop/orders/${shopId}`
        );
        const json = await res.json();
        if (json.code === 200 && Array.isArray(json.data)) {
          setPedidos(json.data);
        } else {
          console.warn("Respuesta inesperada:", json);
        }
      } catch (err) {
        console.error("❌ Error al obtener pedidos de tienda:", err);
      }
    };

    if (shopId !== "0" && shopId !== undefined) {
      fetchPedidos();
    }
  }, [shopId]);

  console.log(pedidos);

  return (
    <View style={{}}>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
          padding: 20,
          paddingBottom: 0,
        }}
        onPress={() => router.navigate("/(seller)/sellerMain")}
      >
        <View
          style={{
            backgroundColor: "#ECF0F4",
            paddingRight: 15,
            paddingLeft: 15,
            paddingTop: 12,
            paddingBottom: 12,
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={require("../../assets/images/seller-chevron-back-icon.svg")}
            style={{
              height: 14,
              width: 10,
              tintColor: "#E94B64",
            }}
          />
        </View>
        <Text
          style={{
            fontFamily: "Inter_600SemiBold",
            fontSize: 17,
            textAlign: "center",
          }}
        >
          Entregas en curso
        </Text>
      </TouchableOpacity>
      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <View
            style={{
              marginBottom: 16,
              padding: 16,
              borderRadius: 10,
              backgroundColor: "#FAFAFA",
              borderColor: "#E94B64",
              borderWidth: 1,
              gap: 2,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              Pedido #{item.id.slice(0, 8)}
            </Text>

            <Text>
              Cliente: {item.cliente?.user?.nombre.trim()}{" "}
              {item.cliente?.user?.apellido.trim()}
            </Text>
            <Text>
              Repartidor:{" "}
              {item.repartidor?.user
                ? `${item.repartidor.user.nombre.trim()} ${item.repartidor.user.apellido.trim()}`
                : "Sin asignar"}
            </Text>
            <Text style={{ marginTop: 8, fontWeight: "bold" }}>Detalles:</Text>
            {item.detalles.map((d, idx) => (
              <Text key={idx}>
                - {d.cantidad} × {d.producto?.nombre}
              </Text>
            ))}
            <View
              style={{
                padding: 15,
                marginBottom: 12,
                backgroundColor: "#FE9BABCC",
                borderRadius: 8,
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 2,
                borderWidth: 1,
                borderColor: "#D61355",
                marginTop: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 14 }}>
                  Estado:
                </Text>
                <Text
                  style={{
                    textTransform: "capitalize",
                    fontFamily: "Inter_400Regular",
                  }}
                >
                  {item.estado}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 14 }}>
                  Total:
                </Text>
                <Text
                  style={{
                    textTransform: "capitalize",
                    fontFamily: "Inter_400Regular",
                  }}
                >
                  ${item.total.toFixed(2)}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 14 }}>
                  Método de pago:
                </Text>
                <Text
                  style={{
                    textTransform: "capitalize",
                    fontFamily: "Inter_400Regular",
                  }}
                >
                  {item.metodoPago}
                </Text>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 40 }}>
            No hay pedidos disponibles.
          </Text>
        }
      />
    </View>
  );
}
