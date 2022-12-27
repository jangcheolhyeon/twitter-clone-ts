import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { db } from '../../fbase';
import { ITweetMessage, IUserObj, TSetToastAlert, TSetToastText } from '../AppRouter';

interface TweetActionLikeProp {
    tictoc : ITweetMessage;
    userObj : IUserObj;
    setToastAlert : TSetToastAlert;
    setToastText : TSetToastText;
}

const TweetActionLike = ({ tictoc, userObj, setToastAlert, setToastText } : TweetActionLikeProp) => {
    const [likeHover, setLikeHover] = useState<boolean>(false);
    const [likeCount, setLikeCount] = useState<number>(0);
    const [likeState, setLikeState] = useState<boolean>(false);

    useEffect(() => {
        setLikeState(likeStateInit());
        setLikeCount(tictoc.like_users.length);
    }, [])

    const onClickLike = async(event : React.MouseEvent<SVGSVGElement>) => {
        event.stopPropagation();

        if(likeState){
            await updateDoc(doc(db, "tictoc", `${tictoc.id}`), {
                like_users : tictoc.like_users.filter((element : string) => element !== userObj?.uid),
            })

            setLikeCount((prev) => {
                return prev - 1;
            })

    
        } else {
            await updateDoc(doc(db, "tictoc", `${tictoc.id}`), {
                like_users : [...tictoc.like_users, userObj?.uid],
            });

            setLikeCount((prev) => {
                return prev + 1;
            })

            setToastAlert(true);
            setToastText('Keep it up! The more Tweets you like, the better your timeline will be.');
        }
        setLikeState((prev) => !prev);
    }

    const likeStateInit = () => {
        if(tictoc.like_users.includes(userObj!.uid)){
            return true;
        }
        
        return false;
    }

    return(
        <>
            <div className="action_like_container"
                onMouseOver={() => { setLikeHover(true) }}
                onMouseOut={() => { setLikeHover(false) }}
            >
                {likeState ? (
                    <>
                        {likeHover ? (
                            <FontAwesomeIcon icon={faHeart} className="icons hearted heart_hover" onClick={onClickLike} />
                        ) : (
                            <FontAwesomeIcon icon={faHeart} className="icons hearted" onClick={onClickLike} />
                        )}
                        <span className="hearted">{likeCount}</span>
                        {likeHover && (
                            <div className="action_hover">
                                UnLike
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        {likeHover ? (
                            <FontAwesomeIcon icon={faHeart} className="icons heart_hover" onClick={onClickLike} />
                        ) : (
                            <FontAwesomeIcon icon={faHeart} className="icons" onClick={onClickLike} />
                        )}
                        <span>{likeCount}</span>
                        {likeHover && (
                            <div className="action_hover">
                                Like
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

export default TweetActionLike;