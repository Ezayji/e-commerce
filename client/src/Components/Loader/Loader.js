import './Loader.css';
import loader from '../../Images/Loader.png';

const Loader = () => {
    return (
        <div className='loader-div' >
            <img className='loader' src={loader} alt='Loader' />
        </div>
    );
};

export default Loader;