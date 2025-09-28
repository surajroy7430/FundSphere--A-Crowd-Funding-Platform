export const parseBackendError = (errorData) => {
  if (!errorData) return "Something went wrong. Please try again later";

  // Validator object
  if (
    errorData.errors &&
    typeof errorData.errors === "object" &&
    !Array.isArray(errorData.errors)
  ) {
    return Object.values(errorData.errors).join(", ");
  }

  // Validator array
  if (Array.isArray(errorData.errors)) {
    return errorData.errors.map((e) => e.msg || e).join(", ");
  }

  if (errorData.msg) {
    return errorData.msg;
  }

  if (typeof errorData === "string") {
    return errorData;
  }

  return "Something went wrong. Please try again later";
};
