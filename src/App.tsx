import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { store } from './store';
import Home from 'pages/Home';
import Room from 'pages/Room';

const basename = `${process.env.REACT_APP_NAME}`;

const App = () => {
  return (
    <Provider store={store}>
      <ChakraProvider>
        <Router basename={basename}>
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
