import React from "react";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  makeStyles,
  Radio,
  RadioGroup,
  TextField,
} from "@material-ui/core";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const useStyles = makeStyles((theme) => ({
  form: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  TextFieldContainer: {
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

const EmployeeForm = ({
  onChangeHandler,
  data,
  error,
  setError,
  handleDateChange,
  onSubmitHandler,
}) => {
  const classes = useStyles();
  return (
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
          value={data.firstName}
          onChange={onChangeHandler("firstName")}
          error={error && !data.firstName}
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
          value={data.middleName}
          onChange={onChangeHandler("middleName")}
          error={error && !data.middleName}
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
          value={data.lastName}
          className={classes.formField}
          required
          onChange={onChangeHandler("lastName")}
          error={error && !data.lastName}
          helperText={
            error && !data.lastName ? "Last Name is Required Field" : null
          }
          onFocus={() => setError(false)}
        />
      </div>

      <div className={classes.TextFieldContainer}>
        <TextField
          fullWidth
          label="Daily Wages"
          type="number"
          variant="outlined"
          color="primary"
          className={classes.formField}
          required
          onChange={onChangeHandler("dailyWages")}
          error={error && !data.dailyWages}
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
          variant="outlined"
          color="primary"
          className={classes.formField}
          required
          onChange={onChangeHandler("otRate")}
          error={error && !data.otRate}
          helperText={
            error && !data.otRate
              ? "Overtime Rate is Required Field and it should not be negative value."
              : null
          }
          onFocus={() => setError(false)}
        />
        <TextField
          fullWidth
          label="Unique ID"
          value={data.uniqueId}
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
          error={error && !data.bankAccountNumber}
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
          variant="outlined"
          color="primary"
          className={classes.formField}
          required
          value={data.ifscCode}
          onChange={onChangeHandler("ifscCode")}
          error={error && !data.ifscCode}
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
          value={data.pfNumber}
          className={classes.formField}
          required
          onChange={onChangeHandler("pfNumber")}
          error={error && !data.pfNumber}
          helperText={
            error && !data.pfNumber ? "PF number is Required Field" : null
          }
          onFocus={() => setError(false)}
        />
        <TextField
          fullWidth
          label="Aadhar No."
          variant="outlined"
          color="primary"
          value={data.aadhar}
          className={classes.formField}
          required
          onChange={onChangeHandler("aadhar")}
          error={error && !data.aadhar}
          helperText={
            error && !data.aadhar
              ? "Aadhar card number is Required Field"
              : null
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
          required
          label="Date of birth"
          views={["year", "month", "date"]}
          value={data.birthDate}
          className={`${classes.formField} ${classes.datePicker}`}
          onChange={handleDateChange("birthDate")}
        />
        <DatePicker
          disableFuture
          required
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
  );
};

export default EmployeeForm;
