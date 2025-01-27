import { Router, Route } from 'wouter';
import Home from "./pages/Home/Home";
import Sign from "./pages/Sign/Sign";
import Profile from './pages/Profile/Profile';
import Search from './pages/Search/Search';

const App = () => {
  return (
    <Router>
      <Route path="/" component={Home} />
      <Route path="/sign" component={Sign} />
      <Route path="/profile" component={Profile} />
      <Route path="/search/:query" component={Search} />
    </Router>
  );
};

export default App;