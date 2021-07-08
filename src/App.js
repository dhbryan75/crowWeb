import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

import Header from './Pages/Common/Header';
import Footer from './Pages/Common/Footer';
import HomePage from './Pages/Home/';
import TrafficPage from './Pages/Traffic/';
import BirdPage from './Pages/Bird/';
import './App.css';

class App extends React.Component {
    state = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    onResize = e => {
        this.setState({
            width: window.innerWidth,
            height: window.innerHeight
        });
    }

    componentDidMount() {
        window.addEventListener('resize', this.onResize);
    }

    render() {
        const { width, height } = this.state;
        return (
            <div className="app">
                <Header />
                <Router>
                    <Switch>
                        <Route exact path="/traffic">
                            <TrafficPage width={width} height={height} />
                        </Route>
                        <Route exact path="/bird">
                            <BirdPage width={width} height={height} />
                        </Route>
                        <Route path="/">
                            <HomePage width={width} height={height} />
                        </Route>
                    </Switch>
                </Router>
                <Footer />
            </div>
        );
    }
}

export default App;