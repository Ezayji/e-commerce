import './Home.css'
import homeSpinner from './homespinner.png';

const Home = () => {
    return(
        <div data-testid='home' className='home' >
            <img class='home-spinner' src={homeSpinner} />
        </div>
    );
};

export default Home;