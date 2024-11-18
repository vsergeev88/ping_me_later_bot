export function chunkArray(arr: any[], size: number): any[][] {
  const result: any[][] = [];

  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size)); // Берем срез массива по 5 элементов
  }

  return result;
}

export const getHumanDate = (date: Date, locale = 'en') => {
  return date.toLocaleDateString(locale, {dateStyle: 'full'}) + ' ' + date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
}