import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../../fbase';
import { IUserObj, IUsersProfile, IUsersProfiles } from '../AppRouter';
import EmailHoverInTweet from '../TweetAction/EmailHoverInTweet';
import FollowAction from '../TweetAction/FollowAction';

interface RecommendFriendProp{
    user : IUsersProfile | undefined;
    userObj : IUserObj; 
    usersProfile : IUsersProfiles;
    emailHoverState? : boolean;
    currentUser : IUsersProfile;
}

export type TFollowState = boolean;
export type TFollowingHover = boolean;
export type TSetFollowingHover = React.Dispatch<React.SetStateAction<boolean>>;
export type TOnFollowClick = (user : any) => void;

const getUserProfileById = (usersProfile: IUsersProfiles, uid: string) => {
    const filteredUserProfiles = usersProfile.filter(element => element.userId === uid)
    return filteredUserProfiles.length ? filteredUserProfiles[0] : null
}

const RecommendFriend = ({ user, currentUser, userObj, usersProfile, emailHoverState } : RecommendFriendProp) => {
    const [followingHover, setFollowingHover] = useState<TFollowingHover>(false);
    const [followState, setFollowState] = useState<TFollowState>(true);

    // let currentUser : IUsersProfile | null;

    useEffect(() => {
        if(usersProfile === undefined || usersProfile === null || usersProfile.length === 0){
            return;
        }

        getFollowInit();
    }, [])    

    useEffect(() => {
        getFollowInit();
    }, [usersProfile])
        
    const getFollowInit = () => {
        if(!userObj) {
            return
        }

        // const userProfile = getUserProfileById(usersProfile, userObj.uid)


        // if(userProfile && user?.userId){
        //     setFollowState(userProfile.follower.includes(user.userId))
        // }

        if(currentUser && user?.userId){
            setFollowState(currentUser.follower.includes(user.userId))
        }

        // currentUser = getUserProfileById(usersProfile, userObj.uid);
    } 

    const onFollowClick = async(user : IUsersProfile) => {
        setFollowState(prev => !prev);
        // currentUser = usersProfile.filter(element => element.userId === userObj?.uid)[0];

        if(followState){
            await updateDoc(doc(db, "usersInfo", `${currentUser.id}`), {
                follower : currentUser.follower.filter(element => {
                    return element !== user.userId
                })
            });   

            await updateDoc(doc(db, 'usersInfo', `${user.id}`), {
                following : user.following.filter((element : string) => {
                    return element !== currentUser?.userId
                })
            })
                        
        } else{
            await updateDoc(doc(db, 'usersInfo', `${currentUser.id}`), {
                follower : [...currentUser.follower, user.userId],
            });

            await updateDoc(doc(db, 'usersInfo', `${user.id}`), {
                following : [...user.following, currentUser.userId]
            })
        }
    }

    return(
        <li className="recommend_item">
            {emailHoverState ? (
                <EmailHoverInTweet 
                    user={user} 
                    userObj={userObj} 
                    followState={followState} 
                    followingHover={followingHover} 
                    setFollowingHover={setFollowingHover} 
                    onFollowClick={onFollowClick} 
                />
            ) : (
                <>
                    <div className="user_image_container">
                        {user?.userImage ? (
                            <img src={user.userImage} alt="user Image" />
                        ) : (
                            <FontAwesomeIcon icon={faCircleUser} />
                        )}
                    </div>

                    <div className="user_display_name">
                        {user?.displayName ? (
                            <span>{user?.displayName}</span>
                        ) : (
                            <span>{user?.email?.split('@')[0]}</span>
                        )}
                        {/* <span>{user?.displayName}</span> */}
                    </div>
                    
                    {user && <FollowAction user={user} followState={followState} followingHover={followingHover} onFollowClick={onFollowClick} setFollowingHover={setFollowingHover} /> }
                </>
            )}
        </li>
    );
}

export default RecommendFriend;