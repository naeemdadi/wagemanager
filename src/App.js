import { useEffect, useState } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import "./App.css";
import Layout from "./Components/Layout";
import Loading from "./Components/Loading";
import PrivateRoute from "./Components/PrivateRoute";
import { auth } from "./firebase";
import CreateMonthlyWages from "./Screens/CreateMonthlyWages";
import EmployeeDetails from "./Screens/EmployeeDetails";
import Employees from "./Screens/Employees";
import Home from "./Screens/Home";
import MonthlyDetails from "./Screens/MonthlyDetails";
import NewEmployee from "./Screens/NewEmployee";
import SignIn from "./Screens/SignIn";
import SignUp from "./Screens/SignUp";
import WagesSheet from "./Screens/WagesSheet";

function App() {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    setLoading(true);
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

  const onSearchInputHandler = (e) => {
    setSearchInput(e.target.value);
  };

  const renderPages = () => {
    if (loading) {
      return <Loading loading={loading} />;
    } else {
      return (
        <Layout authUser={authUser} searchHandler={onSearchInputHandler}>
          <Switch>
            <Route
              path="/signin"
              exact
              render={() => (authUser ? <Redirect to="/" /> : <SignIn />)}
              // component={SignIn}
            />
            <Route
              path="/signup"
              exact
              render={() => (authUser ? <Redirect to="/" /> : <SignUp />)}
            />
            <PrivateRoute
              path="/"
              exact
              authUser={authUser}
              searchValue={searchInput}
              component={Home}
            />
            <PrivateRoute
              path="/employees"
              exact
              authUser={authUser}
              component={Employees}
              searchValue={searchInput}
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
            <PrivateRoute
              path="/create"
              exact
              component={CreateMonthlyWages}
              authUser={authUser}
            />
            <PrivateRoute
              path="/:id"
              exact
              authUser={authUser}
              component={MonthlyDetails}
              searchValue={searchInput}
            />
            <PrivateRoute
              path="/:id/wagessheet"
              exact
              authUser={authUser}
              component={WagesSheet}
              searchValue={searchInput}
            />
          </Switch>
        </Layout>
      );
    }
  };

  return renderPages();
}

export default App;
