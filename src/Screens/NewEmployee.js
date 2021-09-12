import {
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  makeStyles,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { db } from "../firebase";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { format } from "date-fns";

const useStyles = makeStyles((theme) => ({
  form: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  TextFieldContainer: {
    display: "flex",
    gap: theme.spacing(2),
  },
  formField: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  datePicker: {
    marginRight: theme.spacing(2),
  },
}));

export default function NewEmployee({ authUser }) {
  const classes = useStyles();
  const history = useHistory();

  const initialvalue = {
    firstName: "",
    middleName: "",
    lastName: "",
    birthDate: new Date(),
    joiningDate: new Date(),
    monthlyWages: null,
    otRate: null,
    uniqueId: "",
    bankAccountNumber: null,
    ifscCode: "",
    pfNumber: "",
    workerCategory: "",
    mobileNumber: null,
  };

  const [data, setData] = useState(initialvalue);
  const [error, setError] = useState(false);

  const onSubmitHandler = (e) => {
    e.preventDefault();

    if (
      !data.firstName ||
      !data.middleName ||
      !data.lastName ||
      !data.birthDate ||
      !data.joiningDate ||
      !data.monthlyWages ||
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
      .add(data)
      .then(() => {
        setData({});
        history.push("/employees");
      });
  };

  const onChangeHandler = (input) => (e) => {
    setData({
      ...data,
      [input]: e.target.value,
    });
  };

  const handleDateChange = (input) => (e) => {
    setData({
      ...data,
      [input]: e,
    });
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <div>
      <Typography
        variant="h6"
        color="textSecondary"
        component="h2"
        gutterBottom
      >
        Add new Employee
      </Typography>

      <form
        noValidate
        autoComplete="off"
        className={classes.form}
        onSubmit={onSubmitHandler}
      >
        <div className={classes.TextFieldContainer}>
          <TextField
            fullWidth
            label="First Name"
            variant="outlined"
            color="primary"
            className={classes.formField}
            required
            onChange={onChangeHandler("firstName")}
            error={error}
            helperText={
              error && !data.firstName ? "First Name is Required Field" : null
            }
            onFocus={() => setError(false)}
          />
          <TextField
            fullWidth
            label="Middle Name"
            variant="outlined"
            color="primary"
            className={classes.formField}
            required
            onChange={onChangeHandler("middleName")}
            error={error}
            helperText={
              error && !data.middleName ? "Middle Name is Required Field" : null
            }
            onFocus={() => setError(false)}
          />
          <TextField
            fullWidth
            label="Last Name"
            variant="outlined"
            color="primary"
            className={classes.formField}
            required
            onChange={onChangeHandler("lastName")}
            error={error}
            helperText={
              error && !data.lastName ? "Last Name is Required Field" : null
            }
            onFocus={() => setError(false)}
          />
        </div>

        <div className={classes.TextFieldContainer}>
          <TextField
            fullWidth
            label="Monthly Wages"
            type="number"
            variant="outlined"
            color="primary"
            className={classes.formField}
            required
            onChange={onChangeHandler("monthlyWages")}
            error={error}
            helperText={
              error && !data.monthlyWages
                ? "Monthly wage is Required Field"
                : null
            }
            onFocus={() => setError(false)}
          />
          <TextField
            fullWidth
            label="OT Rate"
            type="number"
            variant="outlined"
            color="primary"
            className={classes.formField}
            required
            onChange={onChangeHandler("otRate")}
            error={error}
            helperText={
              error && !data.otRate ? "Overtime Rate is Required Field" : null
            }
            onFocus={() => setError(false)}
          />
          <TextField
            fullWidth
            label="Unique ID"
            variant="outlined"
            color="primary"
            className={classes.formField}
            onChange={onChangeHandler("uniqueId")}
          />
        </div>

        <div className={classes.TextFieldContainer}>
          <TextField
            fullWidth
            label="Bank Account No"
            variant="outlined"
            type="number"
            color="primary"
            className={classes.formField}
            required
            onChange={onChangeHandler("bankAccountNumber")}
            error={error}
            helperText={
              error && !data.bankAccountNumber
                ? "Bank Account number is Required Field"
                : null
            }
            onFocus={() => setError(false)}
          />
          <TextField
            fullWidth
            label="IFSC Code"
            variant="outlined"
            color="primary"
            className={classes.formField}
            required
            onChange={onChangeHandler("ifscCode")}
            error={error}
            helperText={
              error && !data.ifscCode ? "IFSC code is Required Field" : null
            }
            onFocus={() => setError(false)}
          />
        </div>

        <div className={classes.TextFieldContainer}>
          <TextField
            fullWidth
            label="PF No"
            variant="outlined"
            color="primary"
            className={classes.formField}
            required
            onChange={onChangeHandler("pfNumber")}
            error={error}
            helperText={
              error && !data.pfNumber ? "PF number is Required Field" : null
            }
            onFocus={() => setError(false)}
          />
          <TextField
            fullWidth
            label="Mobile No"
            variant="outlined"
            type="number"
            color="primary"
            className={classes.formField}
            onChange={onChangeHandler("mobileNumber")}
          />
        </div>

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            disableFuture
            openTo="year"
            inputVariant="outlined"
            format="dd/MM/yyyy"
            label="Date of birth"
            views={["year", "month", "date"]}
            value={data.birthDate}
            className={`${classes.formField} ${classes.datePicker}`}
            onChange={handleDateChange("birthDate")}
          />
          <DatePicker
            format="dd/MM/yyyy"
            label="Joining Date"
            inputVariant="outlined"
            views={["year", "month", "date"]}
            value={data.joiningDate}
            className={classes.formField}
            onChange={handleDateChange("joiningDate")}
          />
        </MuiPickersUtilsProvider>

        <FormControl className={classes.formField} style={{ display: "block" }}>
          <FormLabel>Worker's Category</FormLabel>
          <RadioGroup onChange={onChangeHandler("workerCategory")}>
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
        <Button
          type="submit"
          color="primary"
          variant="contained"
          className={classes.formField}
          size="large"
        >
          Submit
        </Button>
      </form>
    </div>
  );
}
