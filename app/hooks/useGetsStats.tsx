import { useEffect, useState } from "react";

const useStatsData = (shopId: string, period: "week" | "month" | "year") => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(
      `${process.env.EXPO_PUBLIC_HOST}/getStats?shopId=${shopId}&period=${period}`
    )
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [shopId, period]);

  return { data, loading };
};
