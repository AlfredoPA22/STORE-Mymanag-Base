export const formatDate = (value: string) => {
  const asNumber = Number(value);
  const date = value?.trim() !== "" && !isNaN(asNumber) ? new Date(asNumber) : new Date(value);
  if (isNaN(date.getTime())) return value;
  return date.toLocaleDateString("es-BO", { day: "2-digit", month: "short", year: "numeric" });
};
