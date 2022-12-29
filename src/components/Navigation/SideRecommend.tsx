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
    // const [randomUsersProfile, setRandomUsersProfile] = useState<IUsersProfiles>([]);


    // const shuffleArray = (usersProfile : IUsersProfiles, number : number) => {
    //     let newShuffledArray = [];
        
    //     for(let i=0;i<usersProfile.length;i++){
    //         newShuffledArray[i] = i;
    //     }
        
    //     return (arrayShuffle(newShuffledArray).slice(0, number));
    // }


    // useEffect(() => {
    //     const usersProfileWithoutMe : IUsersProfiles = usersProfile.filter((element) => {
    //         return element.userId !== userObj?.uid;
    //     });

    //     const randomNumberArray = shuffleArray(usersProfileWithoutMe, 3);        

    //     const filteredUsersProfile = randomNumberArray.map(element => {
    //         return usersProfileWithoutMe[element];
    //     })

    //     setRandomUsersProfile(filteredUsersProfile);
    // }, [currentPage])


    return(
        <div className="recommend_container">
            <div className="recommend_container_content">
                <div className="recommend_header_container">
                    <h3>Who to follow</h3>
                </div>

                <ul className="recommend_list">
                    {/* {usersProfile.filter(element => element.userId !== userObj?.uid).map((element) => {
                        return(
                            <RecommendFriend 
                                key={element.userId} user={element} currentUser={currentUser} usersProfile={usersProfile} userObj={userObj} emailHoverState={false}
                            />
                        );
                    })} */}
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