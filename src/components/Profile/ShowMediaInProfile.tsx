import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { TMyTweetList } from '../../Routers/Profile';
import { ITweetMessage, ITweetMessages, IUserObj, IUsersProfile, IUsersProfiles, TCurrentPage, TSetCurrentPage, TSetToastAlert, TSetToastText, TSetTweetDetail, TSetUsersProfile } from '../AppRouter';
import Tweet from '../Tweet';


interface ShowMediaInProfileProp {
    userObj : IUserObj;
    usersProfile : IUsersProfiles;
    setUsersProfile : TSetUsersProfile;
    myTweetList : TMyTweetList;
    setToastAlert : TSetToastAlert;
    setToastText : TSetToastText;
    currentPage : TCurrentPage;
    setCurrentPage : TSetCurrentPage;
    setTweetDetail : TSetTweetDetail;
    messages : ITweetMessages;
    currentUser : IUsersProfile;
}


const ShowMediaInProfile = ({ userObj, usersProfile, currentUser, setUsersProfile, messages, myTweetList, setToastAlert, setToastText, currentPage, setCurrentPage, setTweetDetail }: ShowMediaInProfileProp) => {
    const [attachmentMyTweetList, setAttachmentMyTweetList] = useState<TMyTweetList>([]);

    useEffect(() => {
        if(myTweetList !== null){
            setAttachmentMyTweetList(myTweetList.filter((element : ITweetMessage) => {
                return element.attachmentUrl !== "";
            }))
        }
    }, [])

    return(
        <>
            {myTweetList === null || attachmentMyTweetList === null || myTweetList.length === 0 || attachmentMyTweetList.length === 0 ? (
                <>
                    <div className="media_container">
                        <div className="media_content_img">
                            <FontAwesomeIcon icon={faCamera} />
                        </div>
                        <div className="media_content_message">
                            <span className="message_header">Lights, camera ... attachments!</span>
                            <span className="text">When you send Tweets with photos or videos in them, they will show up here.</span>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {attachmentMyTweetList.map((element : ITweetMessage) => {
                        return <Tweet 
                                    key={element.createdAt} 
                                    tictoc={element} 
                                    isOwner={true}
                                    userObj={userObj}
                                    usersProfile={usersProfile}
                                    setUsersProfile={setUsersProfile}
                                    setToastAlert={setToastAlert}
                                    setToastText={setToastText}
                                    setTweetDetail={setTweetDetail}
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    lastTweet={false}
                                    messages={messages}
                                    currentUser={currentUser}
                                /> 
                    })}
                </>
            )}
        </>
    )
}

export default ShowMediaInProfile;