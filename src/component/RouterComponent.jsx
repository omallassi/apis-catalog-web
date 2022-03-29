import React, { Component, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';

import ListApiComponent from "./apis/ListApiComponent";
import ListDomainsComponent from "./domains/ListDomainsComponent"
import DashBoardComponent from "./DashboardComponent"
import ListReviewsComponent from "./reviews/ListReviewsComponent"

import ListEnvsComponent from './envs/ListEnvsComponent';

//const AppRouter = () => {
    class AppRouter extends Component {

        render() {
// function AppRouter(props) {
    return (
        // <div style={style}>
            // <BrowserRouter>
                <Switch>
                    <Route path="/" exact component={DashBoardComponent} />
                    <Route path="/domains" exact component={ListDomainsComponent} />
                    <Route path="/reviews" exact component={ListReviewsComponent} />
                    <Route path="/apis" exact component={ListApiComponent} />
                    <Route path="/envs" exact component={ListEnvsComponent} />
                </Switch>
            // </BrowserRouter>
        // </div>
    )
}
    }

const useStyles = theme => ({
    marginTop: '20px'
});


AppRouter.propTypes = {
    classes: PropTypes.object.isRequired,
};

//export default AppRouter;
export default withStyles(useStyles)(AppRouter);