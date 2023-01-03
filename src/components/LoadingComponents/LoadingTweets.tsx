import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket, faCommentDots, faHeart, faRetweet } from '@fortawesome/free-solid-svg-icons';


const LoadingTweets = () => {
    return(
        <>
            <div style={{height:"185px"}} className="tweet">
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
    )
}

export default LoadingTweets;