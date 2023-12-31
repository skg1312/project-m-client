import React from 'react'
import './UserdashboardHO.css'
import background from '../images/Desktop.png';
import gr from '../images/gr.png';
import mc from '../images/mc.png';
import mu from '../images/mu.png';
import ms from '../images/ms.png';
import { useUserAuth } from './UserAuth';
import { useNavigate } from 'react-router-dom';

function UserDashboardHO() {
  const auth = useUserAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.userlogout();
  }
  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
      }}
    >
     <div className='user-dashboard-HO'>
     <div className='user-logout-HO'>
        <div className='user-logout-box-HO'>
          <div className='user-logout-container-HO'>
            <div className='user-logout-button-HO'>
              <button className='user-logout-button-value-HO'  onClick={handleLogout}>
                LOGOUT
              <img className='user-logout-icon-HO' src={mu} alt='icon'/>

              </button>
            </div>
          </div>
        </div>
      </div>
        <h1 className='user-dashboard-title-HO'>MAIN MENU</h1>
          <div className='user-dashboard-buttons-HO'>
            <div className='user-dashboard-buttons-row-HO'>
              <button className='user-dashboard-button-HO' onClick={() => navigate('/usersellman')}>
                <div className='user-card-box-HO'>
                  <img src={mu} alt='mu' className='user-dashboard-button-icon-HO' />
                  <span>MANAGE AGENTS</span>
                </div> 
              </button>
              <button className='user-dashboard-button-HO' onClick={() => navigate('/userbuyman')}>
                <div className='user-card-box-HO'>
                  <img src={ms} alt='ms' className='user-dashboard-button-icon-HO' />
                  <span>MANAGE BUYERS</span>
                </div>
              </button>
              <button className='user-dashboard-button-HO' onClick={() => navigate('/usercomman')}>
                <div className='user-card-box-HO'>
                  <img src={gr} alt='gr' className='user-dashboard-button-icon-HO' />
                  <span>MANAGE COMPANY</span>
                </div>
              </button>
              <button className='user-dashboard-button-HO' onClick={() => navigate('/userconman')}>
                <div className='user-card-box-HO'>
                  <img src={mc} alt='mc' className='user-dashboard-button-icon-HO' />
                  <span>MANAGE CONSIGNMENT</span>
                </div>
              </button>
            </div>
          </div>
        </div>
    </div>
  )
}

export default UserDashboardHO