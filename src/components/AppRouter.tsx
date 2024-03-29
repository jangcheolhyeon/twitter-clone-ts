import React,{ useEffect, useRef, useState } from 'react';
import { addDoc, collection, getDoc, getDocs, limit, onSnapshot, orderBy, query, QuerySnapshot, startAfter } from 'firebase/firestore';
import { db } from '../fbase';
import { getAuth, onAuthStateChanged, updateProfile, User } from 'firebase/auth';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import TopNavi from './Navigation/TopNavi';
import ToastNotification from './Navigation/ToastNotification';
import Navigation from './Navigation/Navigation';
import Home from '../Routers/Home';
import Auth from '../Routers/Auth';
import Profile from '../Routers/Profile';
import Details from '../Routers/Details';
import SideRecommend from './Navigation/SideRecommend';
import arrayShuffle from 'array-shuffle';



interface IUserObjData {
    displayName : string | null;
    uid : string;
    updateProfile : () => void;
    photoURL : string | null;
    email : string | null;
    pin : string;
    follower : Array<string>;
    following : Array<string>;
    backgroundImg : string;
}

export interface IUsersProfile{
    backgroundImg : string | null;
    displayName : string | null | undefined;
    email : string | undefined | null;
    follower : string[]; 
    following : Array<string>;
    id? : string;
    pin : string ;
    userId : string | undefined;
    userImage : string | null | undefined;
}

export interface ITweetMessage{
    id : string;
    attachmentUrl : string;
    bundle : number;
    createdAt : number;
    isDeleted : boolean;
    like_users : string[];
    reply_users : string[];
    text : string;
    userId : string;
    userImage : string;

    parent? : boolean;

    child? : boolean;
    parentReplyInfo? : any;
    parentReplyInfoDetail? : any;

    retweet? : boolean;
    retweetParentInfo? : any;
}


export interface IUsersProfiles extends Array<IUsersProfile>{};
export interface ITweetMessages extends Array<ITweetMessage>{};

export type TUserObj = IUserObjData | null;
export type IUserObj = TUserObj | User;
export type TSetUserObj = React.Dispatch<React.SetStateAction<IUserObj>>;
export type TSetUsersProfile = React.Dispatch<React.SetStateAction<Array<IUsersProfile> | undefined>>;
export type TCurrentPage = string;
export type TSetCurrentPage = React.Dispatch<React.SetStateAction<string>>;
export type TTweetDetail = ITweetMessage | any;
export type TSetTweetDetail = React.Dispatch<React.SetStateAction<ITweetMessage>>;
export type TToastAlert = boolean;
export type TSetToastAlert = React.Dispatch<React.SetStateAction<boolean>>;
export type TToastText = string;
export type TSetToastText = React.Dispatch<React.SetStateAction<string>>;
export type TRefreshUserObj = () => void;
export type TSetCurrentUser = React.Dispatch<React.SetStateAction<IUsersProfile | undefined>>;
export type TGetCurrentUser = () => void;
export type TRandomUsersProfiles = IUsersProfiles;
export type TGetRecommendFriendList = (usersProfile : IUsersProfiles, number : number, setState : React.Dispatch<React.SetStateAction<IUsersProfiles>>) => void;


const AppRouter = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>();
    const [userObj, setUserObj] = useState<IUserObj>(null);
    const [init, setInit] = useState<boolean>(false);
    const [usersProfile, setUsersProfile] = useState<Array<IUsersProfile>>();
    const [currentPage, setCurrentPage] = useState<string>('home');
    const [tweetDetail, setTweetDetail] = useState<any>();
    const [toastAlert, setToastAlert] = useState<boolean>(false);
    const [toastText, setToastText] = useState<string>('');
    const [messages, setMessages] = useState<ITweetMessages>([]);
    const [currentUser, setCurrentUser] = useState<IUsersProfile>();
    const [randomUsersProfile, setRandomUsersProfile] = useState<IUsersProfiles>([]);
    const isInitialMount = useRef<boolean>(true);

    useEffect(() => {
        const q = query(collection(db, 'tictoc'), orderBy("bundle", "asc"), orderBy("createdAt", "asc"));
        onSnapshot(q, (snapshot) => {
            const newMessages : any = snapshot.docs.map((doc) => {
                return {
                    id : doc.id,
                    ...doc.data(),
                }
            })
            setMessages(newMessages);
        })  
    }, [])

    useEffect(() => {
        getCurrentUser();
    }, [])

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if(user){
                setIsLoggedIn(true);
                setUserObj({
                    displayName : user.displayName,
                    uid : user.uid,
                    updateProfile: () => updateProfile(user, { displayName : user.displayName, photoURL : user.photoURL }),
                    photoURL : user.photoURL,
                    email : user.email,
                    pin : '',
                    follower : [],
                    following : [],
                    backgroundImg : '',
                });
                setInit(true);
            } else{
                setIsLoggedIn(false);
                setInit(true);
            }
        })
    }, []);

    useEffect(() => {
        if(isInitialMount.current){
            isInitialMount.current = false;
            if(currentPage === 'profile'){
                setCurrentUser(usersProfile?.filter(element => element.userId === userObj?.uid)[0]);
            }
        } else{
            setCurrentUser(usersProfile?.filter(element => element.userId === userObj?.uid)[0]);
        }

    }, [usersProfile])


    useEffect(() => {
        if(!currentUser && usersProfile !== undefined && usersProfile.length){
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

    }, [currentUser, userObj])

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

    const shuffleArray = (usersProfile : IUsersProfiles, number : number) => {
        let newShuffledArray = [];
        
        for(let i=0;i<usersProfile.length;i++){
            newShuffledArray[i] = i;
        }
        return (arrayShuffle(newShuffledArray).slice(0, number));
    }

    useEffect(() => {
        if(usersProfile !== undefined)
        getRecommendFriendList(usersProfile, 3, setRandomUsersProfile);
    }, [currentPage])

    const getRecommendFriendList = (usersProfile : IUsersProfiles, number : number, setState : React.Dispatch<React.SetStateAction<IUsersProfiles>>) => {
        if(usersProfile){
            const usersProfileWithoutMe : IUsersProfiles = usersProfile.filter((element) => {
                return element.userId !== userObj?.uid;
            });
    
            const randomNumberArray = shuffleArray(usersProfileWithoutMe, number);        
    
            const filteredUsersProfile = randomNumberArray.map(element => {
                return usersProfileWithoutMe[element];
            })
    
            setState(filteredUsersProfile);
        }
    }


    const refreshUserObj = () => {
        setUserObj(getAuth().currentUser);
    }

    const getCurrentUser = () => {
        const q = query(collection(db, 'usersInfo'));
        onSnapshot(q, (snapshot) => {
            const newUsersInfo : any = snapshot.docs.map((doc) => {
                return {
                    id : doc.id,
                    ...doc.data()
                }
            });
            
            setUsersProfile(newUsersInfo);
        });

        setCurrentUser(usersProfile?.filter(element => element.userId === userObj?.uid)[0]);
    }

    const createAccountUser = () => {
        if(userObj !== null){
            if(!userObj.displayName){
                let newUserObj = {...userObj};
                if(userObj.email)
                newUserObj.displayName = userObj.email.split('@')[0];
                setUserObj(newUserObj);
            }
        }        
    }

    return(
        <>
            <Router>
                {init && usersProfile !== undefined ? (
                    
                    <>
                        {isLoggedIn && toastAlert &&
                            <ToastNotification text={toastText} setToastAlert={setToastAlert}/>
                        }
                        
                        {isLoggedIn && <TopNavi currentPage={currentPage} userObj={userObj}/>}
                        {isLoggedIn && <Navigation userObj={userObj} />}
                            <Routes>
                                {isLoggedIn ? (
                                    <>
                                        <Route path='/' element={<Home userObj={userObj} currentUser={currentUser as IUsersProfile} getCurrentUser={getCurrentUser} setCurrentUser={setCurrentUser} messages={messages} usersProfile={usersProfile} setUsersProfile={setUsersProfile} currentPage={currentPage} setCurrentPage={setCurrentPage} setTweetDetail={setTweetDetail} setToastAlert={setToastAlert} setToastText={setToastText} />} />
                                        
                                        <Route path='/profile' element={<Profile messages={messages} currentUser={currentUser as IUsersProfile} refreshUserObj={refreshUserObj} userObj={userObj} usersProfile={usersProfile} setCurrentPage={setCurrentPage} setTweetDetail={setTweetDetail} setToastAlert={setToastAlert} setToastText={setToastText} setUsersProfile={setUsersProfile} currentPage={currentPage} getCurrentUser={getCurrentUser} randomUsersProfile={randomUsersProfile} />} />
                                        
                                        <Route path='/details' element={<Details messages={messages} currentUser={currentUser as IUsersProfile} tweetDetail={tweetDetail} currentPage={currentPage} setCurrentPage={setCurrentPage} setTweetDetail={setTweetDetail} usersProfile={usersProfile} setUsersProfile={setUsersProfile} userObj={userObj} setToastAlert={setToastAlert} setToastText={setToastText}/>} />
                                        
                                        <Route path='/detailsParent' element={<Details messages={messages} currentUser={currentUser as IUsersProfile} tweetDetail={tweetDetail} currentPage={currentPage} setCurrentPage={setCurrentPage} usersProfile={usersProfile} setUsersProfile={setUsersProfile} userObj={userObj} setToastAlert={setToastAlert} setToastText={setToastText} setTweetDetail={setTweetDetail} />} />                                   
                                    </>
                                ) : (
                                        <Route path='/' element={<Auth />} />
                                )}
                            </Routes>
                        {isLoggedIn && <SideRecommend usersProfile={usersProfile} userObj={userObj} currentUser={currentUser as IUsersProfile} randomUsersProfile={randomUsersProfile} getRecommendFriendList={getRecommendFriendList} />}
                    </>
                ) : (
                    <span className='loading_page'>LOADING...</span>
                )}
            </Router>
        </>
    );
}

export default AppRouter;
