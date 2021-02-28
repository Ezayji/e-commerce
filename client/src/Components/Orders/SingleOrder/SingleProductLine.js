import './SingleOrder.css';

const SingleProductLine = ({ prod }) => {
    return (
        <div className='order-item' >
            <div className='order-item-title' >
                <p>{prod.product_title}</p>
                <p>{prod.manufacturer}</p>
            </div>
            <p>{prod.color}</p>
            <p>€{prod.unit_price_eur}</p>
            <p>{prod.quantity}</p>
        </div>
    );
};

export default SingleProductLine;