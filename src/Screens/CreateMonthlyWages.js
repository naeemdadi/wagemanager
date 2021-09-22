import {
  Button,
  CircularProgress,
  Link,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import React, { useEffect, useState } from "react";
import DateFnsUtils from "@date-io/date-fns";
import { db } from "../firebase";
import firebase from "firebase";
import { Link as RouterLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  form: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  textFieldContainer: {
    display: "flex",
    gap: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      display: "block",
    },
  },
  formField: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  datePicker: {
    marginRight: theme.spacing(2),
  },
}));

export default function CreateMonthlyWages(props) {
  const classes = useStyles();
  const [employees, setEmployees] = useState([]);
  const [year, setYear] = useState(new Date());
  const [month, setMonth] = useState(new Date());
  const [data, setData] = useState([]);
  const [submitLoad, setSubmitLoad] = useState(false);
  const [error, setError] = useState(false);

  const { authUser } = props;

  useEffect(() => {
    const unsubscribe = db
      .collection(authUser.uid)
      .doc(authUser.displayName)
      .collection("employees")
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const removeExited = data.filter((el) => el.isExited !== true);
        setEmployees(removeExited);
      });
    return () => unsubscribe();
  }, [authUser]);

  useEffect(() => {
    const empId = employees.map((emp) => ({ empRef: emp.id }));
    setData(empId);
  }, [employees]);

  const onChangeDaysHandler = (id) => (e) => {
    setData(
      data.map((el) =>
        el.empRef === id ? { ...el, workingDays: e.target.value } : el
      )
    );
  };

  const onChangeOtHandler = (id) => (e) => {
    setData(
      data.map((el) =>
        el.empRef === id ? { ...el, otHours: e.target.value } : el
      )
    );
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setSubmitLoad(true);

    const errorFilter = data.filter((el) => !el.workingDays && !el.otHours);

    if (errorFilter.length !== 0) {
      setError(true);
      setSubmitLoad(false);
      return;
    }

    const updatedData = data.filter((emp) => emp.workingDays !== "0");

    const updatedMonth = month.toString().split(" ")[1];
    const updatedYear = parseInt(year.toString().split(" ")[3]);

    db.collection(authUser.uid)
      .doc(authUser.displayName)
      .collection("Monthly Data")
      .add({
        employee: updatedData,
        year: updatedYear,
        month: updatedMonth,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        setSubmitLoad(false);
        props.history.push("/");
      });
  };

  const renderPages = () => {
    if (employees?.length === 0) {
      return (
        <Typography
          variant="h4"
          color="textSecondary"
          component="h2"
          gutterBottom
          align="center"
        >
          Please add some{" "}
          <Link component={RouterLink} to="/employees/add" color="primary">
            employees
          </Link>
        </Typography>
      );
    } else {
      return (
        <div>
          <Typography
            variant="h6"
            color="textSecondary"
            component="h2"
            gutterBottom
          >
            Add Employees Monthly Data
          </Typography>

          <form
            noValidate
            autoComplete="off"
            className={classes.form}
            onSubmit={onSubmitHandler}
          >
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                disableFuture
                openTo="year"
                inputVariant="standard"
                format="yyyy"
                label="Select Year"
                views={["year"]}
                value={year}
                className={`${classes.formField} ${classes.datePicker}`}
                onChange={(e) => setYear(e)}
              />
              <DatePicker
                disableFuture
                format="MM"
                label="Select Month"
                inputVariant="standard"
                views={["month"]}
                value={month}
                className={classes.formField}
                onChange={(e) => setMonth(e)}
              />
            </MuiPickersUtilsProvider>
            {employees.map((employee) => {
              const currEmp = data.find((emp) => emp.empRef === employee.id);
              return (
                <div key={employee.id} className={classes.textFieldContainer}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={`${employee.firstName} ${employee.middleName} ${employee.lastName}`}
                    variant="standard"
                    className={classes.formField}
                    disabled
                  />
                  <TextField
                    label="Working Days"
                    variant="standard"
                    type="number"
                    error={error && !currEmp.workingDays}
                    helperText={
                      error && !currEmp.workingDays
                        ? "Working Days is Required field! Set 0 if not available."
                        : null
                    }
                    onFocus={() => setError(false)}
                    color="primary"
                    className={classes.formField}
                    onChange={onChangeDaysHandler(employee.id)}
                  />
                  <TextField
                    label="OT Hours"
                    variant="standard"
                    type="number"
                    error={error && !currEmp.otHours}
                    helperText={
                      error && !currEmp.otHours
                        ? "Overtime is Required field! Set 0 if not available."
                        : null
                    }
                    onFocus={() => setError(false)}
                    color="primary"
                    className={classes.formField}
                    onChange={onChangeOtHandler(employee.id)}
                  />
                </div>
              );
            })}

            <Button
              type="submit"
              color="primary"
              variant="contained"
              className={classes.formField}
              size="large"
            >
              {submitLoad ? (
                <CircularProgress size="inherit" color="inherit" />
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </div>
      );
    }
  };

  return renderPages();
}
