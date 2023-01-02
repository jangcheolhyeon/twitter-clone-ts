import React, { useEffect, useState} from 'react';
import { collection, addDoc } from "firebase/firestore"; 
import { TSetUsersProfile, IUserObj, IUsersProfile, IUsersProfiles, TCurrentPage, TSetCurrentPage, TSetTweetDetail, TSetToastAlert, TSetToastText, ITweetMessages, TSetCurrentUser, TGetCurrentUser, ITweetMessage } from '../components/AppRouter';
import { db } from '../fbase';
import TweetFactory from '../components/Home/TweetFactory';
import Tweet from '../components/Tweet';
import usePagination from '../components/hooks/usePagination';

interface HomeProp{
    messages : ITweetMessages;
    userObj : IUserObj;
    usersProfile : IUsersProfiles;
    setUsersProfile : TSetUsersProfile;
    currentPage : TCurrentPage;
    setCurrentPage : TSetCurrentPage;
    setTweetDetail : TSetTweetDetail;
    setToastAlert : TSetToastAlert;
    setToastText : TSetToastText;
    currentUser : IUsersProfile;
    setCurrentUser : TSetCurrentUser;
    getCurrentUser : TGetCurrentUser;
}

export type TLastTweet = boolean;

const Home = ({ messages, userObj, usersProfile, currentUser, setCurrentUser, setUsersProfile, currentPage, setCurrentPage, setTweetDetail, setToastAlert, setToastText, getCurrentUser } : HomeProp) => {
    useEffect(() => {
        window.scrollTo({top:0, behavior:'smooth'});
        setCurrentPage("home");

        // if(!currentUser){
            
        //     insertUser();

        //     let newUsersProfile : IUsersProfiles = [...usersProfile, {
        //         userId : userObj?.uid,
        //         userImage : userObj?.photoURL,
        //         displayName : userObj?.displayName,
        //         email : userObj?.email,
        //         pin : '',
        //         follower:[],
        //         following:[],
        //         backgroundImg : null,
        //     }];
        //     setUsersProfile(newUsersProfile);
        // }
        getCurrentUser();
    }, [])
    const initTweetLength = 5;
    const [target, setTarget] = useState<any>(null);
    const { data, loading, loadingMore, noMore } : any = usePagination('tictoc', initTweetLength, target);


    console.log("data", data);
    console.log("loading", loading);
    console.log("noMore", noMore);

    

    return(
        <>
        {usersProfile.length === 0 && currentUser !== undefined ? (
            <div className='container'>
                <h1>Loading</h1>
            </div>
        ) : (
            <>
                <div className="container home_container">
                    <div className="content_container">
                        <div className="write_tweet_container">
                            <TweetFactory userObj={userObj} />
                        </div>

                        {data === undefined || data === null ? (
                            <div>
                                <h1>Loading...</h1>
                            </div>
                        ) : (
                            <>
                                <div className='tictoc_container'>
                                    {data.map((element : ITweetMessage, index : number) => {
                                        return <Tweet key={element.id} tictoc={element} currentUser={currentUser} messages={messages} isOwner={element.userId === userObj?.uid} userObj={userObj} usersProfile={usersProfile} setToastAlert={setToastAlert} setToastText={setToastText} setTweetDetail={setTweetDetail} currentPage={currentPage} setCurrentPage={setCurrentPage} setUsersProfile={setUsersProfile} lastTweet={messages.length === (index + 1)} />
                                    })}
                                </div>
                            </>
                        )}
                        
                        {data.length >= initTweetLength && 
                            <div ref={setTarget}></div>
                        }

                        <div className='no_tweet_mark'>
                            {noMore && (
                                <span>Tweets don't exist anymore</span>
                                )}
                        </div>

                    </div>
                </div>
            </>
        )}
        </>
    );
}

export default Home;