import React, { useState } from "react";
import { Box, Typography, Select, MenuItem, Chip } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import axios from "axios";

const personnelOptions = ["team_1", "Sarah Lee", "James Carter", "Emily Clark"];
const priorityOptions = ["High", "Medium", "Low"];
const statusOptions = ["Ongoing", "Resolved", "Critical"];

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

const DetailsComponent = ({ selectedData, onStatusChange, onPersonnelChange, onPriorityChange }) => {
  const theme = useTheme();
  const [error, setError] = useState(null);

  if (!selectedData) {
    return <Typography variant="h6" sx={{ color: theme.palette.grey[500] }}>Select a row to see details</Typography>;
  }

  // API call to update status
  const updateStatusInDB = async (newStatus) => {
    try {
      const response = await axios.put("https://f084-136-233-9-98.ngrok-free.app/update-status", {
        _id: selectedData._id,
        status: newStatus,
      });
      console.log("Status updated:", response.data);
    } catch (err) {
      console.error("Error updating status:", err);
      setError("Failed to update status. Please try again.");
    }
  };

  // API call to update priority
  const updatePriorityInDB = async (newPriority) => {
    try {
      const response = await axios.put("https://f084-136-233-9-98.ngrok-free.app/update-priority", {
        _id: selectedData._id,
        priority: newPriority,
      });
      console.log("Priority updated:", response.data);
    } catch (err) {
      console.error("Error updating priority:", err);
      setError("Failed to update priority. Please try again.");
    }
  };

  // API call to update team assigned
  const updateTeamInDB = async (newTeam) => {
    try {
      const response = await axios.put("https://f084-136-233-9-98.ngrok-free.app/update-team", {
        _id: selectedData._id,
        team_assigned: newTeam,
      });
      console.log("Team assigned updated:", response.data);
    } catch (err) {
      console.error("Error updating team:", err);
      setError("Failed to update team assignment. Please try again.");
    }
  };

  const handleStatusChange = (event) => {
    const newStatus = event.target.value;
    onStatusChange(newStatus);
    updateStatusInDB(newStatus);
  };

  const handlePersonnelChange = (event) => {
    const newPersonnel = event.target.value;
    onPersonnelChange(newPersonnel);
    updateTeamInDB(newPersonnel);
  };

  const handlePriorityChange = (event) => {
    const newPriority = event.target.value;
    onPriorityChange(newPriority);
    updatePriorityInDB(newPriority);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: "1rem", backgroundColor: theme.palette.background.light, borderRadius: "1rem", color: theme.palette.grey[100] }}>
      <Box sx={{ flex: 1 }}>
        {error && <Typography variant="body1" sx={{ color: 'red' }}>{error}</Typography>}
        <Typography variant="h3" sx={{ color: theme.palette.primary.main, marginBottom: "0.5rem" }}>Details</Typography>
        <Typography variant="body1" sx={{ marginBottom: "0.5rem" }}><strong>Name:</strong> {selectedData.name}</Typography>
        <Typography variant="body1" sx={{ marginBottom: "0.5rem" }}><strong>Address:</strong> {selectedData.address}</Typography>
        <Typography variant="body1" sx={{ marginBottom: "0.5rem" }}><strong>Phone:</strong> {selectedData.phone}</Typography>
        <Typography variant="body1" sx={{ marginBottom: "0.5rem" }}><strong>Issue:</strong> {selectedData.issue}</Typography>
        <Typography variant="body1" sx={{ marginBottom: "0.5rem" }}><strong>Time:</strong> {new Date(selectedData.time).toLocaleString()}</Typography>
      </Box>

      <Box sx={{ flex: 1, marginRight: "0.5rem" }}>
        {/* Status Select */}
        <Typography variant="body1" sx={{ marginBottom: "1rem", marginTop: "0.5rem" }}>
          <strong>Status:</strong>
          <Select
            value={selectedData.status}
            onChange={handleStatusChange}
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
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </Typography>

        {/* Personnel Select */}
        <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
          <strong>Team Assigned:</strong>
          <Select
            value={selectedData.team_assigned}
            onChange={handlePersonnelChange}
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
                  backgroundColor: '#12efc8',
                  color: '#000',
                }}
              />
            )}
          >
            {personnelOptions.map((team_assigned) => (
              <MenuItem key={team_assigned} value={team_assigned} sx={{ color: theme.palette.grey[700] }}>
                {team_assigned}
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
        </Typography>
      </Box>
    </Box>
  );
};

export default DetailsComponent;
