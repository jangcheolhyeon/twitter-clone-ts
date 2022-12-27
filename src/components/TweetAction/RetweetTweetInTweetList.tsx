import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { ITweetMessage, IUsersProfile, IUsersProfiles, TCurrentPage } from "../AppRouter";
import { TOnTweetClick } from "../Tweet";

interface RetweetTweetInTweetListProp{
    currentPage? : TCurrentPage;
    onTweetClick : TOnTweetClick;
    tictoc : ITweetMessage;
    usersProfile : IUsersProfiles;
}

const RetweetTweetInTweetList = ({ currentPage, onTweetClick, tictoc, usersProfile } : RetweetTweetInTweetListProp) => {
    let retweetParentInfo : IUsersProfile | undefined;
    if(tictoc.retweet !== undefined && tictoc.retweet === true){
        retweetParentInfo = usersProfile.filter(element => element.userId === tictoc.retweetParentInfo.userId)[0];
    }

    return(
        <>
            <div className="tictoc_retweet_content_container">
                <div className={currentPage === "details" || currentPage === "profile" ? "retweet_content_container tweet_home" : "retweet_content_container"} onClick={currentPage === "details" || currentPage === 'profile' ? onTweetClick : undefined}>
                    <div className="retweet_top">
                        {retweetParentInfo?.userImage ? (
                            <img src={retweetParentInfo?.userImage} alt='retweet user Image' />
                        ) : (
                            <FontAwesomeIcon icon={faCircleUser} />
                        )}

                        <span>{retweetParentInfo?.displayName}</span>
                        {retweetParentInfo?.email ? (
                            <span className="user_email">@{retweetParentInfo.email.split('@')[0]}</span>
                        ) : (
                            <span className="user_email">@</span>
                        )}
                    </div>
                    <div className="retweet_content">
                        <span>{tictoc.retweetParentInfo.text}</span>
                    </div>

                    {tictoc.retweetParentInfo.attachmentUrl && (
                        <div className="retweet_img">
                            <img src={tictoc.retweetParentInfo.attachmentUrl} style={{ backgroundImage : tictoc.retweetParentInfo.attachmentUrl }} alt='retweet user Image' />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default RetweetTweetInTweetList;