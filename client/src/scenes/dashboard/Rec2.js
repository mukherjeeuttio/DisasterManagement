import React, { useState } from 'react';
import DashBox from '../../components/DashBox';
import DetailsComponent from '../../components/DetailsComponent';
import { Typography } from '@mui/material';

const Rec2 = ({ selectedTask }) => {
  // State to track changes in the task
  const [task, setTask] = useState(selectedTask);

  // Sync `task` state when `selectedTask` updates
  React.useEffect(() => {
    setTask(selectedTask);
  }, [selectedTask]);

  // Handler to update the task status
  const handleStatusChange = (newStatus) => {
    setTask((prevTask) => ({
      ...prevTask,
      status: newStatus,
    }));
  };

  // Handler to update the task personnel
  const handlePersonnelChange = (newPersonnel) => {
    setTask((prevTask) => ({
      ...prevTask,
      personnel: newPersonnel,
    }));
  };

  // Handler to update the task priority
  const handlePriorityChange = (newPriority) => {
    setTask((prevTask) => ({
      ...prevTask,
      priority: newPriority,
    }));
  };

  if (!task) {
    return (
      <DashBox gridArea="b" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography variant="h4" sx={{ textAlign: 'center' }}>No task selected</Typography>
      </DashBox>
    );
  }

  return (
    <DashBox gridArea="b">
      <DetailsComponent
        selectedData={task}
        onStatusChange={handleStatusChange}
        onPersonnelChange={handlePersonnelChange}
        onPriorityChange={handlePriorityChange} // Pass the priority change handler
      />
    </DashBox>
  );
};

export default Rec2;
