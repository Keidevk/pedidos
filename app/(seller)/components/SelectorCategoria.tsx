import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

type Categoria = {
  id: string;
  nombre: string;
  icono?: string;
};

type Props = {
  onSeleccionar: (id: string) => void;
  categoriaSeleccionada?: string;
};

const SelectorCategorias = ({
  onSeleccionar,
  categoriaSeleccionada,
}: Props) => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const obtenerCategorias = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_HOST}/api/product/getcategory`
        );
        const data = await res.json();

        if (!Array.isArray(data)) {
          console.warn("Respuesta inesperada:", data);
          setCategorias([]);
          return;
        }

        setCategorias(data);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      } finally {
        setIsLoading(false);
      }
    };

    obtenerCategorias();
  }, []);

  return (
    <View style={{ gap: 16 }}>
      <Text style={{ fontSize: 16, fontWeight: "600" }}>
        Selecciona una categoría
      </Text>

      {isLoading ? (
        <Text style={{ color: "#999", fontStyle: "italic" }}>
          Cargando categorías...
        </Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: "row", gap: 10 }}>
            {categorias.length > 0 ? (
              categorias.map(({ id, nombre }) => {
                const seleccionada = id === categoriaSeleccionada;
                return (
                  <TouchableOpacity
                    key={id}
                    onPress={() => onSeleccionar(id)}
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 12,
                      borderRadius: 6,
                      backgroundColor: seleccionada ? "#003366" : "#E0E0E0",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: 100,
                    }}
                  >
                    <Text
                      style={{
                        color: seleccionada ? "#fff" : "#000",
                        textAlign: "center",
                        fontWeight: "500",
                      }}
                    >
                      {nombre}
                    </Text>
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text style={{ color: "#888" }}>
                No se encontraron categorías.
              </Text>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default SelectorCategorias;
