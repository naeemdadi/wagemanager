import {
  Button,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import XLSX from "xlsx";
import React from "react";

const useStyles = makeStyles((theme) => ({
  textFieldContainer: {
    display: "flex",
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down("sm")]: {
      display: "block",
    },
  },
  formField: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

export default function WagesSheet(props) {
  const { data, employees } = props.location.state;
  const classes = useStyles();
  const { searchValue } = props;

  function createData(
    no,
    name,
    preDays,
    categoryOfWorker,
    basic,
    monthlyBasic,
    wellAll,
    otHrs,
    otRate,
    otAmt,
    gross,
    pf,
    pt,
    lwf,
    totalDeduc,
    netPayable
  ) {
    return {
      no,
      name,
      preDays,
      categoryOfWorker,
      basic,
      monthlyBasic,
      wellAll,
      otHrs,
      otRate,
      otAmt,
      gross,
      pf,
      pt,
      lwf,
      totalDeduc,
      netPayable,
    };
  }

  const rowsData = data.employee.map((emp, index) => {
    const currEmp = employees.find((el) => el.id === emp.empRef);
    let minWages;
    if (currEmp.workerCategory === "Skilled") {
      minWages = 356.2;
    }
    if (currEmp.workerCategory === "Semi skilled") {
      minWages = 348.2;
    }
    if (currEmp.workerCategory === "Unskilled") {
      minWages = 341;
    }

    const monthlyBasic = minWages * emp.workingDays;
    const otAmt = currEmp.otRate * emp.otHours;
    const pf = (monthlyBasic * 12) / 100;
    const wellAll = emp.workingDays * currEmp.dailyWages - monthlyBasic;
    const gross = monthlyBasic + otAmt + wellAll;

    let pt;
    if (gross <= 2999) {
      pt = 0;
    } else if (gross <= 5999) {
      pt = 0;
    } else if (gross <= 8999) {
      pt = 80;
    } else if (gross <= 11999) {
      pt = 150;
    } else {
      pt = 200;
    }

    const lwf = 0;
    const totalDedu = pf + pt;
    const netPayable = gross - totalDedu;
    return createData(
      index + 1,
      currEmp.firstName +
        " " +
        currEmp.middleName.charAt(0) +
        ". " +
        currEmp.lastName,
      emp.workingDays,
      currEmp.workerCategory,
      minWages,
      monthlyBasic.toFixed(2),
      wellAll.toFixed(2),
      emp.otHours,
      currEmp.otRate,
      otAmt,
      gross,
      pf.toFixed(2),
      pt,
      lwf,
      totalDedu.toFixed(2),
      netPayable.toFixed(2)
    );
  });

  const filteredData = rowsData?.filter((employee) => {
    const {
      name,
      preDays,
      categoryOfWorker,
      basic,
      monthlyBasic,
      otHrs,
      otRate,
      otAmt,
      gross,
      pf,
      pt,
      totalDeduc,
      netPayable,
    } = employee;

    if (
      name?.toLowerCase().includes(searchValue) ||
      preDays?.includes(searchValue) ||
      basic?.includes(searchValue) ||
      categoryOfWorker?.toLowerCase().includes(searchValue) ||
      otHrs?.includes(searchValue) ||
      monthlyBasic?.toString().includes(searchValue) ||
      otRate?.includes(searchValue) ||
      otAmt?.toString().includes(searchValue) ||
      gross?.toString().includes(searchValue) ||
      pf?.toString().includes(searchValue) ||
      pt?.toString().includes(searchValue) ||
      totalDeduc?.toString().includes(searchValue) ||
      netPayable?.toString().includes(searchValue)
    ) {
      return rowsData;
    }
    return false;
  });

  const downloadExcel = () => {
    const workSheet = XLSX.utils.json_to_sheet(rowsData);
    var range = XLSX.utils.decode_range(workSheet["!ref"]);
    for (var C = range.s.c; C <= range.e.c; ++C) {
      var address = XLSX.utils.encode_col(C) + "1"; // <-- first row, column number C
      if (!workSheet[address]) continue;
      workSheet[address].v = workSheet[address].v.toUpperCase();
    }

    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "wages sheet");
    //Buffer
    let buf = XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });
    //Binary string
    XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
    //Download
    XLSX.writeFile(workBook, `${data.month}${data.year}wagessheet.xlsx`);
  };

  const tableHeadRows = [
    "No.",
    "Name",
    "Pre. Days",
    "Categroy of Worker's",
    "Basic",
    "Monthly Basic",
    "Well All",
    "O.T. Hrs.",
    "O.T. Rate",
    "O.T. Amt.",
    "Gross",
    "P.F.",
    "P.T.",
    "Total Dedu.",
    "Net Payable",
  ];

  return (
    <React.Fragment>
      <div
        className={classes.textFieldContainer}
        style={{ alignItems: "center" }}
      >
        <Typography
          variant="h4"
          color="textSecondary"
          component="h2"
          gutterBottom
        >
          Wages Sheet
        </Typography>
        <Button
          color="secondary"
          size="small"
          variant="contained"
          onClick={downloadExcel}
        >
          Export to Excel
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="wages sheet">
          <TableHead>
            <TableRow height="80">
              {tableHeadRows.map((head, index) => (
                <TableCell key={index}>{head}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow
                height="70"
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.no}
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.preDays}</TableCell>
                <TableCell>{row.categoryOfWorker}</TableCell>
                <TableCell>{row.basic}</TableCell>
                <TableCell>{row.monthlyBasic}</TableCell>
                <TableCell>{row.wellAll}</TableCell>
                <TableCell>{row.otHrs}</TableCell>
                <TableCell>{row.otRate}</TableCell>
                <TableCell>{row.otAmt}</TableCell>
                <TableCell>{row.gross}</TableCell>
                <TableCell>{row.pf}</TableCell>
                <TableCell>{row.pt}</TableCell>
                <TableCell>{row.totalDeduc}</TableCell>
                <TableCell>{row.netPayable}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
}
