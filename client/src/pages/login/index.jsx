import React, { useContext, useEffect, useRef, useState } from 'react'
import styles from './styles.module.css';
import TextInput from '@/components/form/textInput/TextInput';
import SubmitButton from '@/components/Buttons/submitButton/SubmitButton';
import axios from 'axios';
import { useRouter } from 'next/router';
import GoogleLoginButton from '@/components/Buttons/GoogleLoginButton/GoogleLoginButton';
import { AuthContext } from '@/Context/AuthContext';
import Head from 'next/head';

function loginPage() {
    const passwordRef = useRef(null);
    const emailRef = useRef(null);
    const router = useRouter();

    const [errors, setErrors] = useState(null);
    const [alert, setAlert] = useState(null);
    const [loading, setLoding] = useState(false);

    const { loggedIn } = useContext(AuthContext);

    useEffect(() => {
        if (loggedIn) {
          router.push('/');
        }
      }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoding(true);

        try {
            const loginData = {
                email: emailRef.current.value,
                password: passwordRef.current.value
            };

            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`,loginData).then((res) => {
                if(res.data.success) {
                    window.location.href = process.env.NEXT_PUBLIC_APP_URL;
                    localStorage.setItem(process.env.NEXT_PUBLIC_AUTH_SESSION_KEY,res.data.token)

                }else {
                    setAlert({
                        type: "success",
                        message: res.data.message
                    });
    
                    setErrors(null);
                }
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
        setLoding(false);
    }

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const messageFromURL = searchParams.get('message');
        const errorFromURL = searchParams.get('error');
    
        if (messageFromURL) {
          setAlert({
            type: "success",
            message: messageFromURL
          });
        }
    
        if (errorFromURL) {
            setAlert({
                type: "danger",
                message: errorFromURL
              });
        }
      }, [router.query]);


    return (
        <div className="container">
            <Head>
                {/* Title */}
                <title>TaskTrove : Login</title>

                {/* Meta tags */}
                <meta name="description" 
                content="to manage your tasks more easly login to tasktrove site now." />

            </Head>
            <div className="d-flex justify-content-center">
                <div className={styles.panel}>
                    <div className={styles.title}>
                        <h1>
                            Login with email
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
                        <TextInput name="password" title="Password" errors={errors} type="password" ref={passwordRef}/>
                        <SubmitButton handleSubmit={handleSubmit} disabled={loading}/> 
                        <label className={styles.or}> or </label>
                        <GoogleLoginButton />

                        <label className={styles.createAccount}>
                            dont have account ? <a href="/register">create now.</a>
                        </label>

                        <label className={styles.createAccount}>
                            forget your password ? <a href="/forget-password">reset now.</a>
                        </label>
                        
                    </form>
                </div>
            </div>
        </div>
    )
}

export default loginPage