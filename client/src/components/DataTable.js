import React, { useState, useEffect } from "react";
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
import axios from "axios";

const getStatusStyles = (status) => {
  switch (status) {
    case "Ongoing":
      return { backgroundColor: "#FFA726", color: "black" };
    case "Resolved":
      return { backgroundColor: "#66BB6A", color: "white" };
    case "Critical":
      return { backgroundColor: "#EF5350", color: "white" };
    default:
      return { backgroundColor: "#E0E0E0", color: "black" };
  }
};

const getPriorityStyles = (priority) => {
  switch (priority) {
    case "High":
      return { backgroundColor: "#EF5350", color: "white" };
    case "Medium":
      return { backgroundColor: "#FFA726", color: "black" };
    case "Low":
      return { backgroundColor: "#66BB6A", color: "white" };
    default:
      return { backgroundColor: "#fff", color: "#000" };
  }
};

const statusOptions = ["Ongoing", "Resolved", "Critical"];
const priorityOptions = ["5", "4", "3", "2", "1"];

const DataTable = ({ onRowClick = () => {} }) => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://4454-136-233-9-98.ngrok-free.app/users", {
          headers: {
            'ngrok-skip-browser-warning': '70',
          },
        });
        console.log("data received from mongo", response.data);
        setData(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const updatePriorityInDB = async (id, newPriority) => {
    try {
      await axios.put("https://4454-136-233-9-98.ngrok-free.app/update-priority", {
        _id: id,
        priority: newPriority,
      });
    } catch (err) {
      console.error("Error updating priority:", err);
    }
  };

  const updateStatusInDB = async (id, newStatus) => {
    try {
      await axios.put("https://4454-136-233-9-98.ngrok-free.app/update-status", {
        _id: id,
        status: newStatus,
      });
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleStatusChange = (index, newStatus) => {
    const updatedData = [...data];
    updatedData[index].status = newStatus;
    setData(updatedData);
    updateStatusInDB(updatedData[index]._id, newStatus);
  };

  const handlePriorityChange = (index, newPriority) => {
    const updatedData = [...data];
    updatedData[index].priority = newPriority;
    setData(updatedData);
    updatePriorityInDB(updatedData[index]._id, newPriority);
  };

  const displayedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ padding: "0.25rem", backgroundColor: theme.palette.background.light, borderRadius: "1rem", display: 'flex', flexDirection: 'column', height: '100%' }}>
      {loading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ flex: 1, backgroundColor: theme.palette.background.light, width: '100%', overflow: 'auto', maxHeight: "470px" }}>
          <Table sx={{ minWidth: '100%', color: '#F0F7FD' }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: theme.palette.background.light, position: 'sticky', top: 0, zIndex: 1 }}>
                <TableCell sx={{ color: '#12efc8' }}>Name</TableCell>
                <TableCell sx={{ color: '#12efc8' }}>Address</TableCell>
                <TableCell sx={{ color: '#12efc8' }}>Issue</TableCell>
                <TableCell sx={{ color: '#12efc8' }}>Time</TableCell>
                <TableCell sx={{ color: '#12efc8' }}>Priority</TableCell>
                <TableCell sx={{ color: '#12efc8' }}>Status</TableCell>
                <TableCell sx={{ color: '#12efc8' }}>Location</TableCell> {/* New Column Header */}
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(displayedData) && displayedData.length > 0 ? (
                displayedData.map((row, index) => (
                  <TableRow
                    key={row._id}
                    onClick={() => onRowClick(row)}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "& td": { borderBottom: `1px solid #F0F7FD` },
                      "&:hover": { backgroundColor: theme.palette.grey[800] },
                    }}
                  >
                    <TableCell sx={{ color: '#F0F7FD' }}>{row.name}</TableCell>
                    <TableCell sx={{ color: '#F0F7FD' }}>{row.address || "N/A"}</TableCell>
                    <TableCell sx={{ color: '#F0F7FD' }}>{row.issue}</TableCell>
                    <TableCell sx={{ color: '#F0F7FD' }}>{new Date(row.time).toLocaleString()}</TableCell>
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
                    <TableCell sx={{ color: '#F0F7FD' }}>
                      {row.location.latitude && row.location.longitude
                        ? `${row.location.latitude.toFixed(6)}, ${row.location.longitude.toFixed(6)}`
                        : "N/A"}
                    </TableCell> {/* New Column Data */}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: "center", color: '#F0F7FD' }}>No Data Available</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              "& .MuiTablePagination-toolbar": { backgroundColor: '#12efc8' },
              "& .MuiTablePagination-selectRoot": { backgroundColor:'#12efc8' },
              "& .MuiTablePagination-displayedRows": { color: 'black' },
              "& .MuiTablePagination-selectIcon": { color: 'black' },
            }}
          />
        </TableContainer>
      )}
    </Box>
  );
};

export default DataTable;

// ========================================================================================================

// import React, { useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   TablePagination,
//   Box,
//   Select,
//   MenuItem,
//   Chip,
// } from "@mui/material";
// import { useTheme } from "@mui/material/styles";

// const initialData = [
//   {
//     name: "John Doe",
//     phone: "123-456-7890",
//     address: null,
//     issue: "Flood",
//     time: new Date("2024-09-22T10:30:00"), // ISO Date format
//     priority: "High",
//     status: "Ongoing",
//     transcribed_text: "Flood emergency at VIT,VELLORE. Immediate attention required.",
//     audio: null, // Assume audio file if exists
//     location: {
//       latitude: 12.9165,
//       longitude: 79.1325,
//     },
//     team_assigned: "team_1"
//   },
//   {
//     name: "Jane Smith",
//     phone: "987-654-3210",
//     address: "VIT, Vellore",
//     issue: "Earthquake",
//     time: new Date("2024-09-21T15:45:00"),
//     priority: "Critical",
//     status: "Resolved",
//     transcribed_text: "Earthquake has been resolved but aftershocks continue.",
//     audio: null,
//     location: {
//       latitude: 12.9165,
//       longitude: 79.1325,
//     },
//     team_assigned: "team_2"
//   },
//   {
//     name: "Alice Johnson",
//     phone: "456-789-1234",
//     address: "VIT, Vellore",
//     issue: "Wildfire",
//     time: new Date("2024-09-20T13:15:00"),
//     priority: "Medium",
//     status: "Ongoing",
//     transcribed_text: null,
//     audio: null,
//     location: {
//       latitude: 12.9165,
//       longitude: 79.1325,
//     },
//     team_assigned: "team_3"
//   },
//   {
//     name: "Bob Brown",
//     phone: "321-654-9870",
//     address: "Professor Enclave, Sector-56, Gurugram",
//     issue: "Tornado",
//     time: new Date("2024-09-19T11:00:00"),
//     priority: "High",
//     status: "Critical",
//     transcribed_text: null,
//     audio: null,
//     location: {
//       latitude: 28.4595,
//       longitude: 77.0266,
//     },
//     team_assigned: "team_4"
//   },
// ];


// const getStatusStyles = (status) => {
//   switch (status) {
//     case "Ongoing":
//       return { backgroundColor: "#FFA726", color: "black" }; // Orange for Ongoing
//     case "Resolved":
//       return { backgroundColor: "#66BB6A", color: "white" }; // Green for Resolved
//     case "Critical":
//       return { backgroundColor: "#EF5350", color: "white" }; // Red for Critical
//     default:
//       return { backgroundColor: "#E0E0E0", color: "black" }; // Default grey
//   }
// };

// const getPriorityStyles = (priority) => {
//   switch (priority) {
//     case "High":
//       return { backgroundColor: "#EF5350", color: "white" }; // Red
//     case "Medium":
//       return { backgroundColor: "#FFA726", color: "black" }; // Gold
//     case "Low":
//       return { backgroundColor: "#66BB6A", color: "white" }; // Lime Green
//     default:
//       return { backgroundColor: "#fff", color: "#000" };
//   }
// };

// const statusOptions = ["Ongoing", "Resolved", "Critical"];
// const priorityOptions = ["Medium", "Low", "High"];

// const DataTable = ({ onRowClick = () => {} }) => {
//   const theme = useTheme();
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [data, setData] = useState(initialData);

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleStatusChange = (index, newStatus) => {
//     const updatedData = [...data];
//     updatedData[index].status = newStatus;
//     setData(updatedData);
//   };

//   const handlePriorityChange = (index, newPriority) => {
//     const updatedData = [...data];
//     updatedData[index].priority = newPriority;
//     setData(updatedData);
//   };

//   const displayedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//   return (
//     <Box sx={{ 
//       padding: "0.25rem", 
//       backgroundColor: theme.palette.background.light, 
//       borderRadius: "1rem",
//       display: 'flex',
//       flexDirection: 'column',
//       height: '100%',
//     }}>
//       <TableContainer component={Paper} elevation={0} sx={{ flex: 1, backgroundColor: theme.palette.background.light, width: '100%', overflow: 'auto',maxHeight: "470px" }}>
//         <Table sx={{ minWidth: '100%', color: '#F0F7FD' }}>
//           <TableHead>
//             <TableRow sx={{ backgroundColor: theme.palette.background.light, position: 'sticky', top: 0, zIndex: 1 }}>
//               <TableCell sx={{ color: '#12efc8' }}>Name</TableCell>
//               <TableCell sx={{ color: '#12efc8' }}>Address</TableCell>
//               <TableCell sx={{ color: '#12efc8' }}>Issue</TableCell>
//               <TableCell sx={{ color: '#12efc8' }}>Time</TableCell>
//               <TableCell sx={{ color: '#12efc8' }}>Priority</TableCell>
//               <TableCell sx={{ color: '#12efc8' }}>Status</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {displayedData.map((row, index) => (
//               <TableRow
//                 key={index}
//                 onClick={() => onRowClick(row)}
//                 sx={{
//                   "&:last-child td, &:last-child th": { border: 0 },
//                   "& td": { borderBottom: `1px solid #F0F7FD` },
//                   "&:hover": { backgroundColor: theme.palette.grey[800] },
//                 }}
//               >
//                 <TableCell sx={{ color: '#F0F7FD' }}>{row.name}</TableCell>
//                 <TableCell sx={{ color: '#F0F7FD' }}>{row.address}</TableCell>
//                 <TableCell sx={{ color: '#F0F7FD' }}>{row.issue}</TableCell>
//                 <TableCell sx={{ color: '#F0F7FD' }}>{row.time.toLocaleString()}</TableCell>
//                 <TableCell sx={{ color: '#F0F7FD' }}>
//                   <Select
//                     value={row.priority}
//                     onChange={(e) => handlePriorityChange(index, e.target.value)}
//                     variant="standard"
//                     sx={{
//                       m: 0.5,
//                       '& .MuiSelect-icon': { color: '#F0F7FD' },
//                       '& .MuiOutlinedInput-notchedOutline': { borderColor: '#F0F7FD' },
//                       borderBottom: "none",
//                       "&:before": { borderBottom: "none" },
//                       "&:after": { borderBottom: "none" },
//                       "&:hover:not(.Mui-disabled):before": { borderBottom: "none" },
//                     }}
//                     renderValue={(value) => (
//                       <Chip
//                         label={value}
//                         sx={{
//                           backgroundColor: getPriorityStyles(value).backgroundColor,
//                           color: getPriorityStyles(value).color,
//                         }}
//                       />
//                     )}
//                   >
//                     {priorityOptions.map((priority) => (
//                       <MenuItem key={priority} value={priority} sx={{ color: theme.palette.grey[700] }}>
//                         {priority}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </TableCell>
//                 <TableCell sx={{ color: '#F0F7FD' }}>
//                   <Select
//                     value={row.status}
//                     onChange={(e) => handleStatusChange(index, e.target.value)}
//                     variant="standard"
//                     sx={{
//                       m: 0.5,
//                       '& .MuiSelect-icon': { color: '#F0F7FD' },
//                       '& .MuiOutlinedInput-notchedOutline': { borderColor: '#F0F7FD' },
//                       borderBottom: "none",
//                       "&:before": { borderBottom: "none" },
//                       "&:after": { borderBottom: "none" },
//                       "&:hover:not(.Mui-disabled):before": { borderBottom: "none" },
//                     }}
//                     renderValue={(value) => (
//                       <Chip
//                         label={value}
//                         sx={{
//                           backgroundColor: getStatusStyles(value).backgroundColor,
//                           color: getStatusStyles(value).color,
//                         }}
//                       />
//                     )}
//                   >
//                     {statusOptions.map((status) => (
//                       <MenuItem key={status} value={status} sx={{ color: theme.palette.grey[700] }}>
//                         {status}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <TablePagination
//         rowsPerPageOptions={[5, 10, 25]}
//         component="div"
//         count={data.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//         sx={{
//           backgroundColor: theme.palette.background.light,
//           color: "#12efc8",
//         }}
//       />
//     </Box>
//   );
// };

// export default DataTable;