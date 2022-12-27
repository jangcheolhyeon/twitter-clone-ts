import React, { useEffect, useState } from "react";
import { TNewDisplayName, TUserBackgroundAttachment } from "../../Routers/Profile";
import UpdateUserInfoPage1 from "./UpdateUserInfoModalPages/UpdateUserInfoPage1";
import UpdateUserInfoPage2 from "./UpdateUserInfoModalPages/UpdateUserInfoPage2";
import UpdateUserInfoPage3 from "./UpdateUserInfoModalPages/UpdateUserInfoPage3";
import { TOnChangeDisplayName, TOnChangeUserProfile, TOnUserAttachment, TOnUserBackgroundAttachment, TSetModalOpen, TUserAttachment } from "./UpdateUserProfile";

interface ModalUpdateProfileProp{
    userAttachment : TUserAttachment;
    onUserAttachment : TOnUserAttachment;
    onUserBackgroundAttachment : TOnUserBackgroundAttachment;
    newDisplayName : TNewDisplayName;
    onChangeDisplayName : TOnChangeDisplayName;
    onChangeUserProfile : TOnChangeUserProfile;
    setModalOpen : TSetModalOpen;
    userBackgroundAttachment : TUserBackgroundAttachment;
}

export type TCameraHover = boolean;
export type TSetCameraHover = React.Dispatch<React.SetStateAction<TCameraHover>>;
export type TBackgroundIconHover = boolean;
export type TSetBackgroundIconHover = React.Dispatch<React.SetStateAction<TBackgroundIconHover>>;
export type TCurrentPageIndex = string;
export type TSetCurrentPageIndex = React.Dispatch<React.SetStateAction<TCurrentPageIndex>>;

const ModalUpdateProfile = ({ userAttachment, onUserAttachment, onUserBackgroundAttachment, newDisplayName, onChangeDisplayName, onChangeUserProfile, setModalOpen, userBackgroundAttachment, } : ModalUpdateProfileProp) => {
    const [cameraHover, setCameraHover] = useState<TCameraHover>(false);
    const [backgroundIconHover, setBackgroundIconHover] = useState<TBackgroundIconHover>(false);
    const pageIndex = ['page1', 'page2', 'page3'];
    const [currentPageIndex, setCurrentPageIndex] = useState<TCurrentPageIndex>(pageIndex[0]);


    useEffect(() => {
        document.body.style.overflow = "hidden";

        return() => {
            document.body.style.overflow = 'auto';
        }
    }, [])

    return(
        <div className="modal_update_profile_background">
            <div className="modal_update_profile_container">
                {currentPageIndex === 'page1' && (
                    <UpdateUserInfoPage1 
                        setModalOpen={setModalOpen}
                        userAttachment={userAttachment}
                        cameraHover={cameraHover}
                        setCameraHover={setCameraHover}
                        onUserAttachment={onUserAttachment}
                        setCurrentPageIndex={setCurrentPageIndex}
                    />
                )}
                
                {currentPageIndex === 'page2' && (
                    <UpdateUserInfoPage2 
                        setCurrentPageIndex={setCurrentPageIndex}
                        userBackgroundAttachment={userBackgroundAttachment}
                        setBackgroundIconHover={setBackgroundIconHover}
                        onUserBackgroundAttachment={onUserBackgroundAttachment}
                        backgroundIconHover={backgroundIconHover}
                    />
                )}

                {currentPageIndex === 'page3' && (
                    <UpdateUserInfoPage3 
                        setCurrentPageIndex={setCurrentPageIndex}
                        newDisplayName={newDisplayName}
                        onChangeDisplayName={onChangeDisplayName}
                        onChangeUserProfile={onChangeUserProfile}
                    />
                )}

            </div>
        </div>
    )
}

export default ModalUpdateProfile;