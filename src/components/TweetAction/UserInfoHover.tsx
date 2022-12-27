import React, { useEffect, useState } from "react";
import { IUserObj, IUsersProfile, IUsersProfiles, TSetUsersProfile } from "../AppRouter";
import { TLastTweet } from "../../Routers/Home";
import RecommendFriend from "../Navigation/RecommendFriend";
import { TSetUserImgHover } from "../Tweet";
import { TtimerRef } from "./UserImg";

interface UserInfoHoverProp{
    userInfo : IUsersProfile | undefined;
    userObj : IUserObj;
    usersProfile : IUsersProfiles;
    setUsersProfile : TSetUsersProfile;
    timerRef : TtimerRef;
    setUserInfoHover : TSetUserImgHover;
    isUserImgHover : boolean;
    lastTweet : TLastTweet;
    isAttachmentUrl : string; 
    currentUser : IUsersProfile;
}


const UserInfoHover = ({ userInfo, userObj, currentUser, usersProfile, timerRef, setUserInfoHover, isUserImgHover, lastTweet, isAttachmentUrl }: UserInfoHoverProp) => {
    const [isLastTweet, setIsLastTweet] = useState<boolean>();

    useEffect(() => {
        setIsLastTweet(lastTweet);
    }, [])   

    return(
        <>
            {isLastTweet && isAttachmentUrl === '' ? (
                <div className={isUserImgHover ? 'user_info_hover_container last_tweet_user_img_hover' : 'user_info_hover_container last_tweet_user_email_hover'}
                    onClick={ (event) => event.stopPropagation() } 
                    onMouseOver={() => {
                        clearTimeout(timerRef.current);
                        setUserInfoHover(true); 
                    }}
                    onMouseOut={() => { setUserInfoHover(false); }}
                >

                    <div>
                        <RecommendFriend user={userInfo} userObj={userObj} currentUser={currentUser} usersProfile={usersProfile} emailHoverState={true} />
                    </div>

                    <div className="user_info_hover_mid_container">
                        <span>{userInfo?.displayName}</span>
                        {userInfo?.email === null || userInfo?.email === undefined ? (
                            <span className="user_info_hover_container_gray_text">
                                @
                            </span>
                            ) : (
                            <span className="user_info_hover_container_gray_text">
                                @{userInfo.email?.split('@')[0]}
                            </span>
                            )
                        }
                    </div>

                    <div className="user_info_hover_bottom_container">
                        <span>{userInfo?.following.length}<span className="user_info_hover_container_gray_text">Following</span></span>
                        <span className="second_text">{userInfo?.follower.length}<span className="user_info_hover_container_gray_text">Followers</span></span>
                    </div>

                </div>
            ) : (
                <div className={isUserImgHover ? 'user_info_hover_container hover_user_img' : 'user_info_hover_container hover_email'}
                    onClick={ (event) => event.stopPropagation() } 
                    onMouseOver={() => {
                        clearTimeout(timerRef.current);
                        setUserInfoHover(true); 
                    }}
                    onMouseOut={() => { setUserInfoHover(false); }}
                >

                    <div>
                        <RecommendFriend user={userInfo} userObj={userObj} currentUser={currentUser} usersProfile={usersProfile} emailHoverState={true} />
                    </div>

                    <div className="user_info_hover_mid_container">
                        <span>{userInfo?.displayName}</span>
                        {userInfo?.email === null || userInfo?.email === undefined ? (
                            <span className="user_info_hover_container_gray_text">
                                @
                            </span>
                            ) : (
                            <span className="user_info_hover_container_gray_text">
                                @{userInfo.email?.split('@')[0]}
                            </span>
                            )
                        }
                    </div>

                    <div className="user_info_hover_bottom_container">
                        <span>{userInfo?.following.length}<span className="user_info_hover_container_gray_text">Following</span></span>
                        <span className="second_text">{userInfo?.follower.length}<span className="user_info_hover_container_gray_text">Followers</span></span>
                    </div>

                </div>
            )}
        </>
    );
}

export default UserInfoHover;