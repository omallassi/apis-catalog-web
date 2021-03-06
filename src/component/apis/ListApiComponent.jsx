import React, { Component } from 'react'
import ApiService from "../../service/ApiService";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import Typography from '@material-ui/core/Typography';
import { Link } from '@material-ui/core';
import ApiDetailsComponent from './ApiDetailsComponent';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { deepOrange, green, blue, grey } from '@material-ui/core/colors';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


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
            this.setState({ apis: res.data.apis })
        });
    }

    displaySpecsForApi(id, name) {
        this.setState({ showDetails: true });
        this.setState({ selectedApi: id });

        if (this.apiDetails.current !== null) {
            this.apiDetails.current.updateSelectedApi(id);
        }
    }

    statusClass(classes, status) {
        if (status === "VALIDATED")
            return classes.validated;
        else if (status === "DEPRECATED")
            return classes.deprecated;
        else
            return classes.none;
    }

    render() {
        const { classes } = this.props;
        return (
            <Box>
                <Card variant="outlined">
                    <CardContent>
                        <Typography component="h2" variant="h6" color="primary">APIs List</Typography>
                        <TableContainer>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={this.props.classes.head}>Name</TableCell>
                                        <TableCell className={this.props.classes.head}>Domain Name</TableCell>
                                        <TableCell className={this.props.classes.head}>Version</TableCell>
                                        <TableCell className={this.props.classes.head}>Tier</TableCell>
                                        <TableCell className={this.props.classes.head}>Status</TableCell>
                                        {/* <TableCell>Domain Id</TableCell> */}
                                        <TableCell className={this.props.classes.head}>Product Manager</TableCell>
                                        <TableCell className={this.props.classes.head}>Architect</TableCell>
                                        <TableCell className={this.props.classes.head}>Spec Ids</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.apis.map(row => (
                                        <TableRow hover key={row.id}>
                                            <TableCell component="th" scope="row">
                                                <Link component="button" variant="body2" onClick={() => {
                                                    this.displaySpecsForApi(row.id)
                                                }}>
                                                    {row.name}
                                                </Link>
                                            </TableCell>
                                            <TableCell>{row.domain_name}</TableCell>
                                            <TableCell>TBD</TableCell>
                                            <TableCell>
                                                <Typography className={classes.layer}>{row.tier}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography className={this.statusClass(classes, row.status)}>{row.status}</Typography>
                                            </TableCell>
                                            {/* <TableCell>{row.domain_id}</TableCell> */}
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
                    this.state.showDetails ? <ApiDetailsComponent ref={this.apiDetails} api={this.state.selectedApi} /> : null
                }
            </Box>

        );
    }
}

const useStyles = theme => ({
    display: 'flex',
    justifyContent: 'center',
    deprecated: {
        color: theme.palette.getContrastText(deepOrange[500]),
        padding: '.3em .3em .3em .3em',
        margin: 'auto',
        textAlign: 'center',
        verticalAlign: 'middle',
        fontWeight: '500',
        borderRadius: '.25em',
        fontSize: '90%',
        backgroundColor: deepOrange[500],
    },
    validated: {
        color: theme.palette.getContrastText(green[300]),
        padding: '.3em .3em .3em .3em',
        margin: 'auto',
        textAlign: 'center',
        verticalAlign: 'middle',
        fontWeight: '500',
        borderRadius: '.25em',
        fontSize: '90%',
        backgroundColor: green[300],
    },
    none: {
        color: theme.palette.getContrastText(grey[900]),
        padding: '.3em .3em .3em .3em',
        margin: 'auto',
        textAlign: 'center',
        verticalAlign: 'middle',
        fontWeight: '500',
        borderRadius: '.25em',
        fontSize: '90%',
        backgroundColor: grey[900],
    },
    layer: {
        color: theme.palette.getContrastText(blue[700]),
        padding: '.3em .3em .3em .3em',
        margin: 'auto',
        textAlign: 'center',
        verticalAlign: 'middle',
        fontWeight: '500',
        borderRadius: '.25em',
        fontSize: '90%',
        backgroundColor: blue[700],
        textTransform: 'uppercase'
    },
    head: {
        backgroundColor: blue[700],
        color: theme.palette.getContrastText(blue[700])
    },
});

ListApiComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(ListApiComponent);