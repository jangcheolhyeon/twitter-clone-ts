import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const AUthForm = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [createNewAccount, setCreateNewAccount] = useState<boolean>(true);

    const onChange = (e : React.FormEvent<HTMLInputElement>) => {
        const {currentTarget : {value, name}} = e;

        if(name === 'email') setEmail(value)
        else if(name === 'password') setPassword(value);
    }

    const onSubmit = async (e : React.FormEvent) => {
        e.preventDefault();

        try{
            // 로그인했는지 정보 가져오기
            const auth = getAuth();
            if(createNewAccount){
                // createNewAccount
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                // login
                await signInWithEmailAndPassword(auth, email, password);
            }

        } catch(error){
            console.log(error);
        }
    }

    const onToggleSign = () => {
        setCreateNewAccount((prev) => !prev);
    }

    return(
        <>
            <form onSubmit={onSubmit} className='container'>
                <input type="text" placeholder='Email' name="email" required value={email} onChange={onChange} className='authInput' />
                <input type="password" placeholder='Password' name="password" required value={password} onChange={onChange} className='authInput' />
                <input type="submit" value={createNewAccount ? 'create' : 'login'} className='authInput authSubmit' />
            </form>
            <span onClick={onToggleSign} className='authSwitch' >{createNewAccount ? 'sign in' : 'sign up'}</span>  
        </>
    );
}

export default AUthForm;