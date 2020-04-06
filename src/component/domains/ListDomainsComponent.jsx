import React, {Component} from 'react'
import ApiService from "../../service/ApiService";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

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
            this.setState({domains: res.data.domains})
        });
    }

    render() {
        return (
            <Box>
            <Card variant="outlined">
                <CardContent>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>Domains List</Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>Domain / SubDomain Name</TableCell>
                            <TableCell>Description</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.domains.map ( row => (
                            <TableRow hover key = {row.id}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.name}</TableCell>
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

const style = {
    display: 'flex', 
    justifyContent: 'center'
}

export default ListDomainsComponent;