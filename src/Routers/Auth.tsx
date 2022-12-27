import { faGithub, faGoogle, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getAuth, GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React from 'react';
import AuthForm from '../components/InitPage/AuthForm';

const Auth = ({ }) => {
    let provider : GoogleAuthProvider | GithubAuthProvider;
    const onSnsClick = async (name : string) => {
        const auth = getAuth();

        if(name === 'google'){
            provider = new GoogleAuthProvider();
        } else if(name === 'github'){
            provider = new GithubAuthProvider();
        }
        await signInWithPopup(auth, provider);
    }


    return(
        <div className="authContainer"> 
            <div className="twitter_image">
                <FontAwesomeIcon icon={faTwitter} color={"#04AAFF"} size="10x" className="tweetter_icon" /> 
            </div>
            <div className="init_page_login_form_container">
                <div className="login_form">
                    <AuthForm />      
                </div>
                <div className="authBtns">
                    <button onClick={() => onSnsClick('google')} name="google" className="authBtn googleAuth">
                        <FontAwesomeIcon icon={faGoogle} /><span>Continue with Google</span>
                    </button>
                    <button onClick={() => onSnsClick('github')} name="github" className="authBtn githubAuth">
                        <FontAwesomeIcon icon={faGithub} /><span>Continue with github</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Auth;