import { useContext, useState } from 'react';
import {AuthContext} from '@/Context/AuthContext';
import LogoutModel from '@/components/logoutWarningModel/logoutWarning';
import GoogleModel from '@/components/GoogleServiceWarningModel/googleServiceWarningModel';
import { TasksContext } from '@/Context/TasksContext';
import DeleteAccountModel from '@/components/DeleteAccountModel/DeleteAccountModel';

const Navbar = ({activePage}) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);


  const { user, loggedIn, logout,deleteAccount,profileImageUrl } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      logout();

      setShowLogoutModal(false);
      window.location.reload(); 
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleCloseLogoutModel = () => setShowLogoutModal(false);
  const handleShowLogoutModel = () => setShowLogoutModal(true);

  const handleCloseDeleteModel = () => setShowDeleteModal(false);
  const handleShowDeleteModel = () => setShowDeleteModal(true);



  const handleGoogleValidate = (url) => {
    if(user.googleId === undefined) location.href = url;
    else setShowGoogleModal(true)
  }

  const handleDeleteAccount = () => {
    try {
      deleteAccount();

      setShowDeleteModal(false);
      window.location.reload(); 
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
  
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          TaskTrove
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className={`nav-link ${activePage == "/" ? "active" : ""}`} href="/">
                Home Page
              </a>
            </li>
            <li className="nav-item">
              <a className={`nav-link ${activePage == "/mobile-app" ? "active" : ""}`} href="/mobile-app">
                mobile app
              </a>
            </li>
          </ul>
          <ul className={`navbar-nav d-flex ${loggedIn ? "align-items-center" : ''}`}>
            {loggedIn ? (
              <li className="nav-item dropdown">
                <a
                  className={`nav-link dropdown-toggle ${loggedIn ? 'd-flex align-items-center' : 'd-none d-lg-flex'}`}
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={profileImageUrl()}
                    width="30"
                    height="30"
                    className="rounded-circle me-2"
                    alt="User"
                  />
                  {user.username}
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                  <li>
                    <a className="dropdown-item" onClick={() => handleGoogleValidate("/change-password")} href="#">
                      Change Password
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" onClick={() => handleGoogleValidate("/update-profile")} href="#">
                      Update User
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" onClick={handleShowLogoutModel} href="#">
                      Logout
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" onClick={handleShowDeleteModel} href="#">
                      Delete account 
                    </a>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <a className="nav-link" href="/register">
                    Register
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/login">
                    Login
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {
        user ? 
        <>
          <LogoutModel show={showLogoutModal} handleClose={handleCloseLogoutModel} handleLogout={handleLogout} />
          <DeleteAccountModel show={showDeleteModal} handleClose={handleCloseDeleteModel} handleDelete={handleDeleteAccount} />
          <GoogleModel show={showGoogleModal} handleClose={() => setShowGoogleModal(false)} />
        </>
        :
        <></>
      }


    </nav>
  );
};


export default Navbar;
