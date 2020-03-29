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
        }

        this.getPullRequestNumber = this.getPullRequestNumber.bind(this);
    }

    componentDidMount() {
        this.getPullRequestNumber();
    }

    getPullRequestNumber() {
        // var data_points = [];
        const t = this;
        ApiService.getPullRequestNumber().then((res) => {
            console.log("Response Status " + res.status);
                this.setState({pr_num: res.data.pr_num});
        });
    }

    render() {
        var data_points = this.state.pr_num;
        
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
                                    rows={data_points}
                                    options={{
                                        // title: "Pull Requests #",
                                        // curveType: "function",
                                        // legend: { position: "bottom",},
                                        hAxis: {
                                        title: 'Date',
                                        },
                                        vAxis: {
                                        title: '#',
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
                                data={[
                                    ['x', 'Pull Request Avg Duration'],
                                    [0, 0],
                                    [1, 5],
                                    [2, 5],
                                    [3, 5],
                                    [4, 6],
                                    [5, 5],
                                    [6, 7],
                                    [7, 10],
                                    [8, 8],
                                    [9, 5],
                                    [10, 4],
                                    [11, 5],
                                ]}
                                options={{
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
                                data={[
                                    ['x', '# of endpoints'],
                                    [0, 1],
                                    [1, 1],
                                    [2, 1],
                                    [3, 5],
                                    [4, 5],
                                    [5, 5],
                                    [6, 5],
                                    [7, 10],
                                    [8, 11],
                                    [9, 11],
                                    [10, 11],
                                    [11, 12],
                                ]}
                                options={{
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
                                data={[
                                    ['x', '# of deprecated APIs (before retirement'],
                                    [0, 0],
                                    [1, 0],
                                    [2, 0],
                                    [3, 0],
                                    [4, 0],
                                    [5, 0],
                                    [6, 0],
                                    [7, 0],
                                    [8, 1],
                                    [9, 1],
                                    [10, 1],
                                    [11, 0],
                                ]}
                                options={{
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
                <Paper>
                    <Box component="span" m={1}>
                        <Typography component="h6" variant="h6" color="inherit" gutterBottom>Runtime Governance Metrics</Typography>
                    </Box>
                </Paper>
            </Paper>
        );
    }
}

const style = {
    display: 'flex', 
    justifyContent: 'center'
}

export default ListApiComponent;