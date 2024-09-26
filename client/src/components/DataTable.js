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
  { name: "John Doe", address: "VIT,VELLORE", disaster: "Flood", time: "2024-09-22 10:30 AM", priority: "High", status: "Ongoing", phone: "123-456-7890", transcription: "Flood emergency at VIT,VELLORE. Immediate attention required.Flood emergency at VIT,VELLORE. Immediate attention required." },
  { name: "Jane Smith", address: "VIT,VELLORE", disaster: "Earthquake", time: "2024-09-21 03:45 PM", priority: "Critical", status: "Resolved", phone: "987-654-3210", transcription: "Earthquake has been resolved but aftershocks continue." },
  { name: "Alice Johnson", address: "VIT,VELLORE", disaster: "Wildfire", time: "2024-09-20 01:15 PM", priority: "Medium", status: "Ongoing", phone: "456-789-1234" },
  { name: "Bob Brown", address: "Professor Enclave, Sector-56,Gururgram", disaster: "Tornado", time: "2024-09-19 11:00 AM", priority: "High", status: "Critical", phone: "321-654-9870" },
  { name: "John Doe", address: "123 Main St, City, Country", disaster: "Flood", time: "2024-09-22 10:30 AM", priority: "High", status: "Ongoing", phone: "123-456-7890" },
  { name: "Jane Smith", address: "456 Oak St, City, Country", disaster: "Earthquake", time: "2024-09-21 03:45 PM", priority: "Critical", status: "Resolved", phone: "987-654-3210" },
  { name: "Alice Johnson", address: "789 Pine St, City, Country", disaster: "Wildfire", time: "2024-09-20 01:15 PM", priority: "Medium", status: "Ongoing", phone: "456-789-1234" },
  { name: "Bob Brown", address: "321 Maple St, City, Country", disaster: "Tornado", time: "2024-09-19 11:00 AM", priority: "High", status: "Critical", phone: "321-654-9870" },
  // Add more data as necessary
];

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

const getPriorityStyles = (priority) => {
  switch (priority) {
    case "High":
      return { backgroundColor: "#EF5350", color: "white" }; // Red
    case "Medium":
      return { backgroundColor: "#FFA726", color: "black" }; // Gold
    case "Low":
      return { backgroundColor: "#66BB6A", color: "white" }; // Lime Green
    default:
      return { backgroundColor: "#fff", color: "#000" };
  }
};

const statusOptions = ["Ongoing", "Resolved", "Critical"];
const priorityOptions = ["Medium", "Low", "High"];

const DataTable = ({ onRowClick = () => {} }) => {
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

  const handlePriorityChange = (index, newPriority) => {
    const updatedData = [...data];
    updatedData[index].priority = newPriority;
    setData(updatedData);
  };

  const displayedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ 
      padding: "0.25rem", 
      backgroundColor: theme.palette.background.light, 
      borderRadius: "1rem",
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}>
      <TableContainer component={Paper} elevation={0} sx={{ flex: 1, backgroundColor: theme.palette.background.light, width: '100%', overflow: 'auto',maxHeight: "470px" }}>
        <Table sx={{ minWidth: '100%', color: '#F0F7FD' }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.background.light, position: 'sticky', top: 0, zIndex: 1 }}>
              <TableCell sx={{ color: '#12efc8' }}>Name</TableCell>
              <TableCell sx={{ color: '#12efc8' }}>Address</TableCell>
              <TableCell sx={{ color: '#12efc8' }}>Disaster</TableCell>
              <TableCell sx={{ color: '#12efc8' }}>Time</TableCell>
              <TableCell sx={{ color: '#12efc8' }}>Priority</TableCell>
              <TableCell sx={{ color: '#12efc8' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedData.map((row, index) => (
              <TableRow
                key={index}
                onClick={() => onRowClick(row)}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "& td": { borderBottom: `1px solid #F0F7FD` },
                  "&:hover": { backgroundColor: theme.palette.grey[800] },
                }}
              >
                <TableCell sx={{ color: '#F0F7FD' }}>{row.name}</TableCell>
                <TableCell sx={{ color: '#F0F7FD' }}>{row.address}</TableCell>
                <TableCell sx={{ color: '#F0F7FD' }}>{row.disaster}</TableCell>
                <TableCell sx={{ color: '#F0F7FD' }}>{row.time}</TableCell>
                <TableCell sx={{ color: '#F0F7FD' }}>
                  <Select
                    value={row.priority}
                    onChange={(e) => handlePriorityChange(index, e.target.value)}
                    variant="standard"
                    sx={{
                      m: 0.5,
                      '& .MuiSelect-icon': { color: '#F0F7FD' },
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#F0F7FD' },
                      borderBottom: "none",
                      "&:before": { borderBottom: "none" },
                      "&:after": { borderBottom: "none" },
                      "&:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                    }}
                    renderValue={(value) => (
                      <Chip
                        label={value}
                        sx={{
                          backgroundColor: getPriorityStyles(value).backgroundColor,
                          color: getPriorityStyles(value).color,
                        }}
                      />
                    )}
                  >
                    {priorityOptions.map((priority) => (
                      <MenuItem key={priority} value={priority} sx={{ color: theme.palette.grey[700] }}>
                        {priority}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell sx={{ color: '#F0F7FD' }}>
                  <Select
                    value={row.status}
                    onChange={(e) => handleStatusChange(index, e.target.value)}
                    variant="standard"
                    sx={{
                      m: 0.5,
                      '& .MuiSelect-icon': { color: '#F0F7FD' },
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#F0F7FD' },
                      borderBottom: "none",
                      "&:before": { borderBottom: "none" },
                      "&:after": { borderBottom: "none" },
                      "&:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                    }}
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
                      <MenuItem key={status} value={status} sx={{ color: theme.palette.grey[700] }}>
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
        sx={{
          backgroundColor: theme.palette.background.light,
          color: "#12efc8",
        }}
      />
    </Box>
  );
};

export default DataTable;
