import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { v4 } from 'uuid';
import { authService, db, storageService } from '../../fbase';
import { TNewDisplayName, TSetNewDisplayANme, TSetUserBackgroundAttachment, TUserBackgroundAttachment } from '../../Routers/Profile';
import { TUserObj, IUsersProfile, IUsersProfiles, TRefreshUserObj, TSetUsersProfile, IUserObj } from '../AppRouter';
import ModalUpdateProfile from './ModalUpdateProfile';


interface UpdateUserProfileProp{
    userObj : IUserObj;
    usersProfile : IUsersProfiles;
    setUsersProfile : TSetUsersProfile;
    userBackgroundAttachment : TUserBackgroundAttachment;
    setUserBackgroundAttachment : TSetUserBackgroundAttachment;
    setChangedUserBackgroundAttachment : TSetUserBackgroundAttachment;
    newDisplayName : TNewDisplayName;
    setNewDisplayName : TSetNewDisplayANme;
    refreshUserObj : TRefreshUserObj;
    currentUser : IUsersProfile;
}

export type TUserAttachment = string | null | undefined;
export type TOnUserAttachment = (event : React.ChangeEvent<HTMLInputElement>) => void;
export type TOnUserBackgroundAttachment = (event: React.ChangeEvent<HTMLInputElement>) => void;
export type TOnChangeDisplayName = (event : React.ChangeEvent<HTMLInputElement>) => void;
export type TOnChangeUserProfile = (event : React.MouseEvent<HTMLElement>) => void;
export type TSetModalOpen = React.Dispatch<React.SetStateAction<boolean>>;


const UpdateUserProfile = ({ userObj, usersProfile, setUsersProfile, currentUser, userBackgroundAttachment, setUserBackgroundAttachment, setChangedUserBackgroundAttachment, newDisplayName, setNewDisplayName, refreshUserObj } : UpdateUserProfileProp) => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [userAttachment, setUserAttachment] = useState<TUserAttachment>(userObj?.photoURL);


    useEffect(() => {
        if(userObj?.photoURL !== '' || userObj.photoURL !== null){
            setUserAttachment(userObj?.photoURL);
        }
        
        if(currentUser.backgroundImg !== null){
            setUserBackgroundAttachment(currentUser.backgroundImg);
            setChangedUserBackgroundAttachment(currentUser.backgroundImg);
        }
    }, [])

    useEffect(() => {
        const newUsersProfile = usersProfile.map(element => {
            if(element.userId === userObj?.uid){
                return {...element, displayName : userObj?.displayName}
            } else{
                return element;
            }
        })
        setUsersProfile(newUsersProfile);
    }, [modalOpen])

    const handleUpdateProfile = () => {
        setModalOpen((prev) => !prev);
    }

    const onChangeDisplayName = async(event : React.ChangeEvent<HTMLInputElement>) => {
        const {target : {value}} = event;
        setNewDisplayName(value);

    }

    const onUserAttachment = (event : React.ChangeEvent<HTMLInputElement>) => {
        const {target : { files }} = event;
        
        if(files !== null){
            const theFile = files[0];
            const reader = new FileReader();
            reader.onloadend = (finishedEvent) => {
                const {currentTarget : {result}} : any = finishedEvent;
                setUserAttachment(result);
            }
            reader.readAsDataURL(theFile);
        }
    }

    const onUserBackgroundAttachment = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {target : {files}} = event;
        
        if(files !== null){
            const theFile = files[0];
            const reader = new FileReader();
            reader.onloadend = (finishedEvent) => {
                const {currentTarget : {result}} : any = finishedEvent;
                setUserBackgroundAttachment(result);
            }
            reader.readAsDataURL(theFile);
        }
    }


    
    const onChangeUserProfile = async(event : React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        onUpdateUserImg();
        onUpdateUserBackground();
        if(authService.currentUser !== null){
            await updateProfile(authService.currentUser, {displayName: newDisplayName});
            
            await updateDoc(doc(db, 'usersInfo', `${currentUser.id}`), {
                displayName : userObj?.displayName
            })
                        
            refreshUserObj();
        }
        setModalOpen((prev) => !prev);
    }

    const onUpdateUserImg = async() => {
        let attachmentUrl = "";

        if(userAttachment !== undefined && userAttachment !== null){
            const attachmentRef = ref(storageService, `${userObj?.uid}/${v4()}`);
            const response = await uploadString(attachmentRef, userAttachment, "data_url" );
            attachmentUrl = await getDownloadURL(response.ref);
        }


        if(userAttachment !== userObj?.photoURL){
            if(authService.currentUser !== null){
                await updateProfile(authService.currentUser, {photoURL: attachmentUrl});
                await updateDoc(doc(db, 'usersInfo', `${currentUser.id}`), {
                    userImage : attachmentUrl,
                });
                refreshUserObj();
            }
        }
    }



    const onUpdateUserBackground = async() => {
        let backAttachmentUrl = "";

        if(userBackgroundAttachment !== undefined){
            const backAttachmentRef = ref(storageService, `${userObj?.uid}/${v4()}`);
            const backResponse = await uploadString(backAttachmentRef, userBackgroundAttachment, "data_url" );
            backAttachmentUrl = await getDownloadURL(backResponse.ref);
        }


        if(userBackgroundAttachment !== currentUser.backgroundImg){
            if(authService.currentUser !== null ){
                    await updateDoc(doc(db, 'usersInfo', `${currentUser.id}`), {
                    backgroundImg : backAttachmentUrl,
                });
                refreshUserObj();
            }
        }
        setChangedUserBackgroundAttachment(userBackgroundAttachment);
    }
    
    return(
        <>
            { modalOpen && <ModalUpdateProfile userAttachment={userAttachment} onUserAttachment={onUserAttachment} onUserBackgroundAttachment={onUserBackgroundAttachment} newDisplayName={newDisplayName} onChangeDisplayName={onChangeDisplayName} onChangeUserProfile={onChangeUserProfile} setModalOpen={setModalOpen} userBackgroundAttachment={userBackgroundAttachment} />}
            <button onClick={handleUpdateProfile}>Set up profile</button>
        </>
    );

}

export default UpdateUserProfile;