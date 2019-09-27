import React, { useState, useEffect, useRef } from "react";
import { Map } from "../core/map";
import { Polygon, Tooltip, Polyline, Popup } from "react-leaflet";
import { SpinnerContainer } from "../core/spinner-container";
import { lineString, polygon } from "@turf/helpers";
import lineIntersect from "@turf/line-intersect";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import axios from "axios";

const sliceTracking = (route, geometry) => {
  const first = route[0];
  const routeOffseted = route.slice(1);
  const slicedTracking = [];
  const turfPolygon = polygon([geometry]);
  routeOffseted.reduce((point1, point2) => {
    // Create a line between these two points
    const line = lineString([point1, point2]);
    const isPoint1Inside = booleanPointInPolygon(point1, turfPolygon);

    const intersects = lineIntersect(line, turfPolygon);
    const trackingCuts = intersects.features.length > 0;
    const trackingCutsOnce = intersects.features.length === 1;
    const isTrackingInside = !trackingCuts && isPoint1Inside;

    if (isTrackingInside) {
      slicedTracking.push(point1);
    } else if (trackingCutsOnce) {
      const intersectPoint = intersects.features[0].geometry.coordinates.slice();
      if (isPoint1Inside) {
        slicedTracking.push(point1);
        slicedTracking.push(intersectPoint);
      } else {
        slicedTracking.push(intersectPoint);
      }
    }
    return point2;
  }, first);
  return slicedTracking;
};

const CustomTooltip = props => {
  return <div>{props.name}</div>;
};

const CustomPopup = props => {
  return <div onClick={props.onClick}>{props.description}</div>;
};

export const StriderCefet = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [slicedTracking, setSlicedTracking] = useState([]);
  const [cefetGeometry, setCefetGeometry] = useState([]);
  const [cefetBuiildings, setCefetBuildings] = useState([]);
  const [studentTracking, setStudentTracking] = useState([]);
  const mapRef = useRef();

  useEffect(() => {
    setIsLoading(true);
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
    Promise.all(promises).then(() => {
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (
      cefetGeometry &&
      cefetGeometry.length > 0 &&
      studentTracking &&
      studentTracking.length > 0
    ) {
      setSlicedTracking(sliceTracking(studentTracking, cefetGeometry));
    }
  }, [studentTracking, cefetGeometry]);

  return (
    <>
      <SpinnerContainer isLoading={isLoading} />
      <Map ref={mapRef}>
        {studentTracking.length > 0 && <Polyline positions={studentTracking} />}
        {slicedTracking.length > 0 && (
          <Polyline color="lime" positions={slicedTracking} />
        )}
        {cefetGeometry.length > 0 && (
          <Polygon color="purple" fillOpacity={0.1} positions={cefetGeometry}>
            <Tooltip sticky>
              <CustomTooltip name={"C2"} />
            </Tooltip>
          </Polygon>
        )}
        {cefetBuiildings.map((building, index) => {
          return (
            <Polygon
              key={index}
              color={building.color}
              fillOpacity={0.4}
              positions={building.coordinates}
            >
              <Tooltip sticky>
                <CustomTooltip name={building.name} />
              </Tooltip>
              <Popup closeButton={false}>
                <CustomPopup
                  onClick={mapRef.current.closePopup}
                  description={building.description}
                />
              </Popup>
            </Polygon>
          );
        })}
      </Map>
    </>
  );
};
