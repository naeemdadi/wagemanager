import {
  Card,
  CardContent,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { AddCircleOutlineRounded } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { auth, db } from "../firebase";

const useStyles = makeStyles((theme) => ({
  card: {
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

export default function Employees(props) {
  const history = useHistory();
  const classes = useStyles();

  const { authUser } = props;

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const unsubscribe = db
      .collection(`${authUser.uid}/${authUser.displayName}/employees`)
      .onSnapshot((snapshot) => {
        setEmployees(
          snapshot.docs.map((doc) => {
            return {
              id: doc.id,
              ...doc.data(),
            };
          })
        );
      });
    return () => unsubscribe();
  }, [authUser]);

  return (
    <Grid container spacing={4} style={{ cursor: "pointer" }}>
      <Grid item md={3} sm={6} xs={12}>
        <Card
          onClick={() => history.push("/employees/add")}
          className={classes.card}
        >
          <CardContent>
            <Typography variant="body2" color="textSecondary" align="center">
              <AddCircleOutlineRounded style={{ fontSize: 48 }} />
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      {employees.map((employee) => (
        <Grid key={employee.id} item md={3} sm={6} xs={12}>
          <Card
            className={classes.card}
            key={employee.id}
            onClick={() => history.push(`/employees/${employee.id}`)}
          >
            <CardContent>
              <Typography variant="h5" color="textSecondary">
                {`${
                  employee.firstName
                } ${employee.middleName[0].toUpperCase()}. ${
                  employee.lastName
                }`}
              </Typography>
              <Grid container spacing={6}>
                <Grid item>
                  <Typography variant="body2" color="textSecondary">
                    {employee.workerCategory}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2" color="textSecondary">
                    {employee.monthlyWages}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
