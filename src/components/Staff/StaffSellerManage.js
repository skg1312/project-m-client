import React, { useState, useEffect } from 'react';
import './StaffSellerManage.css'
import axios from 'axios';
import background from '../images/Desktop.png';
import ReactPaginate from 'react-paginate';
import StaffNavbar from './StaffNavbar';

function StaffSellerManage() {
  const [sellers, setSellers] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [selectedSellerId, setSelectedSellerId] = useState(null);
  const API = process.env.REACT_APP_API;
  const [selectedSellerData, setSelectedSellerData] = useState({
    sellerid: '',
    sellercompanyname: '',
    sellercompanygstno: '',
    sellercompanyaddress: '',
    sellercompanystatename: '',
    sellercompanystatecode: '',
  });

  const itemsPerPage = 12;
  const [searchInput, setSearchInput] = useState('');

  // Sort the seller array in reverse order (newest first)
  const sortedSellers = [...sellers].reverse();
  const displayedSellerSearch = sortedSellers
  .filter(
    (item) =>
      item.sellercompanyname.toLowerCase().includes(searchInput.toLowerCase()))
  .slice(pageNumber * itemsPerPage, (pageNumber + 1) * itemsPerPage);


  const pageCount = Math.ceil(sortedSellers.length / itemsPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  useEffect(() => {
    axios
      .get(`${API}seller`)
      .then((response) => {
        setSellers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching seller data:', error);
      });
  }, [API]);

  const handleSellerUpdate = (sellerUpdateId) => {
    setSelectedSellerId(sellerUpdateId);
    const selectedSeller = sellers.find((seller) => seller._id === sellerUpdateId);
    setSelectedSellerData({ ...selectedSeller });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (selectedSellerId) {
      // Update an existing seller
      axios
        .put(`${API}seller/${selectedSellerId}`, selectedSellerData)
        .then((response) => {
          // Handle successful update (if needed)
          console.log('Seller updated successfully:', response.data);
          // Optionally, you can update the local state to reflect the changes
          setSellers((prevSellers) =>
            prevSellers.map((seller) => (seller._id === selectedSellerId ? response.data : seller))
          );
        })
        .catch((error) => {
          console.error('Error updating seller:', error);
        });
    } else {
      // Create a new seller
      axios
        .post(`${API}seller`, selectedSellerData)
        .then((response) => {
          // Handle successful creation (if needed)
          console.log('Seller created successfully:', response.data);
          // Optionally, you can update the local state to include the new seller
          setSellers((prevSellers) => [...prevSellers, response.data]);
        })
        .catch((error) => {
          console.error('Error creating seller:', error);
        });
    }

    setSelectedSellerData({
      sellerid: '',
      sellercompanyname: '',
      sellercompanygstno: '',
      sellercompanyaddress: '',
      sellercompanystatename: '',
      sellercompanystatecode: '',
    });

    setSelectedSellerId(null);
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
      <div className='staff-seller-manage'>
        <div className='staff-seller-manage-data'>
          <h1 className='staff-seller-manage-data-title'>ALL SELLERS</h1>
          <input
              type='text'
              placeholder='Search Seller...'
              className='admin-user-manage-form-input' // Search input placeholder
              value={searchInput} // Bind the input value to the state
              onChange={(e) => setSearchInput(e.target.value)} // Update the searchInput state as the user types
            />
          <table className='staff-seller-manage-data-table'>
  <thead className='staff-seller-manage-data-table-head'>
    <tr className='staff-seller-manage-data-table-row-head'>
      <th className='staff-seller-manage-data-table-header'>Sellers Id</th>
      <th className='staff-seller-manage-data-table-header'>Company Name</th>
      <th className='staff-seller-manage-data-table-header'>GST NO</th>
      <th className='staff-seller-manage-data-table-header'>State Name</th>
      
      <th className='staff-seller-manage-data-table-header'>Action</th>
    </tr>
  </thead>
  <tbody className='staff-seller-manage-data-table-body'>
    {displayedSellerSearch.map((seller) => (
      <tr key={seller._id} className='staff-seller-manage-data-table-row-body'>
        <td className='staff-seller-manage-data-table-data highlight'>{seller.sellerid.substring(0, 12)}</td>
        <td className='staff-seller-manage-data-table-data'>{seller.sellercompanyname.substring(0, 12)}</td>
        <td className='staff-seller-manage-data-table-data'>{seller.sellercompanygstno.substring(0, 12)}</td>
        <td className='staff-seller-manage-data-table-data'>{seller.sellercompanystatename.substring(0, 12)}</td>
        
        <td className='staff-seller-manage-data-table-data'>
          <button
            className='staff-seller-manage-data-table-button'
            onClick={() => handleSellerUpdate(seller._id)}
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
        <div className='staff-seller-manage-form'>
          <h1 className='staff-seller-manage-form-title'>
            {selectedSellerId ? 'UPDATE SELLER' : 'ADD SELLER'}
          </h1>
          <form className='staff-seller-manage-form-form' onSubmit={handleFormSubmit}>
            <input
              type='text'
              required
              className='staff-seller-manage-form-input'
              placeholder='Seller ID'
              value={selectedSellerData.sellerid || ''}
              onChange={(e) => setSelectedSellerData({ ...selectedSellerData, sellerid: e.target.value })}
            />
            <input
              type='text'
              required
              className='staff-seller-manage-form-input'
              placeholder='Company Name'
              value={selectedSellerData.sellercompanyname || ''}
              onChange={(e) => setSelectedSellerData({ ...selectedSellerData, sellercompanyname: e.target.value })}
            />
            <input
              type='text'
              required
              className='staff-seller-manage-form-input'
              placeholder='Company GST Number'
              value={selectedSellerData.sellercompanygstno || ''}
              onChange={(e) => setSelectedSellerData({ ...selectedSellerData, sellercompanygstno: e.target.value })}
            />
            <input
              type='text'
              required
              className='staff-seller-manage-form-input'
              placeholder='Company Address'
              value={selectedSellerData.sellercompanyaddress || ''}
              onChange={(e) => setSelectedSellerData({ ...selectedSellerData, sellercompanyaddress: e.target.value })}
            />
            <input
              type='text'
              required
              className='staff-seller-manage-form-input'
              placeholder='Company State Name'
              value={selectedSellerData.sellercompanystatename || ''}
              onChange={(e) => setSelectedSellerData({ ...selectedSellerData, sellercompanystatename: e.target.value })}
            />
            <input
              type='text'
              required
              className='staff-seller-manage-form-input'
              placeholder='Company State Code'
              value={selectedSellerData.sellercompanystatecode || ''}
              onChange={(e) => setSelectedSellerData({ ...selectedSellerData, sellercompanystatecode: e.target.value })}
            />
             <br />
            <input type='checkbox' required className='staff-seller-manage-form-input-checkbox' />
            <label className='staff-seller-manage-form-input-checkbox-label'>
              I agree with Terms and Conditions & Privacy Policy
            </label>
            <br />
            <button type='submit' className='staff-seller-manage-form-button'>
              {selectedSellerId ? 'Update' : 'Add'}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}

export default StaffSellerManage;
