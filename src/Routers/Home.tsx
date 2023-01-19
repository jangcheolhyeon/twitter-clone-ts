import React, { useEffect, useState, useCallback } from 'react';
import { collection, addDoc, query, orderBy, limit, getDocs, startAfter } from "firebase/firestore"; 
import { TSetUsersProfile, IUserObj, IUsersProfile, IUsersProfiles, TCurrentPage, TSetCurrentPage, TSetTweetDetail, TSetToastAlert, TSetToastText, ITweetMessages, TSetCurrentUser, TGetCurrentUser, ITweetMessage } from '../components/AppRouter';
import { db } from '../fbase';
import { useInView } from 'react-intersection-observer';
import TweetFactory from '../components/Home/TweetFactory';
import Tweet from '../components/Tweet';
import LoadingTweets from '../components/LoadingComponents/LoadingTweets';

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
    const [data, setData] = useState<ITweetMessages>([]); 
    const [key, setKey] = useState<any>(null);
    const [noMore, setNoMore] = useState<boolean>(false); 
    const initTweetLen = 5; 
    const [ref, inView] = useInView();

    // 1. 초기에 5개의 tweet을 불러와서 show한다.
    useEffect(() => {
        getFirstPage();
    }, [])

    const getFirstPage = async() => {
        const queryA = query(collection(db, 'tictoc'), orderBy('bundle', 'desc'), limit(initTweetLen));
    
        const snap = await getDocs(queryA);
        const docsArray : any = snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        setData(docsArray);
        setKey(snap.docs[snap.docs.length - 1]);
    }

    // 2. observer로 맨 밑바닥을 감지하면 추가로 state에 데이터를 넣어준다.
    const loadMore = useCallback(async(moreTweetLen : number) => {
        const queryB = query(
            collection(db, 'tictoc'),
            orderBy("bundle", "desc"),
            startAfter(key), 
            limit(moreTweetLen)
        );

        const snap : any = await getDocs(queryB);
        snap.empty ? setNoMore(true) : setKey(snap.docs[snap.docs.length - 1]);

        const docArray = snap.docs.map((doc : any) => ({
            id : doc.id,
            ...doc.data(),
        }));
        setData([...data, ...docArray]);
    }, [inView])


    useEffect(() => {
        if(inView){
            loadMore(3)
        }
    }, [loadMore, inView, noMore])



    useEffect(() => {
        window.scrollTo({top:0, behavior:'smooth'});
        setCurrentPage("home");
        getCurrentUser();
    }, [])

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

                        {data === undefined || data === null || data.length === 0 ? (
                          <>
                            <LoadingTweets />
                            <LoadingTweets />
                            <LoadingTweets />
                          </>
                        ) : (
                            <>
                                <div className='tictoc_container'>
                                    {data.map((element : ITweetMessage, index : number) => {
                                        return <Tweet key={element.id} tictoc={element} currentUser={currentUser} messages={messages} isOwner={element.userId === userObj?.uid} userObj={userObj} usersProfile={usersProfile} setToastAlert={setToastAlert} setToastText={setToastText} setTweetDetail={setTweetDetail} currentPage={currentPage} setCurrentPage={setCurrentPage} setUsersProfile={setUsersProfile} lastTweet={messages.length === (index + 1)} />
                                    })}
                                </div>
                            </>
                        )}
                        
                        {data.length >= initTweetLen && 
                            <div ref={ref}></div>
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