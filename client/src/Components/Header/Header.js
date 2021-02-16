import './Header.css';
import Logo from './RVRZ.png';
import {Link} from 'react-router-dom';

const Header = () => {
    return(
        <header className="header" >
            <div className="logo" >
                <img src={Logo} />
            </div>
            <div className="selection" >
                <nav className='nav' >
                    <p>MN</p>
                    <p>WMN</p>
                    <p>BRNDS</p>
                </nav>
                <div className='user_actions' >
                    <p><Link to={'/login'} >LOGIN</Link></p>
                </div>
            </div>
        </header>
    );
}

export default Header;