import {
  Inter_300Light,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";

export type RootStackParamList = {
  sellerDashboard: undefined;
};

type ProductoFormData = {
  nombre: string;
  detalles: string;
  ingredientes: string;
  precio: number;
  stock: number;
  tiempoEstimado: string;
};

export default function MenuPrincipal() {
  useFonts({
    Inter_600SemiBold,
    Inter_300Light,
    Inter_400Regular,
    Inter_700Bold,
  });

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [formData, setFormData] = useState<ProductoFormData>({
    nombre: "",
    detalles: "",
    precio: 0,
    stock: 0,
    ingredientes: "",
    tiempoEstimado: "",
  });

  const CATEGORIAS = [
    "Desayunos",
    "Almuerzos",
    "Cenas",
    "Bebidas",
    "Postres",
    "Snacks",
  ];

  const handleChange = <T extends keyof ProductoFormData>(
    key: T,
    value: ProductoFormData[T]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const AdjuntarFotos = () => {
    const [imagenes, setImagenes] = useState<string[]>([]);

    const seleccionarImagenes = async () => {
      if (imagenes.length >= 5) {
        Alert.alert(
          "Límite alcanzado",
          "Solo puedes adjuntar hasta 5 imágenes."
        );
        return;
      }

      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"], // ✅ NUEVO FORMATO
        allowsMultipleSelection: true,
        quality: 0.7,
      });

      if (!resultado.canceled && resultado.assets) {
        const nuevasUris = resultado.assets.map((asset) => asset.uri);
        const total = imagenes.length + nuevasUris.length;

        const permitidas =
          total > 5 ? nuevasUris.slice(0, 5 - imagenes.length) : nuevasUris;

        if (total > 5) {
          Alert.alert(
            "Demasiadas imágenes",
            `Solo puedes agregar ${5 - imagenes.length} más.`
          );
        }

        setImagenes((prev) => [...prev, ...permitidas]);
      }
    };

    const eliminarImagen = (uri: string) => {
      setImagenes((prev) => prev.filter((img) => img !== uri));
    };

    return (
      <View style={{ flex: 1 }}>
        <Button title="Adjuntar fotos" onPress={seleccionarImagenes} />
        <ScrollView horizontal style={{ marginTop: 10 }}>
          {imagenes.map((uri, index) => (
            <View key={index} style={{ marginRight: 10 }}>
              <Image
                source={{ uri }}
                style={{ width: 100, height: 100, borderRadius: 8 }}
              />
              <View style={{ marginTop: 5 }}>
                <Button title="Eliminar" onPress={() => eliminarImagen(uri)} />
                {/* ✅ FIX */}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const SelectorCategorias = () => {
    const [categoriaSeleccionada, setCategoriaSeleccionada] =
      useState<string>("");
    const [categorias, setCategorias] = useState<
      { id: string; nombre: string; icono?: string }[]
    >([]);

    useEffect(() => {
      const obtenerCategorias = async () => {
        try {
          const res = await fetch(
            `${process.env.EXPO_PUBLIC_HOST}/api/product/getcategory`
          );
          const data = await res.json();
          setCategorias(data);
        } catch (error) {
          console.error("Error al obtener categorías:", error);
        }
      };

      obtenerCategorias();
    }, []);

    return (
      <View style={{ marginVertical: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 10 }}>
          Selecciona una categoría
        </Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {categorias.length > 0 ? (
            categorias.map(({ id, nombre, icono }) => {
              const seleccionada = id === categoriaSeleccionada;
              return (
                <TouchableOpacity
                  key={id}
                  onPress={() => setCategoriaSeleccionada(id)}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    borderRadius: 6,
                    backgroundColor: seleccionada ? "#003366" : "#E0E0E0",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    minWidth: 100,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      flex: 1,
                    }}
                  >
                    {/* {icono && (
                      <Image
                        source={{ uri: icono }}
                        style={{ width: 20, height: 20, borderRadius: 4 }}
                      />
                    )} */}
                    <Text
                      style={{
                        color: seleccionada ? "#fff" : "#000",
                        textAlign: "center",
                        flexShrink: 1,
                      }}
                    >
                      {nombre}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <Text style={{ color: "#888" }}>No se encontraron categorías.</Text>
          )}
        </View>
      </View>
    );
  };
  return (
    <ScrollView
      style={{
        padding: 20,
        paddingTop: 40,
        paddingBottom: 40,
        backgroundColor: "#fff",
      }}
    >
      <View style={{ gap: 25, paddingBottom: 40 }}>
        <TouchableOpacity
          style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
          onPress={() => navigation.navigate("sellerDashboard")}
        >
          <View
            style={{
              backgroundColor: "#ECF0F4",
              paddingRight: 15,
              paddingLeft: 15,
              paddingTop: 12,
              paddingBottom: 12,
              borderRadius: 50,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={require("../../assets/images/seller-chevron-back-icon.svg")}
              style={{
                height: 14,
                width: 7,
              }}
            />
          </View>
          <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 16 }}>
            Añadir nuevo artículo
          </Text>
        </TouchableOpacity>

        <View style={{ gap: 16 }}>
          <View style={{ gap: 10 }}>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                textTransform: "uppercase",
              }}
            >
              Nombre del artículo
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#E8EAED",
                padding: 10,
                borderRadius: 5,
              }}
              value={formData.nombre}
              onChangeText={(text) => handleChange("nombre", text)}
              placeholder="Ej. Cachapa rellena"
            />
          </View>

          <View style={{ gap: 16 }}>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                textTransform: "uppercase",
              }}
            >
              Subir una foto
            </Text>
            <AdjuntarFotos />
          </View>

          <View style={{ gap: 16 }}>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                textTransform: "uppercase",
              }}
            >
              Precio
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#E8EAED",
                padding: 10,
                borderRadius: 5,
              }}
              value={String(formData.precio)}
              onChangeText={(text) => handleChange("precio", Number(text) || 0)}
              keyboardType="numeric"
              placeholder="Bs."
            />
          </View>

          <View style={{ gap: 16 }}>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                textTransform: "uppercase",
              }}
            >
              Stock inicial
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#E8EAED",
                padding: 10,
                borderRadius: 5,
              }}
              value={String(formData.stock)}
              onChangeText={(text) => handleChange("stock", Number(text) || 0)}
              keyboardType="numeric"
              placeholder="Ej. 5"
            />
          </View>

          <View style={{ gap: 16 }}>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                textTransform: "uppercase",
              }}
            >
              Tiempo estimado
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#E8EAED",
                padding: 10,
                borderRadius: 5,
              }}
              value={formData.tiempoEstimado}
              onChangeText={(text) => handleChange("tiempoEstimado", text)}
              placeholder="Ej. 20 min"
            />
          </View>
        </View>

        <View style={{ gap: 16 }}>
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              textTransform: "uppercase",
            }}
          >
            Ingredientes
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#E8EAED",
              padding: 10,
              borderRadius: 5,
              height: 100,
            }}
            value={formData.ingredientes}
            onChangeText={(text) => handleChange("ingredientes", text)}
            placeholder="Ej. Hecha con maíz dulce, relleno de queso..."
            multiline
          />
        </View>

        <View style={{ gap: 16 }}>
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              textTransform: "uppercase",
            }}
          >
            Categorías
          </Text>
          <SelectorCategorias />
        </View>

        <View style={{ gap: 16 }}>
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              textTransform: "uppercase",
            }}
          >
            Detalles
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#E8EAED",
              padding: 10,
              borderRadius: 5,
              height: 100,
            }}
            value={formData.detalles}
            onChangeText={(text) => handleChange("detalles", text)}
            placeholder="Ej. Crujiente por fuera, suave por dentro..."
            multiline
          />
        </View>
      </View>
    </ScrollView>
  );
}
