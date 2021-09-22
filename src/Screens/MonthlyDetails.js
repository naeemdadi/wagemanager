import {
  Button,
  CircularProgress,
  Fab,
  makeStyles,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { db } from "../firebase";
import Loading from "../Components/Loading";
import { Delete, Edit, Visibility, ListAlt } from "@material-ui/icons";

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

export default function MonthlyDetails(props) {
  const classes = useStyles();

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [submitLoad, setSubmitLoad] = useState(false);
  const [employees, setEmployees] = useState([]);

  const { authUser, searchValue } = props;

  const filteredEmployees = employees?.filter((emp) => {
    const { firstName, middleName, lastName } = emp;

    if (
      firstName?.toLowerCase().includes(searchValue) ||
      middleName?.toLowerCase().includes(searchValue) ||
      lastName?.toLowerCase().includes(searchValue)
    ) {
      return emp;
    } else {
      return false;
    }
  });

  useEffect(() => {
    db.collection(authUser.uid)
      .doc(authUser.displayName)
      .collection("Monthly Data")
      .doc(props.match.params.id)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          return;
        } else {
          setData({ id: doc.id, ...doc.data() });
        }
      });

    const unsubscribe = db
      .collection(authUser.uid)
      .doc(authUser.displayName)
      .collection("employees")
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEmployees(data);
        setLoading(false);
      });
    return () => unsubscribe();
  }, [props, authUser]);

  const onChangeDaysHandler = (id) => (e) => {
    const updatedData = data.employee.map((el) =>
      el.empRef === id ? { ...el, workingDays: e.target.value } : el
    );

    setData({
      ...data,
      employee: updatedData,
    });
  };

  const onChangeOtHandler = (id) => (e) => {
    const updatedData = data.employee.map((el) =>
      el.empRef === id ? { ...el, otHours: e.target.value } : el
    );

    setData({
      ...data,
      employee: updatedData,
    });
  };

  const onUpdateHandler = (e) => {
    e.preventDefault();
    setSubmitLoad(true);

    const errorFilter = data.employee.filter(
      (el) => !el.workingDays && !el.otHours
    );

    if (errorFilter.length !== 0) {
      setError(true);
      setSubmitLoad(false);
      return;
    }

    const updatedData = data.employee.filter((emp) => emp.workingDays !== "0");

    db.collection(authUser.uid)
      .doc(authUser.displayName)
      .collection("Monthly Data")
      .doc(props.match.params.id)
      .update({ employee: updatedData, year: data.year, month: data.month })
      .then(() => {
        setSubmitLoad(false);
        props.history.push("/");
      });
  };

  const onDeleteHandler = () => {
    setSubmitLoad(true);
    const isSure = window.confirm(
      `Are you sure you want to delete ${data.month} ${data.year}?`
    );
    if (!isSure) {
      setSubmitLoad(false);
      return;
    } else {
      db.collection(authUser.uid)
        .doc(authUser.displayName)
        .collection("Monthly Data")
        .doc(props.match.params.id)
        .delete()
        .then(() => {
          setSubmitLoad(false);
          props.history.push("/");
        })
        .catch((error) => alert(error));
    }
  };

  const renderPage = () => {
    if (loading) {
      return <Loading loading={loading} />;
    } else {
      return (
        <div>
          <div
            className={classes.textFieldContainer}
            style={{ alignItems: "center" }}
          >
            <Typography
              variant="h4"
              color="textSecondary"
              component="h2"
              gutterBottom
            >
              Monthly Details
            </Typography>
            {isDisabled ? (
              <Tooltip title="Edit" aria-label="edit">
                <Fab
                  color="secondary"
                  size="small"
                  onClick={() => setIsDisabled(!isDisabled)}
                >
                  <Edit fontSize="small" />
                </Fab>
              </Tooltip>
            ) : (
              <Tooltip title="View" aria-label="view">
                <Fab
                  color="secondary"
                  size="small"
                  onClick={() => setIsDisabled(!isDisabled)}
                >
                  <Visibility fontSize="small" />
                </Fab>
              </Tooltip>
            )}
            {isDisabled ? (
              <Tooltip title="Delete" aria-label="delete">
                <Fab color="secondary" size="small" onClick={onDeleteHandler}>
                  {submitLoad ? (
                    <CircularProgress size={25} color="inherit" />
                  ) : (
                    <Delete fontSize="small" />
                  )}
                </Fab>
              </Tooltip>
            ) : null}

            {isDisabled ? (
              <Tooltip title="Wages Sheet" aria-label="wages">
                <Fab
                  color="secondary"
                  size="small"
                  component={RouterLink}
                  to={{
                    pathname: `${props.match.params.id}/wagessheet`,
                    state: { data, employees },
                  }}
                >
                  <ListAlt />
                </Fab>
              </Tooltip>
            ) : null}
          </div>

          <form
            noValidate
            autoComplete="off"
            className={classes.form}
            onSubmit={onUpdateHandler}
          >
            {data.employee.map((emp) => {
              const currEmp = filteredEmployees.find(
                (e) => e.id === emp.empRef
              );
              return (
                <div key={emp.empRef} className={classes.textFieldContainer}>
                  {!currEmp ? null : (
                    <React.Fragment>
                      <TextField
                        fullWidth
                        label="Name"
                        value={`${currEmp?.firstName} ${currEmp?.middleName} ${currEmp?.lastName}`}
                        variant="standard"
                        className={classes.formField}
                        disabled
                      />
                      <TextField
                        label="Working Days"
                        variant="standard"
                        type="number"
                        error={error && !emp.workingDays}
                        helperText={
                          error && !emp.workingDays
                            ? "Working Days is Required field! Set 0 if not available."
                            : null
                        }
                        onFocus={() => setError(false)}
                        color="primary"
                        className={classes.formField}
                        onChange={onChangeDaysHandler(emp.empRef)}
                        disabled={isDisabled}
                        value={emp.workingDays}
                      />
                      <TextField
                        label="OT Hours"
                        variant="standard"
                        type="number"
                        error={error && !emp.otHours}
                        helperText={
                          error && !emp.otHours
                            ? "Overtime is Required field! Set 0 if not available."
                            : null
                        }
                        onFocus={() => setError(false)}
                        color="primary"
                        className={classes.formField}
                        onChange={onChangeOtHandler(emp.empRef)}
                        disabled={isDisabled}
                        value={emp.otHours}
                      />
                    </React.Fragment>
                  )}
                </div>
              );
            })}

            {!isDisabled ? (
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
                  "Update"
                )}
              </Button>
            ) : null}
          </form>
        </div>
      );
    }
  };

  return renderPage();
}
