import { faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { ITweetMessage, ITweetMessages } from '../AppRouter';
import { TOnReplyModalToggle } from '../Tweet';


interface TweetActionReplyProp{
    tictoc : ITweetMessage;
    messages : ITweetMessages;
    onReplyModalToggle : TOnReplyModalToggle;
}

const TweetActionReply = ({ tictoc, messages, onReplyModalToggle } : TweetActionReplyProp) => {
    const [commentHover, setCommentHover] = useState<boolean>(false);
    const [replyList, setReplyList] = useState<any[]>([]);

    
    useEffect(() => {
        if(messages !== undefined){
            setReplyList(messages.filter((element : ITweetMessage) => {
                return element.child === true;
            }))
        }

    }, [])
    

    return(
        <>
            <div className="action_comment_container" 
                onMouseOver={() => { setCommentHover(true) }}
                onMouseOut={() => { setCommentHover(false) }}
                onClick={onReplyModalToggle}
            >
                {commentHover ? (
                    <FontAwesomeIcon icon={faCommentDots} className="icons comment_dots_hover" />
                ) : (
                    <FontAwesomeIcon icon={faCommentDots} className="icons" />
                )}
                <span>{replyList.filter(element => { return element.parentReplyInfoDetail.id === tictoc.id }).length}</span>
                {commentHover && 
                    (
                        <div className="action_hover"> 
                            Reply
                        </div>
                    )
                }
            </div>
        </>
    );
}

export default TweetActionReply