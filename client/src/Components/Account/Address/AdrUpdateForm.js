import './Address.css';

const AdrUpdateForm = ({ onApChange,
                        onStrtChange,
                        onCtyChange,
                        onPrvncChange,
                        onZpChange,
                        onCntryChange,
                        ap,
                        strt,
                        cty,
                        prvnc,
                        zp,
                        cntry,
                        onCancel,
                        onSubmit 
}) => {
    
    let note;

    if(ap === '' && strt === '' && cty === '' && prvnc === '' && zp === '' && cntry === ''){
        note = <p>No Address Added</p>
    } else {
        note = null;
    }

    return(
    <form onSubmit={onSubmit} className='address' >
        <h2>ADDRSS</h2>
        {note}
        <div className='adr-value' >
            <p>APPRTMNT:</p>
            <input type='text' value={ap} placeholder='APPARTMENT' onChange={onApChange} required />
        </div>
        <div className='adr-value' >
            <p>STRT:</p>
            <input type='text' value={strt} placeholder='STREET' onChange={onStrtChange} required />
        </div>
        <div className='adr-value' >
            <p>CTY:</p>
            <input type='text' value={cty} placeholder='CITY' onChange={onCtyChange} required />
        </div>
        <div className='adr-value' >
            <p>PRVNCE:</p>
            <input type='text' value={prvnc} placeholder='PROVINCE' onChange={onPrvncChange} required />
        </div>
        <div className='adr-value' >
            <p>ZP:</p>
            <input type='text' value={zp} placeholder='ZIP' onChange={onZpChange} required />
        </div>
        <div className='adr-value' >
            <p>CNTRY:</p>
            <input type='text' value={cntry} placeholder='COUNTRY' onChange={onCntryChange} required />
        </div>
        <div className='info-buttons' >
            <input className='info-submit' type='submit' value='SBMT' />
            <button className='adr-cancel' onClick={onCancel} >CNCL</button>
        </div>
    </form>
    );
};

export default AdrUpdateForm;