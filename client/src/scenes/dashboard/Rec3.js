import React, { useState } from 'react';
import DashBox from '../../components/DashBox';
import MapComponent from '../../components/MapComponent'; // Adjust the path based on your structure
import DataTable from '../../components/DataTable'; // Adjust the path based on your structure

const Rec3 = () => {
  const [selectedAddress, setSelectedAddress] = useState('');

  const data = [
    { id: 1, address: '1600 Amphitheatre Parkway, Mountain View, CA' },
    { id: 2, address: '1 Infinite Loop, Cupertino, CA' },
    // Add more addresses as needed
  ];

  const handleRowClick = (address) => {
    setSelectedAddress(address);
  };

  return (
    <>
      <DashBox gridArea="c">
        <MapComponent selectedAddress={selectedAddress} />
      </DashBox>
    </>
  );
};

export default Rec3;
