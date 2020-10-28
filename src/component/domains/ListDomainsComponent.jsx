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
            var data_table = [['Name', 'Parent', 'Resources Number (num)'], ['Global', null, 0]]

            var max = 2;
            for (var index in response) {
                //column 0 is the ID and must be unique
                data_table[data_table.length] = [response[index].name, response[index].parent, response[index].value];
            }

            console.log(data_table);
            console.log(data_table.length);

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
                            The following diagram displays volume of resources per domain and subdomains, based on the Open API Specifications.
                        </Typography>
                        <Chart
                            chartType="TreeMap"
                            loader={<div>Loading Chart</div>}
                            data={this.state.stats}
                            options={{
                                highlightOnMouseOver: true,
                                maxDepth: 1,
                                maxPostDepth: 2,
                                minHighlightColor: '#ABB2B9',
                                midHighlightColor: '#7F8C8D',
                                maxHighlightColor: '#283747',
                                minColor: '#AED6F1',
                                midColor: '#3498DB',
                                maxColor: '#1B4F72',
                                headerHeight: 15,
                                height: 600,
                                // fontColor: 'black',
                                showScale: true,
                                generateTooltip: (row, size, value) => {
                                    return (
                                        '<div style="background:#F5B041; border-radius: 8px; padding:8px"> # of resources: ' +
                                        size +
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