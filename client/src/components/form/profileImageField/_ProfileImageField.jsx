import React, { useRef } from 'react'
import styles from './profileImageField.module.css';
import Image from 'next/image';

const ProfileImageField = React.forwardRef((props,ref) => {
  const imageRef = useRef(null);
  
  const handleUpload = (event) => {
    const  file = event.target.files[0];
    if(file) {
      const reader = new FileReader();
      
      reader.addEventListener('load',(e) => {
        const imageUrl = e.target.result;
        if (ref.current) {
          imageRef.current.srcset = imageUrl;
        }
      });
      reader.readAsDataURL(file);

    }

  }


  return (
    <div className={styles.profileImageField}
    >
        <Image
          width={180}
          height={180}
          priority={true}
          src={props.src}
          ref={imageRef}
          alt="profile image"
          id='image'
        />
        <input type="file" 
          name="profile_image" 
          accept='image/jpeg, image/jpg, image/png' 
          ref={ref}  
          id="fileInput" 
          onChange={handleUpload}/>
        <label htmlFor="fileInput" id='uploadBTN'>upload image</label>
    </div>
  )
});

export default ProfileImageField