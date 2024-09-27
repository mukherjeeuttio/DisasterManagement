import DashBox from '../../components/DashBox';
import MapComponent from '../../components/MapComponent'; // Adjust the path based on your structure

const Rec3 = ({ selectedTask }) => {
  const storedLocation = selectedTask 
    ? { location: { latitude: selectedTask.location.latitude, longitude: selectedTask.location.longitude } }
    : null;

  return (
    <DashBox gridArea="c">
      <MapComponent 
        selectedAddress={selectedTask ? selectedTask.address : null} 
        storedLocation={storedLocation}  // Pass storedLocation to the MapComponent
      />  
    </DashBox>
  );
};

export default Rec3;
