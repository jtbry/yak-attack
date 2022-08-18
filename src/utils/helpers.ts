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

export const timeSinceTimestamp = (timestamp: Date) => {
  const now = new Date();
  const minutes = Math.floor((now.getTime() - timestamp.getTime()) / 60000);
  if (minutes < 1) {
    return "Just now";
  }

  const makePlural = (n: number) => {
    return n > 1 ? "s" : "";
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 1) {
    return `${minutes} minute${makePlural(minutes)} ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 1) {
    return `${hours} hour${makePlural(hours)} ago`;
  }

  const weeks = Math.floor(days / 7);
  if (weeks < 1) {
    return `${days} day${makePlural(days)} ago`;
  }
  
  return `${weeks} week${makePlural(weeks)} ago`;
}