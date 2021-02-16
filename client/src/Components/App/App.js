import './App.css';
import Header from '../Header/Header';
import Login from '../Login/Login';
import Register from '../Register/Register';

import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Switch>
          <Route path='/login' exact component={Login} />
          <Route path='/register' exact component={Register} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
