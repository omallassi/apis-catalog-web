import React, { Component } from 'react'
import ApiService from "../../service/ApiService";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chart from "react-google-charts";
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import SyncIcon from '@mui/icons-material/Sync';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import AssignmentIcon from '@mui/icons-material/Assignment';
import IconButton from '@mui/material/IconButton';
import TableChartTwoToneIcon from '@mui/icons-material/TableChartTwoTone';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { NIL as NIL_UUID } from 'uuid';
import { Grid, TableContainer } from '@mui/material';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import { blue } from '@mui/material/colors';

import Link from '@mui/material/Link';
import LinkIcon from '@mui/icons-material/Link';

import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';

import Tooltip from '@mui/material/Tooltip';

import CircularProgress from '@mui/material/CircularProgress';
import DoneIcon from '@mui/icons-material/Done';

import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';


class ListLayersComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            systems: [],
        }

        this.listAllSystems = this.listAllSystems.bind(this);
    }

    componentDidMount() {
        this.listAllSystems();
    }

    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return;
        };
    }

    listAllSystems() {
        ApiService.listAllSystems().then((res) => {
            console.log(res);

            this.setState({systems: res.data.systems });
        }).catch( (err) => {
            console.error("Error while getting systems " + err);
            this.setState({message: "Error while listing systems - " + err.message, message_level: 'error'});
        });
    }

    render() {
        let message_component;
        if (this.state.message)
        {
            message_component =  <Collapse in = {true} ><Alert severity={this.state.message_level} action={<IconButton aria-label="close" color={this.state.message_level} size="small"
                onClick={() => {
                 this.setState({message: ''});
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>}>
                  <AlertTitle><strong>{this.state.message_level}</strong></AlertTitle>
                  {this.state.message}
                </Alert></Collapse>
        }

        return (
            <Box>
                <Card variant="outlined">
                    <CardContent>
                        <Grid container>
                            <Grid item xs={11}>
                                <Typography variant="h6" color="primary">Systems & Layers Management</Typography>
                                {message_component}
                            </Grid>
                            <Grid item xs={1}></Grid>
                        </Grid>
                    </CardContent>
                    <CardContent>
                        <Grid container>
                            <Grid item xs={11}>
                                <Typography>The following table groups all defined layers per systems</Typography>
                            </Grid>
                            <Grid item xs={1}></Grid>
                        </Grid>
                    </CardContent>
                    <CardContent>
                    <CardContent>
                            <Grid container>
                                <Grid item xs={12}>
                                    <TableContainer>
                                        <Table className={this.props.classes.table}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell className={this.props.classes.head}></TableCell>
                                                    <TableCell className={this.props.classes.head} >
                                                        System Name
                                                    </TableCell>
                                                    <TableCell className={this.props.classes.head}>Layer Name</TableCell>
                                                    <TableCell className={this.props.classes.head}>Description</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {this.state.systems.map(row => ( 
                                                    row.layers.map( sub_row => (
                                                        <TableRow hover>
                                                            <TableCell><Avatar src={sub_row.image} /></TableCell>
                                                            <TableCell><Typography variant="button" display="block">{row.name}</Typography></TableCell>
                                                            <TableCell><Typography variant="button" display="block" color={sub_row.color}>{sub_row.name}</Typography></TableCell>
                                                            <TableCell>{sub_row.description}</TableCell>
                                                        </TableRow>
                                                    ))
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </CardContent>
                </Card>
            </Box >
        );
    }
}

const useStyles = theme => ({
    fab: {
        top: theme.spacing(0.5),
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        float: 'right'
    },
    head: {
        backgroundColor: blue[700],
        color: theme.palette.getContrastText(blue[700])
    },
    table_cell_is_empty: {
        color: theme.palette.error.dark
    }
});

ListLayersComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(ListLayersComponent);