import { useEffect, useState } from "react";

type Producto = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url: string;
};

export function useProductosPorCategoria(nombreCategoria: string) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!nombreCategoria) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${
            process.env.EXPO_PUBLIC_HOST
          }/api/product/getproductsbycategory/${encodeURIComponent(
            nombreCategoria
          )}`
        );
        const json = await res.json();

        if (res.ok && Array.isArray(json)) {
          setProductos(json);
        } else {
          throw new Error("Respuesta inválida");
        }
      } catch (err: any) {
        setError(err.message ?? "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [nombreCategoria]);

  return { productos, loading, error };
}
