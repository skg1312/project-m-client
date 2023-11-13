// UserAuth.js
import React, { useContext, useEffect, useState } from "react";
import axios from 'axios';

const UserAuthContext = React.createContext(null);

const UserAuthProvider = (props) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [userlist, setUserlist] = useState([]);
    const [access, setAccess] = useState(localStorage.getItem("userAccess") || '');
    const API = process.env.REACT_APP_API;

    const saveUserToLocalStorage = (user) => {
        localStorage.setItem("user", JSON.stringify(user));
    };

    const saveUserAccessToLocalStorage = (newAccess) => {
        localStorage.setItem("userAccess", newAccess);
    };

    const userlogin = (
        username,
        useremail,
        userpassword,
        userphone,
        useraccess,
        useridproof,
        useraddress,
    ) => {
        const newUser = {
            username,
            useremail,
            userpassword,
            userphone,
            useraccess,
            useridproof,
            useraddress,
        };

        setUser(newUser);
        saveUserToLocalStorage(newUser);

        setAccess(useraccess);
        saveUserAccessToLocalStorage(useraccess);
    };

    const setUserAccess = (newAccess) => {
        setAccess(newAccess);
        saveUserAccessToLocalStorage(newAccess);
    };

    useEffect(() => {
        axios.get(`${API}/user`)
            .then(res => {
                setUserlist(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    }, [API]);

    const userlogout = () => {
        setUser(null);
        setAccess('');
        localStorage.removeItem("user");
        localStorage.removeItem("userAccess");
    };

    return (
        <UserAuthContext.Provider
            value={{ user, userlogin, userlist, userlogout, access, setUserAccess }}>
            {props.children}
        </UserAuthContext.Provider>
    );
};

const useUserAuth = () => {
    return useContext(UserAuthContext);
};

export { UserAuthProvider, useUserAuth };
