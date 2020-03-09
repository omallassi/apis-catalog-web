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

class ListEnvsComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            envs: [],
        }

        this.listAllEnvs = this.listAllEnvs.bind(this);
    }

    componentDidMount() {
        this.listAllEnvs();
    }

    listAllEnvs() {
        ApiService.listAllEnvs().then((res) => {
            this.setState({envs: res.data.envs})
        });
    }

    render() {
        return (
            <div>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>Envs List</Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>Env Name</TableCell>
                            <TableCell>Description</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.envs.map ( row => (
                            <TableRow hover key = {row.id}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.description}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    }
}

const style = {
    display: 'flex', 
    justifyContent: 'center'
}

export default ListEnvsComponent;