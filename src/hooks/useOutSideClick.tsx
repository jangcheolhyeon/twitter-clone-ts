import React, { useEffect } from 'react';


// const useOutSideClick = ( dep : boolean, outSideFunc : any) => {
const useOutSideClick = (dep : boolean, outSideFunc : any) => { 
    useEffect(() => {
        document.addEventListener("mousedown", outSideFunc);

        return () => {
            document.removeEventListener("mousedown", outSideFunc);
        }
    }, [dep]);



}

export default useOutSideClick;