import React, { Component } from 'react'
import ApiService from "../../service/ApiService";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Chart from "react-google-charts";

class ListDomainsComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            domains: [],
            stats: []
        }

        this.listAllDomains = this.listAllDomains.bind(this);
    }

    componentDidMount() {
        this.listAllDomains();
    }

    listAllDomains() {
        ApiService.listAllDomains().then((res) => {
            this.setState({ domains: res.data.domains })
        });
        //
        ApiService.getDomainsMetrics().then((res) => {
            var response = res.data;
            var data_table = [['Name', 'Parent', 'Resources Number (num)']]

            var max = 2;
            for (var index in response) {
                console.log(data_table.length);
                console.log([response[index].name, response[index].parent, response[index].value]);

                data_table[data_table.length] = [response[index].name, response[index].parent, response[index].value];
            }

            console.log(data_table);

            //we should map it to
            //[
            //    ['Location','Parent','Resources Number (num)'],
            //    ['All', null, 0],
            //    ['iam', 'All', 0],
            //    ['xva-management', 'All', 0],
            //    ['authn', 'iam', 11],
            //    ['authz', 'iam', 52],
            //]

            this.setState({ stats: data_table })
        });
    }

    render() {
        return (
            <Box>
                <Card variant="outlined">
                    <CardContent>
                        <Typography component="h2" variant="h6" color="primary" gutterBottom>Domains Statistics</Typography>
                        <Typography variant="body1" gutterBottom>
                            The following diagram displays volume of endpoints per doamin and subdomains.
                        </Typography>
                        <Chart
                            chartType="TreeMap"
                            loader={<div>Loading Chart</div>}
                            data={this.state.stats}
                            options={{
                                highlightOnMouseOver: true,
                                minHighlightColor: '#8c6bb1',
                                midHighlightColor: '#9ebcda',
                                maxHighlightColor: '#edf8fb',
                                minColor: '#009688',
                                midColor: '#f7f7f7',
                                maxColor: '#ee8100',
                                headerHeight: 15,
                                height: 600,
                                // fontColor: 'black',
                                showScale: true,
                                generateTooltip: (row, size, value) => {
                                    return (
                                        '<div style="background:#fd9; padding:10px; border-style:solid"> row: ' +
                                        row +
                                        ' size: ' +
                                        size +
                                        ' val: ' +
                                        value +
                                        '</div>'
                                    )
                                },
                            }}
                            rootProps={{ 'data-testid': '1' }}
                        />
                    </CardContent>
                    <CardContent>
                        <Typography component="h2" variant="h6" color="primary" gutterBottom>Domains List</Typography>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Domain / SubDomain Name</TableCell>
                                    <TableCell>Id</TableCell>
                                    <TableCell>Description</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.domains.map(row => (
                                    <TableRow hover key={row.id}>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>{row.description}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </Box>
        );
    }
}

export default ListDomainsComponent;