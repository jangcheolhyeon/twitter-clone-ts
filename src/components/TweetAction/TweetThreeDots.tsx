import React, { useEffect, useRef, useState } from "react";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ITweetMessage, IUsersProfile } from "../AppRouter";
import { db } from "../../fbase";
import { doc, updateDoc } from "firebase/firestore";
import useOutSideClick from "../../hooks/useOutSideClick";


interface TweetThreeDotsProp{
    isOwner : boolean;
    currentUser : IUsersProfile;
    tictoc : ITweetMessage;
}

const TweetThreeDots = ({ isOwner, currentUser, tictoc } : TweetThreeDotsProp) => {
    const [threedotsHover, setThreedotsHover] = useState<boolean>(false);
    const [threedotsActive, setThreedotsActive] = useState<boolean>(false);
    const dotsRef = useRef<any>();


    const onThreedotsToggle = (event : React.MouseEvent<SVGSVGElement>) => {
        event.stopPropagation();
        setThreedotsActive((prev) => !prev);
    }

    const threedotsOutSide = (event : any) => {
        if(threedotsActive && !event.path.includes(dotsRef.current)){
            onThreedotsToggle(event);
        }
    }

    //삼항 연산자로 string은 const로 
    const handlePinActive = async() => {
        if(currentUser.pin === tictoc.id){
            await updateDoc(doc(db, "usersInfo", `${currentUser.id}`), {
                pin : ""
            });            
        }
        else{
            await updateDoc(doc(db, "usersInfo", `${currentUser.id}`), {
                pin : tictoc.id
            });
        }

    }

    useOutSideClick(threedotsActive, threedotsOutSide);


    // useEffect(() => {
    //     document.addEventListener("mousedown", threedotsOutSide);
    //     return () => {
    //         document.removeEventListener("mousedown", threedotsOutSide);
    //     }
    // }, [threedotsActive])

    return(
        <>
            <FontAwesomeIcon icon={faEllipsis} className='three-dots-icon'
                onMouseOver={() => { setThreedotsHover(true) }}
                onMouseOut={() => { setThreedotsHover(false) }}
                onClick={onThreedotsToggle}
                ref={dotsRef}
            />

            {threedotsHover && 
                (
                    <div className="action_hover">
                        more
                    </div>
                )
            }

            {threedotsActive && 
                (
                    <div className="tictoc_active_box threedots_active_container" >
                        <ul>
                            {isOwner ? 
                                (
                                    <>
                                        <li onMouseDown={handlePinActive}>Pin to your profile</li>
                                        <li>change who can reply</li>
                                    </>
                                )
                                :
                                (<>
                                    <li>Follow</li>
                                    <li>Block</li>
                                    <li>Mute</li>
                                </>)
                            }
                        </ul>
                    </div>
                )
            }
        </>
    );
}

export default TweetThreeDots;