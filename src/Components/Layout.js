import React from "react";
import {
  Link,
  makeStyles,
  Typography,
  Container,
  Box,
} from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import MenuBar from "./MenuBar";

const useStyles = makeStyles((theme) => {
  return {
    page: {
      width: "100%",
      marginTop: theme.spacing(5),
      minHeight: "90vh",
    },
    toolbar: theme.mixins.toolbar,
    date: {
      flexGrow: 1,
    },
    avatar: {
      marginLeft: theme.spacing(2),
    },
    copyright: {
      marginBottom: theme.spacing(3),
    },
  };
});

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link component={RouterLink} color="inherit" to="/">
        WagesManager
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function Layout(props) {
  const classes = useStyles();
  const { children, authUser, searchHandler } = props;
  return (
    <div>
      {/* app bar */}
      <MenuBar authUser={authUser} searchHandler={searchHandler} />

      {/* main content */}
      <Container>
        <div className={classes.page}>{children}</div>
        <Box className={classes.copyright}>
          <Copyright />
        </Box>
      </Container>
    </div>
  );
}
