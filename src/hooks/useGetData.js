import { useCallback, useState } from "react";

const useGetData = (url) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async function () {
      try {
        setIsLoading(true);
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Something went wrong");
        }
        const rawData = await response.json();
        setData(rawData);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
      }
    },
    [url]
  );

  return { fetchData, isLoading, data, error };
};

export default useGetData;
