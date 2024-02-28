import { AuthContext } from '@/Context/AuthContext'
import React, { useContext } from 'react'

function GoogleModel(props) {
    const {user} = useContext(AuthContext)
    return (
        <div className={`modal fade ${props.show ? 'show' : ''}`} style={{ display: props.show ? 'block' : 'none' }} tabIndex="-1" aria-labelledby="logoutModalLabel" aria-hidden={!props.show}>
            <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                <h5 className="modal-title" id="logoutModalLabel">
                    Google service warning
                </h5>
                <button type="button" className="btn-close" onClick={props.handleClose} aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <p>Dear {user.username},</p>
                    <p>Please note that your login to TaskTrove is facilitated through Google services. It's important to be aware that within TaskTrove, you do not have the capability to directly change your password or update user information.</p>
                    <p>As your login credentials and account details are managed through your Google Account, any changes to your password or user information must be handled within your Google Account settings.</p>
                    <p>Thank you for your understanding.</p>
                    <p>Best regards,<br />TaskTrove Team</p>
                </div>
                <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={props.handleClose}>ok</button>
                </div>
            </div>
            </div>
        </div>
    )
}

export default GoogleModel