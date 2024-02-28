import React from 'react';
import styles from './styles.module.css'
import Link from 'next/link';
import Head from 'next/head';

function index() {
  return (
    <div className={styles.container}>
      <Head>
          {/* Title */}
          <title>TaskTrove : mobile app</title>

          {/* Meta tags */}
          <meta name="description" 
          content="to manage your tasks more from your mobile phone install tasktrove app now." />

      </Head>
      <div className={`text-muted ${styles.dialog}`}>
      Manage your tasks on the go with Task Trove's mobile app. Create, edit, and complete tasks seamlessly. Stay organized and productive wherever you are.
      </div>
      <div className={styles.imageContainer}>
        <img src="/images/mobileAppQr.png" alt="Mobile App" width={400} />
      </div>
      <label className={styles.or}> or </label>


      <Link 
      href={'https://app.qr-code-generator.com'}
      className={'btn btn-outline-primary'}
      > click to download</Link>
    </div>
  )
}

export default index