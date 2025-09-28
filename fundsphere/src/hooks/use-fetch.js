import axios from "axios";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { parseBackendError } from "../helpers/parse-backend-error";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

export const useFetch = (baseUrl = BASE_URL) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(
    async ({ url, method = "GET", data, headers = {}, showToast = true }) => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios({
          url: `${baseUrl}${url}`,
          method,
          ...(data ? { data } : {}),
          headers: { "Content-Type": "application/json", ...headers },
          withCredentials: true,
        });

        if (showToast) toast.success(res.data?.msg || "Success");

        return { success: true, data: res.data };
      } catch (error) {
        let message = parseBackendError(error.response?.data);

        if (showToast) toast.error(message);
        setError(message);

        return { success: false, message };
      } finally {
        setLoading(false);
      }
    },
    [baseUrl]
  );

  return { request, loading, error };
};
