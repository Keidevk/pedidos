import {
  Inter_300Light,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Image } from "expo-image";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function MenuPrincipal() {
  useFonts({
    Inter_600SemiBold,
    Inter_300Light,
    Inter_400Regular,
    Inter_700Bold,
  });

  return (
    <ScrollView
      contentContainerStyle={{
        display: "flex",
        backgroundColor: "#F7F8F9",
        padding: 20,
        gap: 20,
      }}
    >
      <View style={{}}>
        <Text style={{ fontFamily: "Inter_400Regular" }}>
          05 solicitudes en curso
        </Text>
      </View>
      <View style={{ overflow: "hidden", maxHeight: 300 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            borderColor: "#000",
            borderWidth: 1,
            padding: 10,
            borderRadius: 15,
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              alignItems: "center",
              borderRightWidth: 1,
              borderRightColor: "#000",
              padding: 5,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 16,
                color: "#D61355",
              }}
            >
              01
            </Text>
            <Image
              source={require("../../assets/images/delivery-requests-icon.png")}
              style={{
                height: 62,
                width: 58,
              }}
            />
          </View>
          <View style={{ justifyContent: "space-between" }}>
            <View style={{ gap: 5 }}>
              <Text
                style={{ fontFamily: "Inter_400Regular", color: "#D61355" }}
              >
                Orden: #11203
              </Text>
              <Text style={{ fontFamily: "Inter_600SemiBold" }}>
                Cliente: María Pérez
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 1,
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={require("../../assets/images/location-requests-icon.svg")}
                    style={{
                      height: 19,
                      width: 19,
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      color: "#9C9BA6",
                    }}
                  >
                    10 min
                  </Text>
                </View>
                <Text style={{}}>-</Text>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 1,
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={require("../../assets/images/timer-requests-icon.svg")}
                    style={{
                      height: 19,
                      width: 19,
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      color: "#9C9BA6",
                    }}
                  >
                    10 min
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={{
                width: "100%",
                padding: 5,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#FA0E0E",
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  color: "#fff",
                  fontSize: 13,
                }}
              >
                Pendiente
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{}}>
            <Image
              source={require("../../assets/images/points-requests-icon.svg")}
              style={{
                height: 24,
                width: 18,
              }}
            />
          </View>
        </View>
      </View>
      <View style={{ overflow: "hidden", maxHeight: 300 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            borderColor: "#000",
            borderWidth: 1,
            padding: 10,
            justifyContent: "space-between",

            borderRadius: 15,
          }}
        >
          <View
            style={{
              alignItems: "center",
              borderRightWidth: 1,
              borderRightColor: "#000",
              padding: 5,
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 16,
                color: "#D61355",
              }}
            >
              02
            </Text>
            <Image
              source={require("../../assets/images/delivery-requests-icon.png")}
              style={{
                height: 62,
                width: 58,
              }}
            />
          </View>
          <View style={{ justifyContent: "space-between" }}>
            <View style={{ gap: 5 }}>
              <Text
                style={{ fontFamily: "Inter_400Regular", color: "#D61355" }}
              >
                Orden: #11203
              </Text>
              <Text style={{ fontFamily: "Inter_600SemiBold" }}>
                Cliente: María Pérez
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 1,
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={require("../../assets/images/location-requests-icon.svg")}
                    style={{
                      height: 19,
                      width: 19,
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      color: "#9C9BA6",
                    }}
                  >
                    10 min
                  </Text>
                </View>
                <Text style={{}}>-</Text>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 1,
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={require("../../assets/images/timer-requests-icon.svg")}
                    style={{
                      height: 19,
                      width: 19,
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      color: "#9C9BA6",
                    }}
                  >
                    10 min
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                gap: 5,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  borderBottomColor: "#000",
                  borderBottomWidth: 1,
                  fontSize: 13,
                }}
              >
                Repartidor Asignado
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: "Inter_600SemiBold",
                }}
              >
                Jean Luis Gómez
              </Text>
            </View>
          </View>
          <View style={{ justifyContent: "space-between" }}>
            <Image
              source={require("../../assets/images/rectangulo-img.svg")}
              style={{
                height: "50%",
                width: "100%",
                borderRadius: 20,
              }}
            />
            <TouchableOpacity
              style={{
                padding: 10,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#FFDCE1",
              }}
            >
              <Image
                source={require("../../assets/images/chat-requests-icon.svg")}
                style={{
                  height: 19,
                  width: 19,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={{ overflow: "hidden", maxHeight: 300 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            borderColor: "#000",
            borderWidth: 1,
            padding: 10,
            borderRadius: 15,
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              alignItems: "center",
              borderRightWidth: 1,
              borderRightColor: "#000",
              padding: 5,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 16,
                color: "#D61355",
              }}
            >
              03
            </Text>
            <Image
              source={require("../../assets/images/delivery-requests-icon.png")}
              style={{
                height: 62,
                width: 58,
              }}
            />
          </View>
          <View style={{ justifyContent: "space-between" }}>
            <View style={{ gap: 5 }}>
              <Text
                style={{ fontFamily: "Inter_400Regular", color: "#D61355" }}
              >
                Orden: #11203
              </Text>
              <Text style={{ fontFamily: "Inter_600SemiBold" }}>
                Cliente: María Pérez
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 1,
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={require("../../assets/images/location-requests-icon.svg")}
                    style={{
                      height: 19,
                      width: 19,
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      color: "#9C9BA6",
                    }}
                  >
                    10 min
                  </Text>
                </View>
                <Text style={{}}>-</Text>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 1,
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={require("../../assets/images/timer-requests-icon.svg")}
                    style={{
                      height: 19,
                      width: 19,
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      color: "#9C9BA6",
                    }}
                  >
                    10 min
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                gap: 5,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  borderBottomColor: "#000",
                  borderBottomWidth: 1,
                  fontSize: 13,
                }}
              >
                Repartidor Asignado
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: "Inter_600SemiBold",
                }}
              >
                Jean Luis Gómez
              </Text>
            </View>
          </View>
          <View style={{ justifyContent: "space-between" }}>
            <Image
              source={require("../../assets/images/rectangulo-img.svg")}
              style={{
                height: "50%",
                width: "100%",
                borderRadius: 20,
              }}
            />
            <TouchableOpacity
              style={{
                padding: 10,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#FFDCE1",
              }}
            >
              <Image
                source={require("../../assets/images/chat-requests-icon.svg")}
                style={{
                  height: 19,
                  width: 19,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={{ overflow: "hidden", maxHeight: 300 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            borderColor: "#000",
            borderWidth: 1,
            padding: 10,
            borderRadius: 15,
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              alignItems: "center",
              borderRightWidth: 1,
              borderRightColor: "#000",
              padding: 5,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 16,
                color: "#D61355",
              }}
            >
              04
            </Text>
            <Image
              source={require("../../assets/images/delivery-requests-icon.png")}
              style={{
                height: 62,
                width: 58,
              }}
            />
          </View>
          <View style={{ justifyContent: "space-between" }}>
            <View style={{ gap: 5 }}>
              <Text
                style={{ fontFamily: "Inter_400Regular", color: "#D61355" }}
              >
                Orden: #11203
              </Text>
              <Text style={{ fontFamily: "Inter_600SemiBold" }}>
                Cliente: María Pérez
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 1,
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={require("../../assets/images/location-requests-icon.svg")}
                    style={{
                      height: 19,
                      width: 19,
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      color: "#9C9BA6",
                    }}
                  >
                    10 min
                  </Text>
                </View>
                <Text style={{}}>-</Text>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 1,
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={require("../../assets/images/timer-requests-icon.svg")}
                    style={{
                      height: 19,
                      width: 19,
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      color: "#9C9BA6",
                    }}
                  >
                    10 min
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                gap: 5,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  borderBottomColor: "#000",
                  borderBottomWidth: 1,
                  fontSize: 13,
                }}
              >
                Repartidor Asignado
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: "Inter_600SemiBold",
                }}
              >
                Jean Luis Gómez
              </Text>
            </View>
          </View>
          <View style={{ justifyContent: "space-between" }}>
            <Image
              source={require("../../assets/images/rectangulo-img.svg")}
              style={{
                height: "50%",
                width: "100%",
                borderRadius: 20,
              }}
            />
            <TouchableOpacity
              style={{
                padding: 10,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#FFDCE1",
              }}
            >
              <Image
                source={require("../../assets/images/chat-requests-icon.svg")}
                style={{
                  height: 19,
                  width: 19,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
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
