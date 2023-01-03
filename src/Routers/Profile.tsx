import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { ITweetMessages, IUserObj, IUsersProfile, IUsersProfiles, TCurrentPage, TGetCurrentUser, TRandomUsersProfiles, TRefreshUserObj, TSetCurrentPage, TSetToastAlert, TSetToastText, TSetTweetDetail, TSetUsersProfile } from '../components/AppRouter';
import UpdateUserProfile from '../components/Profile/UpdateUserProfile';
import UserHistoryInProfile from '../components/Profile/UserHistoryInProfile';


interface ProfileProp{
    messages : ITweetMessages;
    userObj : IUserObj;
    currentPage : TCurrentPage;
    refreshUserObj : TRefreshUserObj;
    usersProfile : IUsersProfiles;
    setCurrentPage : TSetCurrentPage;
    setTweetDetail : TSetTweetDetail;
    setToastAlert : TSetToastAlert;
    setToastText : TSetToastText;
    setUsersProfile : TSetUsersProfile;
    currentUser : IUsersProfile;
    getCurrentUser : TGetCurrentUser;
    randomUsersProfile : TRandomUsersProfiles;
}

export type TMyTweetList = ITweetMessages | [] | null;

export type TNewDisplayName = string | null | undefined;
export type TSetNewDisplayANme = React.Dispatch<React.SetStateAction<TNewDisplayName>>;
export type TUserBackgroundAttachment = string | undefined;
export type TSetUserBackgroundAttachment = React.Dispatch<React.SetStateAction<TUserBackgroundAttachment>>;
export type TSetChangedUserBackgroundAttachment = React.Dispatch<React.SetStateAction<string | undefined>>;


const Profile = ({ userObj, messages, currentUser, currentPage, refreshUserObj, usersProfile, setCurrentPage, setToastAlert, setToastText, setUsersProfile, setTweetDetail, getCurrentUser, randomUsersProfile } : ProfileProp) => {
    const [newDisplayName, setNewDisplayName] = useState<TNewDisplayName>(userObj?.displayName);
    const [userBackgroundAttachment, setUserBackgroundAttachment] = useState<TUserBackgroundAttachment>();
    const [changedUserBackgroundAttachment, setChangedUserBackgroundAttachment] = useState<string | undefined >();
    const [myTweetList, setMyTweetList] = useState<TMyTweetList>([]); 
    const [tweets, setTweets] = useState<ITweetMessages>([]); 
    const [followersCnt, setFollowersCnt] = useState<number>(0);
    const [followingCnt, setFollowingCnt] = useState<number>(0);


    useEffect(() => {
        const newMyTweetList = messages.filter(element => element.userId === userObj?.uid);
        setMyTweetList(newMyTweetList);
        setTweets(messages);
        getCurrentUser();
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
        if(usersProfile.length === 0 || currentUser === undefined) return;

        setFollowersCnt(currentUser.follower.length);
        setFollowingCnt(currentUser.following.length);
    }, [usersProfile]) 

    
        
    return(
        <>
            {myTweetList === null || usersProfile.length === 0 || currentUser === undefined? (
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
                            randomUsersProfile={randomUsersProfile}      
                        />

                    </div>
                </>
            )}
        </>

    );
}

export default Profile;