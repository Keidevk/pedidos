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
type ActiveDeliveryResponse = {
  code: number;
  deliverys: ActiveDelivery[];
};

type ActiveDelivery = {
  id: string;
  userId: number;
  tipoVehiculo: string;
  licencia: string;
  disponibilidad: boolean;
  ubicacionActual: string;
  rating: string;
  vehiculoDescripcion: string;
  fotosVehiculo: string;
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

export const useActiveDelivery = () => {
  const [deliverys, setDeliverys] = useState<ActiveDelivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveDelivery = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_HOST}/api/delivery/actives`
      );
      const json: ActiveDeliveryResponse = await res.json();

      if (json.code === 200 && json.deliverys) {
        setDeliverys(json.deliverys);
      } else {
        setError("No se encontraron repartidores disponibles");
        setDeliverys([]); // Limpia si no hay data
      }
    } catch (err) {
      setError("Error de red al buscar repartidores");
      setDeliverys([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveDelivery();
  }, []);

  return { deliverys, loading, error, refetch: fetchActiveDelivery };
};
