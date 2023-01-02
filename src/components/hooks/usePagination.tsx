import { collection, getDocs, limit, onSnapshot, orderBy, query, startAfter } from "firebase/firestore";
import React, { useEffect, useState, useCallback } from "react";
import { db } from "../../fbase";
import { ITweetMessages } from "../AppRouter";


const usePagination = (collectionName : string, limitCount : number, target : any) => {
    const [data, setData] = useState<ITweetMessages>([]); // 불러온 문서들 상태
    const [loading, setLoading] = useState<boolean>(false); // 로딩 상태 
    const [loadingMore, setLoadingMore] = useState<boolean>(false); // 추가 요청시 로딩 상태
    const [key, setKey] = useState<any>(null); // 마지막으로 불러온 스냅샷 상태
    const [noMore, setNoMore] = useState<boolean>(false); // 추가로 요청할 데이터 없다는 flag
  
    // 첫번째 페이지 요청 함수
    const getFirstPage = useCallback(async () => {
      const queryRef = query(
        collection(db, collectionName),
        orderBy("bundle", "desc"), // 최신 작성순으로 정렬
        limit(limitCount)
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
    }, [collectionName, limitCount]);


    
    useEffect(() => {
      console.log("data", data);
    }, [data])
  
    // 추가 요청 함수
    const loadMore = useCallback(
      async (loadCount : number) => {
        const queryRef = query(
          collection(db, collectionName),
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
      [collectionName, data, key]
    );

    console.log("noMore", noMore);

  
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
    }, [getFirstPage]);
  
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
  
    return { data, loading, loadingMore, noMore };
  };

export default usePagination;