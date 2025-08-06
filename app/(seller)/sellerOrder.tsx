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
import { useClientes } from "../hooks/useClientes";
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
  const [pedidoActualizado, setPedidoActualizado] = useState(["", ""]);
  const [totalOrders, setTotalOrders] = useState<number | null>(null);

  const { pedidos, loading, error, refetchPedidos } = usePedidos(shopId || "");
  const { clientes, fetchCliente } = useClientes();

  useEffect(() => {
    getItem("@userId", setShopId);
  }, []);

  useEffect(() => {
    if (shopId !== "0" && shopId !== undefined) {
      fetchOrderStats(Number(shopId)).then((value) => {
        if (typeof value === "number") {
          setTotalOrders(value);
        }
      });
    }
  }, [shopId]);

  const estadosPedidos = [
    "pendiente",
    "recibido",
    "preparando",
    "listo",
    "enCamino",
    "entregado",
    "cancelado",
  ];

  const fetchOrderStats = async (shopId: number) => {
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_HOST}/api/stats/orders?shopId=${shopId}`
      );
      if (!res.ok) throw new Error("Error al obtener pedidos");

      const totalOrders = await res.json();
      console.log("🧾 Total de pedidos:", totalOrders);
      return totalOrders;
    } catch (err) {
      console.error("❌ Falló el fetch de pedidos:", err);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (
      pedidoActualizado[0] === pedidoSeleccionado?.id &&
      pedidoActualizado[0] !== ""
    ) {
      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_HOST}/api/order/update`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: pedidoActualizado[1],
              uuid: pedidoActualizado[0],
            }),
          }
        );

        if (!res.ok) throw new Error("Error al actualizar pedido");

        const data = await res.json();
        console.log("✅ Pedido actualizado:", data);
        await refetchPedidos(); // 👈 aquí refrescás la vista
        setModalVisible(false);
        setPedidoActualizado(["", ""]);
      } catch (err) {
        console.error("❌ Falló el update:", err);
      }
    } else {
      console.log("🔄 Estado aún no seleccionado");
    }
  };

  const handlePedidoIcon = (status: string) => {
    const iconMap: Record<string, any> = {
      recibido: require("../../assets/images/seller-sellerOrder-recibido-icon.svg"),
      listo: require("../../assets/images/seller-sellerOrder-recibido-icon.svg"),
      entregado: require("../../assets/images/seller-sellerOrder-recibido-icon.svg"),
      pendiente: require("../../assets/images/seller-sellerOrder-pendiente-icon.svg"),
      enCamino: require("../../assets/images/seller-sellerOrder-enCamino-icon.svg"),
      preparando: require("../../assets/images/seller-sellerOrder-preparando-icon.png"),
    };

    const icon = iconMap[status];
    return icon ? (
      <Image
        source={icon}
        style={{ height: 24, width: 24, tintColor: "#fff" }}
      />
    ) : (
      <View style={{ width: 32, height: 32 }}>
        <Text style={{ color: "#fff", fontSize: 25, textAlign: "center" }}>
          X
        </Text>
      </View>
    );
  };

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
        <Text style={{ fontFamily: "Inter_400Regular" }}>
          {`${totalOrders ?? "00"} pedidos pendientes`}
        </Text>

        {pedidos.map((pedido) => {
          const nombreCliente = clientes[pedido.clienteId];

          return (
            <View
              key={pedido.id}
              style={{
                overflow: "hidden",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                padding: 10,
                borderRadius: 10,
                borderBottomWidth: 1,
                borderWidth: 1,
                borderColor: "#E94B64",
              }}
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
                    <Text>{nombreCliente ?? "Cargando cliente..."}</Text>
                    <Text style={{ textTransform: "capitalize" }}>
                      {pedido?.metodoPago}
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
                    >
                      {handlePedidoIcon(pedido.estado)}
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
                      onPress={() => {
                        setPedidoSeleccionado(pedido);
                        setModalVisible(true);
                        setPedidoActualizado(["", ""]); // 👈 limpia el estado por si acaso
                        if (!clientes[pedido.clienteId]) {
                          fetchCliente(pedido.clienteId);
                        }
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
        animationType="fade"
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

            {pedidoSeleccionado ? (
              <View style={{ gap: 10, alignItems: "center", width: "100%" }}>
                <Text
                  style={{
                    width: 200,
                    textAlign: "center",
                    fontFamily: "Inter_400Regular",
                  }}
                >
                  {`Pedido de ${
                    clientes[pedidoSeleccionado.clienteId] ?? "Cargando..."
                  } 
por $${pedidoSeleccionado.total}, actualmente: ${pedidoSeleccionado.estado}`}
                </Text>

                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    textAlign: "center",
                    marginTop: 10,
                  }}
                >
                  Seleccionar nuevo estado:
                </Text>

                <View style={{ gap: 10 }}>
                  {estadosPedidos.map((estado) => (
                    <TouchableOpacity
                      key={`${estado}-${pedidoSeleccionado.id}`}
                      onPress={() => {
                        setPedidoActualizado([pedidoSeleccionado.id, estado]);
                        console.log("Nuevo estado:", [
                          pedidoSeleccionado.id,
                          estado,
                        ]);
                      }}
                      style={{
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        backgroundColor:
                          pedidoActualizado[1] === estado
                            ? "#E94B64"
                            : "#F7F7F7",
                        borderRadius: 8,
                      }}
                    >
                      <Text
                        style={{
                          color:
                            pedidoActualizado[1] === estado ? "#fff" : "#333",
                          fontFamily: "Inter_400Regular",
                          textTransform: "capitalize",
                        }}
                      >
                        {estado}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : (
              <Text style={{ fontFamily: "Inter_400Regular" }}>
                No hay pedido seleccionado
              </Text>
            )}
            {pedidoSeleccionado &&
              pedidoActualizado[0] === pedidoSeleccionado.id &&
              pedidoActualizado[1] !== pedidoSeleccionado.estado && (
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={{
                    marginTop: 10,
                    backgroundColor: "#E94B64",
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{ color: "#fff", fontFamily: "Inter_600SemiBold" }}
                  >
                    Guardar
                  </Text>
                </TouchableOpacity>
              )}

            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{ color: "#E94B64", fontSize: 14, marginTop: 10 }}>
                Cerrar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
