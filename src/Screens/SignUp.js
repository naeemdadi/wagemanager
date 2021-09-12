import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useHistory } from "react-router";
import { auth } from "../firebase";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  link: {
    cursor: "pointer",
  },
}));

export default function SignUp() {
  const classes = useStyles();
  const history = useHistory();

  const [userData, setuserData] = useState({
    email: "",
    password: "",
    companyName: "",
  });
  const [isEmailError, setIsEmailError] = useState(false);
  const [requiredError, setRequiredError] = useState(false);

  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const onChangeHandler = (input) => (e) => {
    setuserData({
      ...userData,
      [input]: e.target.value,
    });
  };

  const userSignUp = (e) => {
    e.preventDefault();

    if (!userData.companyName || !userData.password) {
      setRequiredError(true);
    } else if (!validateEmail(userData.email)) {
      setIsEmailError(true);
    } else {
      auth
        .createUserWithEmailAndPassword(userData.email, userData.password)
        .then(
          (authUser) =>
            authUser.user.updateProfile({
              displayName: userData.companyName,
            }),
          history.push("/")
        )
        .catch((error) => alert(error));
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate onSubmit={userSignUp}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="company"
                label="Company Name"
                name="company"
                autoComplete="company"
                onChange={onChangeHandler("companyName")}
                error={requiredError}
                helperText={
                  requiredError && !userData.companyName
                    ? "Company name is Required"
                    : null
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={onChangeHandler("email")}
                error={isEmailError}
                helperText={
                  isEmailError ? "Please add valid Email Address" : null
                }
                onFocus={() => setIsEmailError(false)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={onChangeHandler("password")}
                error={requiredError}
                helperText={requiredError ? "Password field is required" : null}
                onFocus={() => setRequiredError(false)}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link
                variant="body2"
                className={classes.link}
                onClick={() => history.push("/signin")}
              >
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
