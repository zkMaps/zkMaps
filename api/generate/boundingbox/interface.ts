import { Request } from "express";

export type IGeoFenceRequest = Request & {
  geoFenceCoords: [number, number, number, number];
};
