import React, { useEffect, useState, useRef, useCallback } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";

import axios from "axios";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import NavBar from "./NavBar";
import Header from "./Header";

import logo from "../icons/logo2.svg";

import "../styles/Map.css";

const options = {
  disableDefaultUI: true,
};

const center = { lat: 53.480759, lng: -2.242631 };

const Map = () => {
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [username, setUsername] = useState();

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get("https://test-crane.herokuapp.com/cranes")
        .then(({ data }) => {
          setMarkers(data);
          axios
            .get(`https://test-crane.herokuapp.com/${data[0].craneUser}/users`)
            .then(({ data }) => {
              setUsername(data.username);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchData();
  }, []);

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
  }, []);

  const windowStyle = {
    width: "200px",
  };

  return (
    <div
      className="map"
      style={{
        overflow: "hidden",
      }}
    >
      <div className="google-maps">
        <GoogleMap
          mapContainerStyle={{
            height: "95vh",
            width: "100vw",
          }}
          zoom={13}
          center={center}
          options={options}
          onLoad={onMapLoad}
        >
          {markers.map((crane) => (
            <Marker
              position={{
                lat: crane.markers[0].lat,
                lng: crane.markers[0].lng,
              }}
              icon={{
                url: "crane-marker.svg",
                scaledSize: new window.google.maps.Size(35, 35),
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(15, 30),
              }}
              onClick={() => setSelectedMarker(crane)}
            />
          ))}

          {selectedMarker && (
            <InfoWindow
              position={{
                lat: selectedMarker.markers[0].lat,
                lng: selectedMarker.markers[0].lng,
              }}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div>
                <img src={logo} alt="logo" style={windowStyle}></img>
                <h3 style={{ marginBottom: "-5px" }}>{username}</h3>
                <p>{selectedMarker.craneCaption}</p>
                <p>Crane rating: {selectedMarker.craneRate}</p>
                <p>Location rating: {selectedMarker.craneBackgroundRate}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
      <Search panTo={panTo} />
      <Locate panTo={panTo} />
      <Header />
      <NavBar />
    </div>
  );
};

const Locate = ({ panTo }) => {
  return (
    <button
      style={{ outline: "none" }}
      className="locate"
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            panTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => null
        );
      }}
    >
      <img src="compass.svg" alt="find users current location" />
    </button>
  );
};

const Search = ({ panTo }) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 53.480759, lng: () => -2.242631 },
      radius: 200 * 1000,
    },
  });

  return (
    <div className="search">
      <Combobox
        style={{ outline: "none" }}
        onSelect={async (address) => {
          setValue(address, false);
          clearSuggestions();
          try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            panTo({ lat, lng });
          } catch (error) {
            console.log("Error!");
          }
        }}
      >
        <ComboboxInput
          style={{ outline: "none" }}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          disabled={!ready}
          placeholder="Search..."
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ id, description }) => (
                <ComboboxOption key={id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
};

export default Map;
