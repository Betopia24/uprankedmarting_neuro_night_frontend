export default function paginateData<T>(
  data: T[],
  page: number,
  limit: number
): T[] {
  const startIndex = (page - 1) * limit;
  return data.slice(startIndex, startIndex + limit);
}
