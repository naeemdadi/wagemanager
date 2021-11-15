import {
  Button,
  Card,
  CardContent,
  Fab,
  Grid,
  makeStyles,
  MenuItem,
  TextField,
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
  fixed: {
    position: "fixed",
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
    marginBottom: theme.spacing(8),
  },
  sortSelectField: {
    width: theme.spacing(20),
  },
  sortButtonFields: {
    display: "flex",
    gap: theme.spacing(1),
    justifyContent: "flex-end",
    marginTop: theme.spacing(2),
  },
}));

export default function Employees(props) {
  const history = useHistory();
  const classes = useStyles();

  const { authUser, searchValue } = props;

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState("timestamp");
  const [isDesc, setIsDesc] = useState(true);

  const sortFields = [
    "timestamp",
    "firstName",
    "middleName",
    "lastName",
    "dailyWages",
    "otRate",
  ];

  useEffect(() => {
    setLoading(true);
    const unsubscribe = db
      .collection(`${authUser.uid}/${authUser.displayName}/employees`)
      .orderBy(sortOption, isDesc ? "desc" : "asc")
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
  }, [authUser, sortOption, isDesc]);

  const filteredEmployees =
    employees &&
    employees.filter((employee) => {
      const {
        firstName,
        lastName,
        middleName,
        dailyWages,
        otRate,
        bankAccountNumber,
        ifscCode,
        mobileNumber,
        pfNumber,
        uniqueId,
        workerCategory,
      } = employee;

      if (
        firstName?.toLowerCase().includes(searchValue) ||
        lastName?.toLowerCase().includes(searchValue) ||
        middleName?.toLowerCase().includes(searchValue) ||
        dailyWages?.includes(searchValue) ||
        otRate?.includes(searchValue) ||
        bankAccountNumber?.toLowerCase().includes(searchValue) ||
        ifscCode?.toLowerCase().toLowerCase().includes(searchValue) ||
        mobileNumber?.includes(searchValue) ||
        pfNumber?.toLowerCase().includes(searchValue) ||
        uniqueId?.toLowerCase().includes(searchValue) ||
        workerCategory?.toLowerCase().includes(searchValue)
      ) {
        return employee;
      }
      return false;
    });

  const renderPages = () => {
    if (loading) {
      return <Loading loading={loading} />;
    } else if (!loading && employees.length === 0) {
      return (
        <React.Fragment>
          <Tooltip title="Add New Employee" aria-label="add">
            <Fab
              color="secondary"
              className={classes.fixed}
              size="large"
              onClick={() => history.push("/employees/add")}
            >
              <AddRounded fontSize="large" />
            </Fab>
          </Tooltip>
          <Typography
            variant="h4"
            color="textSecondary"
            component="h2"
            gutterBottom
            align="center"
          >
            Please Add some Employees!
          </Typography>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              variant="h4"
              color="textSecondary"
              component="h2"
              gutterBottom
            >
              Employees
            </Typography>
            <TextField
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              select
              label="Sort by"
              variant="outlined"
              className={classes.sortSelectField}
            >
              {sortFields.map((field) => {
                let val = field.replace(/([a-z])([A-Z])/g, "$1 $2");
                let finalVal = val.charAt(0).toUpperCase() + val.slice(1);
                return (
                  <MenuItem key={field} value={field}>
                    {field === "timestamp" ? "Added Date" : finalVal}
                  </MenuItem>
                );
              })}
            </TextField>
          </div>
          <div className={classes.sortButtonFields}>
            <Button
              variant="contained"
              color="primary"
              size="medium"
              onClick={(e) => setIsDesc(false)}
            >
              Sort By Asc
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="medium"
              onClick={(e) => setIsDesc(true)}
            >
              Sort by Desc
            </Button>
          </div>
          <Grid container spacing={4} className={classes.parentContainer}>
            {filteredEmployees.map((employee) => (
              <Grid key={employee.id} item md={3} sm={6} xs={12}>
                <Card className={classes.card} key={employee.id}>
                  <CardContent>
                    <Typography variant="h5" color="textSecondary">
                      {`${employee.firstName} ${employee.middleName[0]}. ${employee.lastName}`}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {employee.workerCategory}
                    </Typography>
                    <div style={{ display: "flex", gap: 16 }}>
                      <Typography variant="body2" color="textSecondary">
                        Wages: {employee.dailyWages}
                      </Typography>
                      {employee.isExited && (
                        <Typography variant="body2" color="secondary">
                          Exited
                        </Typography>
                      )}
                    </div>
                    <Tooltip title="View">
                      <Fab
                        color="secondary"
                        className={classes.cardAction}
                        size="small"
                        onClick={() =>
                          history.push(`/employees/${employee.id}`)
                        }
                      >
                        <Visibility fontSize="small" />
                      </Fab>
                    </Tooltip>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Tooltip title="Add New Employee" aria-label="add">
            <Fab
              color="secondary"
              className={classes.fixed}
              size="large"
              onClick={() => history.push("/employees/add")}
            >
              <AddRounded fontSize="large" />
            </Fab>
          </Tooltip>
        </React.Fragment>
      );
    }
  };

  return renderPages();
}
