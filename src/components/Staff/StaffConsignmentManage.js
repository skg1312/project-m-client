import React, { useState, useEffect } from 'react';
import './StaffConsignmentManage.css';
import axios from 'axios';
import background from '../images/Desktop.png';

import ReactPaginate from 'react-paginate';
import StaffNavbar from './StaffNavbar';


function StaffConsignmentManage() {
  const [consignedItems, setConsignedItems] = useState([]);
  const [selectedConsignmentId, setSelectedConsignmentId] = useState(null);
  const API = process.env.REACT_APP_API;
  const [selectedConsignmentData, setSelectedConsignmentData] = useState({
    itemname: '',
    itemquantity: '',
    itemhsn: '',
    itemprice: '',
    itemtaxrate: '',
  });

  const [searchInput, setSearchInput] = useState(''); // State for search input
  const itemsPerPage = 12;
  const [pageNumber, setPageNumber] = useState(0);

  useEffect(() => {
    axios
      .get(`${API}consignment`)
      .then((response) => {
        setConsignedItems(response.data);
      })
      .catch((error) => {
        console.error('Error fetching consignment data:', error);
      });
  }, [API]);
  const sortedConsigned = [...consignedItems].reverse();
  const displayedConsignedSearch = sortedConsigned
  .filter(
    (item) =>
      item.itemname.toLowerCase().includes(searchInput.toLowerCase()))
  .slice(pageNumber * itemsPerPage, (pageNumber + 1) * itemsPerPage);

  
  const pageCount = Math.ceil(consignedItems.length / itemsPerPage);

  const handleConsignmentUpdate = (consignmentUpdateId) => {
    setSelectedConsignmentId(consignmentUpdateId);
    const selectedConsignment = consignedItems.find(
      (consignment) => consignment._id === consignmentUpdateId
    );
    setSelectedConsignmentData({ ...selectedConsignment });
  };

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (selectedConsignmentId) {
      // Update an existing consignment
      axios
        .put(`${API}consignment/${selectedConsignmentId}`, selectedConsignmentData)
        .then((response) => {
          // Handle successful update (if needed)
          console.log('Consignment updated successfully:', response.data);
          // Optionally, you can update the local state to reflect the changes
          setConsignedItems((prevConsignedItems) =>
            prevConsignedItems.map((consignment) =>
              consignment._id === selectedConsignmentId ? response.data : consignment
            )
          );
        })
        .catch((error) => {
          console.error('Error updating consignment:', error);
        });
    } else {
      // Create a new consignment
      axios
        .post(`${API}consignment`, selectedConsignmentData)
        .then((response) => {
          // Handle successful creation (if needed)
          console.log('Consignment created successfully:', response.data);
          // Optionally, you can update the local state to include the new consignment
          setConsignedItems((prevConsignedItems) => [...prevConsignedItems, response.data]);
        })
        .catch((error) => {
          console.error('Error creating consignment:', error);
        });
    }

    setSelectedConsignmentData({
      itemname: '',
      itemquantity: '',
      itemhsn: '',
      itemprice: '',
      itemtaxrate: '',
    });

    setSelectedConsignmentId(null);
  };

 
  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
      }}
    >
      <StaffNavbar />
      <div className='staff-consignment-manage'>
        <div className='staff-consignment-manage-data'>
          <h1 className='staff-consignment-manage-data-title'>ALL CONSIGNMENTS</h1>
          <input
              type='text'
              placeholder='Search Item Name...'
              className='staff-consignment-manage-form-input' // Search input placeholder
              value={searchInput} // Bind the input value to the state
              onChange={(e) => setSearchInput(e.target.value)} // Update the searchInput state as the user types
            />
          <table className='staff-consignment-manage-data-table'>
            <thead className='staff-consignment-manage-data-table-head'>
              <tr className='staff-consignment-manage-data-table-row-head'>
                <th className='staff-consignment-manage-data-table-header'>Item Name</th>
                <th className='staff-consignment-manage-data-table-header'>Item Quantity</th>
                <th className='staff-consignment-manage-data-table-header'>Item HSN</th>
                <th className='staff-consignment-manage-data-table-header'>Item Price</th>
                <th className='staff-consignment-manage-data-table-header'>Item Tax Rate</th>
                <th className='staff-consignment-manage-data-table-header'>Action</th>
              </tr>
            </thead>
            <tbody className='staff-consignment-manage-data-table-body'>
              {displayedConsignedSearch.map((item) => (
                  <tr key={item._id} className='staff-consignment-manage-data-table-row-body'>
                    <td className='staff-consignment-manage-data-table-data highlight'>{item.itemname}</td>
                    <td className='staff-consignment-manage-data-table-data'>{item.itemquantity}</td>
                    <td className='staff-consignment-manage-data-table-data'>{item.itemhsn}</td>
                    <td className='staff-consignment-manage-data-table-data'>{item.itemprice}</td>
                    <td className='staff-consignment-manage-data-table-data'>{item.itemtaxrate}</td>
                    <td className='staff-consignment-manage-data-table-data'>
                      <button
                        className='staff-consignment-manage-data-table-button'
                        onClick={() => handleConsignmentUpdate(item._id)}
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <br />
         
          <ReactPaginate
          className='pagination-container'
          previousLabel='Previous'
          nextLabel='Next'
          pageCount={pageCount}
          onPageChange={changePage}
          containerClassName='pagination'
          previousLinkClassName='previous-page'
          nextLinkClassName='next-page'
          disabledClassName='pagination-button disabled'
          activeClassName='pagination-button active'
          pageClassName='pagination-button'
          breakClassName='pagination-space'
        />
          
        </div>
        <div className='staff-consignment-manage-form'>
          <h1 className='staff-consignment-manage-form-title'>
            {selectedConsignmentId ? 'UPDATE CONSIGNMENT' : 'ADD CONSIGNMENT'}
          </h1>
          <form className='staff-consignment-manage-form-form' onSubmit={handleFormSubmit}>
            <input
              type='text'
              required
              className='staff-consignment-manage-form-input'
              placeholder='Item Name'
              value={selectedConsignmentData.itemname || ''}
              onChange={(e) =>
                setSelectedConsignmentData({ ...selectedConsignmentData, itemname: e.target.value })
              }
            />
            <input
              type='number'
              required
              pattern='[0-9]*'
              className='staff-consignment-manage-form-input'
              placeholder='Item Quantity'
              value={selectedConsignmentData.itemquantity || ''}
              onChange={(e) =>
                setSelectedConsignmentData({ ...selectedConsignmentData, itemquantity: e.target.value })
              }
            />
            <input
              type='number'
              pattern='[0-9]*'
              required
              className='staff-consignment-manage-form-input'
              placeholder='Item HSN'
              value={selectedConsignmentData.itemhsn || ''}
              onChange={(e) =>
                setSelectedConsignmentData({ ...selectedConsignmentData, itemhsn: e.target.value })
              }
            />
            <input
              type='number'
              required
              pattern='[0-9]*'
              className='staff-consignment-manage-form-input'
              placeholder='Item Price'
              value={selectedConsignmentData.itemprice || ''}
              onChange={(e) =>
                setSelectedConsignmentData({ ...selectedConsignmentData, itemprice: e.target.value })
              }
            />
            <input
              type='number'
              pattern='[0-9]*'
              required
              className='staff-consignment-manage-form-input'
              placeholder='Item Tax Rate'
              value={selectedConsignmentData.itemtaxrate || ''}
              onChange={(e) =>
                setSelectedConsignmentData({ ...selectedConsignmentData, itemtaxrate: e.target.value })
              }
            />
          
            <br />
          <input type='checkbox' required className='staff-consignment-manage-form-input-checkbox' />
          <label className='staff-consignment-manage-form-input-checkbox-label'>
            I you agree with Terms and Conditions & Privacy Policy
          </label>
          <br />
            <button type='submit' className='staff-consignment-manage-form-button'>
              {selectedConsignmentId ? 'Update' : 'Add'}
            </button>
          </form> 
        </div>
      </div>
    </div>
  );
}

export default StaffConsignmentManage;
