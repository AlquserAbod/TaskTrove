import { AuthContext } from '@/Context/AuthContext'
import React, { useContext, useEffect, useState } from 'react'
import styles from './styles.module.css'

function Alerts() {
    const { loggedIn } = useContext(AuthContext);
    let [alerts,setAlerts] = useState([])
    const alertLavel = 'warning';

    useEffect(() => {
        if(!loggedIn) setAlerts([...alerts, "Please register to access full functionality of the website."]);
    },[])

  return (
    <div className="container">
        {alerts.length > 0 ? (
        <div className={`alert alert-${alertLavel} ${styles.alerts}`}>
            <ul>
            {alerts.map((alert, index) => (
                <li key={index}>{alert}</li>
            ))}
            </ul>
        </div>
        ) : <></>}
  </div>
  )
}

export default Alerts