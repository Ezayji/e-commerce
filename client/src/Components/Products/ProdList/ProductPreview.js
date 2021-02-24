import { Link } from 'react-router-dom';
import './ProductPreview.css';

const ProductPreview = ({ product, url }) => {
    

    return(
        <div className='prod-preview' >
            <Link to={`${url}/${product.id}/${product.title}`} >
                <img src={product.thumbnail_url} alt={product.title} />
            </Link>
            <div className='preview-desc' >
                <h2>{product.title}</h2>
                <p className='preview-brnd' >{product.manufacturer}</p>
                <p>€{product.unit_price_eur}</p>
            </div>
        </div>
    );
};

export default ProductPreview; 