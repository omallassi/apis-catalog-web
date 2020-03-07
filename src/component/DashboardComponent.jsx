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

class ListApiComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            apis: [],
        }

        this.listAllApis = this.listAllApis.bind(this);
    }

    componentDidMount() {
        this.listAllApis();
    }

    listAllApis() {
        ApiService.listAllApis().then((res) => {
            this.setState({apis: res.data.apis})
        });
    }

    render() {
        return (
            <div>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>Dashbaord</Typography>
            </div>
        );
    }
}

const style = {
    display: 'flex', 
    justifyContent: 'center'
}

export default ListApiComponent;