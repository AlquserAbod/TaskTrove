import React, { useEffect,useContext, useRef, useState } from 'react'
import styles from './styles.module.css';
import TextInput from '@/components/form/textInput/TextInput';
import SubmitButton from '@/components/Buttons/submitButton/SubmitButton';
import axios from 'axios';
import { AuthContext } from '@/Context/AuthContext';
import { useRouter } from 'next/router';
import Head from 'next/head';

function resetPasswordPage() {
    const passwordRef = useRef(null);
    const passwordConfirmRef = useRef(null);
    const router = useRouter();

    const [errors, setErrors] = useState(null);
    const [alert, setAlert] = useState(null);
    const [loading, setLoding] = useState(false);

    const { loggedIn,user } = useContext(AuthContext);
    
    
    useEffect(() => {
        if(loggedIn && user.googleId != null) {
            router.push('/')
        }
        if (!loggedIn) {
          router.push('/login');
        }
      }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoding(true);

        try {
            const changePasswordForm = {
                password: passwordRef.current.value,
                passwordVerify: passwordConfirmRef.current.value
            };

            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`,changePasswordForm).then((res) => {

                    setAlert({
                        type: "success",
                        message: res.data.message
                    });
                    setErrors(null);

            }).catch((err) => {
                console.log(err);

                setErrors(err.response.data.errors); // field errors

                // if res has error alert set it 
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
                <title>TaskTrove : change password</title>

                {/* Meta tags */}
                <meta name="description" 
                content="change your tasktrove account password now." />

            </Head>
            <div className="d-flex justify-content-center">
                <div className={styles.panel}>
                    <div className={styles.title}>
                        <h1>
                            Change your password
                        </h1>
                    </div>
                    {alert != null  ? 
                        <div className={`alert alert-${alert.type} w-100  alert-dismissible fade show`} role="alert">
                            {alert.message}
                            <button type="button" className="btn-close" onClick={() => { setAlert(null);}} aria-label="Close"></button>

                        </div>
                     : <></>}
                    <form>
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

                    <SubmitButton handleSubmit={handleSubmit}/> 
                                    
                        
                    </form>
                </div>
            </div>
        </div>
    )
}

export default resetPasswordPage