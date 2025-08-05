import {
  Inter_300Light,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";
import { getItem } from "../utils";

type Product = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url?: string;
  stock_actual: number;
};

export default function SellerDashboardProducts() {
  useFonts({
    Inter_600SemiBold,
    Inter_300Light,
    Inter_400Regular,
    Inter_700Bold,
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
  }, []);

  useEffect(() => {
    setLoading(true);
    getItem("@userId", (userId)=>{
      fetch(`${process.env.EXPO_PUBLIC_HOST}/api/product/getproducts/userid/${userId}`)
      .then((res) => res.json())
      .then((tiendaArray) => {
        // console.log(tiendaArray)
        const tienda = tiendaArray?.[0];

        if (Array.isArray(tienda?.productos)) {
          setProducts(tienda.productos);
        } else {
          console.warn("Tienda sin productos o estructura inesperada:", tienda);
          setProducts([]);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener productos:", err);
        setProducts([]);
        setLoading(false);
      });
    });
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#D61355" />;

  return (
    <View style={{ padding: 20, gap: 20 }}>
      <Text style={{ fontFamily: "Inter_700Bold", fontSize: 20 }}>
        Mis productos
      </Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 12, gap: 10 }}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              marginBottom: 12,
              backgroundColor: "#fff",
              borderRadius: 8,
              overflow: "hidden",
              elevation: 2,
            }}
          >
            {item.imagen_url ? (
              <Image
                source={{ uri: item.imagen_url }}
                style={{ width: 80, height: 80, backgroundColor: "#ccc" }}
              />
            ) : (
              <View
                style={{
                  width: 80,
                  height: 80,
                  backgroundColor: "#ccc",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontFamily: "Inter_600SemiBold" }}>
                  No imagen
                </Text>
              </View>
            )}
            <View style={{ flex: 1, padding: 8 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                  fontFamily: "Inter_600SemiBold",
                }}
              >
                {item.nombre}
              </Text>
              <Text>{item.descripcion}</Text>
              <Text
                style={{
                  color: "#D61355",
                  fontWeight: "bold",
                  marginTop: 4,
                  fontFamily: "Inter_300Light",
                }}
              >
                ${item.precio}
              </Text>
              {/* <Text style={{ fontFamily: "Inter_300Light" }}>
                Stock: {item.stock_actual}
              </Text> */}
            </View>
          </View>
        )}
      />
    </View>
  );
}
