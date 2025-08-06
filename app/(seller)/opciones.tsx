import {
  Inter_300Light,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getItem } from "../utils";

type Tienda = {
  nombre: string;
  descripcion: string;
  ubicacion: string;
  horarioApertura: string;
  horarioCierre: string;
  tiempoEntregaPromedio: number;
  fotoPerfil?: string;
};

export default function ShopProfile() {
  useFonts({
    Inter_600SemiBold,
    Inter_300Light,
    Inter_400Regular,
    Inter_700Bold,
  });

  const insets = useSafeAreaInsets();
  const [shopId, setShopId] = useState<string>();
  const [data, setData] = useState<Tienda | null>(null);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);
  const [tiendaEditable, setTiendaEditable] = useState<Tienda | null>(null);

  const cargarPerfilTienda = (id: string) => {
    const url = `${process.env.EXPO_PUBLIC_HOST}/api/shop/userid/${id}`;
    console.log("🔄 Refetch tienda desde:", url);

    fetch(url)
      .then(async (res) => {
        const texto = await res.text();
        try {
          const json = JSON.parse(texto);
          if (json) {
            setData(json);
            setTiendaEditable(json);
          }
        } catch (error) {
          console.error("💥 Error al parsear JSON:", error);
        }
      })
      .catch((err) => console.error("⛔ Error en refetch:", err));
  };

  useEffect(() => {
    getItem("@userId", (id) => {
      if (!id) {
        console.warn("⚠️ No hay ID de tienda");
        return;
      }
      setShopId(id);
      console.log(id);

      const url = `${process.env.EXPO_PUBLIC_HOST}/api/shop/userid/${id}`;
      console.log("🔎 Haciendo fetch a:", url);

      fetch(url)
        .then(async (res) => {
          const texto = await res.text();
          console.log("📦 Raw response:", texto);

          try {
            const json = JSON.parse(texto);
            console.log("✅ JSON parseado:", json);
            setData(json);
            setTiendaEditable(json);
          } catch (error) {
            console.error("💥 Error al parsear JSON:", error);
          }
        })
        .catch((err) => {
          console.error("⛔ Error en fetch:", err);
        })
        .finally(() => setLoading(false));
    });
  }, []);

  const handleSubmit = () => {
    if (!tiendaEditable || !shopId) {
      alert("❌ No hay datos para guardar");
      return;
    }

    const jsonPayload = {
      nombre: tiendaEditable.nombre,
      descripcion: tiendaEditable.descripcion,
      ubicacion: tiendaEditable.ubicacion,
      horarioApertura: tiendaEditable.horarioApertura,
      horarioCierre: tiendaEditable.horarioCierre,
      tiempoEntregaPromedio: tiendaEditable.tiempoEntregaPromedio,
    };

    console.log("📤 JSON enviado:", JSON.stringify(jsonPayload));

    fetch(`${process.env.EXPO_PUBLIC_HOST}/api/shop/update/${shopId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jsonPayload),
    })
      .then(async (res) => {
        const response = await res.json();
        if (response.code === 200) {
          alert("✅ Perfil actualizado correctamente");
          cargarPerfilTienda(shopId); // 👈 Refetch desde backend
          setEditando(false);
        } else {
          alert("❌ Error al actualizar el perfil");
        }
      })
      .catch((err) => {
        console.error("⛔ Error al actualizar:", err);
        alert("⛔ Error al conectar con el servidor");
      });
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No se pudo cargar el perfil de la tienda.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingTop: 30,
          paddingBottom: 40,
          backgroundColor: "#fff",
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            gap: 25,
            paddingBottom: 20,
            borderBottomColor: "#4A55684D",
            borderBottomWidth: 1,
          }}
        >
          <TouchableOpacity
            style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
            onPress={() => router.back()}
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
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 16,
                textAlign: "center",
              }}
            >
              Perfil de Tienda
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            padding: 20,
            justifyContent: "center",
            alignItems: "center",
            gap: 20,
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 100,
              borderWidth: 30,
              width: 100,
              height: 100,
              borderColor: "#FFF0F0",
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#D61355",
                padding: 10,
                borderRadius: 30,
                position: "absolute",
                zIndex: 2,
                top: 40,
                left: 30,
                borderColor: "#FFF",
                borderWidth: 2,
              }}
              onPress={() => setEditando(!editando)}
            >
              <Image
                source={require("../../assets/images/delivery-pencil-icon.svg")}
                style={{
                  height: 15,
                  width: 15,
                }}
              />
            </TouchableOpacity>
            {data?.fotoPerfil && data.fotoPerfil.trim() ? (
              <Image
                source={{ uri: data.fotoPerfil }}
                style={{
                  height: 80,
                  width: 80,
                  borderRadius: 40,
                }}
              />
            ) : (
              <View
                style={{
                  height: 80,
                  width: 80,
                  borderRadius: 40,
                  backgroundColor: "#ECF0F4",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={require("../../assets/images/delivery-profile-notfound.svg")}
                  style={{
                    width: 80,
                    height: 80,
                  }}
                />
              </View>
            )}
          </View>
          <View
            style={{
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{ fontFamily: "Inter_600SemiBold" }}
            >{`ID Tienda: ${shopId}`}</Text>
          </View>

          <View style={{ width: "115%", gap: 10 }}>
            <Text
              style={{
                textTransform: "uppercase",
                fontFamily: "Inter_700Bold",
                textAlign: "center",
              }}
            >
              Información de la tienda
            </Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: "#E0E0E0",
                borderRadius: 10,
                padding: 15,
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                gap: 15,
              }}
            >
              {/* Nombre */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    textTransform: "uppercase",
                    color: "#3B3B3B",
                    fontFamily: "Inter_600SemiBold",
                    width: 100,
                  }}
                >
                  Nombre
                </Text>
                <TextInput
                  style={{
                    width: 200,
                    fontFamily: editando
                      ? "Inter_400Regular"
                      : "Inter_300Light",
                    padding: 8,
                    // borderWidth: editando ? 1 : 0,
                    // borderColor: editando ? "#E0E0E0" : "transparent",
                    borderRadius: 5,
                  }}
                  value={tiendaEditable?.nombre || ""}
                  onChangeText={(text) =>
                    setTiendaEditable(
                      (prev) => prev && { ...prev, nombre: text }
                    )
                  }
                  editable={editando}
                />
              </View>

              {/* Descripción */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                  alignItems: "flex-start",
                }}
              >
                <Text
                  style={{
                    textTransform: "uppercase",
                    color: "#3B3B3B",
                    fontFamily: "Inter_600SemiBold",
                    width: 100,
                  }}
                >
                  Descripción
                </Text>
                <TextInput
                  style={{
                    width: 200,
                    fontFamily: editando
                      ? "Inter_400Regular"
                      : "Inter_300Light",
                    padding: 8,
                    // borderWidth: editando ? 1 : 0,
                    // borderColor: editando ? "#E0E0E0" : "transparent",
                    borderRadius: 5,
                    minHeight: 80,
                    textAlignVertical: "top",
                  }}
                  value={tiendaEditable?.descripcion || ""}
                  onChangeText={(text) =>
                    setTiendaEditable(
                      (prev) => prev && { ...prev, descripcion: text }
                    )
                  }
                  editable={editando}
                  multiline
                />
              </View>

              {/* Ubicación */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    textTransform: "uppercase",
                    color: "#3B3B3B",
                    fontFamily: "Inter_600SemiBold",
                    width: 100,
                  }}
                >
                  Ubicación
                </Text>
                <TextInput
                  style={{
                    width: 200,
                    fontFamily: editando
                      ? "Inter_400Regular"
                      : "Inter_300Light",
                    padding: 8,
                    // borderWidth: editando ? 1 : 0,
                    // borderColor: editando ? "#E0E0E0" : "transparent",
                    borderRadius: 5,
                  }}
                  value={tiendaEditable?.ubicacion || ""}
                  onChangeText={(text) =>
                    setTiendaEditable(
                      (prev) => prev && { ...prev, ubicacion: text }
                    )
                  }
                  editable={editando}
                />
              </View>

              {/* Horario Apertura */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    textTransform: "uppercase",
                    color: "#3B3B3B",
                    fontFamily: "Inter_600SemiBold",
                    width: 100,
                  }}
                >
                  Apertura
                </Text>
                <TextInput
                  style={{
                    width: 200,
                    fontFamily: editando
                      ? "Inter_400Regular"
                      : "Inter_300Light",
                    padding: 8,
                    // borderWidth: editando ? 1 : 0,
                    // borderColor: editando ? "#E0E0E0" : "transparent",
                    borderRadius: 5,
                  }}
                  value={tiendaEditable?.horarioApertura || ""}
                  onChangeText={(text) =>
                    setTiendaEditable(
                      (prev) => prev && { ...prev, horarioApertura: text }
                    )
                  }
                  editable={editando}
                  placeholder="HH:MM"
                />
              </View>

              {/* Horario Cierre */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    textTransform: "uppercase",
                    color: "#3B3B3B",
                    fontFamily: "Inter_600SemiBold",
                    width: 100,
                  }}
                >
                  Cierre
                </Text>
                <TextInput
                  style={{
                    width: 200,
                    fontFamily: editando
                      ? "Inter_400Regular"
                      : "Inter_300Light",
                    padding: 8,
                    // borderWidth: editando ? 1 : 0,
                    // borderColor: editando ? "#E0E0E0" : "transparent",
                    borderRadius: 5,
                  }}
                  value={tiendaEditable?.horarioCierre || ""}
                  onChangeText={(text) =>
                    setTiendaEditable(
                      (prev) => prev && { ...prev, horarioCierre: text }
                    )
                  }
                  editable={editando}
                  placeholder="HH:MM"
                />
              </View>

              {/* Tiempo Entrega Promedio */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    textTransform: "uppercase",
                    color: "#3B3B3B",
                    fontFamily: "Inter_600SemiBold",
                    width: 100,
                  }}
                >
                  Tiempo Entrega (min)
                </Text>
                <TextInput
                  style={{
                    width: 200,
                    fontFamily: editando
                      ? "Inter_400Regular"
                      : "Inter_300Light",
                    padding: 8,
                    // borderWidth: editando ? 1 : 0,
                    // borderColor: editando ? "#E0E0E0" : "transparent",
                    borderRadius: 5,
                  }}
                  value={
                    tiendaEditable?.tiempoEntregaPromedio?.toString() || ""
                  }
                  onChangeText={(text) =>
                    setTiendaEditable(
                      (prev) =>
                        prev && {
                          ...prev,
                          tiempoEntregaPromedio: parseInt(text) || 0,
                        }
                    )
                  }
                  editable={editando}
                  keyboardType="numeric"
                />
              </View>

              {editando && (
                <TouchableOpacity
                  style={{ width: "100%", alignItems: "center", marginTop: 20 }}
                  onPress={handleSubmit}
                >
                  <View
                    style={{
                      width: 120,
                      padding: 10,
                      borderRadius: 30,
                      backgroundColor: "#EB6278",
                    }}
                  >
                    <Text
                      style={{
                        textTransform: "uppercase",
                        color: "#fff",
                        fontFamily: "Inter_700Bold",
                        textAlign: "center",
                      }}
                    >
                      Guardar
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <TouchableOpacity
            onPress={() => router.push({ pathname: "/" })}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              width: "100%",
              gap: 10,
              marginTop: 20,
            }}
          >
            <View
              style={{
                padding: 10,
                backgroundColor: "#EEEEEE",
                borderRadius: 30,
                width: 32,
                height: 32,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={require("../../assets/images/delivery-profile-logout-icon.svg")}
                style={{
                  height: 19,
                  width: 19,
                }}
              />
            </View>
            <Text
              style={{
                color: "#FF627B",
                fontFamily: "Inter_700Bold",
                fontSize: 16,
              }}
            >
              Cerrar sesión
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
