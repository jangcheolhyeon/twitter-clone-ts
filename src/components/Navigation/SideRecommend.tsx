import React from 'react';
import { IUserObj, IUsersProfile, IUsersProfiles } from '../AppRouter';
import RecommendFriend from './RecommendFriend';


interface SideRecommendProp{
    userObj : IUserObj;
    usersProfile : IUsersProfiles;
    currentUser : IUsersProfile;
}


const SideRecommend = ({ usersProfile, userObj, currentUser } : SideRecommendProp) => {
    return(
        <div className="recommend_container">
            <div className="recommend_container_content">
                <div className="recommend_header_container">
                    <h3>Who to follow</h3>
                </div>

                <ul className="recommend_list">
                    {usersProfile.filter(element => element.userId !== userObj?.uid).map((element) => {
                        return(
                            <RecommendFriend 
                                key={element.userId} user={element} currentUser={currentUser} usersProfile={usersProfile} userObj={userObj} emailHoverState={false}
                            />
                        );
                    })}
                </ul>
            </div>
        </div>
    )
}

export default SideRecommend;