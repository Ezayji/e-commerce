import React, { useEffect, useState } from 'react';

import axios from 'axios';

import './ProdPage.js';

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
    
    let content

    if(prod === 0){
        content = null;
    } else if (prod !== 0) {
        content = (
            <div>
                <img src={prod.images[0].url} alt={prod.product.title} />
                <div>
                    <h2>{prod.product.title}</h2>
                    <p>{prod.product.manufacturer}</p>
                    <p>€{prod.product.unit_price_eur}</p>
                    <p>{prod.product.color}</p>
                    <p>{prod.product.description}</p>
                    <p>• Material: {prod.product.material}</p> 
                </div>
            </div>
        )
    }

    return(
        <div>
            {content}
        </div>
    );
};

export default ProdPage;