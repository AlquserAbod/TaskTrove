import React from 'react'

function LogoutModel(props) {
  return (
      <div className={`modal fade ${props.show ? 'show' : ''}`} style={{ display: props.show ? 'block' : 'none' }} tabIndex="-1" aria-labelledby="logoutModalLabel" aria-hidden={!props.show}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="logoutModalLabel">
                Logout Confirmation
              </h5>
              <button type="button" className="btn-close" onClick={props.handleClose} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              Are you sure you want to logout?
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={props.handleClose}>Cancel</button>
              <button type="button" className="btn btn-danger" onClick={props.handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      </div>
  )
}

export default LogoutModel