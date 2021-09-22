import React from "react";
import { Redirect, Route } from "react-router-dom";

const PrivateRoute = ({
  component: Component,
  authUser,
  searchValue,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        authUser ? (
          <Component
            {...props}
            authUser={authUser}
            searchValue={searchValue}
          ></Component>
        ) : (
          <Redirect to="/signin" />
        )
      }
    ></Route>
  );
};

export default PrivateRoute;
