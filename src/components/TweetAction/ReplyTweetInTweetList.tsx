import React, { useRef } from "react";
import { ITweetMessage, IUserObj, IUsersProfile, IUsersProfiles, TSetUsersProfile } from "../AppRouter";
import { TLastTweet } from "../../Routers/Home";
import { TEmailHover, TSetEmailHover } from "../Tweet";
import UserInfoHover from "./UserInfoHover";

interface ReplyTweetInTweetListProp{
    tictoc : ITweetMessage;
    emailHover : TEmailHover;
    setEmailHover : TSetEmailHover;
    userObj : IUserObj;
    usersProfile : IUsersProfiles;
    setUsersProfile : TSetUsersProfile;
    lastTweet : TLastTweet;
    currentUser : IUsersProfile;
}

const ReplyTweetInTweetList = ({ tictoc, emailHover, currentUser, setEmailHover, userObj, usersProfile, setUsersProfile, lastTweet } : ReplyTweetInTweetListProp) => {
    const emailTimer : any = useRef();
    let replyParentInfo;
    if(tictoc.child !== undefined && tictoc.child === true){
        replyParentInfo = usersProfile.filter(element => element.userId === tictoc.parentReplyInfoDetail.userId)[0]
    }
    
    return(
        <>
            {tictoc.parent && <span>{tictoc.text}</span>}
            {tictoc.child && 
                <div className="reply_content">
                    <span className='replying'>Replying to 
                        {replyParentInfo === undefined || replyParentInfo.email == null? (
                            <>
                                <span className={emailHover ? 'user_email activing_user_email' : 'user_email'}
                                    onMouseOver={() => { setEmailHover(true); }} 
                                    onMouseOut={() => { emailTimer.current = setTimeout(() => {
                                        setEmailHover(false);
                                    }, 500) }}
                            >
                                @
                                </span>
                            </>
                        ) : (
                                <span className={emailHover ? 'user_email activing_user_email' : 'user_email'}
                                onMouseOver={() => { setEmailHover(true); }} 
                                onMouseOut={() => { emailTimer.current = setTimeout(() => {
                                    setEmailHover(false);
                                }, 500) }}
                            >
                                    @{replyParentInfo.email.split('@')[0]}
                                </span>
                        )}
                    </span>

                    <span className="text">{tictoc.text}</span>
                </div>
            }
            
            {emailHover && 
                <UserInfoHover userInfo={replyParentInfo} currentUser={currentUser} userObj={userObj} usersProfile={usersProfile} setUsersProfile={setUsersProfile} timerRef={emailTimer} setUserInfoHover={setEmailHover} isUserImgHover={false} lastTweet={lastTweet} isAttachmentUrl={tictoc.attachmentUrl} />
            }
        </>
    );
}

export default ReplyTweetInTweetList;