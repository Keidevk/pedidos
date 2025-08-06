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
  Modal,
  Platform,
  Pressable,
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

  // fuera del componente:
  const vehiculoOptions = [
    { label: "Moto", value: "moto" },
    { label: "Bicicleta", value: "bicicleta" },
    { label: "Automóvil", value: "automovil" },
  ];

  const [data, setData] = useState<Repartidor | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(true);
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

    console.log(
      "🆔 Enviando a:",
      `${process.env.EXPO_PUBLIC_HOST}/api/delivery/update/${userId}`
    );

    const jsonPayload = {
      tipoVehiculo: vehiculoEditable.tipoVehiculo,
      licencia: vehiculoEditable.licencia,
      descripcion: vehiculoEditable.descripcion ?? "",
    };

    fetch(`${process.env.EXPO_PUBLIC_HOST}/api/delivery/update/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonPayload),
    }).then(async (res) => {
      const text = await res.text();
      console.log("🔍 Raw backend response:", text);

      try {
        const response = JSON.parse(text);
        console.log("🧩 Parsed:", response);

        if (response.code === 200 || response.status === "success") {
          alert("✅ Perfil actualizado correctamente");
          setData(response.data);
          setEditandoVehiculo(false);
        } else {
          alert("❌ Error al actualizar el perfil");
        }
      } catch (error) {
        console.error("💥 Error al parsear respuesta:", error);
        alert("❌ Respuesta inválida del servidor");
      }
    });

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
          <ScrollView
            style={{
              borderWidth: 1,
              borderColor: "#E0E0E0",
              borderRadius: 10,
              padding: 15,
              width: "100%",
              gap: 15,
            }}
            contentContainerStyle={{
              alignItems: "center",
              justifyContent: "center",
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
          </ScrollView>
        </View>
        <View style={{ width: "100%", gap: 10 }}>
          <Text style={{ textTransform: "uppercase" }}>
            Información del vehículo
          </Text>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView
              style={{
                borderWidth: 1,
                borderColor: "#E0E0E0",
                borderRadius: 10,
                padding: 15,
                width: "100%",
                gap: 15,
              }}
              contentContainerStyle={{
                alignItems: "center",
                justifyContent: "center",
                gap: 15,
                paddingBottom: 160,
              }}
              keyboardShouldPersistTaps="handled"
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
                {editandoVehiculo ? (
                  <>
                    <Pressable
                      onPress={() => setShowModal(true)}
                      style={{
                        padding: 10,
                        borderWidth: 1,
                        borderColor: "#E0E0E0",
                        borderRadius: 8,
                        width: 120,
                        backgroundColor: "#F7F7F7",
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          textTransform: "uppercase",
                        }}
                      >
                        {vehiculoEditable?.tipoVehiculo
                          ? vehiculoEditable.tipoVehiculo.toUpperCase()
                          : "NO REGISTRADO"}
                      </Text>
                    </Pressable>

                    <Modal transparent visible={showModal} animationType="fade">
                      <View
                        style={{
                          flex: 1,
                          backgroundColor: "#00000055",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: "#fff",
                            width: 250,
                            borderRadius: 10,
                            padding: 20,
                            gap: 10,
                          }}
                        >
                          {vehiculoOptions.map((opt) => (
                            <Pressable
                              key={opt.value}
                              onPress={() => {
                                if (vehiculoEditable) {
                                  setVehiculoEditable({
                                    ...vehiculoEditable,
                                    tipoVehiculo: opt.value,
                                  });
                                }
                                setShowModal(false);
                              }}
                              style={{
                                backgroundColor: "#EFEFEF",
                                padding: 10,
                                borderRadius: 6,
                              }}
                            >
                              <Text style={{ textAlign: "center" }}>
                                {opt.label}
                              </Text>
                            </Pressable>
                          ))}
                        </View>
                      </View>
                    </Modal>
                  </>
                ) : (
                  <Text
                    style={{
                      textTransform: "uppercase",
                      width: 120,
                      textAlign: "center",
                    }}
                  >
                    {vehiculoEditable?.tipoVehiculo
                      ? vehiculoEditable.tipoVehiculo.toUpperCase()
                      : "NO REGISTRADO"}
                  </Text>
                )}
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
                    editandoVehiculo
                      ? vehiculoEditable?.licencia ?? ""
                      : vehiculoEditable?.licencia === ""
                      ? "NO REGISTRADO"
                      : vehiculoEditable?.licencia.toUpperCase()
                  }
                  onChangeText={(text) =>
                    setVehiculoEditable(
                      (prev) =>
                        prev && { ...prev, licencia: text?.toUpperCase() ?? "" }
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
                    editandoVehiculo
                      ? vehiculoEditable?.descripcion ?? ""
                      : vehiculoEditable?.descripcion === ""
                      ? "NO REGISTRADO"
                      : vehiculoEditable?.descripcion.toUpperCase()
                  }
                  onChangeText={(text) =>
                    setVehiculoEditable(
                      (prev) =>
                        prev && {
                          ...prev,
                          descripcion: text?.toUpperCase() ?? "",
                        }
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
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
        <TouchableOpacity
          onPress={() => router.push({ pathname: "/" })}
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
