// authContext.js

import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const AuthContext = createContext();

function AuthContextProvider(props) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const logout = () => {
    localStorage.removeItem(process.env.NEXT_PUBLIC_AUTH_SESSION_KEY)
    window.location.href = `${process.env.NEXT_PUBLIC_APP_URL}/login`
  };

  const getToken = () => localStorage.getItem(process.env.NEXT_PUBLIC_AUTH_SESSION_KEY);

  const deleteAccount = async () => {
    try {
        const token = getToken();

        if (token) {
            logout();
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/auth`, {
                headers: {
                    Authorization: `Bearer ${token}` // Include the token in the Authorization header
                }
            });
        }
    } catch (err) {
        console.error("Error deleting account:", err);
    }
  };

  const getUser = async () => {
    try {
      const token = getToken();
      if (token) {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/user`, {
          headers: {
            Authorization: `Bearer ${token}` // Include the token in the Authorization header
          }
        });
  
        if (response.data) {
          setUser(response.data);
          return true;
        }
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const checktoUser = async () => {
    try {
        const token = getToken();

        if (token) {
            const userFetched = await getUser();

            if (userFetched) {
                setLoggedIn(true);
            }
        }
        setLoading(false);
    } catch (error) {
        setLoading(false);
    }
  };
  
  const profileImageUrl = () => {
    if(loggedIn) {

      if(user.googleId != null || user.imagePath != 'uploads/images/default_avatar.jpg')
        return user.imagePath
      return  `${process.env.NEXT_PUBLIC_SERVER_URL}/${user.imagePath}`
    }

    return `${process.env.NEXT_PUBLIC_SERVER_URL}/uploads/images/default_avatar.jpg`
  }
    

    
    useEffect(() => {

      axios.defaults.headers.common['Authorization'] = `Bearer ${getToken()}`;

      
      const token = router.query.token;
      if (token) {
          localStorage.setItem(process.env.NEXT_PUBLIC_AUTH_SESSION_KEY, token);
          location.href = process.env.NEXT_PUBLIC_APP_URL
          
      }
  
      // Call checktoUser to update authentication state after setting token
      checktoUser();
    }, [router.query.token]);

    if (loading) return null;
  
  

    return (
      <AuthContext.Provider value={{ user, loggedIn, getToken, logout, deleteAccount, profileImageUrl}}>
        {props.children}
      </AuthContext.Provider>
    );
  }

export { AuthContext, AuthContextProvider }; 