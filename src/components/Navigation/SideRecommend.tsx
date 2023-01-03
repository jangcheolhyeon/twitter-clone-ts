import arrayShuffle from 'array-shuffle';
import React, { useEffect, useState } from 'react';
import { IUserObj, IUsersProfile, IUsersProfiles, TCurrentPage, TRandomUsersProfiles } from '../AppRouter';
import RecommendFriend from './RecommendFriend';


interface SideRecommendProp{
    userObj : IUserObj;
    usersProfile : IUsersProfiles;
    currentUser : IUsersProfile;
    randomUsersProfile : TRandomUsersProfiles;
}


const SideRecommend = ({ usersProfile, userObj, currentUser, randomUsersProfile } : SideRecommendProp) => {

    return(
        <div className="recommend_container">
            <div className="recommend_container_content">
                <div className="recommend_header_container">
                    <h3>Who to follow</h3>
                </div>

                <ul className="recommend_list">
                    <>
                        {randomUsersProfile.length !== 0 ? (
                            <>
                                {randomUsersProfile.map((element) => {
                                    return(
                                        <RecommendFriend 
                                            key={element.userId} user={element} currentUser={currentUser} usersProfile={usersProfile} userObj={userObj} emailHoverState={false}
                                        />
                                    );
                                })}
                            </>
                        ) : (
                            <>
                            </>
                        )}

                    </>
                </ul>
            </div>
        </div>
    )
}

export default SideRecommend;