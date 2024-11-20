export type TimezoneData = {
  countryCode: string;
  countryName: string;
  zoneName: string;
  abbreviation: string;
  gmtOffset: number;
  dst: string;
  zoneStart: number;
  zoneEnd: number;
  cityName: string;
}

export const getTimezoneFromCoordinates = async (latitude: number, longitude: number): Promise<TimezoneData | null> => {
  const API = 'https://api.timezonedb.com/v2.1/get-time-zone';
  const API_KEY = process.env.TIMEZONEDB_API_KEY;
  const url = `${API}?key=${API_KEY}&format=json&by=position&lat=${latitude}&lng=${longitude}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.status === 'FAILED') {
    return null;
  }

  return {  countryCode: data.countryCode,
    countryName: data.countryName,
    zoneName: data.zoneName,
    abbreviation: data.abbreviation,
    gmtOffset: data.gmtOffset,
    dst: data.dst,
    zoneStart: data.zoneStart,
    zoneEnd: data.zoneEnd,
    cityName: data.cityName
  };
};