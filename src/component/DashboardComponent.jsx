import React, { Component } from 'react'
import ApiService from "../service/ApiService";
import Typography from '@material-ui/core/Typography';
import { Box } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Chart from "react-google-charts";
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import SyncIcon from '@material-ui/icons/Sync';
import IconButton from '@material-ui/core/IconButton';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import AssessmentIcon from '@material-ui/icons/Assessment';
import AssignmentLateIcon from '@material-ui/icons/AssignmentLate';
import AssignmentIcon from '@material-ui/icons/Assignment';


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

class ListApiComponent extends Component {
    data_points = [];

    constructor(props) {
        super(props)
        this.state = {
            pr_num: [],
            pr_ages: [],
            endpoints_num: [],
            zally_violations: [],
            zally_violations_columns: [],
        }

        this.getPullRequestNumber = this.getPullRequestNumber.bind(this);
    }

    componentDidMount() {
        this.getPullRequestNumber();
    }

    getPullRequestNumber() {
        ApiService.getPullRequestNumber().then((res) => {
            this.setState({ pr_num: res.data.pr_num });
            this.setState({ pr_ages: res.data.pr_ages });
            this.setState({ endpoints_num: res.data.endpoints_num });

            //need to parse them to have an array of array
            var column_length = 1;
            var columns = new Array();
            //get the number of columns : ie. distinct zally violations number
            for (var index in res.data.zally_violations) {
                var values = res.data.zally_violations[index][1];
                for (var violation_num in values) {
                    //append the key to the columns
                    if (!columns.includes(violation_num)) {
                        columns[columns.length] = violation_num;
                    }
                }
            }

            column_length = columns.length;

            //create data table
            var zally_data = new Array();
            var zally_data_columns = new Array();
            zally_data_columns[0] = 'Date';
            for (var index in res.data.zally_violations) {
                //zally violations have the following format 
                //"zally_violations":[
                //   [
                //     "2020-08-17T05:38:03.956767Z",
                //     {
                //        "134":3,
                //        "120":4
                //     }
                //  ],...
                var zally_data_point = new Array(column_length + 1);
                zally_data_point.fill(0);
                zally_data_point[0] = res.data.zally_violations[index][0];

                var values = res.data.zally_violations[index][1];

                for (var violation_num in values) {
                    //append the key to the columns
                    if (!zally_data_columns.includes(violation_num)) {
                        zally_data_columns[zally_data_columns.length] = violation_num;
                    }
                    var index = zally_data_columns.indexOf(violation_num);
                    zally_data_point[index] = values[violation_num];
                }
                zally_data[zally_data.length] = zally_data_point;
            }

            console.info("zally_data_columns", zally_data_columns);
            this.setState({ zally_violations_columns: zally_data_columns });
            console.info("zally_violations", zally_data);
            this.setState({ zally_violations: zally_data });
        });
    }

    a11yProps(index) {
        return {
            id: `full-width-tab-${index}`,
            'aria-controls': `full-width-tabpanel-${index}`,
        };
    }

    render() {
        return (
            <Box component="span" m={1}>
                <Paper>
                    <Card>
                        <CardContent>
                            <Grid container>
                                <Grid item xs={11}>
                                    <Typography variant="h6" color="primary">Design Time Governance Metrics</Typography>
                                </Grid>
                                <Grid item xs={1}>
                                    <IconButton color="primary" aria-label="refresh" onClick={() => {
                                        ApiService.refreshMetrics();
                                    }}>
                                        <SyncIcon></SyncIcon>
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </CardContent>
                        <CardContent>
                            <Tabs
                                value={this.state.value}
                                onChange={(event, newValue) => this.setState({ value: newValue })}
                                indicatorColor="primary"
                                textColor="primary">
                                <Tab label="Process" icon={<AssessmentIcon />} {...this.a11yProps(0)} />
                                <Tab label="Catalog" icon={<AssignmentIcon />} {...this.a11yProps(1)} />
                                <Tab label="Zally Violations" icon={<AssignmentLateIcon />} {...this.a11yProps(1)} />
                            </Tabs>
                            <TabPanel value={this.state.value} index={0}>
                                <Grid container direction="row" alignItems="center" >
                                    <Grid item xs={12}>
                                        <Chart
                                            height={'400px'}
                                            chartType="LineChart"
                                            loader={<div>Loading Chart</div>}
                                            columns={['Date', 'Pull Requests #']}
                                            rows={this.state.pr_num}
                                            options={{
                                                title: "Opened Pull Requests #",
                                                // curveType: "function",
                                                // legend: { position: "bottom",},
                                                //curveType: 'function',
                                                lineWidth: 3,
                                                intervals: { style: 'line' },
                                                hAxis: {
                                                    title: 'Date',
                                                },
                                                vAxis: {
                                                    title: '# of PRs',
                                                },
                                            }}
                                            rootProps={{ 'data-testid': '1' }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Chart
                                            height={'400px'}
                                            chartType="LineChart"
                                            loader={<div>Loading Chart</div>}
                                            columns={['Date', 'min (days)', 'p50 (days)', 'max (days)', 'mean (days)']}
                                            rows={this.state.pr_ages}
                                            options={{
                                                title: "Opened Pull Requests Stats",
                                                //curveType: 'function',
                                                lineWidth: 3,
                                                intervals: { style: 'line' },
                                                hAxis: {
                                                    title: 'Time',
                                                },
                                                vAxis: {
                                                    title: '# of days',
                                                },
                                            }}
                                            rootProps={{ 'data-testid': '1' }}
                                        />
                                    </Grid>
                                </Grid>
                            </TabPanel>
                            <TabPanel value={this.state.value} index={1}>
                                <Grid container direction="row" alignItems="center" >
                                    <Grid item xs={12}>
                                        <Chart
                                            height={'400px'}
                                            chartType="LineChart"
                                            loader={<div>Loading Chart</div>}
                                            columns={['Date', '# of (REST) Operations']}
                                            rows={this.state.endpoints_num}
                                            options={{
                                                title: "Number of (REST) Operations",
                                                //curveType: 'function',
                                                lineWidth: 3,
                                                intervals: { style: 'line' },
                                                hAxis: {
                                                    title: 'Time',
                                                },
                                                vAxis: {
                                                    title: '# of operations',
                                                },
                                            }}
                                            rootProps={{ 'data-testid': '1' }}
                                        />
                                    </Grid>
                                </Grid>
                            </TabPanel>
                            <TabPanel value={this.state.value} index={2}>
                                <Grid container direction="row" alignItems="center" >
                                    <Grid item xs={12}>
                                        <Chart
                                            height={'400px'}
                                            chartType="LineChart"
                                            loader={<div>Loading Chart</div>}
                                            columns={this.state.zally_violations_columns}
                                            rows={this.state.zally_violations}
                                            options={{
                                                title: "Number of Zally Violations",
                                                //curveType: 'function',
                                                lineWidth: 3,
                                                intervals: { style: 'line' },
                                                hAxis: {
                                                    title: 'Time',
                                                },
                                                vAxis: {
                                                    title: '# of violations',
                                                },
                                            }}
                                            rootProps={{ 'data-testid': '1' }}
                                        />
                                    </Grid>
                                </Grid>
                            </TabPanel>
                        </CardContent>
                    </Card>

                </Paper>
                <Paper>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary">Runtime Governance Metrics (To Be Done)</Typography>
                        </CardContent>
                    </Card>
                </Paper>
            </Box >
        );
    }
}

export default ListApiComponent;