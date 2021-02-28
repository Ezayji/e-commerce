import './OrderPreview.css';

const OrderPreview = ({ order }) => {
    let payment;
    if(order.payment === true){
        payment = 'Successful';
    } else {
        payment = 'Not Processed';
    };


    
    return(
        <div className='order-preview-item' >
            <p>{order.id}</p>
            <p>{order.date_utc}</p>
            <p>{order.total_eur}</p>
            <p>{payment}</p>
        </div>
    );
};

export default OrderPreview;