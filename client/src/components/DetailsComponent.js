import React from "react";
import { Box, Typography, Select, MenuItem, Chip } from "@mui/material";
import { useTheme } from '@mui/material/styles';

const personnelOptions = ["Mike Davis", "Sarah Lee", "James Carter", "Emily Clark"];
const priorityOptions = ["High", "Medium", "Low"]; // Define priority options
const statusOptions = ["Ongoing", "Resolved", "Critical"]; // Define status options

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
      return { backgroundColor: "#EF5350", color: "white" }; // Orange Red
    case "Medium":
      return { backgroundColor: "#FFA726", color: "black" }; // Gold
    case "Low":
      return { backgroundColor: "#66BB6A", color: "white" }; // Lime Green
    default:
      return { backgroundColor: "#fff", color: "#000" };
  }
};

const DetailsComponent = ({ selectedData, onStatusChange, onPersonnelChange, onPriorityChange }) => {
  const theme = useTheme();

  if (!selectedData) {
    return <Typography variant="h6" sx={{ color: theme.palette.grey[500] }}>Select a row to see details</Typography>;
  }

  const handleStatusChange = (event) => {
    onStatusChange(event.target.value);
  };

  const handlePersonnelChange = (event) => {
    onPersonnelChange(event.target.value);
  };

  const handlePriorityChange = (event) => {
    onPriorityChange(event.target.value);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: "1rem", backgroundColor: theme.palette.background.light, borderRadius: "1rem", color: theme.palette.grey[100] }}>
      <Box sx={{ flex: 1 }}>
        <Typography variant="h3" sx={{ color: theme.palette.primary.main, marginBottom: "0.5rem" }}>Details</Typography>
        <Typography variant="body1" sx={{ marginBottom: "0.5rem" }}><strong>Name:</strong> {selectedData.name}</Typography>
        <Typography variant="body1" sx={{ marginBottom: "0.5rem" }}><strong>Address:</strong> {selectedData.address}</Typography>
        <Typography variant="body1" sx={{ marginBottom: "0.5rem" }}><strong>Phone:</strong> {selectedData.phone}</Typography>
        <Typography variant="body1" sx={{ marginBottom: "0.5rem" }}><strong>Disaster:</strong> {selectedData.disaster}</Typography>
        <Typography variant="body1" sx={{ marginBottom: "0.5rem" }}><strong>Time:</strong> {selectedData.time}</Typography>
      </Box>

      <Box sx={{ flex: 1 , marginRight: "0.5rem"}}>
        {/* Status Select */}
        <Typography variant="body1" sx={{ marginBottom: "1rem", marginTop: "0.5rem" }}>
          <strong>Status:</strong>
          <Select
            value={selectedData.status}
            onChange={handleStatusChange}
            variant="standard"
            sx={{
              m: 0.5,
              '& .MuiSelect-icon': {
                color: '#F0F7FD',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#F0F7FD',
              },
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
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </Typography>

        {/* Personnel Select */}
        <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
          <strong>Personnel Assigned:</strong>
          <Select
            value={selectedData.personnel}
            onChange={handlePersonnelChange}
            variant="standard"
            sx={{
              m: 0.5,
              '& .MuiSelect-icon': {
                color: '#F0F7FD',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#F0F7FD',
              },
              borderBottom: "none",
              "&:before": { borderBottom: "none" },
              "&:after": { borderBottom: "none" },
              "&:hover:not(.Mui-disabled):before": { borderBottom: "none" },
            }}
            renderValue={(value) => (
              <Chip
                label={value}
                sx={{
                  backgroundColor: '#12efc8',
                  color: '#000',
                }}
              />
            )}
          >
            {personnelOptions.map((personnel) => (
              <MenuItem key={personnel} value={personnel} sx={{ color: theme.palette.grey[700] }}>
                {personnel}
              </MenuItem>
            ))}
          </Select>
        </Typography>

        {/* Priority Select */}
        <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
          <strong>Priority:</strong>
          <Select
            value={selectedData.priority}
            onChange={handlePriorityChange}
            variant="standard"
            sx={{
              m: 0.5,
              '& .MuiSelect-icon': {
                color: '#F0F7FD',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#F0F7FD',
              },
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
        </Typography>
      </Box>
    </Box>
  );
};

export default DetailsComponent;
