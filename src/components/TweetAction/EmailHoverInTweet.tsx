import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { IUserObj, IUsersProfile } from "../AppRouter";
import { TFollowingHover, TFollowState, TOnFollowClick, TSetFollowingHover } from "../Navigation/RecommendFriend";
import FollowAction from "./FollowAction";

interface IEmailHoverInTweetProp{
    user : IUsersProfile | undefined;
    userObj : IUserObj;
    followState : TFollowState;
    followingHover : TFollowingHover;
    setFollowingHover : TSetFollowingHover;
    onFollowClick : TOnFollowClick;
}


const EmailHoverInTweet = ({ user, userObj, followState, followingHover, setFollowingHover, onFollowClick } : IEmailHoverInTweetProp) => {
    return(
        <>
            <div className="user_info_hover_top_container">
                <div className="user_info_hover_img_container">
                    {user?.userImage ? (
                        <img src={user.userImage} alt="user Image" />
                    ) : (
                        <FontAwesomeIcon icon={faCircleUser}/>
                    )}
                    
                </div>
                {user?.userId === userObj?.uid ? 
                    (
                        <>
                            <div className="user_info_hover_current_user">
                                <button>me</button>
                            </div>
                        </>
                    ) : (
                        <FollowAction user={user} followState={followState} followingHover={followingHover} onFollowClick={onFollowClick} setFollowingHover={setFollowingHover} />
                    )}
            </div>
        </>
    );
}

export default EmailHoverInTweet