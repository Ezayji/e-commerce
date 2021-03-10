import './OrderPreview.css';

import { Link } from 'react-router-dom';

const OrderPreview = ({ username, order }) => {
    let payment;
    if(order.payment === true){
        payment = 'Successful';
    } else {
        payment = 'Not Processed';
    };

    const d = new Date(order.date_utc);
    const date = d.toLocaleDateString();

    return(
        <div className='order-preview' >
            <p><Link to={`/orders/${username}/order/${order.id}`} >{order.id}</Link></p>
            <p data-testid='date' >{date}</p>
            <p>€{order.total_eur}</p>
            <p>{payment}</p>
        </div>
    );
};

export default OrderPreview;