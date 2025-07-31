import {
  Inter_300Light,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Text,
  View,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";
import RNPickerSelect from "react-native-picker-select";
import Svg, { Circle } from "react-native-svg";
import { useCategorias } from "../hooks/useCategory";
import { obtenerStatsPedidos } from "../hooks/useGetStatPedidos";
import { useProductosPorCategoria } from "../hooks/useProductsCategory";
import { getItem } from "../utils";
import {
  processMonthlyData,
  processWeeklyData,
  processYearlyData,
} from "./utils/dataProcessHelpers";

enum Categories {
  one = "one",
  two = "two",
  three = "three",
}

enum PeriodSells {
  week = "week",
  month = "month",
  year = "year",
}

type ChartItem = {
  label: string;
  value: number;
  frontColor: string;
  gradientColor: string;
};

export default function SellerStats() {
  const [fontsLoaded] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [chartPeriod, setChartPeriod] = useState<PeriodSells>(PeriodSells.week);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<null | Awaited<
    ReturnType<typeof obtenerStatsPedidos>
  >>(null);
  const { categorias, error } = useCategorias();
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const { productos } = useProductosPorCategoria(categoriaSeleccionada);
  const [shopId, setShopId] = useState("0");

  useEffect(() => {
    getItem("@userId", setShopId);
  }, []);

  console.log(shopId);

  useEffect(() => {
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

    async function fetchStats() {
      try {
        const datos = await obtenerStatsPedidos(
          `${process.env.EXPO_PUBLIC_HOST}/api/stats/orders/2`
        );
        setStats(datos);
      } catch (error) {
        console.error("Error al obtener estadísticas:", error);
      }
    }

    fetchStats();

    if (shopId !== "0" && shopId !== undefined) {
      fetchData();
    }
  }, [chartPeriod, currentDate]);
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
  if (!fontsLoaded) return null;

  const BorderProgressCircle = ({
    percentage,
    label,
    size = 60,
    strokeWidth = 8,
    ringColor = "#E0E0E0",
    progressColor = "#D61355",
    bgColor = "#fff",
  }: {
    percentage: number;
    label: string;
    size?: number;
    strokeWidth?: number;
    ringColor?: string;
    progressColor?: string;
    bgColor?: string;
  }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset =
      circumference * (1 - Math.min(Math.max(percentage, 0), 100) / 100);

    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginHorizontal: 12,
          gap: 5,
        }}
      >
        <Svg width={size} height={size}>
          {/* Fondo del círculo */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={ringColor}
            strokeWidth={strokeWidth}
            fill={bgColor}
          />

          {/* Círculo progresivo */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={progressColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            rotation={-90}
            originX={size / 2}
            originY={size / 2}
          />
        </Svg>

        {/* Texto en el centro */}
        <View
          style={{
            left: 0,
            right: 0,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 17,
              fontWeight: "600",

              color: "#333",
            }}
          >
            {`${Math.round(percentage)}%`}
          </Text>
        </View>

        {/* Etiqueta debajo */}
        <Text
          style={{ fontSize: 14, fontFamily: "Inter_300Light", color: "#333" }}
        >
          {label}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={{ gap: 20, padding: 10 }}>
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
      <ScrollView
        style={{
          backgroundColor: "#fff",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 4, // una media entre 1 y los 60px del segundo shadow
          },
          shadowOpacity: 0.3, // similar al rgba del último shadow
          shadowRadius: 10,
          elevation: 10,
          padding: 15,
          borderRadius: 30,
          gap: 10,
        }}
        showsHorizontalScrollIndicator
        showsVerticalScrollIndicator
      >
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_700Bold",
              fontSize: 12,
              textTransform: "uppercase",
              width: 120,
            }}
          >
            Productos por categoría
          </Text>

          {/* <RNPickerSelect
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
          /> */}

          <RNPickerSelect
            onValueChange={(value) => setCategoriaSeleccionada(value)}
            placeholder={{ label: "Categoría", value: null }}
            items={categorias.map((cat) => ({
              label: cat.nombre,
              value: cat.nombre, // ✅ Ahora el value será el nombre
            }))}
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
        <View style={{ flexDirection: "row" }}>
          {/* <View
            style={{
              width: "30%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{ fontFamily: "Inter_700Bold", fontSize: 20, gap: 10 }}
            >
              1,284
            </Text>
            <Text
              style={{
                textTransform: "uppercase",
                fontFamily: "Inter_300Light",
                color: "#6D6D6D",
                textAlign: "center",
              }}
            >
              Total
            </Text>
          </View> */}
          <ScrollView horizontal>
            {loading ? (
              <ActivityIndicator size="large" color="#D61355" />
            ) : productos.length === 0 ? (
              <Text>No hay productos en esta categoría</Text>
            ) : (
              productos.map((prod) => (
                <View
                  key={prod.id}
                  style={{
                    width: 150,
                    marginRight: 10,
                    backgroundColor: "#fff",
                    borderRadius: 10,
                    padding: 10,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 5,
                  }}
                >
                  <Image
                    source={{
                      uri: prod.imagen_url.startsWith("//")
                        ? "https:" + prod.imagen_url
                        : process.env.EXPO_PUBLIC_HOST + prod.imagen_url,
                    }}
                    style={{ width: "100%", height: 80, borderRadius: 6 }}
                  />
                  <Text style={{ fontFamily: "Inter_700Bold", fontSize: 14 }}>
                    {prod.nombre}
                  </Text>
                  <Text style={{ fontSize: 12, color: "#666" }}>
                    {prod.descripcion}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#D61355",
                      fontWeight: "bold",
                    }}
                  >
                    ${prod.precio.toFixed(2)}
                  </Text>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </ScrollView>
      <View
        style={{
          backgroundColor: "#fff",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 4, // una media entre 1 y los 60px del segundo shadow
          },
          shadowOpacity: 0.3, // similar al rgba del último shadow
          shadowRadius: 10,
          elevation: 10,
          padding: 15,
          borderRadius: 30,
          gap: 10,
        }}
      >
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_700Bold",
              fontSize: 12,
              textTransform: "uppercase",
              width: 150,
            }}
          >
            Pedidos cancelados y completados
          </Text>

          {/* <RNPickerSelect
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
          /> */}
        </View>
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: "30%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View style={{}}>
              <Text
                style={{
                  fontFamily: "Inter_700Bold",
                  fontSize: 20,
                  gap: 10,
                  textAlign: "center",
                }}
              >
                {stats?.cancelados.cantidad}
              </Text>
              <Text
                style={{
                  textTransform: "uppercase",
                  fontFamily: "Inter_300Light",
                  color: "#6D6D6D",
                  textAlign: "center",
                  fontSize: 12,
                }}
              >
                Cancelados
              </Text>
            </View>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Text
                style={{
                  fontFamily: "Inter_700Bold",
                  fontSize: 20,
                  gap: 10,
                  textAlign: "center",
                }}
              >
                {stats?.completados.cantidad}
              </Text>
              <Text
                style={{
                  textTransform: "uppercase",
                  fontFamily: "Inter_300Light",
                  color: "#6D6D6D",
                  textAlign: "center",
                  fontSize: 12,
                }}
              >
                Completados
              </Text>
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator
            contentContainerStyle={{}}
          >
            <BorderProgressCircle
              percentage={Number(stats?.completados.porcentaje)}
              progressColor="#35C01A"
              label="Completados"
              size={70}
            />
            <BorderProgressCircle
              percentage={Number(stats?.cancelados.porcentaje)}
              label="Cancelados"
              progressColor="#D61355"
              size={70}
            />
          </ScrollView>
        </View>
      </View>
      <View
        style={{
          backgroundColor: "#fff",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 4, // una media entre 1 y los 60px del segundo shadow
          },
          shadowOpacity: 0.3, // similar al rgba del último shadow
          shadowRadius: 10,
          elevation: 10,
          padding: 15,
          borderRadius: 30,
          gap: 10,
        }}
      >
        <View style={{}}>
          <View style={{}}>
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                textAlign: "center",
                fontSize: 13,
                textTransform: "uppercase",
              }}
            >
              Rancking de Tiendas más Populares
            </Text>
          </View>
          <View
            style={{
              width: "100%",
              alignItems: "flex-end",
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 13,
                textTransform: "uppercase",
                color: "#D61355",
                borderBottomColor: "#D61355",
                borderBottomWidth: 1,
                width: 150,
                textAlign: "center",
              }}
            >
              Conoce tu posición
            </Text>
          </View>
        </View>
        <ScrollView horizontal style={{ flexDirection: "row" }}>
          <View style={{ justifyContent: "flex-end" }}>
            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 100,
                  borderWidth: 7,
                  borderColor: "#D61355",
                  top: 10,
                  zIndex: 5,
                  backgroundColor: "#D9D9D9",
                }}
              ></View>
              <Text
                style={{
                  fontFamily: "Inter_700Bold",
                  textAlign: "center",
                  color: "#fff",
                  width: 100,
                  padding: 10,
                  textTransform: "uppercase",
                  backgroundColor: "#D61355",
                  zIndex: 3,
                  borderRadius: 20,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                }}
              >
                Nombre de tienda
              </Text>
            </View>
          </View>
          <View style={{ justifyContent: "flex-end" }}>
            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 100,
                  borderWidth: 7,
                  borderColor: "#D61355",
                  top: 10,
                  zIndex: 5,
                  backgroundColor: "#D9D9D9",
                }}
              ></View>
              <Text
                style={{
                  fontFamily: "Inter_700Bold",
                  textAlign: "center",
                  color: "#fff",
                  width: 100,
                  height: 80,
                  padding: 10,
                  textTransform: "uppercase",
                  backgroundColor: "#D61355",
                  zIndex: 3,
                  borderRadius: 20,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                }}
              >
                Nombre de tienda
              </Text>
            </View>
          </View>
          <View style={{ justifyContent: "flex-end" }}>
            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 100,
                  borderWidth: 7,
                  borderColor: "#D61355",
                  top: 10,
                  zIndex: 5,
                  backgroundColor: "#D9D9D9",
                }}
              ></View>
              <Text
                style={{
                  fontFamily: "Inter_700Bold",
                  textAlign: "center",
                  color: "#fff",
                  width: 100,
                  padding: 10,
                  textTransform: "uppercase",
                  backgroundColor: "#D61355",
                  zIndex: 3,
                  borderRadius: 20,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                }}
              >
                Nombre de tienda
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
}
