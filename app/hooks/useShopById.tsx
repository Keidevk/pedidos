import { useEffect, useState } from "react";

type Shop = {
  id: string;
  userId: number;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  horarioApertura: string;
  horarioCierre: string;
  tiempoEntregaPromedio: number;
  costoEnvio: string;
  rating: string;
  fotosTienda: string[];
};

export function useShopById(shopId: string | null) {
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shopId) {
      setError("No se proporcionó un shopId válido.");
      setShop(null);
      setLoading(false);
      return;
    }

    const fetchShop = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_HOST}/api/shop/${shopId}`
        );
        const json = await res.json();

        if (json?.id) {
          setShop(json);
          setError(null);
        } else {
          setError("Tienda no encontrada.");
          setShop(null);
        }
      } catch (err) {
        setError("Error de red al obtener tienda.");
        setShop(null);
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [shopId]);

  return { shop, loading, error };
}
