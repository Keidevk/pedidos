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
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useClientsByOrder } from "../hooks/useClientByOrder";
import { usePedidos } from "../hooks/usePedidos";

export default function MenuPrincipal() {
  useFonts({
    Inter_600SemiBold,
    Inter_300Light,
    Inter_400Regular,
    Inter_700Bold,
  });
  const [shopId, setShopId] = useState("0");

  useEffect(() => {
    // getItem("@userId", setShopId);
    setShopId("3");
  }, []);

  const { pedidos, loading, error } = usePedidos(shopId || "");
  const { clientes, loading: loadingClientes } = useClientsByOrder(pedidos);

  console.warn(pedidos, "asdasd");

  return (
    <ScrollView
      contentContainerStyle={{
        display: "flex",
        backgroundColor: "#F7F8F9",
        padding: 20,
        gap: 20,
      }}
    >
      <View style={{ gap: 30 }}>
        <View style={{}}>
          <Text style={{ fontFamily: "Inter_400Regular" }}>
            20 pedidos en curso
          </Text>
        </View>
        {pedidos.map((pedido) => {
          const cliente = clientes[pedido.clienteId];

          return (
            <View style={{ overflow: "hidden" }} key={pedido.id}>
              <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                <View
                  style={{
                    gap: 5,
                    justifyContent: "space-between",
                    flexBasis: "60%",
                  }}
                >
                  {/* <Text style={{ fontSize: 10, color: "gray" }}>
                    {JSON.stringify(clientes, null, 2)}
                  </Text>
                  <Text style={{ fontSize: 10, color: "#E94B64" }}>
                    clienteId: {pedido.clienteId}
                  </Text> */}
                  <View style={{ gap: 5 }}>
                    <Text
                      style={{
                        fontFamily: "Inter_400Regular",
                        color: "#D61355",
                      }}
                    >
                      #Categoría
                    </Text>
                    <Text>
                      {loadingClientes
                        ? "Cargando cliente..."
                        : `${cliente?.nombre ?? "Usuario"} ${
                            cliente?.apellido ?? ""
                          }`}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Inter_400Regular",
                        color: "#9C9BA6",
                      }}
                    >
                      ID: {pedido?.id ?? "404"}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{ fontFamily: "Inter_300Light", fontSize: 16 }}
                    >
                      ${pedido?.total}
                    </Text>
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#E94B64",
                        padding: 10,
                        width: "30%",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 10,
                      }}
                    >
                      <Image
                        source={require("../../assets/images/order-icon.svg")}
                        style={{
                          height: 24,
                          width: 18,
                          tintColor: "#fff",
                        }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        width: 70,
                        borderWidth: 1,
                        padding: 10,
                        borderRadius: 10,
                        alignItems: "center",
                        justifyContent: "center",
                        borderColor: "#D61355",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Inter_400Regular",
                          color: "#D61355",
                          fontSize: 13,
                        }}
                      >
                        Actualizar
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
        {/* {pedidos.map((pedido) => {
          const clienteId = parseInt(pedido.clienteId);
          const { cliente, loading: loadingCliente } = useCliente(clienteId);

          return (
            <View style={{ overflow: "hidden" }} key={pedido.id}>
              <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                <View
                  style={{
                    gap: 5,
                    justifyContent: "space-between",
                    flexBasis: "60%",
                  }}
                >
                  <View style={{ gap: 5 }}>
                    <Text
                      style={{
                        fontFamily: "Inter_400Regular",
                        color: "#D61355",
                      }}
                    >
                      #Categoría
                    </Text>
                    <Text style={{ fontFamily: "Inter_700Bold" }}>
                      {loadingCliente
                        ? "Cargando..."
                        : `${cliente?.nombre ?? "Usuario"} ${
                            cliente?.apellido ?? ""
                          }`}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Inter_400Regular",
                        color: "#9C9BA6",
                      }}
                    >
                      ID: {pedido?.id ?? "404"}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{ fontFamily: "Inter_300Light", fontSize: 16 }}
                    >
                      ${pedido?.total}
                    </Text>
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#E94B64",
                        padding: 10,
                        width: "30%",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 10,
                      }}
                    >
                      <Image
                        source={require("../../assets/images/order-icon.svg")}
                        style={{
                          height: 24,
                          width: 18,
                          tintColor: "#fff",
                        }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        width: 70,
                        borderWidth: 1,
                        padding: 10,
                        borderRadius: 10,
                        alignItems: "center",
                        justifyContent: "center",
                        borderColor: "#D61355",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Inter_400Regular",
                          color: "#D61355",
                          fontSize: 13,
                        }}
                      >
                        Actualizar
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          );
        })} */}

        {/* <View style={{ overflow: "hidden" }}>
          <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
            <Image
              source={require("../../assets/images/rectangulo-img.svg")}
              style={{
                height: 100,
                width: 100,
                borderRadius: 20,
              }}
            />
            <View
              style={{
                gap: 5,
                justifyContent: "space-between",
                flexBasis: "60%",
              }}
            >
              <View
                style={{
                  gap: 5,
                }}
              >
                <Text
                  style={{ fontFamily: "Inter_400Regular", color: "#D61355" }}
                >
                  #Categoría
                </Text>
                <Text style={{ fontFamily: "Inter_700Bold" }}>
                  Nombre del Cliente
                </Text>
                <Text
                  style={{ fontFamily: "Inter_400Regular", color: "#9C9BA6" }}
                >
                  ID: 32053
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontFamily: "Inter_300Light", fontSize: 16 }}>
                  $60
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#E94B64",
                    padding: 10,
                    width: "30%",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 10,
                  }}
                >
                  <Image
                    source={require("../../assets/images/cart-check-order-icon.png")}
                    style={{
                      height: 26,
                      width: 26,
                      tintColor: "#fff",
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: 70,
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    borderColor: "#D61355",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      color: "#D61355",
                      fontSize: 13,
                    }}
                  >
                    Actualizar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View style={{ overflow: "hidden" }}>
          <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
            <Image
              source={require("../../assets/images/rectangulo-img.svg")}
              style={{
                height: 100,
                width: 100,
                borderRadius: 20,
              }}
            />
            <View
              style={{
                gap: 5,
                justifyContent: "space-between",
                flexBasis: "60%",
              }}
            >
              <View
                style={{
                  gap: 5,
                }}
              >
                <Text
                  style={{ fontFamily: "Inter_400Regular", color: "#D61355" }}
                >
                  #Categoría
                </Text>
                <Text style={{ fontFamily: "Inter_700Bold" }}>
                  Nombre del Cliente
                </Text>
                <Text
                  style={{ fontFamily: "Inter_400Regular", color: "#9C9BA6" }}
                >
                  ID: 32053
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontFamily: "Inter_300Light", fontSize: 16 }}>
                  $60
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#E94B64",
                    padding: 10,
                    width: "30%",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 10,
                  }}
                >
                  <Image
                    source={require("../../assets/images/delivery-requests-white-icon.png")}
                    style={{
                      height: 23,
                      width: 23,
                      tintColor: "#fff",
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: 70,
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    borderColor: "#D61355",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      color: "#D61355",
                      fontSize: 13,
                    }}
                  >
                    Actualizar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View style={{ overflow: "hidden" }}>
          <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
            <Image
              source={require("../../assets/images/rectangulo-img.svg")}
              style={{
                height: 100,
                width: 100,
                borderRadius: 20,
              }}
            />
            <View
              style={{
                gap: 5,
                justifyContent: "space-between",
                flexBasis: "60%",
              }}
            >
              <View
                style={{
                  gap: 5,
                }}
              >
                <Text
                  style={{ fontFamily: "Inter_400Regular", color: "#D61355" }}
                >
                  #Categoría
                </Text>
                <Text style={{ fontFamily: "Inter_700Bold" }}>
                  Nombre del Cliente
                </Text>
                <Text
                  style={{ fontFamily: "Inter_400Regular", color: "#9C9BA6" }}
                >
                  ID: 32053
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontFamily: "Inter_300Light", fontSize: 16 }}>
                  $60
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#E94B64",
                    padding: 10,
                    width: "30%",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 10,
                  }}
                >
                  <Image
                    source={require("../../assets/images/order-icon.svg")}
                    style={{
                      height: 24,
                      width: 18,
                      tintColor: "#fff",
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: 70,
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    borderColor: "#D61355",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      color: "#D61355",
                      fontSize: 13,
                    }}
                  >
                    Actualizar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View style={{ overflow: "hidden" }}>
          <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
            <Image
              source={require("../../assets/images/rectangulo-img.svg")}
              style={{
                height: 100,
                width: 100,
                borderRadius: 20,
              }}
            />
            <View
              style={{
                gap: 5,
                justifyContent: "space-between",
                flexBasis: "60%",
              }}
            >
              <View
                style={{
                  gap: 5,
                }}
              >
                <Text
                  style={{ fontFamily: "Inter_400Regular", color: "#D61355" }}
                >
                  #Categoría
                </Text>
                <Text style={{ fontFamily: "Inter_700Bold" }}>
                  Nombre del Cliente
                </Text>
                <Text
                  style={{ fontFamily: "Inter_400Regular", color: "#9C9BA6" }}
                >
                  ID: 32053
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontFamily: "Inter_300Light", fontSize: 16 }}>
                  $60
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#E94B64",
                    padding: 10,
                    width: "30%",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 10,
                  }}
                >
                  <Image
                    source={require("../../assets/images/order-icon.svg")}
                    style={{
                      height: 24,
                      width: 18,
                      tintColor: "#fff",
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: 70,
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    borderColor: "#D61355",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      color: "#D61355",
                      fontSize: 13,
                    }}
                  >
                    Actualizar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View> */}
      </View>
    </ScrollView>
  );
}
const style = StyleSheet.create({
  subtitle: {
    flexDirection: "row",
    marginLeft: 15,
    marginTop: 10,
    marginBottom: 5,
  },
  chevron: {
    height: 16,
    width: 16,
    marginLeft: 5,
    margin: "auto",
  },
  button_etiqueta: {
    borderColor: "#E6E6E6",
    borderWidth: 1,
    marginVertical: 10,
    marginRight: 5,
    padding: 5,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  image_etiqueta: {
    height: 16,
    width: 16,
    marginRight: 5,
  },
  text_etiqueta: {
    fontFamily: "Inter_600SemiBold",
  },
  container_input: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "4%",
    paddingVertical: 3,
    width: "90%",
    backgroundColor: "#ddd",
    borderRadius: 10,
  },
  image_input: {
    height: 32,
    width: 32,
    marginLeft: 10,
  },
  text_input: {
    marginLeft: 10,
    fontSize: 16,
    width: "75%",
  },
  promo: {
    height: 160,
    backgroundColor: "#444",
  },
  shops: {
    height: 100,
    marginLeft: 5,
    borderRadius: 15,
    backgroundColor: "#E94B64",
    flexDirection: "row",
    alignItems: "center",
  },
});
