import React from "react";
import { IUsersProfile } from "../AppRouter";
import { TFollowingHover, TFollowState, TOnFollowClick, TSetFollowingHover } from "../Navigation/RecommendFriend";

interface FollowActionProp{
    user : IUsersProfile | undefined;
    followState : TFollowState;
    followingHover : TFollowingHover;
    setFollowingHover : TSetFollowingHover;
    onFollowClick : TOnFollowClick;
}

const FollowAction = ({ user, followState, followingHover, onFollowClick, setFollowingHover } : FollowActionProp) => {


    return(
        <>
            <div className="recommend_contaienr_follow_box">
                {followState ? (
                    followingHover ? (
                        <button className="recommend_friend_follow_btn" onClick={() => {onFollowClick(user)}} onMouseOver={() => setFollowingHover(true)} onMouseOut={() => setFollowingHover(false)}>UnFollow</button>
                    ) : (
                        <button className="recommend_friend_follow_btn" onClick={() => {onFollowClick(user)}} onMouseOver={() => setFollowingHover(true)} onMouseOut={() => setFollowingHover(false)}>Following</button>
                    )
                ) : (
                    <button className="recommend_friend_unfollow_btn" onClick={() => {onFollowClick(user)}}>Follow</button>
                )}
            </div>
        </>
    );
}

export default FollowAction;