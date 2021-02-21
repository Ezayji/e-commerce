import './Profile.css';

const Display = ({ customer, onClick }) => {
    return(
        <div className='profile' >
            <h2>MY ACCNT</h2>
            <div className='account-value'>
                <p>USRNM: </p>
                <p>{customer.username}</p>
            </div>
            <div className='account-value'>
                <p>FRST NM: </p>
                <p>{customer.first_name}</p>
            </div>
            <div className='account-value'>
                <p>LST NM: </p>
                <p>{customer.last_name}</p>
            </div>
            <div className='account-value'>
                <p>EML: </p>
                <p>{customer.email}</p>
            </div>
            <div className='account-value'>
                <p>PHN: </p>
                <p>{customer.phone}</p>
            </div>
            <div className='info-buttons' >
                <button onClick={onClick} >CHNGE</button>
                <button>UPDT PW</button>
            </div>
        </div>
    )
};

export default Display;