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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";

const RegisteredUserInfo = ({ onRowClick = () => {} }) => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://f084-136-233-9-98.ngrok-free.app/registered-users", {
          headers: {
            'ngrok-skip-browser-warning': '70',
          },
        });
        console.log("data received from mongo", response.data.users);
        setData((response.data) ? response.data.users : []);
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
                <TableCell sx={{ color: '#12efc8' }}>POC Name</TableCell>
                <TableCell sx={{ color: '#12efc8' }}>Phone</TableCell>
                <TableCell sx={{ color: '#12efc8' }}>Email</TableCell>
                <TableCell sx={{ color: '#12efc8' }}>Address</TableCell>
                <TableCell sx={{ color: '#12efc8' }}>Property Type</TableCell>
                <TableCell sx={{ color: '#12efc8' }}>Property Name</TableCell>
                <TableCell sx={{ color: '#12efc8' }}>No. of People</TableCell>
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
                    <TableCell sx={{ color: '#F0F7FD' }}>{row.phone}</TableCell>
                    <TableCell sx={{ color: '#F0F7FD' }}>{row.email}</TableCell>
                    <TableCell sx={{ color: '#F0F7FD' }}>{row.address || "N/A"}</TableCell>
                    <TableCell sx={{ color: '#F0F7FD' }}>{row.propertyType || "N/A"}</TableCell>
                    <TableCell sx={{ color: '#F0F7FD' }}>{row.propertyName || "N/A"}</TableCell>
                    <TableCell sx={{ color: '#F0F7FD' }}>{row.noOfPeople || "N/A"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ color: '#F0F7FD' }}>
                    No data available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
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

export default RegisteredUserInfo;
