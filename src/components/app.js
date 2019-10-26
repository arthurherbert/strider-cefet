import React, { useState, useEffect, useRef } from "react";
import { Map } from "../core/map";
import { Polygon, Tooltip, Polyline, Popup } from "react-leaflet";
import { SpinnerContainer } from "../core/spinner-container";
import { lineString, polygon } from "@turf/helpers";
import lineIntersect from "@turf/line-intersect";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import axios from "axios";

// Components
const CustomTooltip = props => {
  return <div>{props.name}</div>;
};

const CustomPopup = props => {
  return <div onClick={props.onClick}>{props.description}</div>;
};

export const StriderCefet = () => {
  // States
  const [isLoading, setIsLoading] = useState(false);
  const [cefetGeometry, setCefetGeometry] = useState([]);
  const [cefetBuiildings, setCefetBuildings] = useState([]);
  const [studentTracking, setStudentTracking] = useState([]);
  const [location, setLocation] = useState([]);
  // Refs
  const mapRef = useRef();

  // Efects
  useEffect(() => {
    // Show SpinnerContainer
    setIsLoading(true);
    var c1 = lineString(
      "https://strider-cefet-backend.arthurherbert.now.sh/get-cefet-geometry"
    );
    var c2 = lineString(
      "https://strider-cefet-backend.arthurherbert.now.sh/get-student-tracking"
    );
    console.log(c2);
    // var location = lineIntersect(c1, c2);
    // polygon([location]);
    // var i = 0;
    // do {
    //   if (booleanPointInPolygon(c2[i], cefetGeometry)) {
    //     polygon([c2[i]]);
    //   }
    //   i++;
    // } while (c2);
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
        }),

      axios.get(polygon).then(response => {
        setLocation(response.data);
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
        {location.length > 0 && (
          <Polyline color="green" fillOpacity={0.1} positions={polygon} />
        )}
        {studentTracking.length > 0 && <Polyline positions={studentTracking} />}
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
