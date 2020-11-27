import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import ListApiComponent from "./apis/ListApiComponent";
import ListDomainsComponent from "./domains/ListDomainsComponent"
import DashBoardComponent from "./DashboardComponent"
import ListReviewsComponent from "./reviews/ListReviewsComponent"

import React from "react";
import ListEnvsComponent from './envs/ListEnvsComponent';

const AppRouter = () => {
    return (
        <div style={style}>
            <Router>
                <Switch>
                    <Route path="/" exact component={DashBoardComponent} />
                    <Route path="/domains" exact component={ListDomainsComponent} />
                    <Route path="/reviews" exact component={ListReviewsComponent} />
                    <Route path="/apis" exact component={ListApiComponent} />
                    <Route path="/envs" exact component={ListEnvsComponent} />
                </Switch>
            </Router>
        </div>
    )
}

const style = {
    marginTop: '20px'
}

export default AppRouter;