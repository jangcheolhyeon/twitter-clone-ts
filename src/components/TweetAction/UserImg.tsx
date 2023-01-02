import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {useRef, useState} from 'react';
import { ITweetMessage, IUserObj, IUsersProfile, IUsersProfiles, TCurrentPage, TSetUsersProfile } from '../AppRouter';
import { TLastTweet } from '../../Routers/Home';
import { TSetUserImgHover, TUserImgHover, TUserPhoto } from '../Tweet';
import UserInfoHover from './UserInfoHover';



interface UserImgProp{
    tictoc : ITweetMessage;
    userImgHover : TUserImgHover;
    userPhoto : TUserPhoto;
    userObj : IUserObj;
    usersProfile : IUsersProfiles;
    setUsersProfile : TSetUsersProfile;
    setUserInfoHover : TSetUserImgHover;
    lastTweet : TLastTweet;
    currentUser : IUsersProfile;
    currentPage : TCurrentPage;
}

export type TtimerRef = ReturnType<typeof setTimeout> | any;

const UserImg = ({ tictoc, currentPage, userImgHover, currentUser, userPhoto, userObj, usersProfile, setUsersProfile, setUserInfoHover, lastTweet } : UserImgProp) => {
    const timerRef = useRef<TtimerRef>();
    const tweetWriteUser : IUsersProfile = usersProfile.filter(element => element.userId === tictoc.userId)[0];

    
    return(
        <>
            <div className="tweet_user_photo_container">
                <>
                    {/* {currentPage === "detailsParent" ? (
                        <>
                            {userPhoto ? (
                                <>
                                    <img src={userPhoto} alt="user image" className={userImgHover ? 'user_photo_image activing_user_photo_image' : 'user_photo_image'}
                                        onMouseOver={() => { setUserInfoHover(true); }} 
                                        onMouseOut={() => { timerRef.current = setTimeout(() => {
                                            setUserInfoHover(false);
                                        }, 500) }}
                                    />
                                </>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faCircleUser} className={userImgHover ? 'user_photo_image activing_user_photo_image' : 'user_photo_image'}
                                        onMouseOver={() => { setUserInfoHover(true); }} 
                                        onMouseOut={() => { timerRef.current = setTimeout(() => {
                                            setUserInfoHover(false);
                                        }, 500) }}
                                    />
                                </>
                            )}

                            {userImgHover && 
                                <UserInfoHover userInfo={tweetWriteUser} currentUser={currentUser} userObj={userObj} usersProfile={usersProfile} setUsersProfile={setUsersProfile} timerRef={timerRef} setUserInfoHover={setUserInfoHover} isUserImgHover={true} lastTweet={lastTweet} isAttachmentUrl={tictoc.attachmentUrl} />
                            }
                        </>
                    ) : (
                        <>
                            {userPhoto ? (
                                <>
                                    <img src={userPhoto} alt="user image" className={userImgHover ? 'user_photo_image activing_user_photo_image' : 'user_photo_image'}
                                        onMouseOver={() => { setUserInfoHover(true); }} 
                                        onMouseOut={() => { timerRef.current = setTimeout(() => {
                                            setUserInfoHover(false);
                                        }, 500) }}
                                    />
                                </>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faCircleUser} className={userImgHover ? 'user_photo_image activing_user_photo_image' : 'user_photo_image'}
                                        onMouseOver={() => { setUserInfoHover(true); }} 
                                        onMouseOut={() => { timerRef.current = setTimeout(() => {
                                            setUserInfoHover(false);
                                        }, 500) }}
                                    />
                                </>
                            )}

                            {userImgHover && 
                                <UserInfoHover userInfo={tweetWriteUser} currentUser={currentUser} userObj={userObj} usersProfile={usersProfile} setUsersProfile={setUsersProfile} timerRef={timerRef} setUserInfoHover={setUserInfoHover} isUserImgHover={true} lastTweet={lastTweet} isAttachmentUrl={tictoc.attachmentUrl} />
                            }
                        </>
                    )} */}
                    {userPhoto ? (
                        <>
                            <img src={userPhoto} alt="user image" className={userImgHover ? 'user_photo_image activing_user_photo_image' : 'user_photo_image'}
                                onMouseOver={() => { setUserInfoHover(true); }} 
                                onMouseOut={() => { timerRef.current = setTimeout(() => {
                                    setUserInfoHover(false);
                                }, 500) }}
                            />
                        </>
                    ) : (
                        <>
                            <FontAwesomeIcon icon={faCircleUser} className={userImgHover ? 'user_photo_image activing_user_photo_image' : 'user_photo_image'}
                                onMouseOver={() => { setUserInfoHover(true); }} 
                                // onMouseOut={() => { timerRef.current = setTimeout(() => {
                                //     setUserInfoHover(false);
                                // }, 500) }}
                            />
                        </>
                    )}

                    {userImgHover && 
                        <UserInfoHover userInfo={tweetWriteUser} currentUser={currentUser} userObj={userObj} usersProfile={usersProfile} setUsersProfile={setUsersProfile} timerRef={timerRef} setUserInfoHover={setUserInfoHover} isUserImgHover={true} lastTweet={lastTweet} isAttachmentUrl={tictoc.attachmentUrl} />
                    }
                </>
            </div>    
        </>
    );
}

export default UserImg;