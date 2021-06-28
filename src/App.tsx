import { Provider } from 'react-redux';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { store } from './store';
import Home from 'pages/Home';
import Room from 'pages/Room';

const App = () => {
  return (
    <Provider store={store}>
      <ChakraProvider>
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/room/:roomId" component={Room} />
            <Redirect to="/" />
          </Switch>
        </Router>
      </ChakraProvider>
    </Provider>
  );
};

export default App;
