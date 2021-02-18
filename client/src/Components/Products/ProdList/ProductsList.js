import './ProductsList.css';
import ProductPreview from './ProductPreview';

const ProductsList = ( { products, url } ) => {
    
    const list = products.map((item, i) => (
        <ProductPreview product={item} key={i} url={url} />
    ));
    
    return(
        <div className='product-list' >
            {list}
        </div>
    );
};

export default ProductsList; 