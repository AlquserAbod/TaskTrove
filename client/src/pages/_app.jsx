// pages/_app.js
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '@/layouts/navbar/Navbar';
import Head from 'next/head';
import BootstrapClient from '@/components/BootstrapClient';
import '../app/globals.css'; // Global styles
import '../app/custom-variables.css'; // Custom veribles
import axios from 'axios';
import { AuthContext, AuthContextProvider } from '@/Context/AuthContext';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import Alerts from '@/layouts/alerts/Alerts';
import { TasksProvider } from '@/Context/TasksContext';

axios.defaults.withCredentials = true;

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const activePage = router.pathname;



  return (
    <AuthContextProvider>
      <TasksProvider>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="icon" href="/favicon.png" sizes="32x32" type="image/png" />

        </Head>

        <Navbar activePage={activePage}/>

        <Alerts />
            
        <Component {...pageProps} />

        <BootstrapClient />

      </TasksProvider>
    </ AuthContextProvider>
  );
}

export default MyApp;