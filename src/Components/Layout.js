import React from "react";
import {
  Box,
  Link,
  makeStyles,
  Typography,
  Container,
} from "@material-ui/core";
import { auth } from "../firebase";
import MenuBar from "./MenuBar";

const useStyles = makeStyles((theme) => {
  return {
    page: {
      width: "100%",
      padding: theme.spacing(3),
    },
    toolbar: theme.mixins.toolbar,
    date: {
      flexGrow: 1,
    },
    avatar: {
      marginLeft: theme.spacing(2),
    },
    copyright: {
      position: "absolute",
      bottom: theme.spacing(5),
      left: "50%",
      transform: "translateX(-50%)",
    },
  };
});

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="/">
        WagesManager
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function Layout({ children }) {
  const classes = useStyles();
  return (
    <div>
      {/* app bar */}
      <MenuBar />
      {/* main content */}
      <Container>
        <div className={classes.page}>
          <div className={classes.toolbar}></div>
          {children}
        </div>
        <div onClick={() => auth.signOut()}>Signout</div>
        {/* <Box className={classes.copyright}>
        <Copyright />
      </Box> */}
      </Container>
    </div>
  );
}
