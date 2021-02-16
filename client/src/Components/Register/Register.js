import './Register.css';

const Register = () => {
    return(
        <div className="register_div" >
            <form>
                <input className="register_cred" type='text' placeholder="USERNAME" />
                <input className="register_cred" type='text' placeholder="FIRST NAME" />
                <input className="register_cred" type='text' placeholder="LAST NAME" />
                <input className="register_cred" type='text' placeholder="EMAIL" />
                <input className="register_cred" type='text' placeholder="PHONE" />
                <input className="register_cred" type='password' placeholder="PASSWORD" />
                <input className="register_cred" type='password' placeholder="PASSWORD AGAIN" />
                <input className="register_sub" type="submit" value="CREATE" />
            </form>
            <p>Register To Start Shopping For Some Fine Goods</p>
        </div>
    );
}

export default Register;