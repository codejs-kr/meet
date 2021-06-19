import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Home from 'pages/Home';
import Room from 'pages/Room';
// import utils from 'modules/utils';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/room/:uuid" component={Room} />
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};

export default App;
