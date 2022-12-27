import React, { useState, useEffect } from "react";
import { TMyTweetList } from "../../Routers/Profile";
import { ITweetMessages, IUserObj, IUsersProfile, IUsersProfiles, TCurrentPage, TSetCurrentPage, TSetToastAlert, TSetToastText, TSetTweetDetail, TSetUsersProfile } from "../AppRouter";
import RecommendFriend from "../Navigation/RecommendFriend";
import Tweet from "../Tweet";


interface ShowMyTweetInProfileProp{
    usersProfile : IUsersProfiles;
    setUsersProfile : TSetUsersProfile;
    userObj : IUserObj;
    myTweetList : TMyTweetList;
    setTweetDetail : TSetTweetDetail;
    setToastAlert : TSetToastAlert;
    setToastText : TSetToastText;
    currentPage : TCurrentPage;
    setCurrentPage : TSetCurrentPage;
    messages : ITweetMessages;
    currentUser : IUsersProfile;
}

const ShowMyTweetInProfile = ({ usersProfile, currentUser, messages, setUsersProfile, userObj, myTweetList, setTweetDetail, setToastAlert, setToastText, currentPage, setCurrentPage } : ShowMyTweetInProfileProp) => {
    const [myTweets, setMyTweets] = useState<TMyTweetList>();
    
    useEffect(() => {
        if(myTweetList !== null){
            setMyTweets(myTweetList.filter(element => {

                if(element.parent === true && element.retweet === undefined){
                    return element;
                }
            }));
        }
    }, [myTweetList])
    
    return(
        <>
            {myTweets === undefined || myTweets === null ? (
                <h1>Loading</h1>
            ) : (
                <>
                    {
                        myTweets.map((element) => {
                            return <Tweet key={element.createdAt} tictoc={element} currentUser={currentUser} messages={messages} isOwner={true} userObj={userObj} usersProfile={usersProfile} setUsersProfile={setUsersProfile} setToastAlert={setToastAlert} setToastText={setToastText} setTweetDetail={setTweetDetail} currentPage={currentPage} setCurrentPage={setCurrentPage} lastTweet={false} />
                        })
                    }
        
                    <div className='profile_follow_recommend'>
                        <span>Who to follow</span>
                        
                        <div className="recommend_list_container">
                            <ul className="recommend_list">
                                {usersProfile.filter(element => element.userId !== userObj?.uid).map((element) => {
                                    return(
                                        <>
                                            <RecommendFriend
                                                key={element.userId} user={element} currentUser={currentUser} userObj={userObj} usersProfile={usersProfile}
                                            />
                                            <span>asdlfnsaldk</span>
                                        </>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default ShowMyTweetInProfile;