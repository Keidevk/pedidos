import {
  Inter_300Light,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getItem } from "../utils";

type Vehiculo = {
  tipoVehiculo: string;
  descripcion: string;
  rating: string;
  disponibilidad: boolean;
  licencia: string;
};

type Repartidor = {
  nombre: string;
  apellido: string;
  telefono: string;
  direccion: string;
  fotoPerfil: string;
  vehiculo: Vehiculo;
  documento_identidad: string;
};

export default function Home() {
  useFonts({
    Inter_600SemiBold,
    Inter_300Light,
    Inter_400Regular,
    Inter_700Bold,
  });
  const insets = useSafeAreaInsets();
  const [userId, setUserId] = useState<string>();

  const [data, setData] = useState<Repartidor | null>(null);
  const [loading, setLoading] = useState(true);
  const [vehiculoEditable, setVehiculoEditable] = useState<Vehiculo | null>(
    null
  );
  const [editandoVehiculo, setEditandoVehiculo] = useState(false);

  useEffect(() => {
    getItem("@userId", (id) => {
      if (!id) {
        console.warn("⚠️ No hay ID de usuario");
        return;
      }
      setUserId(id);

      const url = `${process.env.EXPO_PUBLIC_HOST}/api/delivery/${id}`;
      console.log("🔎 Haciendo fetch a:", url);

      fetch(url)
        .then(async (res) => {
          const texto = await res.text();
          console.log("📦 Raw response:", texto);
          try {
            const json = JSON.parse(texto);
            console.log("✅ JSON parseado:", json);
            if (json.code === 200) {
              setData(json.data);
              setVehiculoEditable(json.data.vehiculo);
            } else console.warn("❌ Error de código:", json);
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

  if (loading) {
    return (
      <View style={{ padding: 30 }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={{ padding: 30 }}>
        <Text>No se pudo cargar el perfil.</Text>
      </View>
    );
  }

  const handleSubmit = () => {
    if (!vehiculoEditable) {
      alert("❌ No hay datos para guardar");
      return;
    }

    const jsonPayload = {
      tipoVehiculo: vehiculoEditable.tipoVehiculo,
      licencia: vehiculoEditable.licencia,
      descripcion: vehiculoEditable.descripcion,
      rating: vehiculoEditable.rating,
      disponibilidad: vehiculoEditable.disponibilidad,
    };

    console.log("📦 JSON para enviar:", JSON.stringify(jsonPayload));
    setEditandoVehiculo(!editandoVehiculo);
  };

  return (
    <ScrollView
      style={{
        padding: 20,
        paddingTop: 30,
        paddingBottom: 40,
        backgroundColor: "#fff",
      }}
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
          //   onPress={() => navigation.navigate("sellerDashboard")}
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
            Perfil
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
            onPress={() => setEditandoVehiculo(!editandoVehiculo)}
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
          >{`ID Repartidor: ${userId}`}</Text>
        </View>

        <View style={{ width: "100%", gap: 10 }}>
          <Text style={{ textTransform: "uppercase" }}>
            Información personal
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
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "#EEEEEE",
                  padding: 10,
                  borderRadius: 30,
                  width: 32,
                  height: 32,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={require("../../assets/images/delivery-profile-papers-icon.svg")}
                  style={{
                    height: 21,
                    width: 18,
                  }}
                />
              </View>
              <Text
                style={{
                  textTransform: "uppercase",
                  color: "#3B3B3B",
                  fontFamily: "Inter_300Light",
                  width: 100,
                }}
              >
                Nombre
              </Text>
              <Text style={{ textTransform: "uppercase", width: 100 }}>
                {`${data.nombre} ${data.apellido}`}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "#EEEEEE",
                  padding: 10,
                  width: 32,
                  height: 32,
                  borderRadius: 30,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={require("../../assets/images/delivery-profile-cedula-icon.svg")}
                  style={{
                    height: 14,
                    width: 21,
                  }}
                />
              </View>
              <Text
                style={{
                  textTransform: "uppercase",
                  color: "#3B3B3B",
                  fontFamily: "Inter_300Light",
                  width: 100,
                }}
              >
                Cédula
              </Text>
              <Text style={{ textTransform: "uppercase", width: 100 }}>
                {`${data.documento_identidad}`}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "#EEEEEE",
                  padding: 10,
                  borderRadius: 30,
                  alignItems: "center",
                  width: 32,
                  height: 32,
                  justifyContent: "center",
                }}
              >
                <Image
                  source={require("../../assets/images/delivery-profile-phone-icon.svg")}
                  style={{
                    height: 17,
                    width: 19,
                  }}
                />
              </View>
              <Text
                style={{
                  textTransform: "uppercase",
                  color: "#3B3B3B",
                  width: 100,
                  fontFamily: "Inter_300Light",
                }}
              >
                Teléfono
              </Text>
              <Text style={{ textTransform: "uppercase", width: 100 }}>
                {`${data.telefono}`}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ width: "100%", gap: 10 }}>
          <Text style={{ textTransform: "uppercase" }}>
            Información del vehículo
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
                  fontFamily: "Inter_300Light",
                  width: 100,
                }}
              >
                Tipo
              </Text>

              <TextInput
                style={{
                  textTransform: "uppercase",
                  width: 100,
                  textAlign: "center",
                }}
                value={
                  vehiculoEditable?.tipoVehiculo === ""
                    ? `NO REGISTRADO`
                    : `${vehiculoEditable?.tipoVehiculo.toLocaleUpperCase()}`
                }
                onChangeText={(text) =>
                  setVehiculoEditable(
                    (prev) => prev && { ...prev, tipoVehiculo: text }
                  )
                }
                editable={editandoVehiculo}
                multiline
              />
            </View>
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
                  fontFamily: "Inter_300Light",
                  width: 100,
                }}
              >
                Placa
              </Text>
              <TextInput
                style={{
                  textTransform: "uppercase",
                  width: 100,
                  textAlign: "center",
                }}
                value={
                  vehiculoEditable?.licencia === ""
                    ? `NO REGISTRADO`
                    : `${vehiculoEditable?.licencia.toLocaleUpperCase()}`
                }
                onChangeText={(text) =>
                  setVehiculoEditable(
                    (prev) => prev && { ...prev, licencia: text }
                  )
                }
                editable={editandoVehiculo}
                multiline
              />
            </View>
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
                  width: 100,
                  fontFamily: "Inter_300Light",
                }}
              >
                Descripción
              </Text>
              <TextInput
                style={{
                  textTransform: "uppercase",
                  width: 100,
                  textAlign: "center",
                }}
                value={
                  vehiculoEditable?.descripcion === ""
                    ? `NO REGISTRADO`
                    : `${vehiculoEditable?.descripcion.toLocaleUpperCase()}`
                }
                onChangeText={(text) =>
                  setVehiculoEditable(
                    (prev) => prev && { ...prev, descripcion: text }
                  )
                }
                editable={editandoVehiculo}
                multiline
              />
            </View>
            <TouchableOpacity
              style={{ width: "100%", alignItems: "center" }}
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
          </View>
        </View>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            width: "100%",
            gap: 10,
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
            Cerrar cuenta
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
