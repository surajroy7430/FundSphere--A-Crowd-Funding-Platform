import axios from "axios";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { parseBackendError } from "../helpers/parse-backend-error";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

export const useFetch = (baseUrl = BASE_URL) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(
    async ({
      url,
      method = "GET",
      data,
      headers = {},
      showToast = true,
      onUploadProgress = false,
    }) => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios({
          url: `${baseUrl}${url}`,
          method,
          ...(data ? { data } : {}),
          headers: {
            ...(data instanceof FormData
              ? {}
              : { "Content-Type": "application/json" }),
            ...headers,
          },
          withCredentials: true,
          onUploadProgress,
        });

        if (showToast) toast.success(res.data?.msg || "Success");

        return { success: true, data: res.data };
      } catch (error) {
        let message = "Something went wrong. Please try again later";

        if (error.response?.data) {
          const contentType = error.response.headers?.["content-type"];

          if (contentType && contentType.includes("application/json")) {
            message = parseBackendError(error.response?.data);
          } else if (typeof error.response.data === "string") {
            if (
              error.response.data.startsWith("<!DOCTYPE") ||
              error.response.data.startsWith("<html")
            ) {
              message = "Server returned an unexpected response.";
            } else {
              error.response.data;
            }
          } else if (error.message) {
            message = error.message;
          }
        }

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
