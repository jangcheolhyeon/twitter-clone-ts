import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

interface ITweetModalFooter{
    onFileChange : (event : React.ChangeEvent<HTMLInputElement>) => void;
    onTweetBtn : () => void;
    division : string;
}

const TweetModalFooter = ({ onFileChange, onTweetBtn, division }: ITweetModalFooter) => {
    return(
        <>
            <div className="tweet_modal_container_footer">
                    <label htmlFor={division}>
                        <FontAwesomeIcon icon={faImage} />
                    </label>
                    <input type="file" id={division} accept="image/*" onChange={onFileChange} />

                    <button onClick={onTweetBtn}>Tweet</button>
                </div>  
        </>
    );
}

export default TweetModalFooter;