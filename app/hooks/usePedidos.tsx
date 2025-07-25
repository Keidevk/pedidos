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

  useEffect(() => {
    if (!shopId) return;

    const fetchPedidos = async () => {
      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_HOST}/api/order/${shopId}`
        );
        const json = await res.json();
        console.log("Res:", json); // ¿data existe?
        console.log(
          "URL:",
          `${process.env.EXPO_PUBLIC_HOST}/api/order/${shopId}`
        );
        if (res.ok && Array.isArray(json.data)) {
          setPedidos(json.data);
        } else {
          throw new Error("Respuesta inesperada");
        }
      } catch (err: any) {
        setError(err.message ?? "Error desconocido");
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
  }, [shopId]);

  return { pedidos, loading, error };
}
