import React, { Component } from 'react'
import ApiService from "../../service/ApiService";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import { blue } from '@material-ui/core/colors';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

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