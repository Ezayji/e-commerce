import './Login.css';
import {Link} from 'react-router-dom';

const Login = () => {
    return(
        <div className="login_div" >
            <form>
                <input className="login_cred" type="text" placeholder="USERNAME" />
                <input className="login_cred" type="password" placeholder="PASSWORD"/>
                <input className="sign_in" type="submit" value="SIGN IN" />
            </form>
            <p><Link to={'/register'}>CREATE ACCOUNT</Link></p>
        </div>
    );
}

export default Login;