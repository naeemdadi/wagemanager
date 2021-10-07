import {
  Card,
  CardContent,
  Fab,
  Typography,
  makeStyles,
  Grid,
  Tooltip,
  TextField,
  MenuItem,
  Button,
} from "@material-ui/core";
import { AddRounded, Visibility } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import Loading from "../Components/Loading";
import { db } from "../firebase";

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

export default function Home(props) {
  const classes = useStyles();

  const { authUser, searchValue } = props;

  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("timestamp");
  const [isDesc, setIsDesc] = useState(true);

  const sortFields = ["timestamp", "month", "year"];

  const filteredMonths =
    monthlyData &&
    monthlyData.filter((data) => {
      const { month, year } = data;

      if (
        month?.toLowerCase().includes(searchValue) ||
        year?.toString().includes(searchValue)
      ) {
        return monthlyData;
      }
      return false;
    });

  useEffect(() => {
    const unsubscribe = db
      .collection(`${authUser?.uid}/${authUser?.displayName}/Monthly Data`)
      .orderBy(sortOption, isDesc ? "desc" : "asc")
      .onSnapshot((snapshot) => {
        setMonthlyData(
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
  }, [authUser, isDesc, sortOption]);

  const renderPages = () => {
    if (!loading) {
      if (monthlyData.length === 0) {
        return (
          <React.Fragment>
            <Tooltip title="Add New Employee" aria-label="add">
              <Fab
                color="secondary"
                className={classes.fixed}
                size="large"
                onClick={() => props.history.push("/create")}
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
              Add Monthly Data!
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
                Monthly Data
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
              {filteredMonths.map((data) => (
                <Grid key={data.id} item md={3} sm={6} xs={12}>
                  <Card className={classes.card}>
                    <CardContent>
                      <Typography variant="h5" color="textSecondary">
                        {data.month}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {data.year}
                      </Typography>
                      <Tooltip title="View">
                        <Fab
                          color="secondary"
                          className={classes.cardAction}
                          size="small"
                          onClick={() => props.history.push(`/${data.id}`)}
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
                onClick={() => props.history.push("/create")}
              >
                <AddRounded fontSize="large" />
              </Fab>
            </Tooltip>
          </React.Fragment>
        );
      }
    } else {
      return <Loading loading={loading} />;
    }
  };

  return renderPages();
}
