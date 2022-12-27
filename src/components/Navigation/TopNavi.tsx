import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom";
import { IUserObj } from '../AppRouter';

interface TopNaviProp {
    currentPage : string;
    userObj : IUserObj;
}


const TopNavi = ({ currentPage, userObj }:TopNaviProp) => {
    const navigate = useNavigate();
    const handlePreviousPage = () => {
        navigate(-1);
    }

    return(
        <>
            {currentPage === "home" &&
                <div className="top_container">
                    <div className="show_current_page">
                        <span>HOME</span>
                    </div>
                </div>
            }

            {currentPage === 'profile' && 
                <div className="top_container">
                    <div className="show_current_page">
                        <FontAwesomeIcon icon={faArrowLeft} onClick={handlePreviousPage} />
                        <span>{userObj?.displayName}</span>
                    </div>
                </div>        
            }

            {currentPage === 'details' &&
                <div className="top_container">
                    <div className="show_current_page">
                        <FontAwesomeIcon icon={faArrowLeft} onClick={handlePreviousPage} />
                        <span>Tweet</span>
                    </div>
                </div>
            }

            {currentPage === 'detailsParent' &&
                <div className="top_container">
                    <div className="show_current_page">
                        <FontAwesomeIcon icon={faArrowLeft} onClick={handlePreviousPage} />
                        <span>Tweet</span>
                    </div>
                </div>
            }
        </>
    )
}

export default TopNavi;