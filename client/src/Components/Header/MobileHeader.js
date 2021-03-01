import './MobileHeader.css';
import React, { useState } from 'react';

const MobileHeader = ({ user, categoryListM, categoryListW, brands, onLogout }) => {
    
    const [prof, setProf] = useState(false);

    let userActions;
    let usernav;
    let login;

    const showProfileActions = () => {
        if(prof === false){
            setProf(true);
        } else {
            setProf(false);
        };
    };

    if(prof === true){
        userActions = (
            <div className='mob-user-actions' >
                <p><Link to={`/account/${user.username}`} >ACNT</Link></p>
                <p><Link to={`/cart/${user.username}`} >CART</Link></p>
                <p><Link to={`/orders/${user.username}`} >ORDRS</Link></p>
                <p onClick={onLogout} ><a className='logout' >EXIT</a></p>
            </div>
        );
    } else {
        userActions = null;
    };

    if(user !== null){
        const unChars = user.username.split('');
        usernav = (
            <div className='mob-user' >
                <div>
                    <p onClick={showProfileActions} >{unChars[0].toUpperCase()}</p>
                </div>
                {userActions}
            </div>
        );
        login = null;
    } else {
        usernav = null;
        login = (
            <p><Link to={'/login'} >LOGIN</Link></p>
        );
    };
    
    return(
        <div className='mob-selection' >
            {usernav}
            <nav>
                <img />
                <div className='mob-shop-nav-actions' >
                    <div>
                        <p>MN</p>
                        <div>
                            {categoryListM}
                        </div>
                    </div>
                    <div>
                        <p>WMN</p>
                        <div>
                            {categoryListW}
                        </div>
                    </div>
                    <div>
                        <p>BRNDS</p>
                        <div>
                            {brands}
                        </div>
                    </div>
                    <div>
                        {login}
                    </div>
                </div>
            </nav>
        </div>    
    );
};