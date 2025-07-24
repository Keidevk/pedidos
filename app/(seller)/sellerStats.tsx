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
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { BarChart, barDataItem } from "react-native-gifted-charts";
import RNPickerSelect from "react-native-picker-select";
import Svg, { Circle } from "react-native-svg";
import {
  processMonthlyData,
  processWeeklyData,
  processYearlyData,
} from "./utils/dataProcessHelpers";

enum Categories {
  one = "week",
  two = "month",
  three = "year",
}
enum PeriodProducts {
  week = "week",
  month = "month",
  year = "year",
}
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
export default function sellerStats() {
  useFonts({
    Inter_600SemiBold,
    Inter_300Light,
    Inter_400Regular,
    Inter_700Bold,
  });

  const [chartData, setChartData] = React.useState<barDataItem[]>([]);
  const [chartPeriod, setChartPeriod] = React.useState<PeriodSells>(
    PeriodSells.week
  );
  const [currentDate, setCurrentDate] = React.useState<Date>(new Date());
  const [currentEndDate, setCurrentEndDate] = React.useState<Date>(new Date());
  const [chartKey, setChartKey] = React.useState<number>(0);
  const database = useSQLiteContext();

  useEffect(() => {
    const fetchData = async () => {
      if (chartPeriod === PeriodSells.week) {
        const { endDate, startDate } = getWeekRange(currentDate);
        setCurrentEndDate(new Date(endDate));
        const data = await fetchWeeklyData(startDate, endDate);
        if (data) {
          setChartData(processWeeklyData(data!));
          setChartKey((prev) => prev + 1);
          console.log(processWeeklyData(data!));
        } else setChartData([]);
      } else if (chartPeriod === PeriodSells.month) {
        const { endDate, startDate } = getMonthRange(currentDate);

        setCurrentEndDate(new Date(endDate));

        const data = await fetchMonthlyData(startDate, endDate);
        console.log(data);

        if (data) {
          const formattedData = processMonthlyData(data, currentDate);
          setChartData(formattedData);
          setChartKey((prev) => prev + 1);
          console.log(formattedData);
        } else {
          setChartData([]);
        }
      } else if (chartPeriod === PeriodSells.year) {
        const months = getYearMonthRanges(currentDate);

        const data = await fetchYearlyMonthlyData(currentDate.getFullYear());
        console.log(data);

        if (data) {
          const formattedData = processYearlyData(data); // genera 12 barras (Ene–Dic)
          setChartData(formattedData);
          setChartKey((prev) => prev + 1);
          console.log(formattedData);
        } else {
          setChartData([]);
        }
      }
    };
    fetchData();
  }, [currentDate, chartPeriod]);

  const fetchWeeklyData = async (startDate: number, endDate: number) => {
    try {
      const countResult = await database.getAllAsync<{ total: number }>(
        "SELECT COUNT(*) AS total FROM transactions WHERE date >= ? AND date <= ?;",
        [startDate, endDate]
        //[startDate, endDate]
      );
      const weeklyQuery = `
        SELECT 
          strftime('%w', date /1000, 'unixepoch') AS day_of_week,
          SUM(amount) as total
          FROM transactions
          WHERE date >= ? AND date <= ?
          GROUP BY day_of_week
          ORDER BY day_of_week ASC
        `;
      if (countResult[0]?.total > 0) {
        const result = await database.getAllAsync<{
          day_of_week: number;
          total: number;
        }>(weeklyQuery, [startDate, endDate]);
        //[startDate, endDate]
        console.log(result);
        return result;
      } else {
        return [];
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchMonthlyData = async (startDate: number, endDate: number) => {
    try {
      const countResult = await database.getAllAsync<{ total: number }>(
        "SELECT COUNT(*) AS total FROM transactions WHERE date >= ? AND date <= ?;",
        [startDate, endDate]
      );
      //[startDate, endDate]

      const monthlyQuery = `
        SELECT 
          strftime('%d', date / 1000, 'unixepoch') AS day_of_month,
          SUM(amount) AS total
        FROM transactions
        WHERE date >= ? AND date <= ?
        GROUP BY day_of_month
        ORDER BY day_of_month ASC;
      `;

      if (countResult[0]?.total > 0) {
        const result = await database.getAllAsync<{
          day_of_month: number;
          total: number;
        }>(monthlyQuery, [startDate, endDate]);

        console.log(result);
        return result;
      } else {
        return [];
      }
    } catch (e) {
      console.log(e);
      return [];
    }
  };

  const fetchYearlyMonthlyData = async (year: number) => {
    try {
      const yearlyQuery = `
        SELECT 
          strftime('%m', date / 1000, 'unixepoch') AS month_of_year,
          SUM(amount) AS total
        FROM transactions
        WHERE strftime('%Y', date / 1000, 'unixepoch') = ?
        GROUP BY month_of_year
        ORDER BY month_of_year ASC;
      `;

      const result = await database.getAllAsync<{
        month_of_year: string;
        total: number;
      }>(yearlyQuery, [year.toString()]);

      console.log(result);
      return result; // Ejemplo: [{ month: "01", total: 1230 }, ...]
    } catch (e) {
      console.log(e);
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
      <View style={styles.wrapper}>
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
        <View style={styles.centerText}>
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
        <Text style={styles.label}>{label}</Text>
      </View>
    );
  };

  const styles = StyleSheet.create({
    wrapper: {
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: 12,
      gap: 5,
    },
    centerText: {
      // position: "absolute",
      // top: "43%",
      left: 0,
      right: 0,
      alignItems: "center",
      justifyContent: "center",
    },
    label: {
      fontSize: 14,
      fontFamily: "Inter_300Light",
      color: "#333",
    },
  });

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
              width: 120,
            }}
          >
            Productos más vendidos
          </Text>

          <RNPickerSelect
            onValueChange={(value) => setChartPeriod(value)}
            placeholder={{ label: "Semanal", value: PeriodProducts.week }}
            items={[
              { label: "Mensual", value: PeriodProducts.month },
              { label: "Anual", value: PeriodProducts.year },
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
          <RNPickerSelect
            onValueChange={(value) => setChartPeriod(value)}
            placeholder={{ label: "Categoría", value: Categories.one }}
            items={[
              { label: "Mensual", value: Categories.two },
              { label: "Anual", value: Categories.three },
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
        <View style={{ flexDirection: "row" }}>
          <View
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
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator
            contentContainerStyle={{}}
          >
            <BorderProgressCircle
              percentage={29}
              label="Hamburguesa"
              size={70}
            />
            <BorderProgressCircle
              percentage={76}
              label="Pizza"
              progressColor="#FFC700"
              size={70}
            />
            <BorderProgressCircle
              percentage={76}
              label="Pizza"
              progressColor="#A776F5"
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

          <RNPickerSelect
            onValueChange={(value) => setChartPeriod(value)}
            placeholder={{ label: "Semanal", value: PeriodProducts.week }}
            items={[
              { label: "Mensual", value: PeriodProducts.month },
              { label: "Anual", value: PeriodProducts.year },
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
                1,284
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
                1,284
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
              percentage={29}
              progressColor="#35C01A"
              label="Completados"
              size={70}
            />
            <BorderProgressCircle
              percentage={76}
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
