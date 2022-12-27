import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { ITweetMessage, ITweetMessages, IUserObj, IUsersProfile, IUsersProfiles, TCurrentPage, TRefreshUserObj, TSetCurrentPage, TSetToastAlert, TSetToastText, TSetTweetDetail, TSetUserObj, TSetUsersProfile, TUserObj } from '../components/AppRouter';
import UpdateUserProfile from '../components/Profile/UpdateUserProfile';
import UserHistoryInProfile from '../components/Profile/UserHistoryInProfile';


interface ProfileProp{
    messages : ITweetMessages;
    userObj : IUserObj;
    setUserObj : TSetUserObj;
    currentPage : TCurrentPage;
    refreshUserObj : TRefreshUserObj;
    usersProfile : IUsersProfiles;
    setCurrentPage : TSetCurrentPage;
    setTweetDetail : TSetTweetDetail;
    setToastAlert : TSetToastAlert;
    setToastText : TSetToastText;
    setUsersProfile : TSetUsersProfile;
    currentUser : IUsersProfile;
}

export type TMyTweetList = ITweetMessages | [] | null;

export type TNewDisplayName = string | null | undefined;
export type TSetNewDisplayANme = React.Dispatch<React.SetStateAction<TNewDisplayName>>;
export type TUserBackgroundAttachment = string | undefined;
export type TSetUserBackgroundAttachment = React.Dispatch<React.SetStateAction<TUserBackgroundAttachment>>;
export type TSetChangedUserBackgroundAttachment = React.Dispatch<React.SetStateAction<string | undefined>>;


const Profile = ({ userObj, setUserObj, messages, currentUser, currentPage, refreshUserObj, usersProfile, setCurrentPage, setToastAlert, setToastText, setUsersProfile, setTweetDetail } : ProfileProp) => {
    const [newDisplayName, setNewDisplayName] = useState<TNewDisplayName>(userObj?.displayName);
    const [userBackgroundAttachment, setUserBackgroundAttachment] = useState<TUserBackgroundAttachment>();
    const [changedUserBackgroundAttachment, setChangedUserBackgroundAttachment] = useState<string | undefined >();
    const [myTweetList, setMyTweetList] = useState<TMyTweetList>([]); // 내가 작성한 message만 넣음
    const [tweets, setTweets] = useState<ITweetMessages>([]); // 모든 message를 다 넣음
    const [followersCnt, setFollowersCnt] = useState<number>(0);
    const [followingCnt, setFollowingCnt] = useState<number>(0);


    useEffect(() => {
        const newMyTweetList = messages.filter(element => element.userId === userObj?.uid);
        setMyTweetList(newMyTweetList);
        setTweets(messages);
        if(!currentUser && usersProfile.length !== 0){
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
        setCurrentPage('profile');

    }, []);

    useEffect(() => {
        const pinTweet = myTweetList?.filter((element) => {
            return currentUser.pin === element.id;
        })[0];


        if(pinTweet){

            let newMyTweetList = myTweetList.filter(element => {
                return element.id !== currentUser.pin;
            })

            
            newMyTweetList.unshift(pinTweet);
            setMyTweetList(newMyTweetList);

        } else{
            const newMyTweetList = messages.filter(element => element.userId === userObj?.uid);
            setMyTweetList(newMyTweetList);
        }
    }, [currentUser])

    useEffect(() => {
        console.log("myTweetList", myTweetList);

    }, [myTweetList, ])

        
    useEffect(() => {
        if(usersProfile.length === 0) return;

        setFollowersCnt(currentUser.follower.length);
        setFollowingCnt(currentUser.following.length);
    }, [usersProfile]) 

    
    const createAccountUser = () => {
        if(userObj !== null){
            // if(userObj.displayName === null || userObj.displayName === undefined){
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
            {myTweetList === null || usersProfile.length === 0 ? (
                <div className='container'>
                </div>
            ) : (
                <>
                    <div className='container'>
                        <div className='background_container'>
                            
                            {userBackgroundAttachment && (
                                <img src={changedUserBackgroundAttachment} />
                            )}
                        </div>

                        <div className='my_profile_container'>
                            <div className='my_profile_container_top'>
                                {userObj?.photoURL ? (
                                    <img src={userObj.photoURL} />
                                ) : (
                                    <FontAwesomeIcon icon={faCircleUser} />
                                )}
                                <UpdateUserProfile 
                                    userObj={userObj} 
                                    usersProfile={usersProfile}
                                    setUsersProfile={setUsersProfile}
                                    userBackgroundAttachment={userBackgroundAttachment}
                                    setUserBackgroundAttachment={setUserBackgroundAttachment}
                                    setChangedUserBackgroundAttachment={setChangedUserBackgroundAttachment}
                                    newDisplayName={newDisplayName}
                                    setNewDisplayName={setNewDisplayName}
                                    refreshUserObj={refreshUserObj}
                                    currentUser={currentUser}
                                />
                            </div>
                        </div>

                        <div className='my_profile_info_container'>
                            <span className='user_name'>{userObj?.displayName}</span>
                            <span className='user_email'>{userObj?.email}</span>
                            <div className='follow_follower_info'>
                                <span>
                                    <span className='number'>{followingCnt}</span> Following
                                </span>
                                <span>
                                    <span className='number'>{followersCnt}</span> Followers
                                </span>
                            </div>
                        </div>
                        

                        <UserHistoryInProfile
                            usersProfile={usersProfile} 
                            userObj={userObj} 
                            myTweetList={myTweetList}
                            setToastAlert={setToastAlert}
                            setToastText={setToastText}
                            setUsersProfile={setUsersProfile}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            setTweetDetail={setTweetDetail}
                            tweets={tweets}             
                            messages={messages}  
                            currentUser={currentUser}         
                        />

                    </div>
                </>
            )}
        </>

    );
}

export default Profile;