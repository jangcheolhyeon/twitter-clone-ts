import React, { useEffect, useState, useCallback } from 'react';
import { collection, addDoc, query, orderBy, limit, getDocs, startAfter } from "firebase/firestore"; 
import { TSetUsersProfile, IUserObj, IUsersProfile, IUsersProfiles, TCurrentPage, TSetCurrentPage, TSetTweetDetail, TSetToastAlert, TSetToastText, ITweetMessages, TSetCurrentUser, TGetCurrentUser, ITweetMessage } from '../components/AppRouter';
import { db } from '../fbase';
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
    const [loading, setLoading] = useState<boolean>(false); 
    const [loadingMore, setLoadingMore] = useState<boolean>(false); 
    const [key, setKey] = useState<any>(null);
    const [noMore, setNoMore] = useState<boolean>(false); 
    const [target, setTarget] = useState<any>(null);
    const initTweetLength = 5;
    
    const getFirstPage = useCallback(async () => {
      const queryRef = query(
        collection(db, 'tictoc'),
        orderBy("bundle", "desc"),
        limit(initTweetLength)
      );
      try {
        setLoading(true);
        
        const snap = await getDocs(queryRef);
        const docsArray : any = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setData(docsArray);
        
        setKey(snap.docs[snap.docs.length - 1]);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    }, [initTweetLength]);
  
    const loadMore = useCallback(
      async (loadCount : number) => {
        const queryRef = query(
          collection(db, 'tictoc'),
          orderBy("bundle", "desc"),
          startAfter(key), 
          limit(loadCount)
        );
        try {
          const snap : any = await getDocs(queryRef);
          snap.empty ? setNoMore(true) : setKey(snap.docs[snap.docs.length - 1]);

          const docsArray = snap.docs.map((doc : any) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setData([...data, ...docsArray]); 
        } catch (err) {
          console.log(err);
        }
      },
      [data, key]
    );

  
    const onIntersect = useCallback(
      async ([entry] : any, observer : any) => {
        if (entry.isIntersecting && !loadingMore ) {
          observer.unobserve(entry.target);
          setLoadingMore(true);
          await loadMore(3);
          setLoadingMore(false);
        }
      },
      [loadMore, loadingMore]
    );
  
    useEffect(() => {
      getFirstPage();
    }, [messages, getFirstPage]);
  
    useEffect(() => {
      let observer : any;
      if (target && !noMore) {
        observer = new IntersectionObserver(onIntersect, {
          threshold: 0,
        });
        observer.observe(target);
      }
      return () => {
        setLoading(false);
        setLoadingMore(false);
        observer && observer.disconnect();
      };
    }, [target, onIntersect, noMore]);

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