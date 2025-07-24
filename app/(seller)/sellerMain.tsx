import {
  Inter_300Light,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Image } from "expo-image";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect } from "react";
import { Dimensions, ScrollView, Text, View } from "react-native";
import { BarChart, barDataItem } from "react-native-gifted-charts";
import RNPickerSelect from "react-native-picker-select";
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

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (chartPeriod === Period.week) {
  //       const { endDate, startDate } = getWeekRange(currentDate);
  //       setCurrentEndDate(new Date(endDate));
  //       const data = await fetchWeeklyData(startDate, endDate);
  //       if (data) {
  //         setChartData(processWeeklyData(data!));
  //         setChartKey((prev) => prev + 1);
  //         console.log(processWeeklyData(data!));
  //       } else setChartData([]);
  //     } else if (chartPeriod === Period.month) {
  //       const { endDate, startDate } = getMonthRange(currentDate);

  //       setCurrentEndDate(new Date(endDate));

  //       const data = await fetchMonthlyData(startDate, endDate);
  //       console.log(data);

  //       if (data) {
  //         const formattedData = processMonthlyData(data, currentDate);
  //         setChartData(formattedData);
  //         setChartKey((prev) => prev + 1);
  //         console.log(formattedData);
  //       } else {
  //         setChartData([]);
  //       }
  //     } else if (chartPeriod === Period.year) {
  //       const months = getYearMonthRanges(currentDate);

  //       const data = await fetchYearlyMonthlyData(currentDate.getFullYear());
  //       console.log(data);

  //       if (data) {
  //         const formattedData = processYearlyData(data); // genera 12 barras (Ene–Dic)
  //         setChartData(formattedData);
  //         setChartKey((prev) => prev + 1);
  //         console.log(formattedData);
  //       } else {
  //         setChartData([]);
  //       }
  //     }
  //   };
  //   fetchData();
  // }, [currentDate, chartPeriod]);

  useEffect(() => {
    fetchStatsData();
  }, [chartPeriod, currentDate]);

  // const fetchWeeklyData = async (startDate: number, endDate: number) => {
  //   try {
  //     const countResult = await database.getAllAsync<{ total: number }>(
  //       "SELECT COUNT(*) AS total FROM transactions WHERE date >= ? AND date <= ?;",
  //       [startDate, endDate]
  //       //[startDate, endDate]
  //     );
  //     const weeklyQuery = `
  //     SELECT
  //       strftime('%w', date /1000, 'unixepoch') AS day_of_week,
  //       SUM(amount) as total
  //       FROM transactions
  //       WHERE date >= ? AND date <= ?
  //       GROUP BY day_of_week
  //       ORDER BY day_of_week ASC
  //     `;
  //     if (countResult[0]?.total > 0) {
  //       const result = await database.getAllAsync<{
  //         day_of_week: number;
  //         total: number;
  //       }>(weeklyQuery, [startDate, endDate]);
  //       //[startDate, endDate]
  //       console.log(result);
  //       return result;
  //     } else {
  //       return [];
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // const fetchMonthlyData = async (startDate: number, endDate: number) => {
  //   try {
  //     const countResult = await database.getAllAsync<{ total: number }>(
  //       "SELECT COUNT(*) AS total FROM transactions WHERE date >= ? AND date <= ?;",
  //       [startDate, endDate]
  //     );
  //     //[startDate, endDate]

  //     const monthlyQuery = `
  //     SELECT
  //       strftime('%d', date / 1000, 'unixepoch') AS day_of_month,
  //       SUM(amount) AS total
  //     FROM transactions
  //     WHERE date >= ? AND date <= ?
  //     GROUP BY day_of_month
  //     ORDER BY day_of_month ASC;
  //   `;

  //     if (countResult[0]?.total > 0) {
  //       const result = await database.getAllAsync<{
  //         day_of_month: number;
  //         total: number;
  //       }>(monthlyQuery, [startDate, endDate]);

  //       console.log(result);
  //       return result;
  //     } else {
  //       return [];
  //     }
  //   } catch (e) {
  //     console.log(e);
  //     return [];
  //   }
  // };

  // const fetchYearlyMonthlyData = async (year: number) => {
  //   try {
  //     const yearlyQuery = `
  //     SELECT
  //       strftime('%m', date / 1000, 'unixepoch') AS month_of_year,
  //       SUM(amount) AS total
  //     FROM transactions
  //     WHERE strftime('%Y', date / 1000, 'unixepoch') = ?
  //     GROUP BY month_of_year
  //     ORDER BY month_of_year ASC;
  //   `;

  //     const result = await database.getAllAsync<{
  //       month_of_year: string;
  //       total: number;
  //     }>(yearlyQuery, [year.toString()]);

  //     console.log(result);
  //     return result; // Ejemplo: [{ month: "01", total: 1230 }, ...]
  //   } catch (e) {
  //     console.log(e);
  //     return [];
  //   }
  // };

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
          <Text style={{}}></Text>
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
  );
}
