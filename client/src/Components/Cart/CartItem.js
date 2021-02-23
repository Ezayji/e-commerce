

const CartItem = ({ item, onDecrement, onIncrement, onDelete }) => {
    
    
    return(
        <div className='cart-item' >
            <img src={item.thumbnail_url} />
            <div className='cart-details' >
                <div className='cart-desc' >
                    <h3>{item.product_title}</h3>
                    <p className='cart-brnd' >{item.manufacturer}</p>
                    <p className='cart-clr' >{item.color}</p>
                    <p className='cart-prc' >€{item.unit_price_eur}</p>
                </div>
                <div className='cart-actions' >
                    <div className='cart-quantity' >
                        <button className='calculate' onClick={() => onDecrement(item)} >-</button>
                        <p><span>{item.quantity}</span></p>
                        <button className='calculate' onClick={() => onIncrement(item)} >+</button>
                    </div>
                    <button className='cart-remove' onClick={() => onDelete(item)} >REMOVE ITEM</button>
                </div>
            </div>
        </div>
    );
};

export default CartItem;