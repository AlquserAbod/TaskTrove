import React, { useContext, useEffect, useRef, useState } from 'react'
import styles from './styles.module.css';
import TextInput from '@/components/form/textInput/TextInput';
import SubmitButton from '@/components/Buttons/submitButton/SubmitButton';
import ProfileImageField from '@/components/form/profileImageField/_ProfileImageField';
import axios from 'axios';
import {AuthContext} from '@/Context/AuthContext';
import { useRouter } from 'next/router';
import Head from 'next/head';

function updateProfile() {
    const usernameRef = useRef(null);
    const emailRef = useRef(null);
    const avatarRef = useRef(null);
    const router = useRouter();

    
    const [errors, setErrors] = useState(null);
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);

    
    const { user, loggedIn,logout,profileImageUrl } = useContext(AuthContext);

    useEffect(() => {
        if(loggedIn && user.googleId != null) {
            router.push('/')
        }
        
        if (!loggedIn) {
          router.push('/login');
        }

        // Set initial values when the user data is available
        if (user) {
            emailRef.current.value = user.email;
            usernameRef.current.value = user.username;
        }
      }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('username',usernameRef.current.value);
            formData.append('email',emailRef.current.value);
            
            const selectedAvatar = avatarRef.current.files[0];
            formData.append('avatar', selectedAvatar ? selectedAvatar : '' )

            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/auth/update`,formData,{
                headers: { 
                    'Content-Type': 'multipart/form-data',
                }
            }).then(async (res) => {
                if(res.data.VerifyEmail){
                    logout();
                    window.location.href = `${process.env.NEXT_PUBLIC_APP_URL}/login?message=${encodeURIComponent(res.data.message)}`;
                }
                
                setAlert({
                    type: "success",
                    message: res.data.message
                });

                setErrors(null);

            }).catch((err) => {
                console.log(err);

                setErrors(err.response.data.errors); // field errors

                // if res hase error alert set it 
                if(err.response.data.error) {
                    setAlert({
                        type: "danger",
                        message: err.response.data.error
                    }); // has any error 
                }else {setAlert(null); }


                console.log("error :", err);
            })

        }catch( err ) {
            console.log(err);
        }
        setLoading(false);
    }

    return (
        <div className="container">
            <Head>
                {/* Title */}
                <title>TaskTrove : update profile</title>

                {/* Meta tags */}
                <meta name="description" 
                content="update your tasktrove account" />

            </Head>
            <div className="d-flex justify-content-center">
                <div className={styles.panel}>
                    <div className={styles.title}>
                        <h1>
                            Update Profile
                        </h1>
                    </div>
                    {alert != null  ? 
                            <div className={`alert alert-${alert.type} w-100  alert-dismissible fade show`} role="alert">
                                {alert.message}
                                <button type="button" className="btn-close" onClick={() => {  setAlert(null);}} aria-label="Close"></button>

                            </div>
                     : <></>}
                    <form>

                        <ProfileImageField 
                            ref={avatarRef}
                            src={profileImageUrl()}/>

                        <TextInput 
                            name="username" 
                            title="Username" 
                            type="text"  
                            ref={usernameRef}
                            errors={errors} />
                        <TextInput 
                            name="email" 
                            title="Email"
                            type="email" 
                            ref={emailRef}
                            errors={errors}/>

                        <SubmitButton handleSubmit={handleSubmit} disabled={loading} /> 

                        <label className={styles.or}> or </label>
                        <label className={styles.createAccount}>
                            change your password? <a href="/change-password">chnage now.</a>
                        </label>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default updateProfile