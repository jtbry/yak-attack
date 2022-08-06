import { LatLng } from "leaflet";

export const distanceToPoint = (dst: [number, number], src: LatLng) => {
  const meters = new LatLng(dst[1], dst[0]).distanceTo(src);
  const miles = meters * 0.000621371;
  if (miles <= 1) {
    return `${Math.round(5280 * miles)} feet`;
  }
  return `${Math.round(miles)} miles`;
};

export const randomColor = (n: number) => {
  const hue = n * 137.508 // use golden angle approximation
  return `hsl(${hue},50%,55%)`
}