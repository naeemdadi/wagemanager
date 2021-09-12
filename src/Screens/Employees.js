import {
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { AddCircleOutlineRounded, Delete, Edit } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { db } from "../firebase";

const useStyles = makeStyles((theme) => ({
  // cardSection: {
  //   display: "flex",
  //   flexWrap: "wrap",
  // },
  card: {
    // width: "calc(100%/5)",
    // margin: theme.spacing(2),
    // marginRight: theme.spacing(3),
    // cursor: "pointer",
    // paddingTop: theme.spacing(6),
    // paddingBottom: theme.spacing(6),
    // paddingLeft: theme.spacing(3),
    // paddingRight: theme.spacing(3),
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

export default function Employees() {
  const history = useHistory();
  const classes = useStyles();

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const unsubscribe = db.collection("employees").onSnapshot((snapshot) => {
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
  }, []);

  return (
    <Container>
      <Grid container spacing={4}>
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
          <Grid item md={3} sm={6} xs={12}>
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
    </Container>
  );
}
