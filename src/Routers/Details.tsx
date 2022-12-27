import { faCircleUser, faImage, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React, { useState, useEffect } from "react";
import { v4 } from "uuid";
import { ITweetMessage, ITweetMessages, IUserObj, IUsersProfile, IUsersProfiles, TCurrentPage, TSetCurrentPage, TSetToastAlert, TSetToastText, TSetTweetDetail, TSetUsersProfile, TTweetDetail } from "../components/AppRouter";
import Tweet from "../components/Tweet";
import { db, storageService } from "../fbase";

interface DetailProp{
    messages : ITweetMessages;
    tweetDetail : TTweetDetail;
    currentPage : TCurrentPage;
    setCurrentPage : TSetCurrentPage;
    userObj : IUserObj;
    usersProfile : IUsersProfiles;
    setUsersProfile : TSetUsersProfile;
    setToastAlert : TSetToastAlert;
    setToastText : TSetToastText;
    setTweetDetail : TSetTweetDetail;
    currentUser : IUsersProfile;
}

const Details = ({ messages, currentUser, tweetDetail, currentPage, setCurrentPage, userObj, usersProfile, setUsersProfile, setToastAlert, setToastText, setTweetDetail } : DetailProp) => {
    const [activeTweetReply, setActiveTweetReply] = useState<boolean>(false);
    const [replyTweet, setReplyTweet] = useState<string>('');
    const [attachment, setAttachment] = useState<string>('');
    
    let parentTweet : ITweetMessage;

    if(messages.length !== 0 ){
        parentTweet = messages.filter(element => {
            return element.id === tweetDetail.id
        })[0]
    }

    useEffect(() => {
        setCurrentPage('details');
    }, [])

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
            const response = await uploadString(attachmentRef, attachment, "data_url" );
            attachmentUrl = await getDownloadURL(response.ref);
        }

        const replyTweetObj = {
            text : replyTweet,
            createdAt : Date.now(),
            userId : userObj?.uid,
            bundle : Number(`${tweetDetail.bundle}`),
            attachmentUrl,
            userImage : userObj?.photoURL,
            reply_users : [],
            like_users : [],
            child : true,
            parentReplyInfoDetail: parentTweet,
        }

        await addDoc(collection(db, 'tictoc'), replyTweetObj);

        setAttachment('');
        setReplyTweet('');
    }

    const onChangeReplyTweet = (event : React.ChangeEvent<HTMLInputElement>) => {
        const {target : {value}} = event;
        setReplyTweet(value);
    }    

    return(
        <div className="container">
            {tweetDetail === undefined ? (
                <h1>Loading</h1>
            ) : (
                <>
                    <Tweet tictoc={tweetDetail} currentUser={currentUser} setTweetDetail={setTweetDetail} messages={messages} isOwner={tweetDetail.userId === userObj?.uid} userObj={userObj} usersProfile={usersProfile} setUsersProfile={setUsersProfile} setToastAlert={setToastAlert} setToastText={setToastText} currentPage={currentPage} setCurrentPage={setCurrentPage} lastTweet={false} />

                    {activeTweetReply ? (
                        <div className="detail_tweet_write_container_active">
                            <div className="tweet_write_active_img_container">
                                {userObj?.photoURL ? (
                                        <img src={userObj.photoURL} alt='user image' />
                                    ) : (
                                        <FontAwesomeIcon icon={faCircleUser} />
                                )}

                            </div>
                            
                            <div className="tweet_write_active_content_container">
                                <span>Replying to 
                                    {tweetDetail.email ? (
                                        <span className="user_email">@{tweetDetail.email.split('@')[0]}</span>
                                    ) : (
                                        <span className="user_email"></span>
                                    )}
                                </span>
                            <div>
                                <input type="text" className="tweet_container" placeholder="Tweet your reply" value={replyTweet} onChange={onChangeReplyTweet} />
                            </div>
        
                                {attachment && (
                                    <div className="reply_attachment">
                                        <img src={attachment} alt='attachment' style={{ backgroundImage : attachment }} />
        
                                        <div className="reply_clear" onClick={onClearImage}>
                                            <FontAwesomeIcon icon={faTimes} />
                                        </div>
                                    </div>
                                )}
        
                                <div className="tweet_write_active_content_footer">
                                    <label htmlFor="attach-file2">
                                        <FontAwesomeIcon icon={faImage} />
                                    </label>
                                    <input type="file" id="attach-file2" className="input_file" accept="image/*" onChange={onFileChange} />
        
                                    <button onClick={onWriteReply}>Reply</button>
                                </div>
        
                            </div>
                        </div>
                    ) : (
                        <div className="detail_tweet_write_container" onClick={() => {setActiveTweetReply(true)}}>
                            <div className="detail_tweet_write_content">
                                {userObj?.photoURL ? (
                                    <img src={userObj.photoURL} alt='user image' />
                                ) : (
                                    <FontAwesomeIcon icon={faCircleUser} />
                                )} 
                                <div>
                                    <span>Tweet your reply</span>
                                </div>
                                <button>Reply</button>
                            </div>
                        </div>
                    )}


                    {messages.map((element, index) => {
                        if(element.child && element.bundle === tweetDetail.bundle){
                            return <Tweet tictoc={element} currentUser={currentUser} isOwner={element.userId === userObj?.uid} messages={messages} userObj={userObj} usersProfile={usersProfile} setUsersProfile={setUsersProfile} setToastAlert={setToastAlert} setToastText={setToastText} currentPage={currentPage} setCurrentPage={setCurrentPage} lastTweet={messages.length === (index + 1)} />
                        }
                    })}
                </>
            )}
        </div>
    );
}

export default Details;