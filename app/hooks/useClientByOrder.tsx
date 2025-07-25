import { useEffect, useState } from "react";

type Cliente = {
  id: number;
  nombre: string;
  apellido: string;
  // ... agrega otras props si lo necesitás
};

export function useClientsByOrder(pedidos: { clienteId: string }[]) {
  const [clientes, setClientes] = useState<Record<string, Cliente>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uniqueIds = Array.from(new Set(pedidos.map((p) => p.clienteId)));
    const nuevos: Record<string, Cliente> = {};

    const fetchClientes = async () => {
      await Promise.all(
        uniqueIds.map(async (idRaw) => {
          const id = parseInt(idRaw);
          const clave = String(id);

          if (clientes[clave]) {
            nuevos[clave] = clientes[clave]; // ⛑️ cache existente
            return;
          }

          try {
            const res = await fetch(
              `${process.env.EXPO_PUBLIC_HOST}/api/client/get/${id}`
            );
            const json = await res.json();

            if (res.ok && json?.data) {
              nuevos[clave] = json.data as Cliente;
            } else {
              console.warn(`Cliente ${id} no encontrado.`);
            }
          } catch (err) {
            console.error(`Error al obtener cliente ${id}:`, err);
          }
        })
      );

      setClientes((prev) => ({ ...prev, ...nuevos }));
      setLoading(false);
    };

    if (uniqueIds.length > 0) {
      fetchClientes();
    } else {
      setLoading(false); // evita loading infinito
    }
  }, [pedidos]);

  return { clientes, loading };
}
