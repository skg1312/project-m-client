// StaffAuth.js
import React, { useContext, useEffect, useState } from "react";
import axios from 'axios';

const StaffAuthContext = React.createContext(null);

const StaffAuthProvider = (props) => {
  const [staff, setStaff] = useState(() => {
    const storedStaff = localStorage.getItem("staff");
    return storedStaff ? JSON.parse(storedStaff) : null;
  });

  const [stafflist, setStafflist] = useState([]);
  const API = process.env.REACT_APP_API;
  
  // Initialize access state from localStorage or set to an empty string
  const [access, setAccess] = useState(localStorage.getItem("access") || '');

  const saveStaffToLocalStorage = (staff) => {
    localStorage.setItem("staff", JSON.stringify(staff));
  };

  const saveAccessToLocalStorage = (newAccess) => {
    localStorage.setItem("access", newAccess);
  };

  const stafflogin = (
    staffname,
    staffemail,
    staffpassword,
    staffphone,
    staffaccess,
    staffidproof,
    staffofficebranch,
  ) => {
    const newStaff = {
      staffname,
      staffemail,
      staffpassword,
      staffphone,
      staffaccess,
      staffidproof,
      staffofficebranch,
    };

    setStaff(newStaff);
    saveStaffToLocalStorage(newStaff);

    setAccess(staffaccess);
    saveAccessToLocalStorage(staffaccess);
  };

  const setStaffAccess = (newAccess) => {
    setAccess(newAccess);
    saveAccessToLocalStorage(newAccess);
  };

  useEffect(() => {
    axios.get(`${API}/staff`)
      .then(res => {
        setStafflist(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, [API]);

  const stafflogout = () => {
    setStaff(null);
    setAccess('');
    localStorage.removeItem("staff");
    localStorage.removeItem("access");
  };

  return (
    <StaffAuthContext.Provider value={{ staff, stafflogin, stafflogout, stafflist, access, setStaffAccess }}>
      {props.children}
    </StaffAuthContext.Provider>
  );
};

const useStaffAuth = () => {
  return useContext(StaffAuthContext);
};

export { StaffAuthProvider, useStaffAuth };
