import React, { Component } from 'react'
import ApiService from "../service/ApiService";
import Typography from '@material-ui/core/Typography';
import { Box } from '@material-ui/core';
import Chart from "react-google-charts";
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import SyncIcon from '@material-ui/icons/Sync';
import IconButton from '@material-ui/core/IconButton';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AssessmentIcon from '@material-ui/icons/Assessment';
import AssignmentLateIcon from '@material-ui/icons/AssignmentLate';
import AssignmentIcon from '@material-ui/icons/Assignment';
import BlurLinearTwoToneIcon from '@material-ui/icons/BlurLinearTwoTone';

import { blue } from '@material-ui/core/colors';


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
                    <Box>{children}</Box>
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

class DashboardComponent extends Component {

    data_points = [];

    constructor(props) {
        super(props)
        this.state = {
            pr_num: [],
            pr_ages: [],
            oldest_pr: [],
            endpoints_num: [],
            endpoints_audience_num: [],
            endpoints_audience_num_columns: [],
            zally_violations: [],
            zally_violations_columns: [],
            value: 0,
        }

        this.getStats = this.getStats.bind(this);
        this.getOldestPr = this.getOldestPr.bind(this);
    }

    componentDidMount() {
        this.getStats();
        this.getOldestPr();
    }

    createDataTable(origin_data) {
        //need to parse them to have an array of array
        var columns = [];
        //get the number of columns : ie. distinct zally violations number
        for (var index in origin_data) {
            var values = origin_data[index][1];
            for (var violation_num in values) {
                //append the key to the columns
                if (!columns.includes(violation_num)) {
                    columns[columns.length] = violation_num;
                }
            }
        }

        //create data table
        var data = [];
        var data_columns = [];
        data_columns[0] = { type: 'datetime', label: 'Date' };
        for (var index in origin_data) {

            var data_point = new Array(columns.length + 1);
            data_point.fill(0);
            data_point[0] = new Date(origin_data[index][0]);

            var values = origin_data[index][1];

            for (var violation_num in values) {
                //append the key to the columns
                if (!data_columns.includes(violation_num)) {
                    data_columns[data_columns.length] = violation_num;
                }
                var index = data_columns.indexOf(violation_num);
                data_point[index] = values[violation_num];
            }
            data[data.length] = data_point;
        }

        return { data: data, data_columns: data_columns };
    }

    getStats() {
        ApiService.getStats().then((res) => {

            //because we need to create JS Date objects....loop and loop and loop 
            var formatted_array = [];
            for (var index in res.data.pr_num) {
                var line_val = [];

                line_val[0] = new Date(res.data.pr_num[index][0]);
                line_val[1] = res.data.pr_num[index][1];

                formatted_array[index] = line_val;
            }
            this.setState({ pr_num: formatted_array });

            //because we need to create JS Date objects....loop and loop and loop 
            var formatted_array = [];
            for (var index in res.data.pr_ages) {
                var line_val = [];

                line_val[0] = new Date(res.data.pr_ages[index][0]);
                line_val[1] = res.data.pr_ages[index][1];
                line_val[2] = res.data.pr_ages[index][2];
                line_val[3] = res.data.pr_ages[index][3];
                line_val[4] = res.data.pr_ages[index][4];

                formatted_array[index] = line_val;
            }
            this.setState({ pr_ages: formatted_array });

            //because we need to create JS Date object, we are to go through the array....
            var formatted_endpoints_num = [];
            for (var index in res.data.endpoints_num) {
                var line_val = [];

                line_val[0] = new Date(res.data.endpoints_num[index][0]);
                line_val[1] = res.data.endpoints_num[index][1];
                line_val[2] = res.data.endpoints_num[index][2];
                line_val[3] = res.data.endpoints_num[index][3];

                formatted_endpoints_num[index] = line_val;
            }
            this.setState({ endpoints_num: formatted_endpoints_num });

            //
            var origin_data = res.data.zally_violations;
            var zally_violations = this.createDataTable(origin_data);
            //zally violations have the following format 
            //"zally_violations":[
            //   [
            //     "2020-08-17T05:38:03.956767Z",
            //     {
            //        "134":3,
            //        "120":4
            //     }
            //  ],...
            this.setState({ zally_violations_columns: zally_violations.data_columns });
            this.setState({ zally_violations: zally_violations.data });

            //set endpoints num per audience
            var origin_data = res.data.endpoints_num_per_audience;
            var endpoints_num_per_audience = this.createDataTable(origin_data)

            this.setState({ endpoints_audience_num_columns: endpoints_num_per_audience.data_columns });
            this.setState({ endpoints_audience_num: endpoints_num_per_audience.data });
        });
    }

    getOldestPr() {
        ApiService.getOldestPr().then((res) => {
            this.setState({ oldest_pr: res.data });
        })
    }

    getCreationDate(creationEpoc) {
        var d = new Date(creationEpoc); // The 0 there is the key, which sets the date to the epoch

        return "" + d
    }

    a11yProps(index) {
        return {
            id: `full-width-tab-${index}`,
            'aria-controls': `full-width-tabpanel-${index}`,
        };
    }

    render() {
        return (
            <Box>
                <Card variant="outlined">
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
                            <Grid container direction="row" alignItems="center" spacing={10}>
                                <Grid item xs={12}>
                                    <Typography variant="body1" gutterBottom className={this.props.classes.wrapIcon}>
                                        <BlurLinearTwoToneIcon className={this.props.classes.linkIcon} style={{ fill: "#6573c3" }} />
                                        The following chart displays the # of opened Pull-Request
                                    </Typography>
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
                                            explorer: {
                                                actions: ['dragToZoom', 'rightClickToReset'],
                                                axis: 'horizontal',
                                                keepInBounds: true
                                            },
                                            intervals: { style: 'line' },
                                            hAxis: {
                                                title: 'Date',
                                            },
                                            vAxis: {
                                                title: '# of PRs',
                                            }
                                        }}
                                        rootProps={{ 'data-testid': '1' }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body1" gutterBottom className={this.props.classes.wrapIcon}>
                                        <BlurLinearTwoToneIcon className={this.props.classes.linkIcon} style={{ fill: "#6573c3" }} />
                                        The following chart displays some statistics around pull-requests
                                    </Typography>
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
                                            explorer: {
                                                actions: ['dragToZoom', 'rightClickToReset'],
                                                axis: 'horizontal',
                                                keepInBounds: true
                                            },
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
                                <Grid item xs={12} >
                                    <Typography variant="body1" gutterBottom className={this.props.classes.wrapIcon}>
                                        <BlurLinearTwoToneIcon className={this.props.classes.linkIcon} style={{ fill: "#6573c3" }} />
                                        The following table displays the oldest opened pull-requests
                                    </Typography>

                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell className={this.props.classes.head}>Pull Request Id</TableCell>
                                                <TableCell className={this.props.classes.head}>Pull Request Title</TableCell>
                                                <TableCell className={this.props.classes.head}>Creation Date</TableCell>
                                                <TableCell className={this.props.classes.head}>Author Name</TableCell>
                                                <TableCell className={this.props.classes.head}>Author Email</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {this.state.oldest_pr.map(row => (
                                                <TableRow hover key={row.id}>
                                                    <TableCell>
                                                        <a className="MuiButtonBase-root MuiListItem-root MuiListItem-gutters MuiListItem-button" tabIndex="0" role="button" aria-disabled="false"
                                                            href={process.env.REACT_APP_STASH_BASE_URL + "/pull-requests/" + row.id + "/overview"} target="_blank">
                                                            <div className="MuiListItemIcon-root">
                                                                <svg className="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                                                                    <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"></path>
                                                                </svg>
                                                            </div>
                                                            <div className="MuiListItemText-root">
                                                                <span className="MuiTypography-root MuiListItemText-primary MuiTypography-body1 MuiTypography-displayBlock">{row.id}</span>
                                                            </div>
                                                        </a></TableCell>
                                                    <TableCell>{row.title}</TableCell>
                                                    <TableCell>{this.getCreationDate(row.createdDate)}</TableCell>
                                                    <TableCell>{row.author.user.displayName}</TableCell>
                                                    <TableCell>{row.author.user.emailAddress}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Grid>
                            </Grid>
                        </TabPanel>
                        <TabPanel value={this.state.value} index={1}>
                            <Typography variant="body1" gutterBottom>A Resource correspond to a Path in OpenAPI specification and can thus, support muliple operations (ie. GET, POST etc...)</Typography>
                            <Grid container direction="row" alignItems="center" spacing={10}>
                                <Grid item xs={12}>
                                    <Typography variant="body1" gutterBottom className={this.props.classes.wrapIcon}>
                                        <BlurLinearTwoToneIcon className={this.props.classes.linkIcon} style={{ fill: "#6573c3" }} />
                                        The following chart displays the evolution of (REST) resources
                                    </Typography>
                                    <Chart
                                        height={'400px'}
                                        chartType="LineChart"
                                        loader={<div>Loading Chart</div>}
                                        columns={[{ type: 'datetime', label: 'Date' }, { type: 'string', role: 'annotation' }, { type: 'string', role: 'annotationText' }, '# of (REST) Operations']}
                                        // columns={['Date', '# of (REST) Operations']}
                                        rows={this.state.endpoints_num}
                                        options={{
                                            title: "Number of (REST) Resources",
                                            //curveType: 'function',
                                            lineWidth: 3,
                                            explorer: {
                                                actions: ['dragToZoom', 'rightClickToReset'],
                                                axis: 'horizontal',
                                                keepInBounds: true
                                            },
                                            intervals: { style: 'line' },
                                            hAxis: {
                                                title: 'Time',
                                            },
                                            vAxis: {
                                                title: '# of operations',
                                            },
                                            annotations: {
                                                style: 'line',
                                                // stemColor: 'red',
                                                // 'textStyle': {
                                                //     'fontSize': 10,
                                                //     'auraColor': 'none'
                                                // },
                                                // 'boxStyle': {
                                                //     'stroke': '#888888', 'strokeWidth': 0.5,
                                                //     'rx': 2, 'ry': 2,
                                                //     'gradient': {
                                                //         'color1': '#eeeeee',
                                                //         'color2': '#dddddd',
                                                //         'x1': '0%', 'y1': '0%',
                                                //         'x2': '0%', 'y2': '100%',
                                                //         'useObjectBoundingBoxUnits': true
                                                //     }
                                                // }
                                            },
                                        }}
                                        rootProps={{ 'data-testid': '1' }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body1" gutterBottom className={this.props.classes.wrapIcon}>
                                        <BlurLinearTwoToneIcon className={this.props.classes.linkIcon} style={{ fill: "#6573c3" }} />
                                        The following chart displays the evolution of (REST) resources per x-audience
                                    </Typography>
                                    <Chart
                                        height={'400px'}
                                        chartType="LineChart"
                                        loader={<div>Loading Chart</div>}
                                        columns={this.state.endpoints_audience_num_columns} //TODO
                                        rows={this.state.endpoints_audience_num} //TODO
                                        options={{
                                            title: "Number of Resources per Audience",
                                            //curveType: 'function',
                                            lineWidth: 3,
                                            explorer: {
                                                actions: ['dragToZoom', 'rightClickToReset'],
                                                axis: 'horizontal',
                                                keepInBounds: true
                                            },
                                            intervals: { style: 'line' },
                                            hAxis: {
                                                title: 'Date',
                                            },
                                            vAxis: {
                                                title: '# of endpoints',
                                            },
                                        }}
                                        rootProps={{ 'data-testid': '1' }}
                                    />
                                </Grid>
                            </Grid>
                        </TabPanel>
                        <TabPanel value={this.state.value} index={2}>
                            <Typography variant="body1" gutterBottom>A Resource correspond to a Path in OpenAPI specification and can thus, support muliple operations (ie. GET, POST etc...)</Typography>
                            <Grid container direction="row" alignItems="center" spacing={10}>
                                <Grid item xs={12}>
                                    <Typography variant="body1" gutterBottom className={this.props.classes.wrapIcon}>
                                        <BlurLinearTwoToneIcon className={this.props.classes.linkIcon} style={{ fill: "#6573c3" }} />
                                        The following chart displays the evolution of x-zally-ignore
                                    </Typography>
                                    <Chart
                                        height={'400px'}
                                        chartType="LineChart"
                                        loader={<div>Loading Chart</div>}
                                        columns={this.state.zally_violations_columns}
                                        rows={this.state.zally_violations}
                                        options={{
                                            title: "Number of Resources with zally-ignore",
                                            //curveType: 'function',
                                            lineWidth: 3,
                                            explorer: {
                                                actions: ['dragToZoom', 'rightClickToReset'],
                                                axis: 'horizontal',
                                                keepInBounds: true
                                            },
                                            intervals: { style: 'line' },
                                            hAxis: {
                                                title: 'Date',
                                            },
                                            vAxis: {
                                                title: '# of zally-ignore',
                                            },
                                        }}
                                        rootProps={{ 'data-testid': '1' }}
                                    />
                                </Grid>
                            </Grid>
                        </TabPanel>
                    </CardContent>
                </Card>

                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h6" color="primary">Runtime Governance Metrics (To Be Done)</Typography>
                    </CardContent>
                </Card>
            </Box >
        );
    }
}


const useStyles = theme => ({
    wrapIcon: {
        verticalAlign: 'middle',
        display: 'inline-flex'
    },
    head: {
        backgroundColor: blue[700],
        color: theme.palette.getContrastText(blue[700])
    },
});

DashboardComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(DashboardComponent);