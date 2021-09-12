import React from "react";
import { Redirect, Route } from "react-router-dom";

const PrivateRoute = ({ component: Component, authUser, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        authUser ? (
          <Component {...props} authUser={authUser}></Component>
        ) : (
          <Redirect to={{ pathname: "/signin", state: props.location }} />
        )
      }
    ></Route>
  );
};

export default PrivateRoute;
