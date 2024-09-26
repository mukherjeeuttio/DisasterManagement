import DashBox from '../../components/DashBox';
import MapComponent from '../../components/MapComponent'; // Adjust the path based on your structure

const Rec3 = ({ selectedAddress }) => {
  return (
    <DashBox gridArea="c">
      <MapComponent selectedAddress={selectedAddress} />  {/* Map points to the selected address */}
    </DashBox>
  );
};

export default Rec3;
