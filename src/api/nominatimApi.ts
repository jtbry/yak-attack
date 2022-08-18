import axios from 'axios';
import { LatLng } from 'leaflet';
import convertUsStateAbbrAndName from '../utils/constants';

const nominatimBaseUrl = 'https://nominatim.openstreetmap.org/';

export const getLocationStrFromLatLng = async (point: LatLng) => {
  const nominatimUrl = nominatimBaseUrl + 'reverse'; 
  const response = await axios.get(nominatimUrl, {
    params: {
      lat: point.lat,
      lon: point.lng,
      format: 'json',
      zoom: 10,
    },
    headers: {
      'User-Agent': 'yakattack/1.0 '
    }
  });

  const addr = response.data.address;
  const state = convertUsStateAbbrAndName(addr.state) ?? addr.country ?? "Unknown";
  const city = addr.city ?? addr.town ?? addr.village ?? addr.county ?? "Unknown";
  return `${city}, ${state}`;
}

export interface LocationSearchResult {
  display_name: string;
  address: {
    amenity: string;
    house_number: string;
    road: string;
    neighbourhood: string;
    suburb: string;
    city: string;
    county: string;
    state: string;
    ISO3166: string;
    postcode: string;
    country: string;
    country_code: string;
  }
  lat: number;
  lon: number;
}

export const getAddressFromLatLng = async (point: LatLng) => {
  const nominatimUrl = nominatimBaseUrl + 'reverse';
  const response = await axios.get<LocationSearchResult>(nominatimUrl, {
    params: {
      lat: point.lat,
      lon: point.lng,
      format: 'json',
      zoom: 18,
    }, 
    headers: {
      'User-Agent': 'yakattack/1.0 '
    }
  });
  const addr = response.data.address;
  return `${addr.house_number ?? ''} ${addr.road}, ${addr.city}, ${addr.state}`;
}

export const searchForLocation = async (query: string) => {
  try {
    const nominatimUrl = nominatimBaseUrl + 'search'; 
    const response = await axios.get<LocationSearchResult[]>(nominatimUrl, {
      params: {
        q: query,
        format: 'json',
        addressdetails: 1,
        limit: 5
      },
      headers: {
        'User-Agent': 'yakattack/1.0 '
      }
    });

    return response.data;
  } catch (e) {
    console.error(e);
    return [];
  }
}