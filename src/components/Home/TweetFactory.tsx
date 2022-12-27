import React, { useState } from "react";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { collection, addDoc } from "firebase/firestore"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faImage, faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { db, storageService } from "../../fbase";
import { IUserObj } from "../AppRouter";


interface TweetFactoryProp{
    userObj : IUserObj;
}


const TweetFactory = ({ userObj } : TweetFactoryProp) => {
    const [message, setMessage] = useState<string>('');
    const [attachment, setAttachment] = useState<string>('');

    const onChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    }

    const onSubmit = async(event : React.FormEvent<HTMLFormElement>) => {
        if(message === ""){
            return ;
        }

        event.preventDefault();

        let attachmentUrl = "";

        if(attachment !== ""){
            const attachmentRef = ref(storageService, `${userObj?.uid}/${v4()}`);
            const response = await uploadString(attachmentRef, attachment, "data_url" );
            attachmentUrl = await getDownloadURL(response.ref);
        }
        
        const tweetObj = {
            text : message,
            createdAt : Date.now(),
            userId : userObj?.uid,
            userImage : userObj?.photoURL,
            attachmentUrl,
            bundle:Date.now(),
            reply_users : [],
            like_users: [],
            parent : true,
        }

        await addDoc(collection(db, 'tictoc'), tweetObj);

        setMessage('');
        setAttachment('');
    }

    const onFileChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        const {target : { files }} = event;
        
        if(files !== null){
            const theFile = files[0];
            const reader = new FileReader();
            reader.onloadend = (finishedEvent : ProgressEvent<FileReader>) :any => {
                const {currentTarget : {result} } : any = finishedEvent;
                setAttachment(result);
            }
            reader.readAsDataURL(theFile);
        }
    }
    
    const onClearImage = () => {
        setAttachment('');
    }


    return(
        <>
            <form className="factoryForm" onSubmit={onSubmit}>
                <div className="user_image_container">
                    {userObj?.photoURL ? (
                        <img src={userObj.photoURL} alt="user image" />
                    ) : (
                        <FontAwesomeIcon icon={faCircleUser} />
                    )}  
                </div>

                <div className="tweet_input_container">
                    <input type="text" placeholder="what's happening?" value={message} onChange={onChange} className="factoryInput__input" />

                    {attachment && (
                        <div className="factoryForm__attachment">
                            <img src={attachment} style={{ backgroundImage : attachment }} alt='attachment' />

                            <div className="factoryForm__clear" onClick={onClearImage}>
                                <FontAwesomeIcon icon={faTimes} />
                            </div>
                        </div>
                    )}

                    <div className="tweet_footer">
                        <label htmlFor="attach-file" className="factoryInput__label">
                            <FontAwesomeIcon icon={faImage} className="input_image_icon" />
                        </label>
                        <input type="file" id="attach-file" accept='image/*' onChange={onFileChange} className="file_upload_input" />

                        <div className="factory_input_tweet">
                            <button>Tweet</button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}

export default TweetFactory;