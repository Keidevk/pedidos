import {
  Inter_300Light,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useClientes } from "../hooks/useClientes";
import { useShopById } from "../hooks/useShopById";
import { getItem } from "../utils";

type Pedido = {
  id: string;
  fecha: string;
  estado: string;
  total: number;
  metodoPago: string;
  clienteId: string;
  tiendaId: string;
  repartidorId: string;
};

const agruparEstado = (estado: string): "activa" | "listo" | "cancelado" => {
  if (estado === "pendiente" || estado === "preparando") return "activa";
  if (estado === "listo") return "listo";
  return "cancelado";
};

export default function OrdersByDelivery() {
  useFonts({
    Inter_600SemiBold,
    Inter_300Light,
    Inter_400Regular,
    Inter_700Bold,
  });

  const [userId, setUserId] = useState("0");
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filtro, setFiltro] = useState<"activa" | "listo" | "cancelado">(
    "activa"
  );
  const {
    shop,
    loading: shopLoading,
    error: shopError,
  } = useShopById("3630a1b4-94c7-4d83-abfb-6e4dc6711d78");
  const { clientes, fetchCliente } = useClientes();

  useEffect(() => {
    getItem("@userId", async (id: string | null) => {
      if (!id) {
        console.warn("⚠️ No se pudo obtener el ID del repartidor.");
        return;
      }

      setUserId(id);

      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_HOST}/api/delivery/orders/${id}`
        );
        const json = await res.json();

        const pedidos = json.data?.[0]?.pedidos ?? [];
        setPedidos(pedidos);

        const uniqueIds = [...new Set(pedidos.map((p: Pedido) => p.clienteId))];
        uniqueIds.forEach((uuid) => fetchCliente(uuid as string));
      } catch (error) {
        console.error("❌ Error al obtener pedidos:", error);
      }
    });
  }, []);

  const pedidosFiltrados = pedidos.filter(
    (p) => agruparEstado(p.estado) === filtro
  );

  const desasignarPedido = async (pedidoId: string) => {
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_HOST}/api/delivery/unassignment/${userId}/${pedidoId}`,
        {
          method: "PUT",
        }
      );

      if (!res.ok) {
        console.warn("❌ Error al desasignar pedido:", res.status);
        return;
      }

      const json = await res.json();
      console.log("✅ Pedido desasignado:", json);

      // Opcional: eliminar visualmente el pedido desasignado
      setPedidos((prev) => prev.filter((p) => p.id !== pedidoId));
    } catch (err) {
      console.error("❌ Error de red al desasignar:", err);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <FlatList
        data={pedidosFiltrados}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={{ padding: 20 }}>
            <TouchableOpacity style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 20, fontFamily: "Inter_600SemiBold" }}>
                Mis entregas
              </Text>
            </TouchableOpacity>

            <View
              style={{ flexDirection: "row", justifyContent: "space-around" }}
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
                      ? "Pendientes"
                      : estado === "listo"
                      ? "Completadas"
                      : "Canceladas"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={{
              padding: 15,
              margin: 15,
              backgroundColor: "#F9F9F9",
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "#D61355",
              flexDirection: "row",
              overflow: "hidden",
            }}
          >
            <View style={{ width: "60%", justifyContent: "space-evenly" }}>
              <View style={{}}>
                <Text
                  style={{
                    marginBottom: 4,
                    fontFamily: "Inter_700Bold",
                    fontSize: 16,
                  }}
                >
                  {clientes[item.clienteId] ?? "🔄 Cargando..."}
                </Text>
                <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 14 }}>
                  {item.tiendaId === shop?.id ? shop?.nombre : item.tiendaId}
                </Text>
              </View>

              <Text style={{ marginBottom: 4 }}>
                Total: ${item.total.toFixed(2)}
              </Text>

              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Inter_600SemiBold",
                  marginBottom: 6,
                }}
              >
                Orden #{item.id.slice(0, 8)}
              </Text>
            </View>
            <View
              style={{ gap: 5, justifyContent: "center", alignItems: "center" }}
            >
              <Text style={{ marginBottom: 4, width: 120 }}>
                Fecha: {new Date(item.fecha).toLocaleString()}
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: "#E94B64",
                  width: 100,
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                <Text style={{ textAlign: "center", color: "#fff" }}>
                  Aceptar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => desasignarPedido(item.id)}
                style={{
                  backgroundColor: "transparent",
                  width: 100,
                  padding: 10,
                  borderRadius: 10,
                  borderColor: "#E94B64",
                  borderWidth: 1,
                }}
              >
                <Text style={{ textAlign: "center", color: "#E94B64" }}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 50 }}>
            No hay entregas disponibles en esta categoría.
          </Text>
        }
      />
    </View>
  );
}
