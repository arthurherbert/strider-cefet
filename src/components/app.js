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
  const [studentTracking, setStudentTracking] = useState([]);

  // Refs
  const mapRef = useRef();

  // Efects
  useEffect(() => {
    // Show SpinnerContainer
    setIsLoading(true);

    // Create an array of promises
    const promises = [
      axios
        .get(
          "https://strider-cefet-backend.arthurherbert.now.sh/get-cefet-geometry"
        )
        .then(response => {
          setCefetGeometry(response.data);
        }),
      axios
        .get(
          "https://strider-cefet-backend.arthurherbert.now.sh/get-cefet-buildings"
        )
        .then(response => {
          setCefetBuildings(response.data);
        }),
      axios
        .get(
          "https://strider-cefet-backend.arthurherbert.now.sh/get-student-tracking"
        )
        .then(response => {
          setStudentTracking(response.data);
        })
    ];

    // When all of them are finished
    Promise.all(promises).then(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <>
      <SpinnerContainer isLoading={isLoading} />
      <Map ref={mapRef}>
        {studentTracking.length > 0 && <Polyline positions={studentTracking} />}
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
