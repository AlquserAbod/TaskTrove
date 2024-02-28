import React, { useEffect, useRef, useState } from 'react'
import styles from '../styles.module.css';
import TextInput from '@/components/form/textInput/TextInput';
import SubmitButton from '@/components/Buttons/submitButton/SubmitButton';
import axios from 'axios';
import { useRouter } from 'next/router';

function resetPasswordPage() {
    const passwordRef = useRef(null);
    const passwordConfirmRef = useRef(null);
    const router = useRouter();

    const { id,token } = router.query; 

    const [errors, setErrors] = useState(null);
    const [alert, setAlert] = useState(null);


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const resetPasswordFormData = {
                password: passwordRef.current.value,
                passwordVerify: passwordConfirmRef.current.value
            };

            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/password-reset/${id}/${token}`,resetPasswordFormData).then((res) => {
                if(res.data.success) {
                    window.location.href = 
                    `${process.env.NEXT_PUBLIC_APP_URL}/login?message=${encodeURIComponent("Your password has been reset successfully. You can now log in.")}`;
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
                <title>TaskTrove : reset password</title>
            </Head>
            <div className="d-flex justify-content-center">
                <div className={styles.panel}>
                    <div className={styles.title}>
                        <h1>
                            Update your password
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