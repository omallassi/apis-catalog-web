import React, { Component } from 'react'
import ApiService from "../../service/ApiService";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { blue } from '@mui/material/colors';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

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

    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return;
        };
    }

    listAllEnvs() {
        ApiService.listAllEnvs().then((res) => {
            this.setState({ envs: res.data.envs })
        });
    }

    render() {
        const { classes } = this.props;

        return (
            <Box>
                <Card variant="outlined">
                    <CardContent>
                        <Typography component="h2" variant="h6" color="primary" gutterBottom>Envs List</Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={this.props.classes.head} />
                                        <TableCell className={this.props.classes.head}>Env Name</TableCell>
                                        <TableCell className={this.props.classes.head}>Id</TableCell>
                                        <TableCell className={this.props.classes.head}>Description</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.envs.map(row => (
                                        <TableRow hover key={row.id}>
                                            <TableCell><Avatar className={classes.avatar}>{row.id}</Avatar></TableCell>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>{row.id}</TableCell>
                                            <TableCell>{row.description}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            </Box>
        );
    }
}

const useStyles = theme => ({
    display: 'flex',
    justifyContent: 'center',
    avatar: {
        color: theme.palette.getContrastText(blue[700]),
        backgroundColor: blue[700],
        fontSize: '90%',
    },
    head: {
        backgroundColor: blue[700],
        color: theme.palette.getContrastText(blue[700])
    },
});

ListEnvsComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(ListEnvsComponent);