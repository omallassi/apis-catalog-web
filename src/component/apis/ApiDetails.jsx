import React, {Component} from 'react'
import ApiService from "../../service/ApiService";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import Typography from '@material-ui/core/Typography';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link, Divider } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { spacing } from '@material-ui/system';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core/styles';

class ApiDetails extends Component {

    constructor(props) {
        super(props)
        this.state = {
            api: props.api,
            name: props.api_name,
            specs: [],
            deployments: []
        }

        this.listSpecsForApi = this.listSpecsForApi.bind(this);
        this.listDeploymentsForApi = this.listDeploymentsForApi.bind(this);
        this.updateSelectedApi = this.updateSelectedApi.bind(this);
    }

    componentDidMount() {
    }

    listSpecsForApi(id) {
        ApiService.listSpecsForApi(id).then((res) => {
            this.setState( {specs: res.data.specs} );
        });
    }

    listDeploymentsForApi(id) {
        ApiService.listDeploymentsForApi(id).then( (res) => {
            this.setState( {deployments: res.data.deployments} );
        });
    }

    updateSelectedApi(api, name) {
        this.setState( {api: api} );
        this.setState( {name: name} );
        this.listSpecsForApi(api);
        this.listDeploymentsForApi(api);
    }

    render() {
        //const classes = useStyles();

        return (
            <Box component="span" m={1}>
            <Paper>
                <Typography component="h6" variant="h6" color="inherit" gutterBottom>Specification Details for API [{this.state.name}]</Typography>
                <TableContainer>
                <Table stickyHeader>
                    <TableHead>
                    <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell>Name</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            this.state.specs.map ( row => (
                                <TableRow hover key = {row.id}>
                                    <TableCell component="th" scope="row">
                                        {row.id}
                                    </TableCell>
                                    <TableCell>{row.name}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
                </TableContainer>
            </Paper>
            <Paper>
                <Typography component="h6" variant="h6" color="inherit" gutterBottom>Deployments Details for API [{this.state.name}]</Typography>
                <TableContainer>
                <Table stickyHeader>
                    <TableHead>
                    <TableRow>
                        <TableCell>Env Id</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Api Id</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            this.state.deployments.map ( row => (
                                <TableRow hover key = {row.id}>
                                    <TableCell component="th" scope="row">
                                        {row.env}
                                    </TableCell>
                                    <TableCell>TBD</TableCell>
                                    <TableCell>{row.api}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
                </TableContainer>
            </Paper>
            </Box>  
        );
    }
}

const style = {
    display: 'flex', 
    justifyContent: 'center'
}

export default ApiDetails;