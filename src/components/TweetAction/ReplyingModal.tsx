import { faCircleUser, faTimes, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import { db, storageService } from "../../fbase";
import { ITweetMessage, IUserObj, IUsersProfiles } from "../AppRouter";
import { TOnReplyModalToggle, TSetReplyModalOpen } from "../Tweet";
import TweetModalFooter from "./TweetModalFooter";



interface ReplyingModalProp{
    userObj : IUserObj;
    onReplyModalToggle : TOnReplyModalToggle;
    parentTweet : ITweetMessage;
    usersProfile : IUsersProfiles;
    setReplyModalOpen : TSetReplyModalOpen;
}


const ReplyingModal = ({ userObj, onReplyModalToggle, parentTweet, usersProfile, setReplyModalOpen } : ReplyingModalProp) => {
    const [modalTweet, setModalTweet] = useState<string | undefined>();
    const [attachment, setAttachment] = useState<string>('');


    useEffect(() => {
        document.body.style.overflow = "hidden";

        return() => {
            document.body.style.overflow = 'auto';
        }
    }, [])

    const parentInfo = usersProfile.filter(element => {
        return element.userId === parentTweet.userId;
    })[0];

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
    

    

    const onWriteReply = async() => {
        let attachmentUrl = ""

        if(attachment !== ""){
            const attachmentRef = ref(storageService, `${userObj?.uid}/${v4()}`);
            const response = await uploadString(attachmentRef, attachment, "data_url");
            attachmentUrl = await getDownloadURL(response.ref);
        }

        const replyTweetObj = {
            text : modalTweet,
            createdAt : Date.now(),
            userId : userObj?.uid,
            bundle : Number(`${parentTweet.bundle}`),
            attachmentUrl,
            userImage : userObj?.photoURL,
            reply_users : [],
            like_users : [],
            child : true,
            parentReplyInfo : parentInfo, 
            parentReplyInfoDetail: parentTweet,
        }

        await addDoc(collection(db, 'tictoc'), replyTweetObj);
        setModalTweet('');
        setReplyModalOpen(false);
    }

    return(
        <div className="tweet_modal_background">
            <div className="tweet_modal_container">
                <div className="delete_container" onClick={onReplyModalToggle}>
                    <FontAwesomeIcon icon={faXmark} />
                </div>

                <div className="parent_tweet_info">
                    <div className="parent_img_container">
                        {parentInfo.userImage ? (
                            <img src={parentInfo.userImage} alt='tweet userImage' />
                        ) : (
                            <FontAwesomeIcon icon={faCircleUser} />
                        )}
                    </div>
                    <div className="parent_text_contaienr">
                        <span className="user_name">{parentInfo.displayName}</span>
                        <span className="user_tweet">{parentTweet.text}</span>
                        {parentTweet.attachmentUrl && (
                            <div className="reply_attachment">
                                <img src={parentTweet.attachmentUrl} alt='tweet attachment' style={{ backgroundImage : attachment }} />
                            </div>
                        )}
                        <span className="user_reply_info">Replying to <span className="user_email">{parentInfo.email}</span></span>
                    </div> 
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
                            <div className="reply_attachment">
                                <img src={attachment} alt='attachment' style={{ backgroundImage : attachment }} />

                                <div className="reply_clear" onClick={onClearImage}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <TweetModalFooter onFileChange={onFileChange} onTweetBtn={onWriteReply} division={"ReplyingModal"} />
            </div>
        </div>
    )
}

export default ReplyingModal;