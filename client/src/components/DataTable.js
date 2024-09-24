import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Box,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const initialData = [
  { name: "John Doe", address: "123 Main St, City, Country", disaster: "Flood", time: "2024-09-22 10:30 AM", priority: "High", status: "Ongoing" },
  { name: "Jane Smith", address: "456 Oak St, City, Country", disaster: "Earthquake", time: "2024-09-21 03:45 PM", priority: "Critical", status: "Resolved" },
  { name: "Alice Johnson", address: "789 Pine St, City, Country", disaster: "Wildfire", time: "2024-09-20 01:15 PM", priority: "Medium", status: "Ongoing" },
  { name: "Bob Brown", address: "321 Maple St, City, Country", disaster: "Tornado", time: "2024-09-19 11:00 AM", priority: "High", status: "Critical" },
  { name: "John Doe", address: "123 Main St, City, Country", disaster: "Flood", time: "2024-09-22 10:30 AM", priority: "High", status: "Ongoing" },
  { name: "Jane Smith", address: "456 Oak St, City, Country", disaster: "Earthquake", time: "2024-09-21 03:45 PM", priority: "Critical", status: "Resolved" },
  { name: "Alice Johnson", address: "789 Pine St, City, Country", disaster: "Wildfire", time: "2024-09-20 01:15 PM", priority: "Medium", status: "Ongoing" },
  { name: "Bob Brown", address: "321 Maple St, City, Country", disaster: "Tornado", time: "2024-09-19 11:00 AM", priority: "High", status: "Critical" },
  { name: "John Doe", address: "123 Main St, City, Country", disaster: "Flood", time: "2024-09-22 10:30 AM", priority: "High", status: "Ongoing" },
  { name: "Jane Smith", address: "456 Oak St, City, Country", disaster: "Earthquake", time: "2024-09-21 03:45 PM", priority: "Critical", status: "Resolved" },
  { name: "Alice Johnson", address: "789 Pine St, City, Country", disaster: "Wildfire", time: "2024-09-20 01:15 PM", priority: "Medium", status: "Ongoing" },
  { name: "Bob Brown", address: "321 Maple St, City, Country", disaster: "Tornado", time: "2024-09-19 11:00 AM", priority: "High", status: "Critical" },
  // Add more data objects to simulate a larger dataset
];

// Styling for different statuses
const getStatusStyles = (status) => {
  switch (status) {
    case "Ongoing":
      return { backgroundColor: "#FFA726", color: "black" }; // Orange for Ongoing
    case "Resolved":
      return { backgroundColor: "#66BB6A", color: "white" }; // Green for Resolved
    case "Critical":
      return { backgroundColor: "#EF5350", color: "white" }; // Red for Critical
    default:
      return { backgroundColor: "#E0E0E0", color: "black" }; // Default grey
  }
};

const statusOptions = ["Ongoing", "Resolved", "Critical"];

const DataTable = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [data, setData] = useState(initialData);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusChange = (index, newStatus) => {
    const updatedData = [...data];
    updatedData[index].status = newStatus;
    setData(updatedData);
  };

  const displayedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ padding: "0.25rem", backgroundColor: theme.palette.background.light, borderRadius: "1rem" }}>
      <TableContainer component={Paper} elevation={0} sx={{ minHeight: "450px", maxHeight: "450px", backgroundColor: theme.palette.background.light, width: '100%' }} className="scrollbar">
        <Table sx={{ minWidth: '100%' }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.background.light, borderBottom: `2px solid ${theme.palette.common.black}` }}>
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Disaster</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedData.map((row, index) => (
              <TableRow
                key={index}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "& td": { borderBottom: `1px solid ${theme.palette.common.black}` },
                  "&:hover": { backgroundColor: theme.palette.grey[800] },
                }}
              >
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.address}</TableCell>
                <TableCell>{row.disaster}</TableCell>
                <TableCell>{row.time}</TableCell>
                <TableCell>{row.priority}</TableCell>
                <TableCell>
                  <Select
                    value={row.status}
                    onChange={(e) => handleStatusChange(index, e.target.value)}
                    variant="standard"
                    sx={{ m: 0.5 , 
                      borderBottom: "none",
                      "&:before": {
                        borderBottom: "none", 
                      },
                      "&:after": {
                        borderBottom: "none", 
                      },
                      "&:hover:not(.Mui-disabled):before": {
                        borderBottom: "none", 
                      },
                    }}
                    // sx={{
                    //   minWidth: 120,
                    //   backgroundColor: getStatusStyles(row.status).backgroundColor,
                    //   color: getStatusStyles(row.status).color,
                    // }}
                    renderValue={(value) => (
                      <Chip
                        label={value}
                        sx={{
                          backgroundColor: getStatusStyles(value).backgroundColor,
                          color: getStatusStyles(value).color,
                        }}
                      />
                    )}
                  >
                    {statusOptions.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default DataTable;



/* 

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Box,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MapComponent from './MapComponent'; // Import the map component

const initialData = [
  // Your initial data...
];

const getStatusStyles = (status) => {
  // Your status styles...
};

const statusOptions = ["Ongoing", "Resolved", "Critical"];

const DataTable = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [data, setData] = useState(initialData);
  const [selectedAddress, setSelectedAddress] = useState('');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusChange = (index, newStatus) => {
    const updatedData = [...data];
    updatedData[index].status = newStatus;
    setData(updatedData);
  };

  const handleRowClick = (row) => {
    setSelectedAddress(row.address); // Set the selected address on row click
  };

  const displayedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <TableContainer component={Paper} elevation={0} sx={{ minHeight: "450px", maxHeight: "450px", backgroundColor: theme.palette.background.light }}>
        <Table sx={{ minWidth: '100%' }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.background.light, borderBottom: `2px solid ${theme.palette.common.black}` }}>
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Disaster</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedData.map((row, index) => (
              <TableRow
                key={index}
                onClick={() => handleRowClick(row)} // Add click handler
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "& td": { borderBottom: `1px solid ${theme.palette.common.black}` },
                  "&:hover": { backgroundColor: theme.palette.grey[800] },
                }}
              >
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.address}</TableCell>
                <TableCell>{row.disaster}</TableCell>
                <TableCell>{row.time}</TableCell>
                <TableCell>{row.priority}</TableCell>
                <TableCell>
                  <Select
                    value={row.status}
                    onChange={(e) => handleStatusChange(index, e.target.value)}
                    variant="standard"
                    sx={{ m: 0.5, borderBottom: "none" }}
                    renderValue={(value) => (
                      <Chip
                        label={value}
                        sx={{
                          backgroundColor: getStatusStyles(value).backgroundColor,
                          color: getStatusStyles(value).color,
                        }}
                      />
                    )}
                  >
                    {statusOptions.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <MapComponent selectedAddress={selectedAddress} /> //Include the map component
      </Box>
    );
  };
  
  export default DataTable;

*/