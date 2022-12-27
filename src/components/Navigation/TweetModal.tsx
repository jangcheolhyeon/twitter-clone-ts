import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React, { useState, useEffect } from "react";
import { db, storageService } from "../../fbase";
import { IUserObj } from "../AppRouter"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faTimes, faDog, faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { v4 } from "uuid";
import TweetModalFooter from '../TweetAction/TweetModalFooter';
import { TOnTweetModalToggle } from "./Navigation";


interface TweetModalProp {
    userObj : IUserObj;
    onTweetModalToggle : TOnTweetModalToggle;
}

const TweetModal = ({ userObj, onTweetModalToggle } : TweetModalProp) => {
    const [modalTweet, setModalTweet] = useState<string>();
    const [attachment, setAttachment] = useState<string>('');

    useEffect(() => {
        document.body.style.overflow = "hidden";

        return() => {
            document.body.style.overflow = 'auto';
        }
    }, [])

    const onChangeModalTweet = (event : React.ChangeEvent<HTMLInputElement>) => {
        const {target : {value}} = event;
        setModalTweet(value);
    }

    const onClearImage = () => {
        setAttachment('');
    }

    const onFileChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        const {target : { files }} = event;

        if(files !== null){
            const theFile = files[0];
            const reader = new FileReader();
            reader.onloadend = (finishedEvent) => {
                const {currentTarget : {result}} : any = finishedEvent;
                setAttachment(result);
            }
            reader.readAsDataURL(theFile);
        }
        
    }
    

    const onTweetBtn = async() => {
        if(modalTweet === ""){
            return ;
        }

        let attachmentUrl = "";


        if(attachment !== ""){
            const attachmentRef = ref(storageService, `${userObj?.uid}/${v4()}`);
            const response = await uploadString(attachmentRef, attachment, "data_url" );
            attachmentUrl = await getDownloadURL(response.ref);
        }
        
        const tweetObj = {
            text : modalTweet,
            createdAt : Date.now(),
            userId : userObj?.uid,
            userImage : userObj?.photoURL,
            attachmentUrl,
            bundle:Date.now(),
            reply_users : [],
            like_users : [],
            parent : true,
        }
        await addDoc(collection(db, 'tictoc'), tweetObj);

        onTweetModalToggle();
        setModalTweet('');
        setAttachment('');
    }

    
    return(
        <>
            <div className="tweet_modal_background">
                <div className="tweet_modal_container">
                    <div className="delete_container" onClick={onTweetModalToggle}>
                        <FontAwesomeIcon icon={faXmark} />
                    </div>

                    <div className="tweet_modal_content_container">
                        <div className="user_img_container">
                            {userObj?.photoURL === undefined || userObj?.photoURL === null ? (
                                <FontAwesomeIcon icon={faCircleUser} />
                            ) : (
                                <img src={userObj?.photoURL} alt='user Image' />
                            )}
                        </div>
                        <div className="user_tweet_container">
                            <div>
                                <input type="text" placeholder="what's happening" className="tweet_modal_tweet_text" value={modalTweet} onChange={onChangeModalTweet}/>
                            </div>

                            {attachment && (
                                <div className="factoryForm__attachment">
                                    <img src={attachment} style={{ backgroundImage : attachment }} alt='attachment' />

                                    <div className="factoryForm__clear" onClick={onClearImage}>
                                        <FontAwesomeIcon icon={faTimes} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <TweetModalFooter onFileChange={onFileChange} onTweetBtn={onTweetBtn} division={"TweetModal"} />

                </div>
            </div>
        </>
    );
}

export default TweetModal;