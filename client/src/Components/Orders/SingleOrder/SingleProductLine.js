import './SingleOrder.css';

const SingleProductLine = ({ prod }) => {
    return (
        <div className='order-item' >
            <div className='order-item-title' >
                <p>{prod.product_title} ({prod.color}) x{prod.quantity}</p>
                <p>{prod.manufacturer}</p>
            </div>
            <p>Size: {prod.size}</p>
            <p>€{prod.unit_price_eur}</p>
        </div>
    );
};

export default SingleProductLine;