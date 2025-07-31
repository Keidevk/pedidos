import {
  Inter_300Light,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useClientsByOrder } from "../hooks/useClientByOrder";
import { usePedidos } from "../hooks/usePedidos";
import { getItem } from "../utils";

type Pedido = {
  id: string;
  fecha: string;
  estado: string;
  total: number;
  metodoPago: string;
  clienteId: string;
  tiendaId: string;
  repartidorId: string | null;
};

export default function MenuPrincipal() {
  useFonts({
    Inter_600SemiBold,
    Inter_300Light,
    Inter_400Regular,
    Inter_700Bold,
  });
  const [shopId, setShopId] = useState("0");
  const [modalVisible, setModalVisible] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(
    null
  );
  const [totalOrders, setTotalOrders] = useState<number | null>(null);

  const fetchOrderStats = async (shopId: number) => {
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_HOST}/api/stats/orders?shopId=${shopId}`
      );
      if (!res.ok) throw new Error("Error al obtener pedidos");

      const totalOrders = await res.json(); // Esto será un número directamente: 1
      console.log("🧾 Total de pedidos:", totalOrders);
      return totalOrders;
    } catch (err) {
      console.error("❌ Falló el fetch de pedidos:", err);
      return null;
    }
  };

  const estadosPedidos = [
    "pendiente",
    "recibido",
    "preparando",
    "listo",
    "enCamino",
    "entregado",
    "cancelado",
  ];

  useEffect(() => {
    getItem("@userId", setShopId);
    if (shopId !== "0") {
      fetchOrderStats(Number(shopId)).then((value) => {
        if (typeof value === "number") {
          setTotalOrders(value);
        }
      });
    }
  }, []);

  const { pedidos, loading, error } = usePedidos(shopId || "");
  const { clientes, loading: loadingClientes } = useClientsByOrder(pedidos);

  console.warn(pedidos, "asdasd");

  return (
    <ScrollView
      contentContainerStyle={{
        display: "flex",
        backgroundColor: "#F7F8F9",
        padding: 20,
        gap: 20,
      }}
    >
      <View style={{ gap: 30 }}>
        <View style={{}}>
          <Text style={{ fontFamily: "Inter_400Regular" }}>
            {`${totalOrders ?? "00"} pedidos en curso`}
          </Text>
        </View>
        {pedidos.map((pedido) => {
          const cliente = clientes[pedido.clienteId];

          return (
            <View
              style={{
                overflow: "hidden",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                borderBottomColor: "#E0E0E0",
                paddingBottom: 10,
                borderBottomWidth: 1,
              }}
              key={pedido.id}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "70%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    gap: 5,
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <View style={{ gap: 5, width: "100%" }}>
                    <Text
                      style={{
                        fontFamily: "Inter_400Regular",
                        color: "#D61355",
                      }}
                    >
                      #Categoría
                    </Text>
                    <Text>
                      {loadingClientes
                        ? "Cargando cliente..."
                        : `${cliente?.nombre ?? "Usuario"} ${
                            cliente?.apellido ?? ""
                          }`}
                    </Text>
                    <Text style={{ textTransform: "capitalize" }}>
                      {loadingClientes
                        ? "Cargando cliente..."
                        : `${pedido?.metodoPago}`}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Inter_400Regular",
                        color: "#9C9BA6",
                      }}
                    >
                      ID: {pedido?.id ?? "404"}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 10,
                      width: "100%",
                    }}
                  >
                    <Text
                      style={{ fontFamily: "Inter_300Light", fontSize: 16 }}
                    >
                      ${pedido?.total}
                    </Text>
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#E94B64",
                        padding: 10,
                        width: "30%",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 10,
                      }}
                      onPress={() => {
                        setPedidoSeleccionado(pedido); // 👈 guarda el que se abrió
                        setModalVisible(true);
                      }}
                    >
                      <Image
                        source={require("../../assets/images/order-icon.svg")}
                        style={{
                          height: 24,
                          width: 18,
                          tintColor: "#fff",
                        }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        width: 90,
                        borderWidth: 1,
                        padding: 10,
                        borderRadius: 10,
                        alignItems: "center",
                        justifyContent: "center",
                        borderColor: "#D61355",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Inter_400Regular",
                          color: "#D61355",
                          fontSize: 13,
                        }}
                      >
                        Actualizar
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 15,
              width: "80%",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Text style={{ fontFamily: "Inter_700Bold", fontSize: 16 }}>
              Estado del pedido
            </Text>
            <View style={{}}>
              {pedidoSeleccionado ? (
                <View style={{ gap: 10, alignItems: "center" }}>
                  <Text
                    style={{
                      width: 200,
                      textAlign: "center",
                      fontFamily: "Inter_400Regular",
                    }}
                  >{`El estado del pedido de ${pedidoSeleccionado.clienteId} por $${pedidoSeleccionado.total} encuentra actualmente: ${pedidoSeleccionado.estado}`}</Text>
                  <Text
                    style={{
                      fontFamily: "Inter_600SemiBold",
                      textAlign: "center",
                    }}
                  >
                    Seleccionar nuevo estado
                  </Text>
                  <View>
                    {estadosPedidos.map((estado) => (
                      <TouchableOpacity style={{}} id={estado}>
                        <Text style={{ textTransform: "capitalize" }}>
                          {estado}
                        </Text>
                        {/* <Image
                      source={require("../../assets/images/order-icon.svg")}
                      style={{
                        height: 24,
                        width: 18,
                      }}
                    /> */}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ) : (
                <Text>No hay pedido seleccionado</Text>
              )}
            </View>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{ color: "#D61355", fontSize: 14 }}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
