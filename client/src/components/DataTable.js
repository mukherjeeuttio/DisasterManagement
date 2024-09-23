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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const initialData = [
  { name: "John Doe", address: "123 Main St, City, Country", disaster: "Flood", time: "2024-09-22 10:30 AM", priority: "High", status: "Ongoing" },
  { name: "Jane Smith", address: "456 Oak St, City, Country", disaster: "Earthquake", time: "2024-09-21 03:45 PM", priority: "Critical", status: "Resolved" },
  { name: "Alice Johnson", address: "789 Pine St, City, Country", disaster: "Wildfire", time: "2024-09-20 01:15 PM", priority: "Medium", status: "Ongoing" },
  { name: "Bob Brown", address: "321 Maple St, City, Country", disaster: "Tornado", time: "2024-09-19 11:00 AM", priority: "High", status: "Critical" },
  // Add more data objects to simulate a larger dataset
];

const getStatusStyles = (status, theme) => {
  switch (status) {
    case "Ongoing":
      return { backgroundColor: theme.palette.secondary[300], color: theme.palette.common.black };
    case "Resolved":
      return { backgroundColor: theme.palette.primary[500], color: theme.palette.common.white };
    case "Critical":
      return { backgroundColor: theme.palette.secondary[500], color: theme.palette.common.white };
    default:
      return { backgroundColor: theme.palette.grey[300], color: theme.palette.common.black };
  }
};

const DataTable = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [data, setData] = useState(initialData); // Use state to manage data

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when changing rows per page
  };

  const handleStatusChange = (index, newStatus) => {
    const updatedData = [...data];
    updatedData[index].status = newStatus;
    setData(updatedData);
  };

  const displayedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ padding: "0.25rem", backgroundColor: theme.palette.background.light, borderRadius: "1rem" }}>
      <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 300, backgroundColor: theme.palette.background.light, width: '100%' }} className="scrollbar">
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
                  "&:hover": { backgroundColor: theme.palette.grey[100] },
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
                    variant="outlined"
                    sx={{ minWidth: 100 }}
                  >
                    <MenuItem value="Ongoing">Ongoing</MenuItem>
                    <MenuItem value="Resolved">Resolved</MenuItem>
                    <MenuItem value="Critical">Critical</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[4, 10, 25]}
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



// import React, { useState } from "react";
// import { Table, TableBody, TableCell, TableHead, TableRow, TablePagination, Select, MenuItem } from "shadcn";

// const data = [
//   { id: 1, name: "John Doe", address: "123 Main St, City, Country", disaster: "Flood", time: "2024-09-22 10:30 AM", priority: "High", status: "Ongoing" },
//   { id: 2, name: "Jane Smith", address: "456 Oak St, City, Country", disaster: "Earthquake", time: "2024-09-21 03:45 PM", priority: "Critical", status: "Resolved" },
//   // Add more data objects
// ];

// const statusOptions = ["Ongoing", "Resolved", "Critical"];

// const DataTable = () => {
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(4);
//   const [tableData, setTableData] = useState(data);

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleStatusChange = (id, newStatus) => {
//     setTableData((prevData) =>
//       prevData.map((row) => (row.id === id ? { ...row, status: newStatus } : row))
//     );
//   };

//   const displayedData = tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//   return (
//     <div>
//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell>Name</TableCell>
//             <TableCell>Address</TableCell>
//             <TableCell>Disaster</TableCell>
//             <TableCell>Time</TableCell>
//             <TableCell>Priority</TableCell>
//             <TableCell>Status</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {displayedData.map((row) => (
//             <TableRow key={row.id}>
//               <TableCell>{row.name}</TableCell>
//               <TableCell>{row.address}</TableCell>
//               <TableCell>{row.disaster}</TableCell>
//               <TableCell>{row.time}</TableCell>
//               <TableCell>{row.priority}</TableCell>
//               <TableCell>
//                 <Select
//                   value={row.status}
//                   onChange={(e) => handleStatusChange(row.id, e.target.value)}
//                 >
//                   {statusOptions.map((status) => (
//                     <MenuItem key={status} value={status}>
//                       {status}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//       <TablePagination
//         rowsPerPageOptions={[4, 10, 25]}
//         count={tableData.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />
//     </div>
//   );
// };

// export default DataTable;
