import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect, useRef } from 'react';

const TweetActionShare = () => {
    const [shareHover, setShareHover] = useState<boolean>(false);
    const [shareActive, setShareActive] = useState<boolean>(false);
    const shareRef = useRef<any>();


    useEffect(() => {
        document.addEventListener("mousedown", shareOutSide);
        return () => {
            document.removeEventListener("mousedown", shareOutSide);
        }
    }, [shareActive])
    
    const onShareToggle = (event : React.MouseEvent<SVGSVGElement>) => {
        event.stopPropagation();
        setShareActive((prev) => !prev);
    }

    const shareOutSide = (event : any) => {
        if(shareActive && !event.path.includes(shareRef.current)){
            onShareToggle(event);
        }
    }

    return(
        <>
            <div className="action_share_container"
                onMouseOver={() => { setShareHover(true) }}
                onMouseOut={() => { setShareHover(false) }}
            >
                {shareHover ? (
                    <FontAwesomeIcon icon={faArrowUpFromBracket} className="icons share_icon share_hover" ref={shareRef} onClick={onShareToggle}/>
                ) : (
                    <FontAwesomeIcon icon={faArrowUpFromBracket} className="icons share_icon" ref={shareRef} onClick={onShareToggle}/>
                )}

                {shareHover && (
                    <div className="action_hover">
                        share
                    </div>
                )}

                {shareActive && (
                    <div className="tictoc_active_box">
                        <ul>
                            <li>Copy link to Tweet</li>
                            <li>share Tweet</li>
                            <li>BookMark</li>
                        </ul>
                    </div>
                )}
            </div>
        </>
    );
}

export default TweetActionShare