import './Footer.css';
import Git from './GitHub-Mark-32px.png';

const Footer = () => {
    return(
        <footer>
            <p>REVARZ™ 2021</p>
            <div className='credentials' >
                <p>Powered by <a className='ezayji-link' href='https://github.com/Ezayji' target="_blank" rel="noreferrer noopener" >Ezayji</a></p>
                <img src={Git} />
            </div>
        </footer>
    );
};

export default Footer;