import React, { useEffect, Dispatch, SetStateAction} from 'react';
import { TSetToastAlert } from '../AppRouter';

interface ToastNotificationProp{
    text : string;
    setToastAlert : TSetToastAlert;
}

const ToastNotification = ({ text, setToastAlert }: ToastNotificationProp) => {
    useEffect(() => {
        let timer = setTimeout(() => {
            setToastAlert(false);
        }, 2000);

        return () => { clearTimeout(timer) }
    }, [])


    return(
        <>
            <div className="toast_container">
                <span>{text}</span>
            </div>
        </>
    );
}

export default ToastNotification;