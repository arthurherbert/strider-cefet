import React, { useRef, useImperativeHandle, forwardRef } from "react";
import { Map as ReactLeafletMap, TileLayer } from "react-leaflet";

const bounds = [
  [-19.93706818861579, -43.99688463192433],
  [-19.940991528702593, -44.00114397983999]
];
const DGTileUrl =
  "https://earthwatch.digitalglobe.com/earthservice/tmsaccess/tms/1.0.0/DigitalGlobe:ImageryTileService@EPSG:3857@jpg/{z}/{x}/{y}.jpg?connectId=f23edc43-408f-44bd-ae0c-03e0a294777f";

const mapStyle = {
  height: "100%",
  width: "100%"
};

export const Map = forwardRef((props, ref) => {
  const mapRef = useRef(null);

  useImperativeHandle(ref, () => ({
    closePopup() {
      if (mapRef.current) {
        mapRef.current.leafletElement.closePopup();
      }
    }
  }));

  return (
    <ReactLeafletMap bounds={bounds} style={mapStyle} ref={mapRef}>
      <TileLayer
        tms={true}
        attribution="(c) DigitalGlobe"
        url={DGTileUrl}
        maxZoom={25}
        maxNativeZoom={18}
      />
      {props.children}
    </ReactLeafletMap>
  );
});
