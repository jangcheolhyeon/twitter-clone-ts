import { faRetweet } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { db } from '../../fbase';
import { ITweetMessage, IUserObj, TSetToastAlert, TSetToastText } from '../AppRouter';
import { TOnRetweetModalToggle, TRetweetActive, TRetweetHover, TSetRetweetActive, TSetRetweetHover } from '../Tweet';


interface TweetActionRetweetProp{
    tictoc: ITweetMessage;
    userObj : IUserObj;
    retweetHover : TRetweetHover;
    setRetweetHover : TSetRetweetHover;
    retweetActive : TRetweetActive;
    setRetweetActive : TSetRetweetActive;
    onRetweetModalToggle : TOnRetweetModalToggle;
    setToastAlert : TSetToastAlert;
    setToastText : TSetToastText;
}

const TweetActionRetweet = ({ tictoc, userObj, retweetHover, setRetweetHover, retweetActive, setRetweetActive, onRetweetModalToggle, setToastAlert, setToastText} : TweetActionRetweetProp) => {
    const retweetRef = useRef<any>();
    const [replyState, setReplyState] = useState<boolean>(false);

    useEffect(() => {
        setReplyState(replyStateInit());
    }, [])

    useEffect(() => {
        document.addEventListener("mousedown", reTweetOutSide);
        return () => {
            document.removeEventListener("mousedown", reTweetOutSide);
        }
    }, [retweetActive])

    const onRetweetToggle = (event : React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        setRetweetHover(false);
        setRetweetActive((prev) => !prev);
    }

    const reTweetOutSide = (event : any) => {
        if(retweetActive && !event.path.includes(retweetRef.current)){
            onRetweetToggle(event);
        }
    }

    const replyStateInit = () => {
        if(tictoc.reply_users.includes(userObj!.uid)){
            return true;
        }

        return false;
    }

    const onClickReply = async(event : React.MouseEvent<HTMLLIElement>) => {
        event.stopPropagation();

        
        if(replyState){
            await updateDoc(doc(db, "tictoc", `${tictoc.id}`), {
                reply_users : tictoc.reply_users.filter((element : string) => { return element !== userObj?.uid})
            })

            setReplyState((prev) => {
                return !prev;
            })
            
        } else {
            await updateDoc(doc(db, "tictoc", `${tictoc.id}`), {
                reply_users : [...tictoc.reply_users, userObj?.uid]
            })

            setReplyState((prev) => {
                return !prev;
            })
            
            setToastAlert(true);
            setToastText('Keep it up! Retweet suceess!');
        }
    }

    return(
        <>
            <div className="action_retweet_container" ref={retweetRef} onClick={onRetweetToggle}
                onMouseOver={() => { setRetweetHover(true) }}
                onMouseOut={() => { setRetweetHover(false) }}
            >
                {retweetHover ? (
                    <FontAwesomeIcon icon={faRetweet} className={replyState ? "icons retweet_hover" : "icons retweet_hover"}/>
                ) : (
                    <>
                    {replyState ? (
                            <FontAwesomeIcon icon={faRetweet} className={replyState ? "icons retweet_hover retweet_state" : "icons retweet_state" } />
                        ) : (
                            <FontAwesomeIcon icon={faRetweet} className={replyState ? "icons retweet_hover" : "icons" } />
                        )}
                    </>
                )}

                <span className={replyState ? "retweet_state_num" : ''}>{tictoc.reply_users.length}</span>

                {retweetHover &&
                    (
                        <div className="action_hover"> 
                            {replyState ? "undo retweet" : "retweet"}
                        </div>
                    )
                }

                {retweetActive && (
                    <div className="tictoc_active_box">
                        <ul>
                            {replyState ? (
                                <li onMouseDown={onClickReply}
                                >Undo Retweet</li>
                            ) : (
                                <li onMouseDown={onClickReply}
                                >Retweet</li>
                            )}
                            <li onClick={onRetweetModalToggle}>Quote Tweet</li>
                        </ul>
                    </div>
                )}
            </div>
        </>
    )
}

export default TweetActionRetweet;