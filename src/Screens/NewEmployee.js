import { Typography } from "@material-ui/core";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { db } from "../firebase";
import firebase from "firebase";
import EmployeeForm from "../Components/EmployeeForm";

export default function NewEmployee({ authUser }) {
  const history = useHistory();

  const initialvalue = {
    firstName: "",
    middleName: "",
    lastName: "",
    birthDate: new Date(),
    joiningDate: new Date(),
    dailyWages: null,
    otRate: null,
    uniqueId: "",
    bankAccountNumber: null,
    ifscCode: "",
    pfNumber: "",
    aadhar: "",
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
      !data.dailyWages ||
      !data.otRate ||
      !data.bankAccountNumber ||
      !data.ifscCode ||
      !data.pfNumber ||
      !data.aadhar ||
      !data.workerCategory
    ) {
      setError(true);
      return;
    }

    db.collection(authUser.uid)
      .doc(authUser.displayName)
      .collection("employees")
      .add({
        ...data,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        setData({});
        history.push("/employees");
      });
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

  return (
    <>
      <Typography
        variant="h6"
        color="textSecondary"
        component="h2"
        gutterBottom
      >
        Add new Employee
      </Typography>

      <EmployeeForm
        onChangeHandler={onChangeHandler}
        data={data}
        error={error}
        setError={setError}
        handleDateChange={handleDateChange}
        onSubmitHandler={onSubmitHandler}
      />
    </>
  );
}
