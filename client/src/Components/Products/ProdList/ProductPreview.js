import React, { useState, useEffect } from 'react';
import './ProductPreview.css';


const ProductPreview = ({ product }) => {
    return(
        <div>
            <img src={product.thumbnail_url} />
            <div>
                
            </div>
        </div>
    );
};

export default ProductPreview;