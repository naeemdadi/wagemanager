import React from "react";
import { Box, Link, makeStyles, Typography } from "@material-ui/core";

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
      {/* <AppBar position="fixed" elevation={0} color="primary"></AppBar> */}
      {/* main content */}
      <div className={classes.page}>
        <div className={classes.toolbar}></div>
        {children}
      </div>
      <Box mt={3}>
        <Copyright />
      </Box>
    </div>
  );
}
