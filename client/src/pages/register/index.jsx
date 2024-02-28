import React, { useContext, useEffect, useRef, useState } from 'react'
import styles from './styles.module.css';
import TextInput from '@/components/form/textInput/TextInput';
import SubmitButton from '@/components/Buttons/submitButton/SubmitButton';
import GoogleLoginButton from '@/components/Buttons/GoogleLoginButton/GoogleLoginButton';
import ProfileImageField from '@/components/form/profileImageField/_ProfileImageField';
import axios from 'axios';
import { AuthContext } from '@/Context/AuthContext';
import { useRouter } from 'next/router';
import Head from 'next/head';

function registerPage() {
    const usernameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const passwordConfirmRef = useRef(null);
    const avatarRef = useRef(null);
    const router = useRouter();
  
    const [errors, setErrors] = useState(null);
    const [alert, setAlert] = useState(null);
    const [loading, setLoding] = useState(false);
    
    const {  loggedIn,profileImageUrl } = useContext(AuthContext);

    useEffect(() => {
        if (loggedIn) {
          router.push('/');
        }
      }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoding(true);

        try {
            const registerData = new FormData();

            registerData.append('username',usernameRef.current.value);
            registerData.append('email',emailRef.current.value);
            registerData.append('password',passwordRef.current.value);
            registerData.append('passwordVerify',passwordConfirmRef.current.value);
            
            const selectedAvatar = avatarRef.current.files[0];
            registerData.append('avatar', selectedAvatar ? selectedAvatar : '' )

            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth`,registerData,{
                headers: { 'Content-Type': 'multipart/form-data' }
            }).then((res) => {
                localStorage.setItem(process.env.NEXT_PUBLIC_AUTH_SESSION_KEY,res.data.token)
                setAlert({
                    type: "success",
                    message: res.data.message
                });

                setErrors(null);
            }).catch((err) => { 
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
        setLoding(false);
    }

    return (
        <div className="container">
            <Head>
                {/* Title */}
                <title>TaskTrove : register</title>

                {/* Meta tags */}
                <meta name="description" 
                content="to manage your tasks more easly register to tasktrove site now." />

            </Head>
            <div className="d-flex justify-content-center">
                <div className={styles.panel}>
                    <div className={styles.title}>
                        <h1>
                            Sign up with email
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
                            src={profileImageUrl()} />

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

                        <TextInput 
                            name="password" 
                            title="Password" 
                            type="password" 
                            ref={passwordRef}
                            errors={errors}/>
                                                        
                        <TextInput 
                            name="passwordVerify" 
                            title="Password confirmation" 
                            type="password" 
                            ref={passwordConfirmRef}
                            errors={errors}/>
                             
                        <SubmitButton handleSubmit={handleSubmit} disabled={loading} />

                        <label className={styles.or}> or </label>

                        <GoogleLoginButton />

                        <label className={styles.createAccount}>
                            you have account ? <a href="/login">login now.</a>
                        </label>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default registerPage