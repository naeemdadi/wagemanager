import { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import Layout from "./Components/Layout";
import Loading from "./Components/Loading";
import PrivateRoute from "./Components/PrivateRoute";
import { auth } from "./firebase";
import EmployeeDetails from "./Screens/EmployeeDetails";
import Employees from "./Screens/Employees";
import Home from "./Screens/Home";
import NewEmployee from "./Screens/NewEmployee";
import SignIn from "./Screens/SignIn";
import SignUp from "./Screens/SignUp";

function App() {
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
      return <Loading loading={loading} />;
    } else {
      return (
        <Layout authUser={authUser}>
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
            <Route path="/signin" exact render={() => authUser ? <Home/> : <SignIn /> } />
            <Route path="/signup" exact render={() => authUser ? <Home/> : <SignUp /> } />
          </Switch>
        </Layout>
      );
    }
  };

  return renderPages();
}

export default App;
