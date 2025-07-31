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
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import { useDelivery } from "../hooks/useDelivery";
import { getItem } from "../utils";

type Pedido = {
  id: string;
  fecha: string;
  estado: string;
  total: number;
  metodoPago: string;
  clienteId: string;
};

const agruparEstado = (estado: string): "activa" | "listo" | "cancelado" => {
  if (estado === "pendiente" || estado === "preparando") return "activa";
  if (estado === "listo") return "listo";
  return "cancelado";
};

export default function MenuPrincipal() {
  useFonts({
    Inter_600SemiBold,
    Inter_300Light,
    Inter_400Regular,
    Inter_700Bold,
  });
  const [filtro, setFiltro] = useState<"activa" | "listo" | "cancelado">(
    "activa"
  );
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [shopId, setShopId] = useState("0");
  const [pedidoActivo, setPedidoActivo] = useState<Pedido | null>(null);
  const { delivery, loading, error } = useDelivery(9);

  useEffect(() => {
    getItem("@userId", (id) => {
      setShopId(id);
      fetch(`${process.env.EXPO_PUBLIC_HOST}/api/stats/orders/${id}`)
        .then((res) => res.json())
        .then((data: Pedido[]) => {
          console.log("Pedidos:", data);
          setPedidos(data);
        })
        .catch((error) => {
          console.error("Error al traer pedidos:", error);
        });
    });
  }, []);

  const pedidosFiltrados = pedidos.filter(
    (p) => agruparEstado(p.estado) === filtro
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <FlatList
        data={pedidosFiltrados}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            {/* Header */}
            <TouchableOpacity
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                marginBottom: 20,
                paddingTop: 20,
              }}
              onPress={() => router.navigate("/(seller)/sellerMain")}
            >
              {/* Ícono si lo tenés */}
              <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 20 }}>
                Mis órdenes
              </Text>
            </TouchableOpacity>

            {/* Tabs */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginBottom: 16,
              }}
            >
              {["activa", "listo", "cancelado"].map((estado) => (
                <TouchableOpacity
                  key={estado}
                  onPress={() => setFiltro(estado as any)}
                  style={{
                    paddingVertical: 8,
                    borderBottomWidth: 2,
                    borderBottomColor: filtro === estado ? "#D61355" : "#ccc",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily:
                        filtro === estado
                          ? "Inter_600SemiBold"
                          : "Inter_400Regular",
                      color: filtro === estado ? "#D61355" : "#888",
                    }}
                  >
                    {estado === "activa"
                      ? "Activas"
                      : estado === "listo"
                      ? "Listas"
                      : "Canceladas"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        }
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setPedidoActivo(item)}>
            <View
              style={{
                padding: 15,
                marginBottom: 12,
                backgroundColor: "#F9F9F9",
                borderRadius: 8,
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 2,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Inter_600SemiBold",
                  marginBottom: 6,
                }}
              >
                Orden #{item.id.slice(0, 8)}
              </Text>
              <Text style={{ marginBottom: 4 }}>Estado: {item.estado}</Text>
              <Text style={{ marginBottom: 4 }}>
                Total: ${item.total.toFixed(2)}
              </Text>
              <Text>Pago: {item.metodoPago}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 20,
        }}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 50 }}>
            No hay órdenes disponibles para esta categoría.
          </Text>
        }
      />

      {/* Modal */}
      <Modal visible={pedidoActivo !== null} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 10,
              padding: 20,
              gap: 20,
              width: "100%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: "#4A55684D",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Inter_700Bold",
                  marginBottom: 10,
                  textAlign: "center",
                  maxWidth: 100,
                }}
              >
                Orden #{pedidoActivo?.id.slice(0, 8)}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  backgroundColor: "#FFDCE1",
                  padding: 5,
                  borderRadius: 30,
                  fontFamily: "Inter_300Light",
                  marginBottom: 10,
                  textAlign: "center",
                  maxWidth: 140,
                }}
              >
                {new Date(pedidoActivo?.fecha || "").toLocaleString()}
              </Text>
            </View>
            <View style={{ gap: 20 }}>
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Image
                  source={require("../../assets/images/sellerOrderPage-user-icon.svg")}
                  style={{ height: 26, width: 26 }}
                  tintColor={"##EB6278"}
                />
                {/* <Text style={{ maxWidth: 100 }}>{pedidoActivo?.clienteId}</Text> */}
                <Text style={{ maxWidth: 100, fontFamily: "Inter_700Bold" }}>
                  Usuario
                </Text>
                <TouchableOpacity style={{}}>
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#FFDCE1",
                      padding: 5,
                      borderRadius: 30,
                      width: 30,
                      height: 30,
                    }}
                  >
                    <Image
                      source={require("../../assets/images/sellerOrderPage-phone-icon.svg")}
                      style={{ height: 17, width: 16 }}
                      tintColor={"##EB6278"}
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={{}}>
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#FFDCE1",
                      padding: 5,
                      borderRadius: 30,
                      width: 30,
                      height: 30,
                    }}
                  >
                    <Image
                      source={require("../../assets/images/sellerOrderPage-message-icon.svg")}
                      style={{ height: 22, width: 24 }}
                      tintColor={"##EB6278"}
                    />
                  </View>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  gap: 5,
                  paddingBottom: 20,
                  borderBottomWidth: 1,
                  borderBottomColor: "#4A55684D",
                }}
              >
                <Text style={{}}>Estado actual del pedido:</Text>
                <Text
                  style={{
                    textTransform: "capitalize",
                    fontFamily: "Inter_600SemiBold",
                  }}
                >
                  {pedidoActivo?.estado}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "#FF59631A",
                  borderWidth: 1,
                  borderColor: "#D61355",
                  borderRadius: 10,
                  padding: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 5,
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{}}>Total:</Text>
                  <Text
                    style={{
                      textTransform: "capitalize",
                      fontFamily: "Inter_600SemiBold",
                    }}
                  >
                    ${pedidoActivo?.total}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 5,
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{}}>Método de pago:</Text>
                  <Text
                    style={{
                      textTransform: "capitalize",
                      fontFamily: "Inter_600SemiBold",
                    }}
                  >
                    {pedidoActivo?.metodoPago}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: "#E94B64",
                  paddingVertical: 10,
                  borderRadius: 5,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "#fff",
                    fontFamily: "Inter_600SemiBold",
                  }}
                >
                  Solicitar delivery
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => setPedidoActivo(null)}
              style={{
                backgroundColor: "#E94B64",
                paddingVertical: 10,
                borderRadius: 5,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#fff",
                  fontFamily: "Inter_600SemiBold",
                }}
              >
                Cerrar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
