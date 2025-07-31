// hooks/useDelivery.ts
import { useEffect, useState } from "react";
type DeliveryResponse = {
  code: number;
  documento_identidad: string;
  data: Delivery;
};
type Delivery = {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  tipo: "repartidor" | "cliente"; // si hay más roles, podés extender
  fechaRegistro: string; // formato ISO
  activo: boolean;
  fotoPerfil: string;
  direccion: string;
  documento_identidad: string;
  vehiculo: Vehiculo;
};
type Vehiculo = {
  id: string;
  tipoVehiculo: string;
  licencia: string;
  disponibilidad: boolean;
  rating: string;
  descripcion: string;
  fotos: string;
};

export const useDelivery = (id: number) => {
  const [delivery, setDelivery] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchDelivery = async () => {
      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_HOST}/api/delivery/`
        );
        const json: DeliveryResponse = await res.json();
        const delivery: Delivery = json.data;

        if (!isMounted) return;

        if (json.code === 200 && json.data) {
          setDelivery(json.data);
        } else {
          setError("Repartidor no encontrado");
        }
      } catch (err) {
        if (isMounted) setError("Error de red");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDelivery();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { delivery, loading, error };
};
