type weeklySummary = {
  day_of_week: number;
  total: number;
};

type monthlySummary = {
  day_of_month: number;
  total: number;
};

type yearlySummary = {
  month_of_year: string;
  total: number;
};

export const processWeeklyData = (data: weeklySummary[]) => {
  const weekDays = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

  let barData = weekDays.map(
    (label) =>
      ({
        label,
        value: 0,
        frontColor: "#e97788ff",
        gradientColor: "#e97788ff",
      } as any)
  );

  data.forEach((item) => {
    const dayIndex = item.day_of_week % 7; // por si llega como "5"
    if (dayIndex >= 0 && dayIndex < 7) {
      barData[dayIndex].value = item.total;
      const color = item.total < 25 ? "#e97788ff" : "#E94B64";
      barData[dayIndex].frontColor = color;
      barData[dayIndex].gradientColor = color;
    }
  });

  return barData;
};

export const processMonthlyData = (
  data: monthlySummary[],
  currentDate: Date
) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const totalDays = new Date(year, month + 1, 0).getDate(); // días del mes

  // Crear array base con todos los días del mes
  const fullMonth = Array.from({ length: totalDays }, (_, i) => {
    const dayLabel = (i + 1).toString().padStart(2, "0"); // "1" → "01"

    return {
      label: dayLabel,
      value: 0,
      frontColor: "#e97788ff",
      gradientColor: "#e97788ff",
    };
  });

  // Insertar los valores reales en el array
  data.forEach((item) => {
    const index = item.day_of_month - 1;
    if (index >= 0 && index < fullMonth.length) {
      const color = item.total < 100 ? "#e97788ff" : "#E94B64";

      fullMonth[index].value = item.total;
      fullMonth[index].frontColor = color;
      fullMonth[index].gradientColor = color;
    }
  });

  return fullMonth;
};

export const processYearlyData = (data: yearlySummary[]) => {
  const monthLabels = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];
  return Array.from({ length: 12 }, (_, i) => {
    const month = (i + 1).toString().padStart(2, "0");
    const match = data.find((d) => d.month_of_year === month);
    const value = match?.total || 0;

    const color = value < 500 ? "#e97788ff" : "#E94B64";

    return {
      label: monthLabels[i],
      value,
      frontColor: color,
      gradientColor: color,
    };
  });
};
