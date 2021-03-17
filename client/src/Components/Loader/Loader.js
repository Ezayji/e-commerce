import './Loader.css';
import loader from './Loader.png';

const Loader = () => {
    return (
        <div className='loader-div' >
            <img className='loader' src={loader} />
        </div>
    );
};

export default Loader;