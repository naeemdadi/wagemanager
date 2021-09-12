import { Route, Switch } from "react-router-dom";
import "./App.css";
import Layout from "./Components/Layout";
import EmployeeDetails from "./Screens/EmployeeDetails";
import Employees from "./Screens/Employees";
import Home from "./Screens/Home";
import NewEmployee from "./Screens/NewEmployee";
import SignIn from "./Screens/SignIn";
import SignUp from "./Screens/SignUp";

function App() {
  return (
    <div>
      <Layout>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/employees" exact component={Employees} />
          <Route path="/employees/add" exact component={NewEmployee} />
          <Route path="/employees/:id" exact component={EmployeeDetails} />
          <Route path="/signin" exact component={SignIn} />
          <Route path="/signup" exact component={SignUp} />
        </Switch>
      </Layout>
    </div>
  );
}

export default App;
