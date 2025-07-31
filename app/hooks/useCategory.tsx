import { useEffect, useState } from "react";

type Categoria = {
  id: string;
  nombre: string;
};

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_HOST}/api/product/getcategory`
        );
        const json = await res.json();

        if (res.ok && Array.isArray(json)) {
          setCategorias(json); // ⬅️ Asumiendo que el array viene directo
        } else {
          throw new Error("Formato inesperado de categorías");
        }
      } catch (err: any) {
        setError(err.message ?? "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  return { categorias, loading, error };
}
