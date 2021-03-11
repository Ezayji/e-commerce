import './App.css';
import Header from '../Header/Header';
import Home from '../Home/Home';
import Login from '../Login/Login';
import Register from '../Register/Register';
import Products from '../Products/Products';
import ProdPage from '../Products/ProdPage/ProdPage';
import Account from '../Account/Account';
import Cart from '../Cart/Cart';
import Orders from '../Orders/Orders';
import SingleOrder from '../Orders/SingleOrder/SingleOrder';
import UpdatePw from '../Account/UpdatePw/UpdatePw';
import SuccessPage from '../Checkout/SuccessPage/SuccessPage';
import Footer from '../Footer/Footer';

import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path='/login' exact component={Login} />
          <Route path='/register' exact render={(props) => <Register {...props} />} />
          <Route path='/products/:gender/list/:categoryid/:category_title/:productid/:product_title' exact render={(props) => <ProdPage {...props} />} />
          <Route path='/products/:gender/list/:categoryid/:category_title' exact render={(props) => <Products {...props} />} />
          <Route path='/products/:gender/:productid/:product_title' exact render={(props) => <ProdPage {...props} />} />
          <Route path='/products/:gender' exact render={(props) => <Products {...props} />} />
          <Route path='/brands/:brand_id/:title/:productid/:product_title' exact render={(props) => <ProdPage {...props} />} />
          <Route path='/brands/:brand_id/:title' exact render={(props) => <Products {...props} />} />
          <Route path='/account/:username/password' exact render={(props) => <UpdatePw {...props} />} />
          <Route path='/account/:username' exact render={(props) => <Account {...props} />} />
          <Route path='/cart/:username' exact render={(props) => <Cart {...props} />} />
          <Route path='/checkout/success/:username/:order_id' exact render={(props) => <SuccessPage {...props} />} />
          <Route path='/orders/:username' exact render={(props) => <Orders {...props} /> } />
          <Route path='/orders/:username/order/:order_id' exact render={(props) => <SingleOrder {...props} /> } />
        </Switch>
      </div>
    </Router>
  );
};

// <Footer/>

export default App;
