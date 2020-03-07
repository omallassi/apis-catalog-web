import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import ListApiComponent from "./apis/ListApiComponent";
import ListDomainsComponent from "./domains/ListDomainsComponent"
import DashBoardComponent from "./DashboardComponent"

import React from "react";
import Dashboard from '../Dashboard';

const AppRouter = () => {
    return (
        <div style={style}>
            <Router>
                <Switch>
                    <Route path="/" exact component={DashBoardComponent} />
                    <Route path="/domains" exact component={ListDomainsComponent} />
                    <Route path="/apis" exact component={ListApiComponent} />
                </Switch>
            </Router>
        </div>
    )
}

const style = {
    marginTop: '20px'
}

export default AppRouter;