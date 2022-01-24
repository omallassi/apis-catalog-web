import React, { Component } from 'react'
import ApiService from "../service/ApiService";
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import Chart from "react-google-charts";
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import SyncIcon from '@mui/icons-material/Sync';
import IconButton from '@mui/material/IconButton';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BlurLinearTwoToneIcon from '@mui/icons-material/BlurLinearTwoTone';

import { blue } from '@mui/material/colors';


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

    createDataTable(origin_data, merged_pull_requests) {
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

        //create data table and merge with PR
        var data = [];
        var data_columns = [];
        data_columns[0] = { type: 'datetime', label: 'Date' };
        data_columns[1] = { type: 'string', role: 'annotation' };
        data_columns[2] = { type: 'string', role: 'annotationText', 'p': { 'html': true } };

        for (var index in origin_data) {

            var data_point = new Array(columns.length + 3);

            data_point.fill(0);
            data_point[0] = new Date(origin_data[index][0]);
            data_point[1] = null;
            data_point[2] = null;

            for (var index_2 in merged_pull_requests) {
                var pr_date = new Date(merged_pull_requests[index_2].closedDate).toDateString();
                var ts_date = new Date(origin_data[index][0]).toDateString();
                if (pr_date == ts_date) {
                    data_point[1] = data_point[1] != null ?
                        data_point[1] + " " + merged_pull_requests[index_2].id : merged_pull_requests[index_2].id;
                    data_point[2] = data_point[2] != null ?
                        data_point[2] + " <br/>" + "id: " + merged_pull_requests[index_2].id
                        + " title: " + merged_pull_requests[index_2].title
                        + " author: " + merged_pull_requests[index_2].author.user.emailAddress : "id: " + merged_pull_requests[index_2].id
                        + " title: " + merged_pull_requests[index_2].title
                        + " author: " + merged_pull_requests[index_2].author.user.emailAddress;
                }
            }

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

            //go and get merged_pr
            ApiService.getMergedPr().then((res2) => {
                //endpoints_num
                var formatted_endpoints_num = [];
                for (var index in res.data.endpoints_num) {

                    var line_val = [];

                    line_val[0] = new Date(res.data.endpoints_num[index][0]);
                    line_val[1] = null;
                    line_val[2] = null;
                    line_val[3] = res.data.endpoints_num[index][1];

                    for (var index_2 in res2.data) {
                        var pr_date = new Date(res2.data[index_2].closedDate).toDateString();
                        var ts_date = new Date(res.data.endpoints_num[index][0]).toDateString();

                        if (pr_date == ts_date) {
                            line_val[1] = line_val[1] != null ?
                                line_val[1] + " " + res2.data[index_2].id : res2.data[index_2].id;
                            line_val[2] = line_val[2] != null ?
                                line_val[2] + " <br/>" + "id: " + res2.data[index_2].id
                                + " title: " + res2.data[index_2].title
                                + " author: " + res2.data[index_2].author.user.emailAddress : "id: " + res2.data[index_2].id
                                + " title: " + res2.data[index_2].title
                                + " author: " + res2.data[index_2].author.user.emailAddress;
                        }
                    }
                    formatted_endpoints_num[index] = line_val;
                }
                this.setState({ endpoints_num: formatted_endpoints_num });
                //
                var origin_data = res.data.zally_violations;
                var zally_violations = this.createDataTable(origin_data, res2.data);
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
                var endpoints_num_per_audience = this.createDataTable(origin_data, res2.data);

                this.setState({ endpoints_audience_num_columns: endpoints_num_per_audience.data_columns });
                this.setState({ endpoints_audience_num: endpoints_num_per_audience.data });
            })

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
                                <IconButton
                                    color="primary"
                                    aria-label="refresh"
                                    onClick={() => {
                                        ApiService.refreshMetrics();
                                    }}
                                    size="large">
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

                            <Tab label="Catalog" icon={<AssignmentIcon />} {...this.a11yProps(0)} />
                            <Tab label="Process" icon={<AssessmentIcon />} {...this.a11yProps(1)} />
                            <Tab label="Zally Violations" icon={<AssignmentLateIcon />} {...this.a11yProps(2)} />
                        </Tabs>
                        <TabPanel value={this.state.value} index={1}>
                            <Grid container direction="row" alignItems="center" spacing={10}>
                                <Grid item xs={12}>
                                    <Typography variant="body1" gutterBottom className={this.props.classes.wrapIcon}>
                                        <BlurLinearTwoToneIcon className={this.props.classes.linkIcon} style={{ fill: "#6573c3" }} />
                                        The following chart displays the # of opened Pull-Request
                                    </Typography>
                                    <Chart
                                        height={'600px'}
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
                                                keepInBounds: true,
                                                maxZoomIn: 0.01,
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
                                        height={'600px'}
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
                                                keepInBounds: true,
                                                maxZoomIn: 0.01,
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

                                                        <a className="MuiButtonBase-root MuiListItem-root MuiListItem-gutters MuiListItem-padding MuiListItem-button css-rxp3g8-MuiButtonBase-root-MuiListItem-root" tabIndex="0" role="button" aria-disabled="false"
                                                            href={process.env.REACT_APP_STASH_BASE_URL + "/pull-requests/" + row.id + "/overview"} target="_blank">
                                                            <div class="MuiListItemIcon-root css-cveggr-MuiListItemIcon-root"><svg class="MuiSvgIcon-root MuiSvgIcon-colorPrimary MuiSvgIcon-fontSizeMedium css-1vn2d77-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24">
                                                                <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"></path></svg></div>

                                                            <div className="MuiListItemText-root">
                                                                <span className="MuiTypography-root MuiListItemText-primary MuiTypography-body1 MuiTypography-displayBlock">{row.id}</span>
                                                            </div>
                                                        </a>

                                                    </TableCell>
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
                        <TabPanel value={this.state.value} index={0}>
                            <Typography variant="body1" gutterBottom>A Resource correspond to a Path in OpenAPI specification and can thus, support muliple operations (ie. GET, POST etc...)</Typography>
                            <Grid container direction="row" alignItems="center" spacing={10}>
                                <Grid item xs={12}>
                                    <Typography variant="body1" gutterBottom className={this.props.classes.wrapIcon}>
                                        <BlurLinearTwoToneIcon className={this.props.classes.linkIcon} style={{ fill: "#6573c3" }} />
                                        The following chart displays the evolution of (REST) resources
                                    </Typography>
                                    <Chart
                                        height={'600px'}
                                        chartType="LineChart"
                                        loader={<div>Loading Chart</div>}
                                        columns={[{ type: 'datetime', label: 'Date' }, { type: 'string', role: 'annotation' }, { type: 'string', role: 'annotationText', 'p': { 'html': true } }, '# of (REST) Paths']}
                                        // columns={['Date', '# of (REST) Operations']}
                                        rows={this.state.endpoints_num}
                                        options={{
                                            title: "Number of (REST) Resources",
                                            //curveType: 'function',
                                            lineWidth: 3,
                                            explorer: {
                                                actions: ['dragToZoom', 'rightClickToReset'],
                                                axis: 'horizontal',
                                                keepInBounds: true,
                                                maxZoomIn: 0.01,
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
                                            tooltip: { isHtml: true }
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
                                        height={'600px'}
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
                                                keepInBounds: true,
                                                maxZoomIn: 0.01,
                                            },
                                            intervals: { style: 'line' },
                                            hAxis: {
                                                title: 'Date',
                                            },
                                            vAxis: {
                                                title: '# of endpoints',
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
                                            tooltip: { isHtml: true }
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
                                        height={'600px'}
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
                                                keepInBounds: true,
                                                maxZoomIn: 0.01,
                                            },
                                            intervals: { style: 'line' },
                                            hAxis: {
                                                title: 'Date',
                                            },
                                            vAxis: {
                                                title: '# of zally-ignore',
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
                                            tooltip: { isHtml: true }
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