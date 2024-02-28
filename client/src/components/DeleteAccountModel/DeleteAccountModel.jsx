import React from 'react';

function DeleteAccountModel(props) {
  return (
    <div className={`modal fade ${props.show ? 'show' : ''}`} style={{ display: props.show ? 'block' : 'none' }} tabIndex="-1" aria-labelledby="deleteAccountModalLabel" aria-hidden={!props.show}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="deleteAccountModalLabel">
              Delete Account Confirmation
            </h5>
            <button type="button" className="btn-close" onClick={props.handleClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            Are you sure you want to delete your account? This action cannot be undone.
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={props.handleClose}>Cancel</button>
            <button type="button" className="btn btn-danger" onClick={props.handleDelete}>Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteAccountModel;
