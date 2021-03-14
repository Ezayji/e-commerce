import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Product from './Product';

const ProdPage = ({ match }) => {
    const [prod, setProd] = useState(0);

    useEffect(() => {
        async function getProd(){
            const url = `/api/products/${match.params.productid}`
            const response = await axios.get(url);
            setProd(response.data);
        };
        getProd();
    }, []);
    
    let content;
    
    if(prod === 0){
        content = null;
    } else if (prod !== 0) {
        content = <Product prod={prod} />
    };

    return(
        <div className='product-page' >
            {content}
        </div>
    );
};

export default ProdPage;