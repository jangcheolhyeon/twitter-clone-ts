import React, { useState } from 'react';
import { TMyTweetList } from '../../Routers/Profile';
import { ITweetMessages, IUserObj, IUsersProfile, IUsersProfiles, TCurrentPage, TRandomUsersProfiles, TSetCurrentPage, TSetToastAlert, TSetToastText, TSetTweetDetail, TSetUsersProfile } from '../AppRouter';
import ShowLikeTweetInProfile from './ShowLikeTweetInProfile';
import ShowMediaInProfile from './ShowMediaInProfile';
import ShowMyTweetInProfile from './ShowMyTweetInProfile';
import ShowMyTweetsNRepliesInProfile from './ShowMyTweetsNRepliesInProfile';

interface UserHistoryInProfileProp{
    usersProfile : IUsersProfiles;
    userObj : IUserObj;
    myTweetList : TMyTweetList;
    setToastAlert : TSetToastAlert;
    setToastText : TSetToastText;
    setUsersProfile : TSetUsersProfile;
    currentPage : TCurrentPage;
    setCurrentPage : TSetCurrentPage;
    setTweetDetail : TSetTweetDetail;
    tweets : ITweetMessages;
    messages : ITweetMessages;
    currentUser : IUsersProfile;
    randomUsersProfile : TRandomUsersProfiles;
}
  
interface TCurrentNavi{
    Tweets : boolean;
    TweetsReplies : boolean;
    Media: boolean;
    Likes : boolean;
}

const UserHistoryInProfile = ({ usersProfile, currentUser, messages, userObj, myTweetList, setToastAlert, setToastText, setUsersProfile, currentPage, setCurrentPage, setTweetDetail, tweets, randomUsersProfile } : UserHistoryInProfileProp) => {
    const [currentNavi, setCurrentNavi] = useState<TCurrentNavi>({
        Tweets : true,
        TweetsReplies : false,
        Media : false,
        Likes : false
    });


    const handleTraceClick = (key : string) => {        
        let newCurrentNavi = {
            Tweets : false,
            TweetsReplies : false,
            Media : false,
            Likes : false
        };

        switch(key){
            case 'Tweets' :
                newCurrentNavi.Tweets = true;
                window.scrollTo({top:0, behavior:'smooth'});
                break;
            case 'TweetsReplies' :
                newCurrentNavi.TweetsReplies = true
                break;
            case 'Media' :
                newCurrentNavi.Media = true
                break;
            case 'Likes' :
                newCurrentNavi.Likes = true
                break;
        }
        setCurrentNavi(newCurrentNavi);
    }

    return(
        <>
            <div className='my_trace_navi'>    
                <div className={currentNavi.Tweets ? "my_trace_box tweets tweets_active" : "my_trace_box tweets"} onClick={() => handleTraceClick('Tweets')}>
                    <span>Tweets</span>
                </div>
                <div className={currentNavi.TweetsReplies ? 'my_trace_box tweets_replies tweets_replies_active' : 'my_trace_box tweets_replies'} onClick={() => handleTraceClick('TweetsReplies')}>
                    <span>Tweets & replies</span>
                </div>
                <div className={currentNavi.Media ? 'my_trace_box media media_active' : 'my_trace_box media'} onClick={() => handleTraceClick('Media')}>
                    <span>Media</span>
                </div>
                <div className={currentNavi.Likes ? 'my_trace_box likes likes_active' : 'my_trace_box likes'} onClick={() => handleTraceClick('Likes')}>
                    <span>Likes</span>
                </div>
            </div>
            

            {currentNavi.Tweets && <ShowMyTweetInProfile usersProfile={usersProfile} currentUser={currentUser} messages={messages} userObj={userObj} myTweetList={myTweetList} setToastAlert={setToastAlert} setToastText={setToastText} setUsersProfile={setUsersProfile} currentPage={currentPage} setCurrentPage={setCurrentPage} setTweetDetail={setTweetDetail} randomUsersProfile={randomUsersProfile} />}
            {currentNavi.TweetsReplies && <ShowMyTweetsNRepliesInProfile usersProfile={usersProfile} currentUser={currentUser} userObj={userObj} messages={messages} myTweetList={myTweetList} setToastAlert={setToastAlert} setToastText={setToastText} setUsersProfile={setUsersProfile} currentPage={currentPage} setCurrentPage={setCurrentPage} setTweetDetail={setTweetDetail} randomUsersProfile={randomUsersProfile} />}
            {currentNavi.Media && <ShowMediaInProfile usersProfile={usersProfile} setUsersProfile={setUsersProfile} currentUser={currentUser} messages={messages} userObj={userObj} myTweetList={myTweetList} setToastAlert={setToastAlert} setToastText={setToastText} currentPage={currentPage} setCurrentPage={setCurrentPage} setTweetDetail={setTweetDetail} />}
            {currentNavi.Likes && <ShowLikeTweetInProfile userObj={userObj} currentUser={currentUser} tweets={tweets} messages={messages} usersProfile={usersProfile} setUsersProfile={setUsersProfile} setToastAlert={setToastAlert} setToastText={setToastText} currentPage={currentPage} />}
        </>
    );
}

export default UserHistoryInProfile;