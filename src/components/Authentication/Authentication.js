import classes from "../../styles/Auth.module.css";
import { Link } from "react-router-dom";
import useGetData from "../../hooks/useGetData";
import { useEffect, useRef } from "react";
import { loginSliceActions } from "../../context/login-slice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Authentication = (props) => {
  const navigate = useNavigate();
  const { fetchData: fetchUserData, data: userData } = useGetData(
    "https://62334ee0a3d0e4ac0bdf90ce.mockapi.io/user"
  );
  const dispatch = useDispatch();

  const userRef = useRef();

  const submitHandler = (e) => {
    e.preventDefault();
    if (
      Number(userRef.current.value) >= 1 &&
      Number(userRef.current.value) <= 100
    ) {
      const user = userData.find((user) => user.id === userRef.current.value);
      dispatch(loginSliceActions.login(user));
      dispatch(loginSliceActions.setBookmarks(user.bookmarkedID));

      navigate("/", { replace: true });
    } else {
      alert("Please use a username between 1 and 100");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return (
    <div className={classes.auth}>
      <form onSubmit={submitHandler}>
        <Link to="/">
          <h1>Kite</h1>
        </Link>
        <label>Username</label>
        <p>
          *For authentication use any ID from 1 to 100 for the username and type
          any password*
        </p>
        <input type="text" ref={userRef} required></input>
        <label>Password</label>
        <input type="password" required></input>
        <button type="submit">Log in</button>
      </form>
    </div>
  );
};

export default Authentication;
