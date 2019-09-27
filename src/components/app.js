import React, { useState, useEffect, useRef } from "react";

// Helpers
import { Map } from "../core/map";
import { SpinnerContainer } from "../core/spinner-container";

// Requests
import axios from "axios";

// Map
import { Polygon, Tooltip, Polyline, Popup } from "react-leaflet";

// Challenge
import { lineString, polygon } from "@turf/helpers";
import lineIntersect from "@turf/line-intersect";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";

// Mocked Geometry
export const cefetGeometry = [
  [-19.939751982185285, -44.00073766708373],
  [-19.940301649756154, -43.998597264289856],
  [-19.939751982185285, -44.00073766708373],
  [-19.940301649756154, -43.998597264289856],
  [-19.939968823749066, -43.99796962738037],
  [-19.93815843969989, -43.998141288757324],
  [-19.938108010877784, -43.99895131587982],
  [-19.93818365410492, -43.9994341135025],
  [-19.938501355263245, -44.000174403190606],
  [-19.93868794135996, -44.00045871734619],
  [-19.93883418436276, -44.000635743141174],
  [-19.939010684358205, -44.00046408176422],
  [-19.939751982185285, -44.00073766708373]
];

export const StriderCefet = () => {
  return (
    <>
      <Map />
    </>
  );
};
