export function isExpiredDate(dateString: string) {
  const date = new Date(dateString); // Converte a string para um objeto Date

  // Verifica se a data é válida
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format");
  }

  return Date.now() > date.getTime(); // Compara a data atual com a data fornecida
}
