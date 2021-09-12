import { Backdrop, CircularProgress, makeStyles } from "@material-ui/core";
import { render } from "@testing-library/react";
import { useEffect, useState } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import "./App.css";
import Layout from "./Components/Layout";
import PrivateRoute from "./Components/PrivateRoute";
import { auth } from "./firebase";
import EmployeeDetails from "./Screens/EmployeeDetails";
import Employees from "./Screens/Employees";
import Home from "./Screens/Home";
import NewEmployee from "./Screens/NewEmployee";
import SignIn from "./Screens/SignIn";
import SignUp from "./Screens/SignUp";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

function App() {
  const history = useHistory();
  const classes = useStyles();

  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsbscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setAuthUser(user);
        setLoading(false);
      } else {
        setAuthUser(null);
        setLoading(false);
      }
    });
    return () => unsbscribe();
  }, []);

  const renderPages = () => {
    if (loading) {
      return (
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      );
    } else {
      return (
        <Layout>
          <Switch>
            <PrivateRoute path="/" exact authUser={authUser} component={Home} />
            <PrivateRoute
              path="/employees"
              exact
              authUser={authUser}
              component={Employees}
            />
            <PrivateRoute
              path="/employees/add"
              exact
              authUser={authUser}
              component={NewEmployee}
            />
            <PrivateRoute
              path="/employees/:id"
              exact
              authUser={authUser}
              component={EmployeeDetails}
            />
            <Route path="/signin" exact component={SignIn} />
            <Route path="/signup" exact component={SignUp} />
          </Switch>
        </Layout>
      );
    }
  };

  return renderPages();
}

export default App;
