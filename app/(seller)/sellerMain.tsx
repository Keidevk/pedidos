import {
  Inter_300Light,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect } from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart, barDataItem } from "react-native-gifted-charts";
import RNPickerSelect from "react-native-picker-select";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import {
  processMonthlyData,
  processWeeklyData,
  processYearlyData,
} from "./utils/dataProcessHelpers";

enum Period {
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

// types/navigation.ts
export type RootStackParamList = {
  sellerOrder: undefined; // o `undefined` si no recibe params
  sellerRequests: undefined;
  sellerStats: undefined;
  sellerReviews: undefined;
};

export default function sellerStats() {
  useFonts({
    Inter_600SemiBold,
    Inter_300Light,
    Inter_400Regular,
    Inter_700Bold,
  });

  const [chartData, setChartData] = React.useState<barDataItem[]>([]);
  const [chartPeriod, setChartPeriod] = React.useState<Period>(Period.week);
  const [currentDate, setCurrentDate] = React.useState<Date>(new Date());
  const [currentEndDate, setCurrentEndDate] = React.useState<Date>(new Date());
  const [chartKey, setChartKey] = React.useState<number>(0);
  const database = useSQLiteContext();

  const fetchStatsData = async () => {
    try {
      const shopId = 3; // puedes hacerlo dinámico según sesión
      const query = `?shopId=${shopId}&period=${chartPeriod}&date=${currentDate.toISOString()}`;
      const response = await fetch(`http://192.168.3.6:3000/getStats${query}`);
      const rawData = await response.json();

      let formatted = [];

      if (chartPeriod === Period.week) {
        formatted = processWeeklyData(rawData);
      } else if (chartPeriod === Period.month) {
        formatted = processMonthlyData(rawData, currentDate);
      } else {
        formatted = processYearlyData(rawData);
      }

      setChartData(formatted);
      setChartKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      setChartData([]); // fallback visual
    }
  };

  useEffect(() => {
    fetchStatsData();
  }, [chartPeriod, currentDate]);

  const fetchWeeklyData = async (startDate: number, endDate: number) => {
    try {
      const shopId = 3; // ← ajusta según contexto
      const query = `?shopId=${shopId}&period=week&date=${new Date(
        startDate
      ).toISOString()}`;
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_HOST}/getStats${query}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener datos semanales:", error);
      return [];
    }
  };
  const fetchMonthlyData = async (startDate: number, endDate: number) => {
    try {
      const shopId = 3;
      const query = `?shopId=${shopId}&period=month&date=${new Date(
        startDate
      ).toISOString()}`;
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_HOST}/getStats${query}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener datos mensuales:", error);
      return [];
    }
  };
  const fetchYearlyMonthlyData = async (year: number) => {
    try {
      const shopId = 3;
      const query = `?shopId=${shopId}&period=year&date=${new Date(
        `${year}-01-01`
      ).toISOString()}`;
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_HOST}/getStats${query}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener datos anuales:", error);
      return [];
    }
  };

  const getWeekRange = (date: Date) => {
    const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay()));
    const endOfWeek = new Date(date.setDate(startOfWeek.getDate() + 6));
    return {
      startDate: Math.floor(startOfWeek.getTime()),
      endDate: Math.floor(endOfWeek.getTime()),
    };
  };

  const getMonthRange = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0); // Día 0 del siguiente mes = último día actual

    return {
      startDate: Math.floor(startOfMonth.getTime()),
      endDate: Math.floor(endOfMonth.getTime()),
    };
  };

  const getYearMonthRanges = (date: Date) => {
    const year = date.getFullYear();

    const months = Array.from({ length: 12 }, (_, i) => {
      const startOfMonth = new Date(year, i, 1);
      const endOfMonth = new Date(year, i + 1, 0); // Día 0 del siguiente mes

      return {
        month: i + 1, // Opcional: número del mes (1–12)
        startDate: Math.floor(startOfMonth.getTime()),
        endDate: Math.floor(endOfMonth.getTime()),
      };
    });

    return months;
  };

  const screenWidth = Dimensions.get("window").width;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
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
        <View
          style={{
            display: "flex",
            backgroundColor: "white",
            borderRadius: 10,
            padding: 20,
            flexShrink: 50,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("sellerOrder")}
            style={{}}
          >
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 52,
                color: "#32343E",
              }}
            >
              20
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
        </View>
        <View
          style={{
            display: "flex",
            backgroundColor: "white",
            borderRadius: 10,
            padding: 20,
            flexShrink: 50,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("sellerRequests")}
            style={{}}
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
              Solicitudes en curso
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          backgroundColor: "white",
          borderRadius: 10,
          padding: 20,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 10,
          }}
        >
          <View>
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
              $2,241
            </Text>
          </View>
          <View
            style={{
              justifyContent: "center",
            }}
          >
            <RNPickerSelect
              onValueChange={(value) => setChartPeriod(value)}
              placeholder={{ label: "Semanal", value: Period.week }}
              items={[
                { label: "Mensual", value: Period.month },
                { label: "Anual", value: Period.year },
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
          <View
            style={{
              justifyContent: "center",
            }}
          >
            <View>
              <TouchableOpacity
                onPress={() => navigation.navigate("sellerStats")}
              >
                <Text
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: "#E94B64",
                    color: "#E94B64",
                    fontFamily: "Inter_400Regular",
                    fontSize: 14,
                  }}
                >
                  Ver detalles
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View
          style={{
            overflow: "hidden",
          }}
        >
          <BarChart
            data={chartData}
            adjustToWidth={true} // ✅ se ajusta al ancho del contenedor
            parentWidth={screenWidth} // ✅ usa el ancho de la pantalla
            barWidth={18} // ajusta según diseño
            spacing={20} // espacio entre barras
            yAxisThickness={0} // opcional: oculta eje Y
            hideRules={true} // opcional: limpia el diseño
            height={200}
            width={290}
            minHeight={3}
            noOfSections={4}
            xAxisThickness={0}
            xAxisLabelTextStyle={{ color: "gray" }}
            yAxisTextStyle={{ color: "gray" }}
            isAnimated
            animationDuration={300}
            showGradient
            barBorderTopLeftRadius={5}
            barBorderTopRightRadius={5}
          />
        </View>
      </View>
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
          <View>
            <TouchableOpacity
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
          <View>
            <TouchableOpacity
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
                Ver todo
              </Text>
            </TouchableOpacity>
          </View>
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
  );
}
