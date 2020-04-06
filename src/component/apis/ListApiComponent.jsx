import React, {Component} from 'react'
import ApiService from "../../service/ApiService";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import Typography from '@material-ui/core/Typography';
import { Link } from '@material-ui/core';
import ApiDetails from './ApiDetails';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

class ListApiComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            apis: [],
            showDetails: false, 
            selectedApi: 0
        }

        this.apiDetails = React.createRef();

        this.listAllApis = this.listAllApis.bind(this);
        this.displaySpecsForApi = this.displaySpecsForApi.bind(this);
    }

    componentDidMount() {
        this.listAllApis();
    }

    listAllApis() {
        ApiService.listAllApis().then((res) => {
            this.setState({apis: res.data.apis})
        });
    }

    displaySpecsForApi(id, name) {
        this.setState({showDetails: true});        
        this.setState({selectedApi: id});
        this.setState({selectedApiName: name});
        if (this.apiDetails.current !== null) {
            this.apiDetails.current.updateSelectedApi(id, name);
        }
    }

    render() {
        const {classes} = this.props;

        return (
            <Box>
            <Card variant="outlined">
                <CardContent>
                <Typography component="h2" variant="h6" color="primary">APIs List</Typography>
                <TableContainer>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>Id</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Version</TableCell>
                                <TableCell>Domain Id</TableCell>
                                <TableCell>Domain Name</TableCell>
                                <TableCell>Product Manager</TableCell>
                                <TableCell>Architect</TableCell>
                                <TableCell>Spec Ids</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.apis.map ( row => (
                                <TableRow hover key = {row.id}>
                                    <TableCell component="th" scope="row">
                                        <Link component="button" variant="body2" onClick={() => {
                                            this.displaySpecsForApi(row.id, row.name)
                                        }}>
                                            {row.id}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>TBD</TableCell>
                                    <TableCell>{row.domain_id}</TableCell>
                                    <TableCell>{row.domain_name}</TableCell>
                                    <TableCell>TBD</TableCell>
                                    <TableCell>TBD</TableCell>
                                    <TableCell>{row.spec_ids}</TableCell>
                                    {/* <TableCell align="right" onClick={() => this.editUser(row.id)}><CreateIcon /></TableCell>
                                    <TableCell align="right" onClick={() => this.deleteUser(row.id)}><DeleteIcon /></TableCell> */}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                </CardContent>
                </Card>
                <Divider />
                { 
                    this.state.showDetails ?  <ApiDetails ref={this.apiDetails} api={this.state.selectedApi} api_name={this.state.selectedApiName}/> : null 
                }
            
        </Box>
            
        );
    }
}

const style = {
    display: 'flex', 
    justifyContent: 'center'
}

export default ListApiComponent;