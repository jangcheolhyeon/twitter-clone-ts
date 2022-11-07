import { getAuth, signOut, updateProfile } from 'firebase/auth';
import React, { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { authService, db } from '../fbase';

interface IProfile{
    userObj : any,
    refreshUserObj : () => void,
}

const Profile = ({ userObj, refreshUserObj } : IProfile) => {
    const [newDisplayName, setNewDisplayName] = useState<string>(userObj.displayName);
    const auth = getAuth();
    const navi = useNavigate();
    const onLogout = () => {
        signOut(auth);
        navi('/');
    }


    const getMyTwits = async () => {
        // db에 컬렉션이 tictoc에 userId가 userObj.uid와 일치하면 createdAt 내림차순으로 쿼리 가져오기
        const q = query(
            collection(db, "tictoc"),
            where("userId", "==", userObj.uid),
            orderBy("createdAt", "desc")
        );
        
        // getDocs()메서드로 쿼리 결과 값 가져오기
        await getDocs(q);
        // const querySnapshot = await getDocs(q);
        // querySnapshot.forEach((doc) => {
            // console.log(doc.id, " = " , doc.data());
        // });
    };

    const onDisplayNameClick = async(event : FormEvent) => {
        event.preventDefault();
        //다르면 업데이트
        if(newDisplayName !== userObj.displayName){
            const authUser : any = authService.currentUser;
            await updateProfile(authUser, {displayName: newDisplayName});
            refreshUserObj();
        }
    }

    const onChangeDisplayName = (event : React.ChangeEvent<HTMLInputElement>) => {
        const {target : {value}} = event;
        setNewDisplayName(value);
    }
        
    // React Hook useEffect has missing dependencies 경고는 useEffect 안에 state를 넣어줘야 되는데 그냥 쓰고싶을땐 ??
    useEffect(() => {
        getMyTwits();
        localLoginProfile();
    }, []);

    // OAuth대신 로그인 하면 displayName이 안나옴. 그래서 email의 @기준으로 앞 부분을 displayNAme으로 설정
    function localLoginProfile(){   
        if(userObj.displayName === null){
            userObj.displayName = userObj.email.split('@')[0];
        }
    }

    return(
        <div className='container'>
            <form onSubmit={onDisplayNameClick} className='profileForm' >
                <input type="text" placeholder="Display Name" value={newDisplayName} onChange={onChangeDisplayName} className='formInput' />
                <button className='formBtn' style={{ marginTop:10 }} >update profile</button>
            </form>
            <button onClick={onLogout} className='formBtn cancelBtn logOut' >logout</button>
        </div>
    );
}

export default Profile;