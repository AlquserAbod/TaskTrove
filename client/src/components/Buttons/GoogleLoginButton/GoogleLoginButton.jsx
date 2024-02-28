import React from 'react'
import styles from './GoogleLoginButton.module.css';

function GoogleLoginButton({ j}) {
  return (
    <div className={styles.buttonContainer}>
        <a  className={`${styles.googleLogin} btn btn-lg btn-light`} href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}>
            <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="google" />
            <span>Sign in with google</span>
        </a>
    </div>
  )
}

export default GoogleLoginButton