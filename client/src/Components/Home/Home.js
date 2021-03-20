import './Home.css'
import homeSpinner from './homespinner.png';

const Home = () => {
    return(
        <div data-testid='home' className='home' >
            <img className='cover-model2' src='https://i.imgur.com/4fd0iE0.png' />
            <div className='home-intro' >
                <h1>REVARZ</h1>
                <p>THE FINEST STREETWEAR PLUG SINCE 2021</p>
                <img className='home-spinner' src={homeSpinner} />
            </div>
            <img className='cover-model' src='https://i.imgur.com/1B7dvlr.png' />
        </div>
    );
};

export default Home;