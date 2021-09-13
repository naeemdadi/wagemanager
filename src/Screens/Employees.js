import {
  Card,
  CardActions,
  CardContent,
  Fab,
  Grid,
  makeStyles,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { AddRounded, Visibility } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { db } from "../firebase";
import Loading from "../Components/Loading";

const useStyles = makeStyles((theme) => ({
  card: {
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    position: "relative",
  },
  fab: {
    margin: theme.spacing(4),
  },
  absolute: {
    position: "absolute",
    bottom: theme.spacing(6),
    right: theme.spacing(8),
  },
  cardAction: {
    position: "absolute",
    bottom: theme.spacing(3),
    right: theme.spacing(3),
  },
  parentContainer: {
    marginTop: theme.spacing(1),
  },
}));

export default function Employees(props) {
  const history = useHistory();
  const classes = useStyles();

  const { authUser } = props;

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

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
    setLoading(false);
    return () => unsubscribe();
  }, [authUser]);

  const renderPages = () => {
    if(!loading) {
      if(employees.length === 0) {
        return <React.Fragment><Tooltip title="Add New Employee" aria-label="add">
        <Fab
          color="secondary"
          className={classes.absolute}
          size="large"
          onClick={() => history.push("/employees/add")}
        >
          <AddRounded fontSize="large" />
        </Fab>
      </Tooltip>
      <Typography
        variant="h6"
        color="textSecondary"
        component="h2"
        gutterBottom
        align="center"
      >
        Please Add some Employees!
      </Typography>
      </React.Fragment>
      } else {
        return <React.Fragment>
      <Typography
        variant="h6"
        color="textSecondary"
        component="h2"
        gutterBottom
      >
        Employees
      </Typography>
      <Grid container spacing={4} className={classes.parentContainer}>
        {/* <Grid item md={3} sm={6} xs={12}>
          <Card
            onClick={() => history.push("/employees/add")}
            className={classes.card}
          >
            <CardContent align="center">
              <Typography variant="body2" color="textSecondary" align="center">
              <AddCircleOutlineRounded style={{ fontSize: 48 }} />
              </Typography>
            </CardContent>
          </Card>
        </Grid> */}
        {employees.map((employee) => (
          <Grid key={employee.id} item md={3} sm={6} xs={12}>
            <Card className={classes.card} key={employee.id}>
              <CardContent>
                <Typography variant="h5" color="textSecondary">
                  {`${employee.firstName} ${employee.middleName[0]}. ${employee.lastName}`}
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
                <Tooltip title="View">
                  <Fab
                    color="secondary"
                    className={classes.cardAction}
                    size="small"
                    onClick={() => history.push(`/employees/${employee.id}`)}
                  >
                    <Visibility fontSize="small" />
                  </Fab>
                </Tooltip>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      </React.Fragment>
      }
    } else {
      return <Loading loading={loading} />
    }
  }

  return renderPages();
}
