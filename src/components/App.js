import { render } from "react-dom";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from "react-router-dom";

import { useAuth } from "../hooks";
import { Home, Login, Signup, Settings, UserProfile } from "../pages";
import { Loader, Navbar } from "./";

function PrivateRoutes({ children, ...rest }) {
  const auth = useAuth();
  return (
    <Route
      {...rest}
      render={() => {
        if (auth.user) return children;

        return <Redirect to="/login" />;
      }}
    />
  );
}
const Page404 = () => {
  return <h1>404</h1>;
};

function App() {
  const auth = useAuth();

  if (auth.loading) {
    return <Loader />;
  }

  return (
    <div className="App">
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>

          <Route exact path="/login">
            <Login />
          </Route>

          <Route exact path="/register">
            <Signup />
          </Route>

          <PrivateRoutes exact path="/settings">
            <Settings />
          </PrivateRoutes>

          <PrivateRoutes exact path="/user/:userId">
            <UserProfile />
          </PrivateRoutes>

          <Route>
            <Page404 />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
