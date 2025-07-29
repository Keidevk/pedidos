import {
  Inter_300Light,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { NavigationProp } from "@react-navigation/native";
import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";
import RNPickerSelect from "react-native-picker-select";
import { getItem } from "../utils";
import {
  processMonthlyData,
  processWeeklyData,
  processYearlyData,
} from "./utils/dataProcessHelpers";

enum PeriodSells {
  week = "week",
  month = "month",
  year = "year",
}

type TransactionsType = {
  id: number;
  product: string;
  client_name: string;
  amount: number;
  date: Date;
};

type weeklySummary = {
  day_of_week: number;
  total: number;
};

type RootParamList = {
  sellerOrder: undefined; // o con props si los necesita
  sellerRequests: undefined; // o con props si los necesita
  sellerReviews: undefined; // o con props si los necesita
  sellerStats: undefined; // o con props si los necesita
};

type Shop = {
  id: string;
  userId: number;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  horarioApertura: string;
  horarioCierre: string;
  tiempoEntregaPromedio: number;
  costoEnvio: string;
  rating: string;
  fotosTienda: string[]; // si luego agregas imágenes, ajusta el tipo si es necesario
};
type ChartItem = {
  label: string;
  value: number;
  frontColor: string;
  gradientColor: string;
};

// ✅ con tipo seguro

export default function sellerStats() {
  useFonts({
    Inter_600SemiBold,
    Inter_300Light,
    Inter_400Regular,
    Inter_700Bold,
  });

  const [shopId, setShopId] = useState("0");
  const [shop, setShop] = useState<Shop | null>(null);

  const [totalOrders, setTotalOrders] = useState<number | null>(null);

  const navigation = useNavigation<NavigationProp<RootParamList>>();

  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [chartPeriod, setChartPeriod] = useState<PeriodSells>(PeriodSells.week);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getItem("@userId", setShopId);
    const fetchData = async () => {
      setLoading(true);
      try {
        let query = "";

        if (chartPeriod === "week") {
          const { startDate } = getWeekRange(currentDate);
          query = `shopId=${shopId}&period=week&date=${startDate.toISOString()}`;
        } else if (chartPeriod === "month") {
          const { startDate } = getMonthRange(currentDate);
          query = `shopId=${shopId}&period=month&date=${startDate.toISOString()}`;
        } else {
          query = `shopId=${shopId}&period=year&date=${currentDate.toISOString()}`;
        }

        const response = await fetch(
          `${process.env.EXPO_PUBLIC_HOST}/api/stats/getStats?${query}`
        );
        console.log(response);
        const json = await response.json();
        console.log("⚠️ Respuesta cruda:", json); // En Expo Go no lo verás, así que mostralo en pantalla:
        if (!Array.isArray(json)) {
          console.warn("Respuesta inválida para map()", json);
          setChartData([]);
          return;
        }
        const formatted =
          chartPeriod === "week"
            ? processWeeklyData(
                json.map((item) => ({
                  day_of_week: parseInt(item.day_of_week, 10), // <-- asegurar que sea número
                  total: item.total,
                }))
              )
            : chartPeriod === "month"
            ? processMonthlyData(
                json.map((item) => ({
                  day_of_month: item.day ? new Date(item.day).getDate() : 0,
                  total: item.total,
                })),
                currentDate
              )
            : processYearlyData(
                json.map((item) => ({
                  month_of_year: item.month.toString().padStart(2, "0"),
                  total: item.total,
                }))
              );

        setChartData(formatted);
      } catch (err) {
        console.error("Error al consumir stats:", err);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchShop = async () => {
      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_HOST}/api/shop/userid/${shopId}`
        );
        if (!res.ok) throw new Error("Error al traer datos");
        console.warn(`${process.env.EXPO_HOST_URL}/api/shop/userid/${shopId}`);
        const data = await res.json();
        console.warn(data);

        setShop(data);
      } catch (err) {
        console.error("❌ Error al traer tienda", err);
      }
    };
    const fetchOrderStats = async (shopId: number) => {
      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_HOST}/api/stats/orders?shopId=${shopId}`
        );
        if (!res.ok) throw new Error("Error al obtener pedidos");

        const totalOrders = await res.json(); // Esto será un número directamente: 1
        console.log("🧾 Total de pedidos:", totalOrders);
        return totalOrders;
      } catch (err) {
        console.error("❌ Falló el fetch de pedidos:", err);
        return null;
      }
    };

    if (shopId !== "0") {
      fetchData();
      fetchShop();
      fetchOrderStats(Number(shopId)).then((value) => {
        if (typeof value === "number") {
          setTotalOrders(value);
        }
      });
    }
  }, [chartPeriod, currentDate, shopId]);
  const getWeekRange = (currentDate: Date) => {
    const day = currentDate.getDay(); // 0 (Dom) → 6 (Sáb)
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() + diffToMonday);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    return { startDate, endDate };
  };

  const getMonthRange = (currentDate: Date) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const startDate = new Date(year, month, 1);

    return { startDate };
  };

  const screenWidth = Dimensions.get("window").width;
  return (
    <View style={{}}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 10,
          padding: 20,
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 25,
            alignItems: "center",
          }}
        >
          <View
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: 35,
              backgroundColor: "white",
              padding: 2,
            }}
          >
            <Image
              source={require("../../assets/images/campana-icon.svg")}
              style={{
                height: 23,
                width: 20,
              }}
            />
          </View>
          <View style={{}}>
            <Text
              style={{
                fontWeight: "bold",
                color: "#D61355",
                textTransform: "uppercase",
                fontFamily: "Inter_700Bold",
                fontSize: 12,
              }}
            >
              {shop?.nombre ?? "Nombre tienda"}
            </Text>
            <ScrollView horizontal style={{ maxWidth: 180 }}>
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  color: "#676767",
                  fontSize: 14,
                }}
              >
                {shop?.ubicacion ?? "Sin ubicación todavía"}
              </Text>
            </ScrollView>
          </View>
        </View>
        <Image
          source={require("../../assets/images/logo-example-logo.png")}
          style={{
            height: 45,
            width: 45,
          }}
        />
      </View>
      <ScrollView
        contentContainerStyle={{
          display: "flex",
          backgroundColor: "#F7F8F9",
          padding: 20,
          gap: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 20,
          }}
        >
          <TouchableOpacity
            style={{
              display: "flex",
              backgroundColor: "white",
              borderRadius: 10,
              padding: 20,
              overflow: "hidden",
              width: "42%",
            }}
            onPress={() => navigation.navigate("sellerOrder")}
          >
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 52,
                color: "#32343E",
              }}
            >
              {totalOrders ?? "00"}
            </Text>
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 13,
                textTransform: "uppercase",
                color: "#838799",
              }}
            >
              Pedidos en curso
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              display: "flex",
              backgroundColor: "white",
              borderRadius: 10,
              padding: 20,
              overflow: "hidden",
              width: "42%",
            }}
            onPress={() => navigation.navigate("sellerRequests")}
          >
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 52,
                color: "#32343E",
              }}
            >
              05
            </Text>
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 13,
                textTransform: "uppercase",
                color: "#838799",
              }}
            >
              Solicitud de delivery
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator
          style={{
            borderRadius: 30,
            flexDirection: "row",
            backgroundColor: "#fff",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 4, // una media entre 1 y los 60px del segundo shadow
            },
            shadowOpacity: 0.3, // similar al rgba del último shadow
            shadowRadius: 10,
            elevation: 10,
          }}
        >
          <View
            style={{
              display: "flex",
              borderRadius: 10,
              padding: 20,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  width: 150,
                }}
              >
                <Text
                  style={{
                    textTransform: "uppercase",
                    fontFamily: "Inter_400Regular",
                    fontSize: 14,
                    color: "#32343E",
                  }}
                >
                  Ingresos
                </Text>
                <Text
                  style={{
                    textTransform: "uppercase",
                    fontFamily: "Inter_700Bold",
                    fontSize: 22,
                    color: "#32343E",
                  }}
                >
                  {chartData.reduce((acc, item) => acc + item.value, 0)}$
                </Text>
              </View>
              <View style={{}}>
                <RNPickerSelect
                  onValueChange={(value) => setChartPeriod(value)}
                  placeholder={{ label: "Semanal", value: PeriodSells.week }}
                  items={[
                    { label: "Mensual", value: PeriodSells.month },
                    { label: "Anual", value: PeriodSells.year },
                  ]}
                  style={{
                    inputIOS: {
                      fontSize: 14,
                      paddingVertical: 12,
                      paddingHorizontal: 10,
                      borderWidth: 1,
                      borderColor: "#E8EAED",
                      borderRadius: 8,
                      color: "#000",
                      backgroundColor: "#fff",
                      paddingRight: 30, // evita que el texto se solape con el ícono
                    },
                    inputAndroid: {
                      fontSize: 14,
                      paddingHorizontal: 10,
                      paddingVertical: 8,
                      borderWidth: 1,
                      borderColor: "#E8EAED",
                      borderRadius: 8,
                      color: "#000",
                      backgroundColor: "#fff",
                      paddingRight: 30,
                    },
                    iconContainer: {
                      top: 12,
                      right: 10,
                    },
                    placeholder: {
                      color: "##9C9BA6",
                      fontSize: 14,
                      fontFamily: "Inter_400Regular",
                    },
                    inputWeb: {
                      backgroundColor: "white",
                      padding: 5,
                      outline: "none",
                      borderRadius: 5,
                    },
                  }}
                  Icon={() => (
                    <Image
                      source={require("../../assets/images/arrow-icon.svg")}
                      style={{
                        height: 20,
                        width: 20,
                      }}
                    />
                  )}
                />
              </View>
            </View>
            <View
              style={{
                overflow: "hidden",
              }}
            >
              <ScrollView horizontal>
                {loading ? (
                  <ActivityIndicator size="large" color="#D61355" />
                ) : chartData.length === 0 ? (
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      color: "#999",
                      textAlign: "center",
                    }}
                  >
                    No hay datos disponibles
                  </Text>
                ) : (
                  <BarChart
                    data={chartData}
                    adjustToWidth
                    parentWidth={screenWidth - 40}
                    barWidth={18}
                    spacing={20}
                    yAxisThickness={0}
                    hideRules
                    height={200}
                    isAnimated
                    animationDuration={300}
                    showGradient
                    barBorderTopLeftRadius={6}
                    barBorderTopRightRadius={6}
                  />
                )}
              </ScrollView>
            </View>
          </View>
        </ScrollView>
        <View
          style={{
            display: "flex",
            backgroundColor: "white",
            borderRadius: 10,
            padding: 20,
            gap: 20,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14 }}>
              Reseñas
            </Text>
            <TouchableOpacity
              style={{}}
              onPress={() => navigation.navigate("sellerReviews")}
            >
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  color: "#E94B64",
                  borderBottomWidth: 1,
                  borderBottomColor: "#E94B64",
                }}
              >
                Ver todas las reseñas
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Image
                source={require("../../assets/images/star-icon.svg")}
                style={{
                  height: 25,
                  width: 25,
                }}
              />
              <Text
                style={{
                  fontFamily: "Inter_700Bold",
                  fontSize: 20,
                  color: "#E94B64",
                }}
              >
                4.9
              </Text>
            </View>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 14,
              }}
            >
              Total 20 reseñas
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            backgroundColor: "white",
            borderRadius: 10,
            padding: 20,
            gap: 10,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14 }}>
              Populares de esta semana
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                color: "#E94B64",
                borderBottomWidth: 1,
                borderBottomColor: "#E94B64",
              }}
            >
              Ver todo
            </Text>
          </View>

          <ScrollView
            horizontal
            contentContainerStyle={{
              display: "flex",
              flexDirection: "row",
              padding: 20,
              gap: 20,
            }}
          >
            <Image
              source={require("../../assets/images/rectangulo-img.svg")}
              style={{
                height: 130,
                width: 130,
                borderRadius: 20,
              }}
            />
            <Image
              source={require("../../assets/images/rectangulo-img.svg")}
              style={{
                height: 130,
                width: 130,
                borderRadius: 20,
              }}
            />
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}
