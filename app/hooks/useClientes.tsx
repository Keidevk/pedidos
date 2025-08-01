import { useCallback, useState } from "react";

type Cliente = {
  nombre: string;
  apellido: string;
};

export function useClientes() {
  const [clientes, setClientes] = useState<Record<string, string>>({});

  const fetchCliente = useCallback(
    async (uuid: string) => {
      if (clientes[uuid]) return clientes[uuid]; // Ya en caché

      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_HOST}/api/client/get/uuid/${uuid}`
        );
        const json = await res.json();

        const user = json?.data?.user;
        console.log("Respuesta del cliente:", user);

        if (user?.nombre && user?.apellido) {
          const nombreCompleto = `${user.nombre.trim()} ${user.apellido.trim()}`;
          setClientes((prev) => ({ ...prev, [uuid]: nombreCompleto }));
          return nombreCompleto;
        } else {
          console.warn("Cliente sin nombre/apellido válido:", json);
          return null;
        }
      } catch (err) {
        console.error("Error al obtener cliente:", err);
        return null;
      }
    },
    [clientes]
  );

  return { clientes, fetchCliente };
}
