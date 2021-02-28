import './OrderPreview.css';

import { Link } from 'react-router-dom';

const OrderPreview = ({ username, order }) => {
    let payment;
    if(order.payment === true){
        payment = 'Successful';
    } else {
        payment = 'Not Processed';
    };

    return(
        <div className='order-preview' >
            <p><Link to={`/orders/${username}/order/${order.id}`} >{order.id}</Link></p>
            <p>{order.date_utc}</p>
            <p>€{order.total_eur}</p>
            <p>{payment}</p>
        </div>
    );
};

export default OrderPreview;