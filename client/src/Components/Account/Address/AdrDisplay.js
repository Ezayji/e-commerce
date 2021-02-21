import './Address.css';

const AdrDisplay = ({ address, onClick }) => {
    return(
    <div className='address' >
        <h2>ADDRSS</h2>
        <div className='adr-value' >
            <p>APPRTMNT:</p>
            <p>{address.appartment_nr}</p>
        </div>
        <div className='adr-value' >
            <p>STRT:</p>
            <p>{address.street}</p>
        </div>
        <div className='adr-value' >
            <p>CTY:</p>
            <p>{address.city}</p>
        </div>
        <div className='adr-value' >
            <p>PRVNCE:</p>
            <p>{address.province}</p>
        </div>
        <div className='adr-value' >
            <p>ZP:</p>
            <p>{address.zip}</p>
        </div>
        <div className='adr-value' >
            <p>CNTRY:</p>
            <p>{address.country}</p>
        </div>
        <div className='info-buttons' >
            <button className='adr-change' onClick={onClick} >CHNGE</button>
        </div>
    </div>
    );
};

export default AdrDisplay;