import classes from "../../styles/Main.module.css";
import Map from "../UI/Map";
import useGetData from "../../hooks/useGetData";
import { useEffect, useState, useRef } from "react";
import Table from "./Table";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ErrorModal from "../UI/ErrorModal";
import filterImage from "../../assets/filter.png";
import { useDispatch } from "react-redux";
import { loginSliceActions } from "../../context/login-slice";

const Main = (props) => {
  const post = useSelector((state) => state.mapPositionSlice.setPost);
  const user = useSelector((state) => state.loginSlice.userData);
  const isLoggedIn = useSelector((state) => state.loginSlice.isLoggedIn);
  const [isFilterOpened, setIsFilteredOpened] = useState(false);
  const [filters, setFilters] = useState(null);
  const [isProfileOpened, setIsProfileOpened] = useState(false);
  const countryRef = useRef();
  const windRef = useRef();
  const dispatch = useDispatch();

  const openFilterHandler = () => {
    setIsFilteredOpened((prevState) => !prevState);
  };

  const openProfileHandler = () => {
    setIsProfileOpened((prevState) => !prevState);
  };

  const logoutHandler = () => {
    dispatch(loginSliceActions.logout());
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setFilters({
      country: countryRef.current.value,
      wind: windRef.current.value,
    });
    countryRef.current.value = "";
    windRef.current.value = "";
  };

  const removeHandler = (e) => {
    e.preventDefault();
    setFilters(null);
  };

  const {
    fetchData: fetchSpots,
    data: spots,
    error: spotsError,
    isLoading: isSpotsLoading,
  } = useGetData("https://62334ee0a3d0e4ac0bdf90ce.mockapi.io/spot");

  useEffect(() => {
    fetchSpots();
  }, [fetchSpots, post]);

  if (spotsError) {
    <ErrorModal
      type="Error"
      body={
        <div>
          <p>{spotsError}</p>
          <p>Unable to list the spots</p>
        </div>
      }
    ></ErrorModal>;
  }

  return (
    <div className={classes.main}>
      <div className={classes.nav} data-aos="fade-in" data-aos-delay="100">
        <h1>Kite</h1>

        {isLoggedIn ? (
          <div className={classes["isLoggedIn-container"]}>
            <p
              data-aos="fade-right"
              data-aos-delay="300"
            >{`Welcome back , User ${user.id}`}</p>
            <i className="fas fa-user" onClick={openProfileHandler}></i>
          </div>
        ) : (
          <Link to="/authentication">
            <i className="fas fa-user"></i>
          </Link>
        )}
      </div>
      <div className={classes.map} data-aos="fade-in" data-aos-delay="200">
        <div className={classes.filterContainer}>
          <button className={classes.filterButton} onClick={openFilterHandler}>
            <img alt="" src={filterImage}></img>Filter
          </button>
          {isFilterOpened && (
            <form
              className={classes.filterBox}
              data-aos="fade-in"
              onSubmit={submitHandler}
            >
              <h3>Country</h3>
              <input type="text" required ref={countryRef}></input>
              <h3>Wind</h3>
              <input type="text" required ref={windRef}></input>
              <button type="submit">Apply Filters</button>
              <button type="submit" onClick={removeHandler}>
                Remove Filters
              </button>
            </form>
          )}
        </div>
        {isProfileOpened && isLoggedIn && (
          <div className={classes.logout} data-aos="fade-in">
            <h5>User ID</h5>
            <p>{user.id}</p>
            <h5>E-mail</h5>
            <p>{user.email}</p>
            <button onClick={logoutHandler}>
              <i className="fas fa-sign-out-alt"></i> Log Out
            </button>
          </div>
        )}
        <Map data={spots} filters={filters}></Map>
      </div>
      <div className={classes.table} data-aos="fade-in" data-aos-delay="300">
        <Table
          data={spots}
          isLoading={isSpotsLoading}
          filters={filters}
        ></Table>
      </div>
    </div>
  );
};

export default Main;
