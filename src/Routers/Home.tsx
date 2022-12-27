import React, { useEffect, } from 'react';
import { collection, addDoc } from "firebase/firestore"; 
import { TSetUsersProfile, IUserObj, IUsersProfile, IUsersProfiles, TCurrentPage, TSetCurrentPage, TSetTweetDetail, TSetToastAlert, TSetToastText, ITweetMessages } from '../components/AppRouter';
import { db } from '../fbase';
import TweetFactory from '../components/Home/TweetFactory';
import Tweet from '../components/Tweet';

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
}

export type TLastTweet = boolean;

const Home = ({ messages, userObj, usersProfile, currentUser, setUsersProfile, currentPage, setCurrentPage, setTweetDetail, setToastAlert, setToastText } : HomeProp) => {
    useEffect(() => {
        window.scrollTo({top:0, behavior:'smooth'});
        setCurrentPage("home");
    }, [])

    useEffect(() => {
        if(!currentUser && usersProfile.length !== 0){
            insertUser();
            let newUsersProfile : IUsersProfiles = [...usersProfile, {
                userId : userObj?.uid,
                userImage : userObj?.photoURL,
                displayName : userObj?.displayName,
                email : userObj?.email,
                pin : '',
                follower:[],
                following:[],
                backgroundImg : null,
            }];
            setUsersProfile(newUsersProfile);
        }
    }, [userObj])
    
    const insertUser = async() => {
        await addDoc(collection(db, 'usersInfo'), {
            userId : userObj?.uid,
            userImage : userObj?.photoURL,
            displayName : userObj?.displayName,
            email : userObj?.email,
            pin : '',
            follower:[],
            following:[],
            backgroundImg : null,
        })
    }

    return(
        <>
        {usersProfile.length === 0 && currentUser !== undefined ? (
            <div className='container'>
            </div>
        ) : (
            <>
                <div className="container home_container">
                    <div className="content_container">
                        <div className="write_tweet_container">
                            <TweetFactory userObj={userObj} />
                        </div>

                        <div className='tictoc_container'>
                            {messages.map((element, index) => {
                                return <Tweet key={element.id} tictoc={element} currentUser={currentUser} messages={messages} isOwner={element.userId === userObj?.uid} userObj={userObj} usersProfile={usersProfile} setToastAlert={setToastAlert} setToastText={setToastText} setTweetDetail={setTweetDetail} currentPage={currentPage} setCurrentPage={setCurrentPage} setUsersProfile={setUsersProfile} lastTweet={messages.length === (index + 1)} />
                            })}
                        </div>
                    </div>
                </div>
            </>
        )}
        </>
    );
}

export default Home;