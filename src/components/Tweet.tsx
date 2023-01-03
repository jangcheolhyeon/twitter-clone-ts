import { faArrowUpFromBracket, faCommentDots, faHeart, faRetweet, faThumbtack } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React,{ useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { IUserObj, IUsersProfiles, TSetUsersProfile, TCurrentPage, TSetCurrentPage, TSetTweetDetail, TSetToastAlert, TSetToastText, ITweetMessage, ITweetMessages, IUsersProfile } from './AppRouter';
import { TLastTweet } from "../Routers/Home";
import TweetActions from "./Profile/TweetActions";
import DeleteTweet from "./TweetAction/DeleteTweet";
import ReplyingModal from "./TweetAction/ReplyingModal";
import ReplyTweetInTweetList from "./TweetAction/ReplyTweetInTweetList";
import RetweetingModal from "./TweetAction/RetweetingModal";
import RetweetTweetInTweetList from "./TweetAction/RetweetTweetInTweetList";
import TweetThreeDots from "./TweetAction/TweetThreeDots";
import UserImg from "./TweetAction/UserImg";

interface TweetProp{
    key? : any;
    tictoc: ITweetMessage;
    isOwner: boolean;
    userObj : IUserObj;
    usersProfile : IUsersProfiles;
    setUsersProfile : TSetUsersProfile;
    currentPage? : TCurrentPage;
    setCurrentPage? : TSetCurrentPage;
    setTweetDetail? : TSetTweetDetail;
    setToastAlert : TSetToastAlert;
    setToastText : TSetToastText;
    lastTweet : TLastTweet;
    messages : ITweetMessages;
    currentUser : IUsersProfile;
}

export type StringNull = string | null | undefined;
export type TOnReplyModalToggle = (event : React.MouseEvent<HTMLDivElement>) => void;
export type TSetReplyModalOpen = React.Dispatch<React.SetStateAction<boolean>>;
export type TSetRetweetModalOpen = React.Dispatch<React.SetStateAction<boolean>>;
export type TOnRetweetModalToggle = (event : React.MouseEvent<HTMLElement>) => void;
export type TUserPhoto = StringNull;
export type TEmailHover = boolean;
export type TSetEmailHover = React.Dispatch<React.SetStateAction<boolean>>;
export type TUserImgHover = boolean;
export type TSetUserImgHover = React.Dispatch<React.SetStateAction<boolean>>;
export type TOnTweetClick = () => void;
export type TRetweetHover = boolean;
export type TSetRetweetHover = React.Dispatch<React.SetStateAction<boolean>>;
export type TRetweetActive = boolean;
export type TSetRetweetActive = React.Dispatch<React.SetStateAction<boolean>>;



const Tweet = ({ tictoc, messages, currentUser, isOwner, userObj, usersProfile, setToastAlert, setToastText, setTweetDetail, currentPage, setCurrentPage, setUsersProfile, lastTweet } : TweetProp) => {
    const [userName, setUserName] = useState<StringNull>();
    const [userPhoto, setUserPhoto] = useState<StringNull>(); 
    const [enrollDate, setEnrollDate] = useState<string>();
    const [replyModalOpen, setReplyModalOpen] = useState<boolean>(false);
    const [retweetHover, setRetweetHover] = useState<boolean>(false);
    const [retweetModalOpen, setRetweetModalOpen] = useState<boolean>(false);
    const [retweetActive, setRetweetActive] = useState<boolean>(false);
    const [emailHover, setEmailHover] = useState<boolean>(false);
    const [userImgHover, setUserImgHover] = useState<boolean>(false);

    useEffect(() => {
        // window.scrollTo({top:0, behavior:'smooth'});
        usersProfile.map(element => {
            if(element.userId === tictoc.userId){
                setUserName(element.displayName);
                setUserPhoto(element.userImage);
            } 
        });
        
        const time = new Date(tictoc.createdAt);
        setEnrollDate((time.getMonth()+1) + "." + (time.getDate()));
    }, []);

    useEffect(() => {
        usersProfile.map(element => {
            if(element.userId === tictoc.userId){
                setUserName(element.displayName);
                setUserPhoto(element.userImage);
            } 
        });
    }, [usersProfile, currentPage])

    const onReplyModalToggle = (event : React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        setReplyModalOpen((prev) => !prev);
    }

    const onRetweetModalToggle = (event : React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setRetweetModalOpen((prev) => !prev);
        setRetweetActive(false);
        setRetweetHover(false);
    }
    
    const navi = useNavigate();

    const onTweetClick = () => {
        if(setTweetDetail !== undefined && setCurrentPage !== undefined){ 
            if(currentPage === "home"){
                setTweetDetail(tictoc);
                setCurrentPage("details");
                navi('/details');
            } else if(currentPage === "details"){

                if(tictoc.retweet){
                    setTweetDetail(tictoc.retweetParentInfo);
                }else if(tictoc.parent){
                    return;
                } else if(tictoc.child){
                    setTweetDetail(tictoc.parentReplyInfoDetail);
                }

                setCurrentPage("detailsParent");
                navi('/detailsParent')

            } else if(currentPage === "profile"){

                if(tictoc.parent){
                    setTweetDetail(tictoc);
                } else if (tictoc.retweet){
                    setTweetDetail(tictoc.retweetParentInfo);
                } else if(tictoc.child){
                    setTweetDetail(tictoc);
                }
                setCurrentPage("details");
                navi('/details');

            }
        }
    }
    
    return(
        <>
            {currentUser === undefined ? (
                <>
                    <div className="tweet">
                        <div className="tweet_user_photo_container">
                            <div className="user_photo_image">
                            </div>
                        </div>

                        <div className="tweet_content">
                            <div className="tweet_userInfo_container">
                                <div className="tweet_more_container">
                    
                                </div>
                                <span className="user_name"></span>
                                <span className="enroll_date"></span>
                            </div>

                            <div className="user_tweet_content">
                                <span></span>
                            </div>

                            <div className="action_container">
                                <div className="action_comment_container">
                                    <FontAwesomeIcon icon={faCommentDots} />
                                    <span></span>
                                </div>
                                <div className="action_retweet_container">
                                    <FontAwesomeIcon icon={faRetweet} />
                                    <span></span>
                                </div>
                                <div className="action_like_container">
                                    <FontAwesomeIcon icon={faHeart} />
                                    <span></span>
                                </div>
                                <div className="action_share_container">
                                    <FontAwesomeIcon icon={faArrowUpFromBracket} />
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                {replyModalOpen && <ReplyingModal userObj={userObj} onReplyModalToggle={onReplyModalToggle} parentTweet={tictoc} usersProfile={usersProfile} setReplyModalOpen={setReplyModalOpen} />}
                {retweetModalOpen && <RetweetingModal userObj={userObj} onRetweetModalToggle={onRetweetModalToggle} retweetContent={tictoc} usersProfile={usersProfile} setRetweetModalOpen={setRetweetModalOpen} />}
                <div className={(currentPage === 'home' || currentPage === 'profile') && emailHover === false && userImgHover === false ? 'tweet tweet_home' : 'tweet'} onClick={currentPage === "home" || currentPage === "profile" ? onTweetClick : undefined}>
                    
                    {currentPage && 
                        <UserImg tictoc={tictoc} currentPage={currentPage} currentUser={currentUser} userImgHover={userImgHover} userPhoto={userPhoto} userObj={userObj} usersProfile={usersProfile} setUsersProfile={setUsersProfile} setUserInfoHover={setUserImgHover} lastTweet={lastTweet}/>
                    }
    
                    <div className="tweet_content">
                        {isOwner && <div className="close_tweet">
                            <DeleteTweet tictoc={tictoc} setToastAlert={setToastAlert} setToastText={setToastText} setCurrentPage={setCurrentPage} />
    
                            {Boolean(currentUser.pin.length) && currentUser.pin === tictoc.id && <>
                                <div className="tweet_pin">
                                    <FontAwesomeIcon icon={faThumbtack} />
                                    <span>Pinned Tweet</span>
                                </div>
                            </>}
                        </div>}
    
                        <div className={isOwner ? 'tweet_userInfo_container' : 'tweet_userInfo_container isNotOwner'}>
                            <div className="tweet_more_container">
                                <TweetThreeDots isOwner={isOwner} currentUser={currentUser} tictoc={tictoc} />
                            </div>
    
                            <span className="user_name">{userName}</span>
                            <span className="enroll_date">{enrollDate}</span>
                        </div>
    
                        <div className="user_tweet_content">
                            <ReplyTweetInTweetList tictoc={tictoc} emailHover={emailHover} currentUser={currentUser} setEmailHover={setEmailHover} userObj={userObj} usersProfile={usersProfile} setUsersProfile={setUsersProfile} lastTweet={lastTweet} />
                        </div>
    
                        {tictoc.attachmentUrl && 
                            <div className="user_tweet_image_container">
                                <img src={tictoc.attachmentUrl} alt="writer img" />
                            </div>
                        }
    
                        {tictoc.retweet &&  
                            <RetweetTweetInTweetList currentPage={currentPage} onTweetClick={onTweetClick} tictoc={tictoc} usersProfile={usersProfile} />
                        }
    
                        <div className="action_container">
    
    
                            <TweetActions 
                                tictoc={tictoc} 
                                userObj={userObj} 
                                onReplyModalToggle={onReplyModalToggle} 
                                retweetHover={retweetHover} 
                                setRetweetHover={setRetweetHover} 
                                retweetActive={retweetActive} 
                                setRetweetActive={setRetweetActive} 
                                setToastAlert={setToastAlert}
                                setToastText={setToastText}
                                onRetweetModalToggle={onRetweetModalToggle}
                                messages={messages}
                            />
    
                        </div>
                    </div>
                </div>
                </>
            )}
        </>
    );
}

export default Tweet;