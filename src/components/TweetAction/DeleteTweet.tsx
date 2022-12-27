import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { ITweetMessage, TSetCurrentPage, TSetToastAlert, TSetToastText } from "../AppRouter";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { db, storageService } from "../../fbase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { isUndefined } from "util";


interface DeleteTweetProp{
    tictoc : ITweetMessage;
    setToastAlert : TSetToastAlert;
    setToastText : TSetToastText;
    setCurrentPage? : TSetCurrentPage;
}

export type TOnDeleteTweet = (event : React.MouseEvent<HTMLButtonElement>) => void;
export type TOnDeleteModalCancel = (event : React.MouseEvent<HTMLButtonElement>) => void;

const DeleteTweet = ({ tictoc, setToastAlert, setToastText, setCurrentPage } : DeleteTweetProp) => {
    const [xMarkHover, setXMarkHover] = useState<boolean>(false);
    const [deleteModal, setDeleteModal] = useState<boolean>(false);

    const navi = useNavigate();

    const onDeleteModalCancel = (event : React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setDeleteModal(false);
    }  

    const onDeleteModal = (event : React.MouseEvent<SVGSVGElement>) => {
        event.stopPropagation();
        setDeleteModal(true);
    }

    const onDeleteTweet = async(event : React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setToastAlert(true);
        setToastText('Your Tweet was Deleted');

        window.scrollTo({top:0, behavior:'smooth'});
        if(setCurrentPage !== undefined){
            setCurrentPage("home");
            navi('/');
        }
        
        await deleteDoc(doc(db, "tictoc", `${tictoc.id}`));
        if(tictoc.attachmentUrl !== null || tictoc.attachmentUrl !== ""){
            await deleteObject(ref(storageService, `${tictoc.attachmentUrl}`));
        }
    }

    return(
        <>
        {deleteModal && <DeleteConfirmModal onDeleteTweet={onDeleteTweet} onDeleteModalCancel={onDeleteModalCancel} />}
            <>
                <FontAwesomeIcon icon={faXmark} 
                    onMouseOver={() => { setXMarkHover(true) }}
                    onMouseOut={() => { setXMarkHover(false) }}
                    onClick={onDeleteModal}
                    className="x_mark_icon"
                />
                {xMarkHover && 
                    (
                        <div className="action_hover"> 
                            remove
                        </div>
                    )
                }
            </>
        </>
    );
}

export default DeleteTweet;