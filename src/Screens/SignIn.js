import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Link } from "@material-ui/core";
import { auth } from "../firebase";
import firebase from "firebase";
import { useHistory } from "react-router";

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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  guest: {
    marginBottom: theme.spacing(1),
  },
  link: {
    cursor: "pointer",
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const history = useHistory();

  const [userData, setuserData] = useState({
    email: "",
    password: "",
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

  const [remember, setRemember] = useState(false);

  const signInHandler = (e) => {
    e.preventDefault();

    if (!userData.password) {
      setRequiredError(true);
    } else if (!validateEmail(userData.email)) {
      setIsEmailError(true);
    } else {
      if (remember) {
        auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() =>
          auth
            .signInWithEmailAndPassword(userData.email, userData.password)
            .then(() => history.push("/"))
            .catch((error) => alert(error))
        );
      } else {
        auth
          .signInWithEmailAndPassword(userData.email, userData.password)
          .then(() => history.push("/"))
          .catch((error) => alert(error));
      }
    }
  };

  const onGuestSignIn = () => {
    auth
      .signInWithEmailAndPassword("test@gmail.com", "test123")
      .then(() => history.push("/"))
      .catch((error) => alert(error));
  };

  const passwordReset = () => {
    if (!validateEmail(userData.email)) {
      setIsEmailError(true);
      return;
    }

    auth
      .sendPasswordResetEmail(userData.email)
      .then(() => alert("Please check your mails"))
      .catch((err) => alert(err));
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={signInHandler}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={onChangeHandler("email")}
            error={isEmailError}
            helperText={isEmailError ? "Please add valid Email Address" : null}
            onFocus={() => setIsEmailError(false)}
          />
          <TextField
            variant="outlined"
            margin="normal"
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
          <FormControlLabel
            control={
              <Checkbox
                value="remember"
                color="primary"
                onChange={() => setRemember(!remember)}
              />
            }
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            className={classes.guest}
            onClick={onGuestSignIn}
          >
            Sign In as Guest
          </Button>
          <Grid container>
            <Grid item xs>
              <Link
                variant="body2"
                onClick={passwordReset}
                className={classes.link}
              >
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link
                variant="body2"
                onClick={() => history.push("/signup")}
                className={classes.link}
              >
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
