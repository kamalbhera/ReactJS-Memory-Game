import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import StartLayout from "./components/StartLayout";
import MemoryGameLayout from "./components/MemoryGameLayout";
import "./App.css";

interface IAppState {}

class App extends React.Component<any, IAppState> {
  render() {
    return (
      <Router>
        <div className="App">
          <h1>MEMORY GAME</h1>
          <Switch>
            <Route exact path="/start" component={StartLayout} />
            <Route exact path="/" render={() => <Redirect to="/start" />} />
            <Route path="/game" component={MemoryGameLayout} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
