import React, { useState, useEffect, useRef } from "react";
import { Map } from "../core/map";
import { Polygon, Tooltip, Polyline, Popup } from "react-leaflet";
import { SpinnerContainer } from "../core/spinner-container";
import { lineString, polygon } from "@turf/helpers";
import lineIntersect from "@turf/line-intersect";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import axios from "axios";

export const StriderCefet = () => {
  // States
  const [isLoading, setIsLoading] = useState(false);
  const [cefetGeometry, setCefetGeometry] = useState([]);
  const [cefetBuiildings, setCefetBuildings] = useState([]);

  // Efects
  useEffect(() => {
    // Show SpinnerContainer
    setIsLoading(true);
    axios
      .get(
        "https://strider-cefet-backend.arthurherbert.now.sh/get-cefet-geometry"
      )
      .then(response => {
        setCefetGeometry(response.data);
        setIsLoading(false);
      });
    axios
      .get(
        "https://strider-cefet-backend.arthurherbert.now.sh/get-cefet-buildings"
      )
      .then(response => {
        setCefetBuildings(response.data);
      });
  }, []);

  return (
    <>
      <SpinnerContainer isLoading={isLoading} />
      <Map>
        {cefetGeometry.length > 0 && (
          <Polygon color="purple" fillOpacity={0.1} positions={cefetGeometry} />
        )}
        {cefetBuiildings.map((building, index) => {
          return (
            <Polygon
              key={index}
              color={building.color}
              fillOpacity={0.4}
              positions={building.coordinates}
            />
          );
        })}
      </Map>
    </>
  );
};
