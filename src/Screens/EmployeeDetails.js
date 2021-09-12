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
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { db } from "../firebase";

const useStyles = makeStyles((theme) => ({
  form: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  formField: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: "block",
  },
}));

export default function NewEmployee(props) {
  const classes = useStyles();

  const [employeeData, setEmployeeData] = useState({});

  const [firstName, setFirstName] = useState(
    employeeData.firstName ? employeeData.firstName : ""
  );
  const [middleName, setMiddleName] = useState(
    employeeData.middleName ? employeeData.middleName : ""
  );
  const [lastName, setLastName] = useState(
    employeeData.lastName ? employeeData.lastName : ""
  );
  const [birthDate, setBirthDate] = useState(
    employeeData.birthDate ? employeeData.birthDate : new Date()
  );
  const [joiningDate, setJoiningDate] = useState(
    employeeData.joiningDate ? employeeData.joiningDate : new Date()
  );
  const [monthlyWages, setMonthlyWage] = useState(
    employeeData.monthlyWages ? employeeData.monthlyWages : null
  );
  const [otRate, setOtRate] = useState(
    employeeData.otRate ? employeeData.otRate : null
  );
  const [uniqueId, setUniqueId] = useState(
    employeeData.uniqueId ? employeeData.uniqueId : ""
  );
  const [bankAccountNumber, setBankAccountNumber] = useState(
    employeeData.bankAccountNumber ? employeeData.bankAccountNumber : null
  );
  const [ifscCode, setIfscCode] = useState(
    employeeData.ifscCode ? employeeData.ifscCode : ""
  );
  const [pfNumber, setPfNumber] = useState(
    employeeData.pfNumber ? employeeData.pfNumber : ""
  );
  const [workerCategory, setWorkerCategory] = useState(
    employeeData.workerCategory ? employeeData.workerCategory : "Unskilled"
  );
  const [mobileNumber, setMobileNumber] = useState(
    employeeData.mobileNumber ? employeeData.mobileNumber : null
  );

  console.log(firstName);

  useEffect(() => {
    const employeeData = db
      .collection("employees")
      .doc(props.match.params.id)
      .get();

    employeeData.then((doc) => {
      if (!doc.exists) return;
      setEmployeeData(doc.data());
    });

    return () => employeeData();
  }, [employeeData]);

  //   const onSubmitHandler = (e) => {
  //     e.preventDefault();

  //     db.collection("employees")
  //       .add({
  //         firstName,
  //         middleName,
  //         lastName,
  //         birthDate,
  //         joiningDate,
  //         monthlyWages,
  //         otRate,
  //         uniqueId,
  //         bankAccountNumber,
  //         ifscCode,
  //         pfNumber,
  //         workerCategory,
  //         mobileNumber,
  //       })
  //       .then((ref) => {
  //         console.log(ref.id);
  //         history.push("/employees");
  //       });
  //   };

  return (
    <Container>
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
        // onSubmit={onSubmitHandler}
      >
        <TextField
          fullWidth
          label="First Name"
          variant="outlined"
          color="primary"
          className={classes.formField}
          value={employeeData.firstName}
          //   required
          disabled
          //   onChange={(e) => setFirstName(e.target.value)}
        />
        <TextField
          fullWidth
          label="Middle Name"
          variant="outlined"
          color="primary"
          value={lastName}
          className={classes.formField}
          required
          //   onChange={(e) => setMiddleName(e.target.value)}
        />
        <TextField
          fullWidth
          label="Last Name"
          variant="outlined"
          color="primary"
          className={classes.formField}
          required
          //   onChange={(e) => setLastName(e.target.value)}
        />

        <TextField
          fullWidth
          label="Monthly Wages"
          variant="outlined"
          color="primary"
          className={classes.formField}
          required
          //   onChange={(e) => setMonthlyWage(e.target.value)}
        />
        <TextField
          fullWidth
          label="OT Rate"
          variant="outlined"
          color="primary"
          className={classes.formField}
          required
          //   onChange={(e) => setOtRate(e.target.value)}
        />
        <TextField
          fullWidth
          label="Unique ID"
          variant="outlined"
          color="primary"
          className={classes.formField}
          onChange={(e) => setUniqueId(e.target.value)}
        />
        <TextField
          fullWidth
          label="Bank Account No"
          variant="outlined"
          color="primary"
          className={classes.formField}
          required
          onChange={(e) => setBankAccountNumber(e.target.value)}
        />
        <TextField
          fullWidth
          label="IFSC Code"
          variant="outlined"
          color="primary"
          className={classes.formField}
          required
          onChange={(e) => setIfscCode(e.target.value)}
        />
        <TextField
          fullWidth
          label="PF No"
          variant="outlined"
          color="primary"
          className={classes.formField}
          required
          onChange={(e) => setPfNumber(e.target.value)}
        />
        <TextField
          fullWidth
          label="Mobile No"
          variant="outlined"
          color="primary"
          className={classes.formField}
          onChange={(e) => setMobileNumber(e.target.value)}
        />
        <TextField
          id="date"
          label="Birth Date"
          type="date"
          defaultValue="2000-05-24"
          className={classes.formField}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) => setBirthDate(e.target.value)}
        />
        <TextField
          id="date"
          label="Joining Date"
          type="date"
          defaultValue="2021-05-24"
          className={classes.formField}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) => setJoiningDate(e.target.value)}
        />

        <FormControl className={classes.formField}>
          <FormLabel>Worker's Category</FormLabel>
          <RadioGroup
            value={workerCategory}
            onChange={(e) => setWorkerCategory(e.target.value)}
          >
            <FormControlLabel
              value="Skilled"
              control={<Radio />}
              label="Skilled"
            />
            <FormControlLabel
              value="Semiskilled"
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
        <Button type="submit" color="primary" variant="contained">
          Update
        </Button>
      </form>
    </Container>
  );
}
