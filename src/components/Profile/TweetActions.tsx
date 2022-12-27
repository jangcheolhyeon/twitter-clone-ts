import React from "react";
import { ITweetMessage, ITweetMessages, IUserObj, TSetToastAlert, TSetToastText } from "../AppRouter";
import { TOnReplyModalToggle, TOnRetweetModalToggle, TRetweetActive, TRetweetHover, TSetRetweetActive, TSetRetweetHover } from "../Tweet";
import TweetActionLike from "../TweetAction/TweetActionLike";
import TweetActionReply from "../TweetAction/TweetActionReply";
import TweetActionRetweet from "../TweetAction/TweetActionRetweet";
import TweetActionShare from "../TweetAction/TweetActionShare";

interface TweetActionsProp{
    tictoc : ITweetMessage;
    userObj : IUserObj;
    onReplyModalToggle : TOnReplyModalToggle;
    retweetHover : TRetweetHover;
    setRetweetHover : TSetRetweetHover;
    retweetActive : TRetweetActive;
    setRetweetActive : TSetRetweetActive;
    setToastAlert : TSetToastAlert;
    setToastText : TSetToastText;
    onRetweetModalToggle : TOnRetweetModalToggle;
    messages : ITweetMessages;
}

const TweetActions = ({ tictoc, messages, userObj, onReplyModalToggle, retweetHover, setRetweetHover, retweetActive, setRetweetActive, onRetweetModalToggle, setToastAlert, setToastText }: TweetActionsProp) => {
    return(
        <>
            <TweetActionReply tictoc={tictoc} messages={messages} onReplyModalToggle={onReplyModalToggle} />
            <TweetActionRetweet tictoc={tictoc} userObj={userObj} retweetHover={retweetHover} setRetweetHover={setRetweetHover} retweetActive={retweetActive} setRetweetActive={setRetweetActive} onRetweetModalToggle={onRetweetModalToggle} setToastAlert={setToastAlert} setToastText={setToastText} /> 
            <TweetActionLike tictoc={tictoc} userObj={userObj} setToastAlert={setToastAlert} setToastText={setToastText} />
            <TweetActionShare />
        </>
    );
}



export default TweetActions;