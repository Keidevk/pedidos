import {
  Inter_300Light,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import * as FileSystem from "expo-file-system";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";

import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getItem } from "../utils";

export type RootStackParamList = {
  sellerDashboard: undefined;
};

type ProductoFormData = {
  nombre: string;
  // detalles: string;
  descripcion: string;
  precio: number;
  stock: number;
  tiempoEstimado: string;
};

type Categoria = {
  id: string;
  nombre: string;
  icono?: string;
};

export default function MenuPrincipal() {
  useFonts({
    Inter_600SemiBold,
    Inter_300Light,
    Inter_400Regular,
    Inter_700Bold,
  });
  const [userId, setUserId] = useState("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [imagenes, setImagenes] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [formData, setFormData] = useState<ProductoFormData>({
    nombre: "",
    // detalles: "",
    precio: 0,
    stock: 0,
    descripcion: "",
    tiempoEstimado: "",
  });

  async function handleCreateProduct() {
    getItem("@userId", setUserId);

    const NewformData = new FormData();
    NewformData.append("nombre", formData.nombre);
    NewformData.append("descripcion", formData.descripcion);
    NewformData.append("precio", formData.precio.toString());
    NewformData.append("stock_actual", formData.stock.toString());
    NewformData.append("stock_minimo", "5");
    NewformData.append("tiendaId", userId);
    NewformData.append("categoriaId", categoriaSeleccionada);

    for (let i = 0; i < imagenes.length; i++) {
      const imagen = imagenes[i];
      const fileUri = imagen.uri;
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      const fileBlob = {
        uri: fileInfo.uri,
        name: `imagen-${i}.png`,
        type: "image/png",
      };
      NewformData.append("file", fileBlob as any);
    }

    fetch(`${process.env.EXPO_PUBLIC_HOST}/api/product/register`, {
      method: "POST",
      body: NewformData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.code === 200 || data?.status === "success") {
          console.log("✅ Producto creado:", data);
          Alert.alert(
            "Producto añadido",
            "Tu producto fue registrado exitosamente."
          );
          router.replace("/(seller)/sellerDashboardProducts"); // ⬅️ Refetch forzado
        } else {
          console.warn("❌ Respuesta inesperada:", data);
          Alert.alert(
            "Error al registrar",
            "La respuesta del servidor no fue válida."
          );
        }
      })
      .catch((err) => {
        console.error("⛔ Error de red al crear producto:", err);
        Alert.alert(
          "Conexión fallida",
          "No se pudo contactar con el servidor."
        );
      });
  }

  // const CATEGORIAS = [
  //   "Desayunos",
  //   "Almuerzos",
  //   "Cenas",
  //   "Bebidas",
  //   "Postres",
  //   "Snacks",
  // ];

  const handleChange = <T extends keyof ProductoFormData>(
    key: T,
    value: ProductoFormData[T]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const AdjuntarFotos = () => {
    const seleccionarImagenes = async () => {
      if (imagenes.length >= 1) {
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
        const nuevasUris = resultado.assets.map((asset) => asset);
        const imagenesReales = resultado.assets.map((item) => item);
        const total = imagenes.length + nuevasUris.length;

        const permitidas =
          total > 5 ? nuevasUris.slice(0, 5 - imagenes.length) : nuevasUris;

        if (total > 5) {
          Alert.alert(
            "Demasiadas imágenes",
            `Solo puedes agregar ${5 - imagenes.length} más.`
          );
        }
        console.log(imagenesReales);
        setImagenes((prev) => [...prev, ...permitidas]);
      }
    };

    const eliminarImagen = (uri: string) => {
      setImagenes((prev) => prev.filter((img) => img.uri !== uri));
    };

    return (
      <View style={{ flex: 1, flexDirection: "row" }}>
        <TouchableOpacity
          style={{
            borderStyle: "dashed",
            borderColor: "#E8EAED",
            borderWidth: 1,
            height: 100,
            width: 100,
          }}
          onPress={seleccionarImagenes}
        >
          <View style={{ margin: "auto" }}>
            <Image
              source={require("../../assets/images/uploadimage.svg")}
              style={{ width: 42, height: 42 }}
            />
            <Text style={{ color: "#9C9BA6" }}>Añadir</Text>
          </View>
        </TouchableOpacity>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {imagenes.map((item, index) => (
            <View key={index} style={{ marginHorizontal: 5 }}>
              <Image
                source={{ uri: item.uri }}
                style={{ width: 100, height: 100, borderRadius: 8 }}
              />
              <View>
                <TouchableOpacity
                  style={{
                    position: "relative",
                    top: -71,
                    right: -25,
                    zIndex: 100,
                  }}
                  onPress={() => eliminarImagen(item.uri)}
                >
                  <Image
                    source={require("../../assets/images/delete-32-regular.svg")}
                    style={{ height: 42, width: 42 }}
                  />
                </TouchableOpacity>
                {/* ✅ FIX */}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const SelectorCategorias = () => {
    useEffect(() => {
      if (categorias.length > 0) return; // ⚠️ Ya se tienen los datos, no volver a pedir

      const obtenerCategorias = async () => {
        try {
          const res = await fetch(
            `${process.env.EXPO_PUBLIC_HOST}/api/product/getcategory`
          );
          const data = await res.json();
          setCategorias(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error("Error al obtener categorías:", error);
        }
      };

      obtenerCategorias();
    }, []);

    return (
      <View style={{ marginVertical: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 5 }}>
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
                    borderWidth: 1,
                    borderColor: seleccionada ? "#D61355" : "#E6E6E6",
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
                        color: seleccionada ? "#D61355" : "#1A1A1A",
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
          onPress={() => router.replace("/(seller)/sellerDashboardProducts")}
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
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ width: 70, gap: 30 }}>
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
                onChangeText={(text) =>
                  handleChange("precio", Number(text) || 0)
                }
                keyboardType="numeric"
                placeholder="Bs."
              />
            </View>

            <View style={{ width: 70, gap: 16 }}>
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
                onChangeText={(text) =>
                  handleChange("stock", Number(text) || 0)
                }
                keyboardType="numeric"
                placeholder="Ej. 5"
              />
            </View>

            <View style={{ width: 80, gap: 16 }}>
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
        </View>
        <View style={{ gap: 16 }}>
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              textTransform: "uppercase",
            }}
          >
            Descripción
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#E8EAED",
              padding: 10,
              borderRadius: 5,
              height: 100,
            }}
            value={formData.descripcion}
            onChangeText={(text) => handleChange("descripcion", text)}
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

        <TouchableOpacity
          onPress={handleCreateProduct}
          style={{
            backgroundColor: "#E94B64",
            paddingVertical: 10,
            borderRadius: 10,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Inter_600SemiBold",
              color: "white",
              textAlign: "center",
            }}
          >
            Añadir Al Catálago
          </Text>
        </TouchableOpacity>

        {/* <View style={{ gap: 16 }}>
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
        </View> */}
      </View>
    </ScrollView>
  );
}
