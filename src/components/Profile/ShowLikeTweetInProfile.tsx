import React,{ useEffect, useState } from "react";
import { ITweetMessage, ITweetMessages, IUserObj, IUsersProfile, IUsersProfiles, TCurrentPage, TSetCurrentPage, TSetToastAlert, TSetToastText, TSetUsersProfile } from "../AppRouter";
import Tweet from "../Tweet";


interface ShowLikeTweetInProfileProp{
    userObj : IUserObj;
    tweets : ITweetMessages;
    usersProfile : IUsersProfiles;
    setUsersProfile : TSetUsersProfile;
    setToastAlert : TSetToastAlert;
    setToastText : TSetToastText;
    messages : ITweetMessages;
    currentUser : IUsersProfile;
    currentPage : TCurrentPage
}


const ShowLikeTweetInProfile = ({ userObj, currentUser, currentPage, messages, tweets, usersProfile, setUsersProfile, setToastAlert, setToastText } : ShowLikeTweetInProfileProp) => {
    const [myLikeList, setMyLikeList] = useState<ITweetMessages>([]);

    useEffect(() => {        
        if(userObj?.uid !== undefined){
            setMyLikeList(tweets.filter(element => element.like_users.includes(userObj?.uid)));
        }
        
    }, [])


    if(!tweets || !myLikeList){
        return null;
    }
    
    return(
        <>
            {Boolean(myLikeList.length) ? (
                <>
                    {myLikeList.map((element, index) => {
                        return <Tweet tictoc={element} isOwner={element.userId === currentUser.userId} currentUser={currentUser} messages={messages} userObj={userObj} currentPage={currentPage} usersProfile={usersProfile} setUsersProfile={setUsersProfile} setToastAlert={setToastAlert} setToastText={setToastText} lastTweet={myLikeList.length === (index + 1)} />
                    })}
                </>
            ) : (
                <>
                    <div className="like_container">
                        <div className="like_container_content">
                            <span className="like_content_top">You don't have any likes yet</span>
                            <span className="text">Tap the heart on any Tweet to show it some love. When you do, it’ll show up here.</span>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default ShowLikeTweetInProfile;