import { Link, Typography } from "@material-ui/core";
import React from "react";
import { Route, Link as RouterLink } from "react-router-dom";

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
          // <Redirect to={props.history.location.pathname} />
          <Typography
            variant="h4"
            color="textSecondary"
            component="h2"
            gutterBottom
            align="center"
          >
            Please{" "}
            <Link component={RouterLink} to="/signin">
              SignIn
            </Link>
          </Typography>
        )
      }
    ></Route>
  );
};

export default PrivateRoute;
