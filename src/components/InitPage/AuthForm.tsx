import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';


const AuthForm = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [createNewAccount, setCreateNewAccount] = useState<boolean>(false);
    const [createEmail, setCreateEmail] = useState<string>('');
    const [createPassword, setCreatePassword] = useState<string>('');
    const [createAccountModal, setCreateAccountModal] = useState<boolean>(false);
    const [loginFail, setLoginFail] = useState<boolean>(false);


    const onChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        const {target : {value, name}} = event;

        if(name === 'email') setEmail(value)
        else if(name === 'password') setPassword(value);
        else if(name === 'createEmail') setCreateEmail(value);
        else if(name === 'createPassword') setCreatePassword(value);
    }

    const onSubmit = async (event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLInputElement>) => {
        event.preventDefault();

        try{
            const auth = getAuth();
            if(createNewAccount){
                await createUserWithEmailAndPassword(auth, createEmail, createPassword);

                onCraeteAccountModal();
                setCreateEmail('');
                setCreatePassword('');
                onToggleSign()

            } else {
                await signInWithEmailAndPassword(auth, email, password);       
            }

        } catch(error){
            console.log(error);
            setLoginFail(true);
        }
    }

    const onToggleSign = () => {
        setCreateNewAccount((prev) => !prev);
    }

    const onCraeteAccountModal = () => {
        onToggleSign();
        setCreateAccountModal((prev) => {
            return !prev;
        })
    }

    return(
        <>
            <form onSubmit={onSubmit} className='login_form_container'>
                <input type="text" placeholder='Email' name="email" required value={email} onChange={onChange} className='authInput' />
                <input type="password" placeholder='Password' name="password" required value={password} onChange={onChange} className='authInput' />
                <input type="submit" value="login" className="authSubmit" />
            </form>
            <input type="button" value="sign up" className="authSwitch" onClick={onCraeteAccountModal}/>
            {loginFail && <span className='login_fail_text'>Login Failed</span>}

            {createAccountModal && (
                <>
                    <div className="create_modal_background">
                        <div className="create_modal_container">
                            <div className="create_account_modal_close">
                                <FontAwesomeIcon icon={faXmark} onClick={onCraeteAccountModal}/>
                            </div>
                            <div className="twitter_icon_container">
                                <FontAwesomeIcon icon={faTwitter} />
                            </div>
                            <div className="create_account_form">
                                <input type="text" placeholder='Email' name="createEmail" required value={createEmail} onChange={onChange} className='create_authInput' />
                                <input type="password" placeholder='Password' name="createPassword" required value={createPassword} onChange={onChange} className='create_authInput' />
                                <input type="button" value='Create Account' className="create_account_btn" onClick={onSubmit}/>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default AuthForm;