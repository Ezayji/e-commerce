import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './Header.css';
import Logo from './RVRZ.png';
import {Link} from 'react-router-dom';

import { resetOrders } from '../../Redux/OrdersSlice';
import { resetCart } from '../../Redux/CartSlice';
import { userAdded, resetCustomer } from '../../Redux/CustomerSlice';
import { logout, checkAuth } from '../../Services/Api/customer';

import MobileHeader from './MobileHeader';

import axios from 'axios';

const Header = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.customer.user);

    const [cats, setCats] = useState([
        {id: 1, title:'HTS'}, 
        {id: 2, title: 'PNTS'}, 
        {id: 3, title: 'JCKTS'}, 
        {id: 4, title: 'SHRTS'}, 
        {id:5, title:'SCKS'}
    ]);
    const [brnds, setBrnds] = useState([]);

    useEffect(() => {
        async function fetchBrnds(){
            const url = '/api/manufacturers';
            const results = await axios.get(url);
            setBrnds(results.data);
        }
        fetchBrnds();
        
        async function auth(){
            const response = await checkAuth();
            if(response !== false){
                dispatch(userAdded(response));
            } else {
                dispatch(resetCustomer());
            };
        };
        auth();

    }, []);

    const onLogout = async () => {
        const response = await logout();
        if(!response){
            alert('An Error Occured While Loging Out');
        } else {
            dispatch(resetOrders());
            dispatch(resetCart());
            dispatch(resetCustomer());
        };
    };

    const categoryListM = cats.map((item, i) => (
        <p key={i} ><Link to={`/products/men/list/${item.id}/${item.title}`} >{item.title}</Link></p>
    ))

    const categoryListW = cats.map((item, i) => (
        <p key={i} ><Link to={`/products/women/list/${item.id}/${item.title}`} >{item.title}</Link></p>
    ))

    let brands;
    let actions;

    if(brnds === []){
        brands = null;
    } else {
        brands = brnds.map((item, i) => (
            <p key={i} ><Link to={`/brands/${item.id}/${item.title}`} >{item.title}</Link></p>
        ))
    };
    
    if(user === null){
        actions = (
            <div className='actions-div' >
                <div className='user_actions' >
                    <p><Link to={'/login'} >LOGIN</Link></p>
                </div>
            </div>
        )
    } else if (user !== null) {
        actions = (
            <div className='actions-div' >
                <div className='user_actions' >
                    <p><a className='user' >{user.username.toUpperCase()}</a></p>
                    <div className='actions' >
                        <p><Link to={`/account/${user.username}`} >ACNT</Link></p>
                        <p><Link to={`/cart/${user.username}`} >CART</Link></p>
                        <p><Link to={`/orders/${user.username}`} >ORDRS</Link></p>
                        <p onClick={onLogout} ><a className='logout' >EXIT</a></p>
                    </div>
                </div>
            </div>
        )
    };
    
    return(
        <header className="header" >
            <div className="logo" >
                <Link to={'/'} >
                    <img src={Logo} />
                </Link>
            </div>
            <div className="selection" >
                <nav className='desktop-nav' >
                    <div className="dropdown" >
                        <p><Link to={'/products/men'} >MN</Link></p>
                        <div className="dropdown-content">
                            {categoryListM}
                        </div>
                    </div>
                    <div className="dropdown" >
                        <p><Link to={'/products/women'} >WMN</Link></p>
                        <div className="dropdown-content">
                            {categoryListW}
                        </div>
                    </div>
                    <div className="dropdown" >
                        <p>BRNDS</p>
                        <div className="brands-drop">
                            {brands}
                        </div>
                    </div>
                </nav>
                {actions}
            </div>
            <MobileHeader user={user} categoryListM={categoryListM} categoryListW={categoryListW} brands={brands} onLogout={onLogout} />
        </header>
    );
};
// •
export default Header;