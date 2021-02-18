import React, { useState, useEffect } from 'react';
import './Header.css';
import Logo from './RVRZ.png';
import {Link} from 'react-router-dom';

import { statusReset } from '../../Redux/ProductsSlice';
import store from '../../Redux/Store';

import axios from 'axios';

const Header = () => {
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
    }, []);

    const onClick = () => {
        store.dispatch(statusReset());
    };

    const categoryListM = cats.map((item, i) => (
        <p key={i} onClick={onClick} ><Link to={`/products/men/list/${item.id}/${item.title}`} >{item.title}</Link></p>
    ))

    const categoryListW = cats.map((item, i) => (
        <p key={i} onClick={onClick} ><Link to={`/products/women/list/${item.id}/${item.title}`} >{item.title}</Link></p>
    ))

    let brands

    if(brnds === []){
        brands = null;
    } else {
        brands = brnds.map((item, i) => (
            <p key={i} onClick={onClick} ><Link to={`/brands/${item.id}/${item.title}`} >{item.title}</Link></p>
        ))
    } 

    return(
        <header className="header" >
            <div className="logo" >
                <Link to={'/'} >
                    <img src={Logo} />
                </Link>
            </div>
            <div className="selection" >
                <nav className='nav' >
                    <div className="dropdown" >
                        <p onClick={onClick} ><Link to={'/products/men'} >MN</Link></p>
                        <div className="dropdown-content">
                            {categoryListM}
                        </div>
                    </div>
                    <div className="dropdown" >
                        <p onClick={onClick} ><Link to={'/products/women'} >WMN</Link></p>
                        <div className="dropdown-content">
                            {categoryListW}
                        </div>
                    </div>
                    <div className="dropdown" >
                        <p>BRNDS</p>
                        <div className="dropdown-content">
                            {brands}
                        </div>
                    </div>
                </nav>
                <div className='user_actions' >
                    <p><Link to={'/login'} >LOGIN</Link></p>
                </div>
            </div>
        </header>
    );
};

export default Header;