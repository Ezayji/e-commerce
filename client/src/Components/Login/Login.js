import './Login.css';

const Login = () => {
    return(
        <div className="login_div" >
            <h1>LOGIN</h1>
            <form>
                <input className="login_cred" type="text" placeholder="USERNAME" />
                <input className="login_cred" type="password" placeholder="PASSWORD"/>
                <input className="sign_in" type="submit" value="SIGN IN" />
            </form>
        </div>
    );
}

export default Login;