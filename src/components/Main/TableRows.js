import classes from "../../styles/TableRow.module.css";
import { useDispatch } from "react-redux";
import { mapActions } from "../../context/map-slice";
import { useSelector } from "react-redux";

const TableRows = (props) => {
  const appliedFilter = useSelector((state) => state.filterSlice.appliedFilter);
  const isLoggedIn = useSelector((state) => state.loginSlice.isLoggedIn);
  const userBookmarks = useSelector((state) => state.loginSlice.userBookmarks);
  const dispatch = useDispatch();

  const sortingNameFunction = (a, b) => {
    if (a.toLowerCase() < b.toLowerCase()) {
      return -1;
    }
    if (a.toLowerCase() > b.toLowerCase()) {
      return 1;
    }
    return 0;
  };

  const sortingNumberFunction = (a, b) => {
    return parseInt(a) - parseInt(b);
  };

  const sortingBookmarksFunction = (x, y) => {
    return Number(y) - Number(x);
  };

  if (props.isLoading) {
    return null;
  }

  return (
    <div className={classes.rows}>
      {props.data
        .sort(function (a, b) {
          if (!appliedFilter) {
            return 0;
          }
          if (appliedFilter === "nameFilter") {
            return sortingNameFunction(a.name, b.name);
          }
          if (appliedFilter === "countryFilter") {
            return sortingNameFunction(a.country, b.country);
          }
          if (appliedFilter === "whenToGoFilter") {
            return sortingNameFunction(a.month, b.month);
          }
          if (appliedFilter === "latitudeFilter") {
            return sortingNumberFunction(a.lat, b.lat);
          }
          if (appliedFilter === "longitudeFilter") {
            return sortingNumberFunction(a.long, b.long);
          }
          if (appliedFilter === "windFilter") {
            return sortingNumberFunction(a.probability, b.probability);
          }
          if (appliedFilter === "bookmarkFilter" && isLoggedIn) {
            return sortingBookmarksFunction(
              userBookmarks.includes(Number(a.id)),
              userBookmarks.includes(Number(b.id))
            );
          }
          return 0;
        })
        .filter((data) => {
          if (!props.filters) {
            return data;
          } else if (
            props.filters.country
              .toLowerCase()
              .includes(data.country.toLowerCase()) &&
            Number(props.filters.wind) <= Number(data.probability)
          ) {
            return data;
          }
          return null;
        })
        .filter((data) => {
          if (props.searchTerm === "") {
            return data;
          } else if (
            data.name.toLowerCase().includes(props.searchTerm.toLowerCase())
          ) {
            return data;
          }
          return null;
        })
        .map((data) => {
          return (
            <ul
              onClick={() => {
                dispatch(
                  mapActions.focus([Number(data.lat), Number(data.long)])
                );
              }}
              key={data.id}
            >
              <li>{data.name}</li>
              <li>{data.country}</li>
              <li>{String(Number(data.lat).toFixed(4))}</li>
              <li>{String(Number(data.long).toFixed(4))}</li>
              <li>{data.probability}</li>
              <li>{data.month}</li>
              {userBookmarks.includes(Number(data.id)) && isLoggedIn ? (
                <i className="fas fa-star"></i>
              ) : (
                <i className="far fa-star"></i>
              )}
            </ul>
          );
        })}
    </div>
  );
};

export default TableRows;
