import classes from "../../styles/Table.module.css";
import TableRows from "./TableRows";

import { Oval } from "react-loader-spinner";
import { useState } from "react";
import { filterSliceActions } from "../../context/filter-slice";
import { useDispatch } from "react-redux";

const Table = (props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();

  const bookmarkHandler = () => {
    dispatch(filterSliceActions.setFilter("bookmarkFilter"));
  };

  const nameFilterHandler = () => {
    dispatch(filterSliceActions.setFilter("nameFilter"));
  };
  const countryFilterHandler = () => {
    dispatch(filterSliceActions.setFilter("countryFilter"));
  };
  const whenToGoFilterHandler = () => {
    dispatch(filterSliceActions.setFilter("whenToGoFilter"));
  };
  const latitudeFilterHandler = () => {
    dispatch(filterSliceActions.setFilter("latitudeFilter"));
  };
  const longitudeFilterHandler = () => {
    dispatch(filterSliceActions.setFilter("longitudeFilter"));
  };
  const windFilterHandler = () => {
    dispatch(filterSliceActions.setFilter("windFilter"));
  };

  return (
    <div className={classes.container}>
      <div className={classes.search}>
        <h1>Location</h1>
        <input
          placeholder="Search..."
          type="text"
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        ></input>
      </div>

      <div className={classes.filters}>
        <h1>
          <i className="fas fa-arrows-alt-v" onClick={nameFilterHandler}></i>{" "}
          Name
        </h1>
        <h1>
          <i className="fas fa-arrows-alt-v" onClick={countryFilterHandler}></i>{" "}
          Country
        </h1>
        <h1>
          <i
            className="fas fa-arrows-alt-v"
            onClick={latitudeFilterHandler}
          ></i>{" "}
          Latitude
        </h1>
        <h1>
          <i
            className="fas fa-arrows-alt-v"
            onClick={longitudeFilterHandler}
          ></i>{" "}
          Longitude
        </h1>
        <h1>
          <i className="fas fa-arrows-alt-v" onClick={windFilterHandler}></i>{" "}
          Wind Prob
        </h1>
        <h1>
          <i
            className="fas fa-arrows-alt-v"
            onClick={whenToGoFilterHandler}
          ></i>{" "}
          When To Go
        </h1>
        <h1>
          {" "}
          <i className="fas fa-arrows-alt-v" onClick={bookmarkHandler}></i>
          Bookmarked
        </h1>
      </div>
      {props.isLoading ? (
        <Oval height="100" width="100" color="grey" ariaLabel="loading" />
      ) : (
        <div className={classes.table}>
          <div className={classes.list}>
            <TableRows
              data={props.data}
              isLoading={props.isLoading}
              searchTerm={searchTerm}
              filters={props.filters}
            ></TableRows>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
