import React, {Component} from 'react'
import ApiService from "../service/ApiService";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import { Box } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Chart from "react-google-charts";
import Grid from '@material-ui/core/Grid';

class ListApiComponent extends Component {
    data_points = [];

    constructor(props) {
        super(props)
        this.state = {
            pr_num: [],
            pr_ages: [],
            endpoints_num: [],
        }

        this.getPullRequestNumber = this.getPullRequestNumber.bind(this);
    }

    componentDidMount() {
        this.getPullRequestNumber();
    }

    getPullRequestNumber() {
        const t = this;
        ApiService.getPullRequestNumber().then((res) => {
            this.setState({pr_num: res.data.pr_num});
            this.setState({pr_ages: res.data.pr_ages});
            this.setState({endpoints_num: res.data.endpoints_num});
        });
    }

    render() {    
        return (
            <Paper>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>Dashboard</Typography>
                <Paper>
                        <Typography component="h6" variant="h6" color="inherit" gutterBottom>Design Time Governance Metrics</Typography>
                        <Grid container direction="row" alignItems="center" >
                            <Grid item>
                                <Chart
                                    width={'600px'}
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
                            <Grid item>
                            <Chart
                                width={'600px'}
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
                            <Grid item>
                            <Chart
                                width={'600px'}
                                height={'400px'}
                                chartType="LineChart"
                                loader={<div>Loading Chart</div>}
                                columns={['Date', '# of Operations']}
                                rows={this.state.endpoints_num}
                                options={{
                                    title: "Number of Operations",
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
                </Paper>
                {/* <Paper>
                    <Box component="span" m={1}>
                        <Typography component="h6" variant="h6" color="inherit" gutterBottom>Runtime Governance Metrics</Typography>
                    </Box>
                </Paper> */}
            </Paper>
        );
    }
}

const style = {
    display: 'flex', 
    justifyContent: 'center'
}

export default ListApiComponent;