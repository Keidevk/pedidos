type Estado = "pendiente" | "preparando" | "listo" | "cancelado";

interface Pedido {
  id: string;
  fecha: string;
  estado: Estado;
  total: number;
  metodoPago: string;
  clienteId: string;
  tiendaId: string;
  repartidorId: string | null;
}

interface Stats {
  completados: {
    cantidad: number;
    porcentaje: number;
  };
  cancelados: {
    cantidad: number;
    porcentaje: number;
  };
}

export async function obtenerStatsPedidos(url: string): Promise<Stats> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Error al obtener pedidos");
  const pedidos: Pedido[] = await res.json();
  const total = pedidos.length;

  const completados = pedidos.filter((p) => p.estado === "listo").length;
  const cancelados = pedidos.filter((p) => p.estado === "cancelado").length;

  return {
    completados: {
      cantidad: completados,
      porcentaje: total
        ? parseFloat(((completados / total) * 100).toFixed(2))
        : 0,
    },
    cancelados: {
      cantidad: cancelados,
      porcentaje: total
        ? parseFloat(((cancelados / total) * 100).toFixed(2))
        : 0,
    },
  };
}
