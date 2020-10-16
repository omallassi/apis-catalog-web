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
                            data={[
                                [
                                    'Location',
                                    'Parent',
                                    'Market trade volume (size)',
                                ],
                                ['All', null, 0],
                                ['iam', 'All', 0],
                                ['xva-management', 'All', 0],
                                ['domain2', 'All', 0],
                                ['domain3', 'All', 0],
                                ['domain1', 'All', 0],
                                ['authn', 'iam', 11],
                                ['authz', 'iam', 52],
                                ['France', 'xva-management', 42],
                                ['Germany', 'xva-management', 31],
                                ['Sweden', 'xva-management', 22],
                                ['Italy', 'xva-management', 17],
                                ['UK', 'xva-management', 21],
                                ['domain2.1', 'domain2', 36],
                                ['domain2.2', 'domain2', 20],
                                ['domain2.1.1', 'domain2.2', 40],
                                ['Egypt', 'domain1', 21],
                                ['S. Africa', 'domain1', 30],
                                ['Sudan', 'domain1', 12],
                                ['Congo', 'domain1', 10],
                                ['Zaire', 'domain1', 8],
                            ]}
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