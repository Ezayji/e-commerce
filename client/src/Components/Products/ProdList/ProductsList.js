import './ProductsList.css';
import ProductPreview from './ProductPreview';

const ProductsList = ( {products} ) => {
    const list = products.map((item, i) => (
        <ProductPreview product={item} key={i} />
    ));
    
    return(
        <div>
            {list}
        </div>
    );
};

export default ProductsList;