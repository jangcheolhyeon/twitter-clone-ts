import React, { useEffect, useState, useCallback } from 'react';
import { collection, addDoc, query, orderBy, limit, getDocs, startAfter } from "firebase/firestore"; 
import { TSetUsersProfile, IUserObj, IUsersProfile, IUsersProfiles, TCurrentPage, TSetCurrentPage, TSetTweetDetail, TSetToastAlert, TSetToastText, ITweetMessages, TSetCurrentUser, TGetCurrentUser, ITweetMessage } from '../components/AppRouter';
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
    setCurrentUser : TSetCurrentUser;
    getCurrentUser : TGetCurrentUser;
}

export type TLastTweet = boolean;

const Home = ({ messages, userObj, usersProfile, currentUser, setCurrentUser, setUsersProfile, currentPage, setCurrentPage, setTweetDetail, setToastAlert, setToastText, getCurrentUser } : HomeProp) => {
    const [data, setData] = useState<ITweetMessages>([]); // 불러온 문서들 상태
    const [loading, setLoading] = useState<boolean>(false); // 로딩 상태 
    const [loadingMore, setLoadingMore] = useState<boolean>(false); // 추가 요청시 로딩 상태
    const [key, setKey] = useState<any>(null); // 마지막으로 불러온 스냅샷 상태
    const [noMore, setNoMore] = useState<boolean>(false); // 추가로 요청할 데이터 없다는 flag
    const [target, setTarget] = useState<any>(null);
    const initTweetLength = 5;
    

    // 첫번째 페이지 요청 함수
    const getFirstPage = useCallback(async () => {
      const queryRef = query(
        collection(db, 'tictoc'),
        orderBy("bundle", "desc"), // 최신 작성순으로 정렬
        limit(initTweetLength)
      );
      try {
        setLoading(true);
        
        const snap = await getDocs(queryRef);
        const docsArray : any = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        // 문서 저장
        setData(docsArray);
        
        // 커서로 사용할 마지막 문서 스냅샷 저장
        setKey(snap.docs[snap.docs.length - 1]);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    }, [initTweetLength]);
  
    // 추가 요청 함수
    const loadMore = useCallback(
      async (loadCount : number) => {
        const queryRef = query(
          collection(db, 'tictoc'),
          orderBy("bundle", "desc"),
          startAfter(key), // 마지막 커서 기준으로 추가 요청을 보내도록 쿼리 전송
          limit(loadCount)
        );
        try {
          const snap : any = await getDocs(queryRef);
          snap.empty ? setNoMore(true) // 만약 스냅샷이 존재 하지 않는다면 더이상 불러올수 없다는 flag 설정
          : setKey(snap.docs[snap.docs.length - 1]); // 존재한다면 처음과 마찬가지고 마지막 커서 저장

          const docsArray = snap.docs.map((doc : any) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setData([...data, ...docsArray]); // 기존 데이터와 합쳐서 상태 저장
        } catch (err) {
          console.log(err);
        }
      },
      [data, key]
    );

  
    // 지정된 요소가 화면에 보일때 실행할 콜백함수
    const onIntersect = useCallback(
      async ([entry] : any, observer : any) => {
       // 만약에 지정한 요소가 화면에 보이거나 현재 데이터를 더 불러오는 상황이 아닐경우,
       // 기존 요소의 주시를 해체하고 추가로 3개의 문서를 더 불러오도록 설정
      
        if (entry.isIntersecting && !loadingMore ) {
          observer.unobserve(entry.target);
          setLoadingMore(true);
          await loadMore(3);
          setLoadingMore(false);
        }
      },
      [loadMore, loadingMore]
    );
  
   // 처음 화면이 랜더링 되었을때 첫번째 페이지를 문서를 가져오도록 설정
    useEffect(() => {
      getFirstPage();
    }, [messages, getFirstPage]);
  
   // target 요소의 ref가 전달되었을때 해당 요소를 주시할수 있도록 observer 인스턴스 생성후 전달
    useEffect(() => {
      let observer : any;
      if (target && !noMore) {
        observer = new IntersectionObserver(onIntersect, {
          threshold: 0,
        });
        observer.observe(target);
      }
      // 메모리 해제 작업
      return () => {
        setLoading(false);
        setLoadingMore(false);
        observer && observer.disconnect();
      };
    }, [target, onIntersect, noMore]);


  //here
    useEffect(() => {
        window.scrollTo({top:0, behavior:'smooth'});
        setCurrentPage("home");
        getCurrentUser();
    }, [])

    // const { data, loading, loadingMore, noMore } : any = usePagination('tictoc', initTweetLength, target);
    

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