import './Address.css';

import React, { useEffect, useState } from 'react';

const AdrUpdateForm = ({
                        ap,
                        strt,
                        cty,
                        prvnc,
                        zp,
                        cntry,
                        onCancel,
                        onSubmit,
                        setAp,
                        setStrt,
                        setCty,
                        setPrvnc,
                        setZp,
                        setCntry 
}) => {
    
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        if(ap === '' && strt === '' && cty === '' && prvnc === '' && zp === '' && cntry === ''){
            setDisabled(true);
        }
    }, []);

    let note;

    if(ap === '' && strt === '' && cty === '' && prvnc === '' && zp === '' && cntry === ''){
        note = <p className='no-address' >* No Address Added *</p>
    } else {
        note = null;
    }

    return(
    <form data-testid='address-edit-form' onSubmit={onSubmit} className='address' >
        <h2>ADDRSS</h2>
        {note}
        <div className='adr-value' >
            <p>APPRTMNT:</p>
            <input data-testid='appartment-field' type='text' value={ap} placeholder='APPARTMENT' onChange={(e) => setAp(e.target.value)} required />
        </div>
        <div className='adr-value' >
            <p>STRT:</p>
            <input data-testid='street-field' type='text' value={strt} placeholder='STREET' onChange={(e) => setStrt(e.target.value)} required />
        </div>
        <div className='adr-value' >
            <p>CTY:</p>
            <input data-testid='city-field' type='text' value={cty} placeholder='CITY' onChange={(e) => setCty(e.target.value)} required />
        </div>
        <div className='adr-value' >
            <p>PRVNCE:</p>
            <input data-testid='province-field' type='text' value={prvnc} placeholder='PROVINCE' onChange={(e) => setPrvnc(e.target.value)} required />
        </div>
        <div className='adr-value' >
            <p>ZP:</p>
            <input data-testid='zip-field' type='text' value={zp} placeholder='ZIP' onChange={(e) => setZp(e.target.value)} required />
        </div>
        <div className='adr-value' >
            <p>CNTRY:</p>
            <input data-testid='country-field' type='text' value={cntry} placeholder='COUNTRY' onChange={(e) => setCntry(e.target.value)} required />
        </div>
        <div className='info-buttons' >
            <input data-testid='address-edit-submit' className='info-submit' type='submit' value='SBMT' />
            <button data-testid='address-edit-cancel' disabled={disabled} type='button' className='adr-cancel' onClick={onCancel} >CNCL</button>
        </div>
    </form>
    );
};

export default AdrUpdateForm;