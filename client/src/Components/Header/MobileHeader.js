import './MobileHeader.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import navBur from './nav.png';

const MobileHeader = ({ user, categoryListM, categoryListW, brands, onLogout }) => {
    
    const [mn, setMn] = useState(false);
    const [wmn, setWmn] = useState(false);
    const [brnds, setBrnds] = useState(false);
    const [prof, setProf] = useState(false);

    let userActions;
    let usernav;
    let login;

    // nav burger visibility helpers
    const slideNav = () => {
        const nav = document.querySelector('.mob-shop-nav-actions');
        nav.classList.toggle('active');
        document.body.classList.toggle('lock-scroll');
    };

    const resetNav = () => {
        const nav = document.querySelector('.mob-shop-nav-actions');
        nav.classList.toggle('active');
        document.body.classList.toggle('lock-scroll');
        setMn(false);
        setWmn(false);
        setBrnds(false);
    };    

    // deeper category nav items
    let mnSelect = null;
    if(mn === true){
        mnSelect = (
            <div className='mob-dropdown-content' onClick={resetNav} >
                {categoryListM}
                <p><Link to={'/products/men'} >ALL PRDCTS FR MN</Link></p>
            </div>
        );
    } else {
        mnSelect = null;
    };
    let wmnSelect;
    if(wmn === true){
        wmnSelect = (
            <div className='mob-dropdown-content' onClick={resetNav} >
                {categoryListW}
                <p><Link to={'/products/women'} >ALL PRDCTS FR WMN</Link></p>
            </div>
        );
    } else {
        wmnSelect = null;
    };
    let brndSelect;
    if(brnds === true){
        brndSelect = (
            <div className='mob-dropdown-content' onClick={resetNav} >
                {brands}
            </div>
        );
    } else {
        brndSelect = null;
    };

    // determine if profile actions should be visible
    const showProfileActions = () => {
        if(prof === false){
            setProf(true);
            document.body.classList.toggle('lock-scroll');
        } else {
            setProf(false);
            document.body.classList.toggle('lock-scroll');
        };
    };

    // render profile action elements based on state
    if(prof === true){
        userActions = (
            <div className='mob-user-actions-wrapper' >
                <div className='mob-user-actions' onClick={showProfileActions} >
                    <p><Link to={`/account/${user.username}`} >ACNT</Link></p>
                    <p><Link to={`/cart/${user.username}`} >CART</Link></p>
                    <p><Link to={`/orders/${user.username}`} >ORDRS</Link></p>
                    <p onClick={onLogout} ><a className='logout' >EXIT</a></p>
                </div>
            </div>
        );
    } else {
        userActions = null;
    };

    if(user !== null){
        const unChars = user.username.split('');
        usernav = (
            <div className='mob-user' >
                <div className='mob-user-icon' >
                    <p onClick={showProfileActions} >{unChars[0].toUpperCase()}</p>
                </div>
                {userActions}
            </div>
        );
        login = null;
    } else if(user === null) {
        usernav = null;
        login = (
            <p onClick={resetNav} ><Link to={'/login'} >LOGIN</Link></p>
        );
    };

    return(
        <div className='mob-selection' >
            {usernav}
            <nav>
                <img className='burger' src={navBur} alt='open shop navigation' role='button' onClick={slideNav} />
                <div className='mob-shop-nav-actions' >
                    <div className='mob-select-wrapper' >
                    <div className='mob-category-select' >
                        <p onClick={() => {
                            if(mn === true){
                                setMn(false);
                            } else if(mn === false) {
                                setWmn(false);
                                setBrnds(false);
                                setMn(true);
                            };
                        }} >MN</p>
                        {mnSelect}
                    </div>
                    <div className='mob-category-select' >
                        <p onClick={() => {
                            if(wmn === true){
                                setWmn(false);
                            } else if(wmn === false){
                                setWmn(true);
                                setBrnds(false);
                                setMn(false);
                            };
                        }} >WMN</p>
                        {wmnSelect}
                    </div>
                    <div className='mob-category-select' >
                        <p onClick={() => {
                            if(brnds === true){
                                setBrnds(false);
                            } else if (brnds === false){
                                setWmn(false);
                                setBrnds(true);
                                setMn(false);
                            };
                        }} >BRNDS</p>
                        {brndSelect}
                    </div>
                    <div>
                        {login}
                    </div>
                    </div>
                </div>
            </nav>
        </div>    
    );
};

export default MobileHeader;