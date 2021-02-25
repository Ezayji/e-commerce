import './Billing.css';
import React, { useState, useEffect } from 'react';

const Billing = ({ onNext, address }) => {
    
    const [ap, setAp] = useState('');
    const [strt, setStrt] = useState('');
    const [cty, setCty] = useState('');
    const [prvnc, setPrvnc] = useState('');
    const [zp, setZp] = useState('');
    const [cntry, setCntry] = useState('');
    const [adrInfo, setAdrInfo] = useState('');

    const setExistingAdr = () => {
        setAp(address.appartment_nr);
        setStrt(address.street);
        setCty(address.city);
        setPrvnc(address.province);
        setZp(address.zip);
        setCntry(address.country);
    };

    const resetAdr = () => {
        setAp('');
        setStrt('');
        setCty('');
        setPrvnc('');
        setZp('');
        setCntry('');
    };

    let adrInfoSelect;

    useEffect(() => {
        if(address !== ''){
            setExistingAdr();
            //setAdrInfo('Existing');
            adrInfoSelect = (
                <div>
                    <input type='checkbox' onChange={(e) => {
                        if(e.target.checked){
                            setAdrInfo('Existing');
                            setExistingAdr();
                        } else {
                            setAdrInfo('Other');
                            resetAdr();
                        };
                    }} />Use existing address
                </div>
            );
        } else {
            adrInfoSelect = (
                <div>
                    <input type='checkbox' onChange={(e) => {
                        if(e.target.checked){
                            setAdrInfo('Save');
                        } else {
                            setAdrInfo('Temp');
                        };
                    }} />Save address
                </div>
            );
        };
    }, []);

    const checkAdrStatus = () => {
        if(adrInfo === 'Existing'){
            setAdrInfo('Other');
        };
    };

    const next = (e) => {
        e.preventDefault();
        const info = {
            appartment_nr: ap,
            street: strt,
            city: cty,
            province: prvnc,
            zip: zp,
            country: cntry,
            status: adrInfo
        };
        onNext(info);
    };
    
    return(
        <form onSubmit={next} >
            <div>
                <h2>BILLING</h2>
                <p>* we will use your saved name, email and phone</p>
                <p>* shipping is free</p>
                <div>
                    <input type='text' value={strt} placeholder='STREET' onChange={(e) => {
                        checkAdrStatus();
                        setStrt(e.target.value);
                    }} required />
                    <input type='text' value={ap} placeholder='APPARTMENT' onChange={(e) => {
                        checkAdrStatus();
                        setAp(e.target.value);
                    }} required />
                </div>

                <div>
                    <input type='text' value={cty} placeholder='CITY' onChange={(e) => {
                        checkAdrStatus();
                        setCty(e.target.value);
                    }} required />
                    <input type='text' value={zp} placeholder='ZIP' onChange={(e) => {
                        checkAdrStatus();
                        setZp(e.target.value);
                    }} required />
                </div>

                <div>
                    <input type='text' value={prvnc} placeholder='PROVINCE' onChange={(e) => {
                        checkAdrStatus();
                        setPrvnc(e.target.value);
                    }} required />
                    <input type='text' value={cntry} placeholder='COUNTRY' onChange={(e) => {
                        checkAdrStatus();
                        setCntry(e.target.value);
                    }} required />
                </div>
                {adrInfoSelect}
            </div>
            <button type='submit' >NEXT</button>
        </form>
    );
};

/* 
<div>
                    <input type='text' placeholder='FIRST NAME' required />
                    <input type='text' placeholder='LAST NAME' required />
                </div>

                <input type='text' placeholder='EMAIL' required />
*/

export default Billing;