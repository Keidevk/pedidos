// hooks/useStatsChart.ts
import { useEffect, useState } from "react";
import { barDataItem } from "react-native-gifted-charts";
import {
  processMonthlyData,
  processWeeklyData,
  processYearlyData,
} from "../(seller)/utils/dataProcessHelpers";

export const useStatsChart = (shopId: number, period: string, date: Date) => {
  const [data, setData] = useState<barDataItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const query = `?shopId=${shopId}&period=${period}&date=${date.toISOString()}`;
        const res = await fetch(`${process.env.EXPO_PUBLIC_HOST}/getStats${query}`);
        const rawData = await res.json();

        let formatted: barDataItem[] = [];
        if (period === "week") formatted = processWeeklyData(rawData);
        if (period === "month") formatted = processMonthlyData(rawData, date);
        if (period === "year") formatted = processYearlyData(rawData);

        setData(formatted);
      } catch (error) {
        console.error("Error:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [shopId, period, date]);

  return { data, loading };
};
