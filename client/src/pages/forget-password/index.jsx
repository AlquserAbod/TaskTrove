import React, { useContext, useEffect, useRef, useState } from 'react'
import styles from './styles.module.css';
import TextInput from '@/components/form/textInput/TextInput';
import SubmitButton from '@/components/Buttons/submitButton/SubmitButton';
import axios from 'axios';
import { AuthContext } from '@/Context/AuthContext';
import { useRouter } from 'next/router';
import Head from 'next/head';

function forgetPasswordPage() {
    const emailRef = useRef(null);

    const [errors, setErrors] = useState(null);
    const [alert, setAlert] = useState(null);
    const { user, loggedIn,getLoggedIn } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (loggedIn) {
          router.push('/');
        }
      }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const forgetPasswordFormData = {email: emailRef.current.value};

            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/password-reset`,forgetPasswordFormData).then((res) => {
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
    }

    return (
        <div className="container">
            <Head>
                {/* Title */}
                <title>TaskTrove : forget password</title>

                {/* Meta tags */}
                <meta name="description" 
                content="forget your tasktrove account password reset now ." />

            </Head>
            <div className="d-flex justify-content-center">
                <div className={styles.panel}>
                    <div className={styles.title}>
                        <h1>
                            Forget your password
                        </h1>
                    </div>
                    {alert != null  ? 
                        <div className={`alert alert-${alert.type} w-100  alert-dismissible fade show`} role="alert">
                            {alert.message}
                            <button type="button" className="btn-close" onClick={() => { setAlert(null);}} aria-label="Close"></button>

                        </div>
                     : <></>}
                    <form>
                        <TextInput name="email" title="Email" errors={errors} type="email" ref={emailRef}/>
                        <SubmitButton handleSubmit={handleSubmit}/> 
                                    
                        
                    </form>
                </div>
            </div>
        </div>
    )
}

export default forgetPasswordPage