import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Home from 'pages/Home';
import Room from 'pages/Room';
// import utils from 'modules/utils';

const App = () => {
  return (
    <ChakraProvider>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/room/:uuid" component={Room} />
          <Redirect to="/" />
        </Switch>
      </Router>
    </ChakraProvider>
  );
};

export default App;
