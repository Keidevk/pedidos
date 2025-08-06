import { useEffect, useState } from "react";

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

export function usePedidos(shopId: string) {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPedidos = async () => {
    if (!shopId) return;

    try {
      const url = `${process.env.EXPO_PUBLIC_HOST}/api/stats/orders/${shopId}`;
      console.log("📦 Refetch desde:", url);

      const res = await fetch(url);
      const json = await res.json();

      if (res.ok && Array.isArray(json)) {
        setPedidos(json);
      } else {
        throw new Error("Formato inesperado en la respuesta");
      }
    } catch (err: any) {
      setError(err.message ?? "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos(); // 🔁 primera carga
  }, [shopId]);

  return { pedidos, loading, error, refetchPedidos: fetchPedidos };
}
