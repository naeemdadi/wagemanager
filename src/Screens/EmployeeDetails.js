import {
  Button,
  CircularProgress,
  Fab,
  FormControl,
  FormControlLabel,
  FormLabel,
  makeStyles,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import Loading from "../Components/Loading";
import {
  AddToPhotosSharp,
  Delete,
  Edit,
  ExitToApp,
  Visibility,
} from "@material-ui/icons";

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

export default function EmployeeDetails(props) {
  const classes = useStyles();

  const { authUser } = props;

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitLoad, setSubmitLoad] = useState(false);
  const [error, setError] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    db.collection(authUser.uid)
      .doc(authUser.displayName)
      .collection("employees")
      .doc(props.match.params.id)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          return;
        } else {
          setData({
            ...doc.data(),
            birthDate: doc.data().birthDate.toDate(),
            joiningDate: doc.data().joiningDate.toDate(),
          });
          setLoading(false);
        }
      });
  }, [props, authUser]);

  const onUpdateHandler = (e) => {
    e.preventDefault();

    if (
      !data.firstName ||
      !data.middleName ||
      !data.lastName ||
      !data.birthDate ||
      !data.joiningDate ||
      !data.dailyWages ||
      !data.otRate ||
      !data.bankAccountNumber ||
      !data.ifscCode ||
      !data.pfNumber ||
      !data.workerCategory
    ) {
      setError(true);
      return;
    }

    db.collection(authUser.uid)
      .doc(authUser.displayName)
      .collection("employees")
      .doc(props.match.params.id)
      .update(data)
      .then(() => props.history.push("/employees"))
      .catch((error) => alert(error));
  };

  const onChangeHandler = (input) => (e) => {
    if (["firstName", "middleName", "lastName"].includes(input)) {
      setData({
        ...data,
        [input]: capitalizeFirstLetter(e.target.value).replace(/ /g, ""),
      });
      return;
    }
    if (
      ["dailyWages", "otRate", "bankAccountNumber", "mobileNumber"].includes(
        input
      )
    ) {
      let val = Math.sign(e.target.value);
      if (val === -1) {
        setData({
          ...data,
          [input]: null,
        });
      } else {
        setData({
          ...data,
          [input]: e.target.value,
        });
      }
      return;
    }
    setData({
      ...data,
      [input]: e.target.value.replace(/ /g, ""),
    });
  };

  const handleDateChange = (input) => (e) => {
    setData({
      ...data,
      [input]: e,
    });
  };

  function capitalizeFirstLetter(string) {
    return (string.charAt(0).toUpperCase() + string.slice(1)).replace(/ /g, "");
  }

  const onExitHandler = () => {
    const isSure = window.confirm(
      `Are you sure you want to change current status of ${data.firstName} ${data.lastName}?`
    );
    if (!isSure) {
      return;
    } else {
      db.collection(authUser.uid)
        .doc(authUser.displayName)
        .collection("employees")
        .doc(props.match.params.id)
        .update({ isExited: !data.isExited })
        .then(() => props.history.push("/employees"))
        .catch((error) => alert(error));
    }
  };

  const onDeleteHandler = () => {
    setSubmitLoad(true);
    const isSure = window.confirm(
      `Are you sure you want to delete ${data.firstName} ${data.lastName}? This is irreversible and you will lose all the previous monthly data associated with this employee. Marking exit will ensure the previous data of the employee won't be lost.`
    );
    if (!isSure) {
      setSubmitLoad(false);
      return;
    } else {
      db.collection(authUser.uid)
        .doc(authUser.displayName)
        .collection("employees")
        .doc(props.match.params.id)
        .delete()
        .then(() => {
          setSubmitLoad(false);
          props.history.push("/employees");
        })
        .catch((error) => alert(error));
    }
  };

  const renderPages = () => {
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
              variant="h6"
              color="textSecondary"
              component="h2"
              gutterBottom
            >
              Employee Details
            </Typography>
            {!isDisabled ? (
              <Tooltip title="View" aria-label="view">
                <Fab
                  color="secondary"
                  size="small"
                  onClick={() => setIsDisabled(!isDisabled)}
                >
                  <Visibility fontSize="small" />
                </Fab>
              </Tooltip>
            ) : (
              <Tooltip title="Edit" aria-label="edit">
                <Fab
                  color="secondary"
                  size="small"
                  onClick={() => setIsDisabled(!isDisabled)}
                >
                  <Edit fontSize="small" />
                </Fab>
              </Tooltip>
            )}
            {isDisabled && (
              <>
                {!data.isExited ? (
                  <Tooltip title="Mark Exit" aria-label="update">
                    <Fab color="secondary" size="small" onClick={onExitHandler}>
                      <ExitToApp size="small" />
                    </Fab>
                  </Tooltip>
                ) : (
                  <Tooltip title="Mark Entry" aria-label="update">
                    <Fab color="secondary" size="small" onClick={onExitHandler}>
                      <AddToPhotosSharp size="small" />
                    </Fab>
                  </Tooltip>
                )}

                <Tooltip title="Delete" aria-label="delete">
                  <Fab color="secondary" size="small" onClick={onDeleteHandler}>
                    {submitLoad ? (
                      <CircularProgress size={25} color="inherit" />
                    ) : (
                      <Delete fontSize="small" />
                    )}
                  </Fab>
                </Tooltip>
              </>
            )}
          </div>
          <form
            noValidate
            autoComplete="off"
            className={classes.form}
            onSubmit={onUpdateHandler}
          >
            <div className={classes.textFieldContainer}>
              <TextField
                fullWidth
                label="First Name"
                variant={isDisabled ? "standard" : "outlined"}
                color="primary"
                className={classes.formField}
                required
                onChange={onChangeHandler("firstName")}
                error={error}
                helperText={
                  error && !data.firstName
                    ? "First Name is Required Field"
                    : null
                }
                value={data.firstName}
                onFocus={() => setError(false)}
                disabled={isDisabled}
              />
              <TextField
                fullWidth
                label="Middle Name"
                variant={isDisabled ? "standard" : "outlined"}
                color="primary"
                className={classes.formField}
                disabled={isDisabled}
                required
                onChange={onChangeHandler("middleName")}
                error={error}
                value={data.middleName}
                helperText={
                  error && !data.middleName
                    ? "Middle Name is Required Field"
                    : null
                }
                onFocus={() => setError(false)}
              />
              <TextField
                fullWidth
                label="Last Name"
                variant={isDisabled ? "standard" : "outlined"}
                color="primary"
                className={classes.formField}
                disabled={isDisabled}
                value={data.lastName}
                required
                onChange={onChangeHandler("lastName")}
                error={error}
                helperText={
                  error && !data.lastName ? "Last Name is Required Field" : null
                }
                onFocus={() => setError(false)}
              />
            </div>

            <div className={classes.textFieldContainer}>
              <TextField
                fullWidth
                label="Daily Wages"
                type="number"
                variant={isDisabled ? "standard" : "outlined"}
                color="primary"
                className={classes.formField}
                disabled={isDisabled}
                value={data.dailyWages}
                required
                onChange={onChangeHandler("dailyWages")}
                error={error}
                helperText={
                  error && !data.dailyWages
                    ? "Daily wage is Required Field and it should not be negative value"
                    : null
                }
                onFocus={() => setError(false)}
              />
              <TextField
                fullWidth
                label="OT Rate"
                type="number"
                variant={isDisabled ? "standard" : "outlined"}
                color="primary"
                value={data.otRate}
                className={classes.formField}
                disabled={isDisabled}
                required
                onChange={onChangeHandler("otRate")}
                error={error}
                helperText={
                  error && !data.otRate
                    ? "Overtime Rate is Required Field and it should not be negative value"
                    : null
                }
                onFocus={() => setError(false)}
              />
              <TextField
                fullWidth
                label="Unique ID"
                variant={isDisabled ? "standard" : "outlined"}
                color="primary"
                value={data.uniqueId}
                className={classes.formField}
                disabled={isDisabled}
                onChange={onChangeHandler("uniqueId")}
              />
            </div>

            <div className={classes.textFieldContainer}>
              <TextField
                fullWidth
                label="Bank Account No"
                variant={isDisabled ? "standard" : "outlined"}
                type="number"
                color="primary"
                value={data.bankAccountNumber}
                className={classes.formField}
                disabled={isDisabled}
                required
                onChange={onChangeHandler("bankAccountNumber")}
                error={error}
                helperText={
                  error && !data.bankAccountNumber
                    ? "Bank Account number is Required Field and it should not be negative value"
                    : null
                }
                onFocus={() => setError(false)}
              />
              <TextField
                fullWidth
                label="IFSC Code"
                variant={isDisabled ? "standard" : "outlined"}
                color="primary"
                className={classes.formField}
                disabled={isDisabled}
                required
                value={data.ifscCode}
                onChange={onChangeHandler("ifscCode")}
                error={error}
                helperText={
                  error && !data.ifscCode ? "IFSC code is Required Field" : null
                }
                onFocus={() => setError(false)}
              />
            </div>

            <div className={classes.textFieldContainer}>
              <TextField
                fullWidth
                label="PF No"
                variant={isDisabled ? "standard" : "outlined"}
                color="primary"
                className={classes.formField}
                disabled={isDisabled}
                required
                value={data.pfNumber}
                onChange={onChangeHandler("pfNumber")}
                error={error}
                helperText={
                  error && !data.pfNumber ? "PF number is Required Field" : null
                }
                onFocus={() => setError(false)}
              />
              <TextField
                fullWidth
                label="Aadhar No"
                variant={isDisabled ? "standard" : "outlined"}
                color="primary"
                className={classes.formField}
                disabled={isDisabled}
                required
                value={data.aadhar}
                onChange={onChangeHandler("aadhar")}
                error={error}
                helperText={
                  error && !data.aadhar
                    ? "Aadhar number is Required Field"
                    : null
                }
                onFocus={() => setError(false)}
              />
              <TextField
                fullWidth
                label="Mobile No"
                variant={isDisabled ? "standard" : "outlined"}
                type="number"
                color="primary"
                value={data.mobileNumber}
                className={classes.formField}
                disabled={isDisabled}
                onChange={onChangeHandler("mobileNumber")}
              />
            </div>

            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                disableFuture
                openTo="year"
                inputVariant={isDisabled ? "standard" : "outlined"}
                format="dd/MM/yyyy"
                label="Date of birth"
                views={["year", "month", "date"]}
                value={data.birthDate}
                className={`${classes.formField} ${classes.datePicker}`}
                disabled={isDisabled}
                onChange={handleDateChange("birthDate")}
              />
              <DatePicker
                disableFuture
                format="dd/MM/yyyy"
                label="Joining Date"
                inputVariant={isDisabled ? "standard" : "outlined"}
                views={["year", "month", "date"]}
                value={data.joiningDate}
                className={classes.formField}
                disabled={isDisabled}
                onChange={handleDateChange("joiningDate")}
              />
            </MuiPickersUtilsProvider>

            <FormControl
              className={classes.formField}
              disabled={isDisabled}
              style={{ display: "block" }}
              variant={isDisabled ? "standard" : "outlined"}
            >
              <FormLabel>Worker's Category</FormLabel>
              <RadioGroup
                onChange={onChangeHandler("workerCategory")}
                value={data.workerCategory}
              >
                <FormControlLabel
                  value="Skilled"
                  control={<Radio />}
                  label="Skilled"
                />
                <FormControlLabel
                  value="Semi skilled"
                  control={<Radio />}
                  label="Semi Skilled"
                />
                <FormControlLabel
                  value="Unskilled"
                  control={<Radio />}
                  label="Unskilled"
                />
              </RadioGroup>
            </FormControl>
            {!isDisabled ? (
              <Button
                type="submit"
                color="primary"
                variant="contained"
                className={classes.formField}
                size="large"
              >
                Update
              </Button>
            ) : null}
          </form>
        </div>
      );
    }
  };

  return renderPages();
}
