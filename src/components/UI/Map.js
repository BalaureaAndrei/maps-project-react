import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { useState, useRef, useEffect } from "react";
import classes from "../../styles/Map.module.css";
import { useSelector } from "react-redux";
import React from "react";
import useGetData from "../../hooks/useGetData";
import { useDispatch } from "react-redux";
import { mapActions } from "../../context/map-slice";
import { redIcon, goldIcon } from "./Icons";
import ErrorModal from "./ErrorModal";
import { loginSliceActions } from "../../context/login-slice";

const replacerFunc = () => {
  const visited = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (visited.has(value)) {
        return;
      }
      visited.add(value);
    }
    return value;
  };
};

function LocationMarker() {
  const focus = useSelector((state) => state.mapPositionSlice.mapPosition);
  const dispatch = useDispatch();
  const countryRef = useRef();
  const nameRef = useRef();
  const seasonRef = useRef();
  const [position, setPosition] = useState(null);
  const [postingError, setPostingError] = useState(null);

  const submitHandler = (e) => {
    e.preventDefault();
    const today = new Date();
    const todayDate =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    const date = new Date(seasonRef.current.value);
    const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
      date
    );

    const postingData = {
      country: countryRef.current.value,
      createdAt: todayDate,
      id: Math.random(),
      lat: position.lat,
      long: position.lng,
      month: month,
      name: nameRef.current.value,
      probability: Math.floor(Math.random() * 100),
    };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(postingData, replacerFunc()),
    };

    fetch("https://62334ee0a3d0e4ac0bdf90ce.mockapi.io/spot", requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Maximum number of elements reached");
        }
        return response.json();
      })
      .then((data) => {
        dispatch(mapActions.rerender(data));
        setPosition(null);
      })
      .catch((err) => {
        setPostingError(err);
      });
  };

  const map = useMapEvents({
    click(e) {
      map.locate();
      setPosition(e.latlng);
    },
    loading() {
      map.flyTo(focus);
    },
  });

  if (postingError) {
    return (
      <ErrorModal
        type="Error"
        body={
          <div>
            <p>{postingError.message}</p>
            <p>Cannot add more elements</p>
          </div>
        }
      ></ErrorModal>
    );
  }

  return position === null ? null : (
    <Popup position={position}>
      <form className={classes.popupForm} onSubmit={submitHandler}>
        <h1>Add Spot</h1>
        <h2>Name</h2>
        <input type="text" ref={nameRef} required></input>
        <h2>Country</h2>
        <input type="text" ref={countryRef} required></input>
        <h2>High Season</h2>
        <input type="date" ref={seasonRef} required></input>
        <button type="submit">Confirm</button>
      </form>
    </Popup>
  );
}

const Map = (props) => {
  const focus = useSelector((state) => state.mapPositionSlice.mapPosition);
  const post = useSelector((state) => state.mapPositionSlice.setPost);
  const userData = useSelector((state) => state.loginSlice.userData);
  const userBookmarks = useSelector((state) => state.loginSlice.userBookmarks);
  const isLoggedIn = useSelector((state) => state.loginSlice.isLoggedIn);
  const dispatch = useDispatch();
  const {
    fetchData: fetchSpots,
    data: spots,
    error: spotsError,
  } = useGetData("https://62334ee0a3d0e4ac0bdf90ce.mockapi.io/spot");

  useEffect(() => {
    fetchSpots();
  }, [fetchSpots, post]);

  if (spotsError) {
    return (
      <ErrorModal
        type="Error"
        body={
          <div>
            <p>{spotsError}</p>
            <p>Unable to render map</p>
          </div>
        }
      ></ErrorModal>
    );
  }

  const bookmarkHandler = (data, id, state) => {
    if (!isLoggedIn) {
      alert("Cannot bookmark locations when not logged in");
      return null;
    }

    let helper = [];
    helper = [...userBookmarks];

    if (state) {
      helper.push(Number(id));
    }

    if (!state) {
      const filtered = helper.filter((data) => data !== Number(id));
      helper = filtered;
    }

    dispatch(loginSliceActions.setBookmarks(helper));

    const api = `https://62334ee0a3d0e4ac0bdf90ce.mockapi.io/user/${userData.id}`;
    fetch(api, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bookmarkedID: helper }, replacerFunc()),
    })
      .then((response) => response.json())
      .then((data) => dispatch(mapActions.rerender(data)));
  };

  return (
    <MapContainer
      center={focus}
      zoom={1}
      fadeAnimation={true}
      maxZoom={6}
      minZoom={2}
    >
      <TileLayer
        attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker></LocationMarker>

      {spots
        .filter((data) => {
          if (!props.filters) {
            return data;
          }
          if (
            props.filters.country
              .toLowerCase()
              .includes(data.country.toLowerCase()) &&
            Number(props.filters.wind) <= Number(data.probability)
          ) {
            return data;
          }
          return null;
        })
        .map((data) => (
          <Marker
            position={[data.lat, data.long]}
            key={data.id}
            icon={
              userBookmarks.includes(Number(data.id)) && isLoggedIn
                ? goldIcon
                : redIcon
            }
          >
            <Popup className={classes.popupContainer}>
              <div className={classes.popup}>
                <h1>
                  {data.name}
                  {userBookmarks.includes(Number(data.id)) && (
                    <i className="fas fa-star"></i>
                  )}
                </h1>
                <h2>{data.country}</h2>
                <h3>WIND PROBABILITY</h3>
                <p>{data.probability}</p>
                <h3>LATITUDE</h3>
                <p>{String(Number(data.lat).toFixed(4))}</p>
                <h3>LONGITUDE</h3>
                <p>{String(Number(data.long).toFixed(4))}</p>
                <h3>WHEN TO GO</h3>
                <p>{data.month}</p>
                {isLoggedIn ? (
                  userBookmarks.includes(Number(data.id)) ? (
                    <button
                      onClick={bookmarkHandler.bind("_", data, data.id, false)}
                      className={classes.remove}
                    >
                      - Remove from Favourites
                    </button>
                  ) : (
                    <button
                      onClick={bookmarkHandler.bind("_", data, data.id, true)}
                      className={classes.add}
                    >
                      + Add to Favourites
                    </button>
                  )
                ) : (
                  <div>
                    <hr></hr>
                    <p className={classes.loginAlert}>
                      Cannot add bookmarks while not logged in
                    </p>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
};

export default React.memo(Map);
