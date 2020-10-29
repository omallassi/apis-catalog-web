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
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import SyncIcon from '@material-ui/icons/Sync';
import IconButton from '@material-ui/core/IconButton';
import { NIL as NIL_UUID } from 'uuid';
import { Grid } from '@material-ui/core';

import Paper from '@material-ui/core/Paper';
import { blue } from '@material-ui/core/colors';


class ListDomainsComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            domains: [],
            stats: [],
            showDomainEditor: false,
            domainEditorError: "",
            domain: { name: "", description: "" }
        }

        this.listAllDomains = this.listAllDomains.bind(this);
        this.buildDomainTreeMap = this.buildDomainTreeMap.bind(this);
        //
        // this.domainEditorRef = React.createRef();
    }

    componentDidMount() {
        this.listAllDomains();
        this.buildDomainTreeMap();
    }

    listAllDomains() {
        ApiService.listAllDomains().then((res) => {
            console.log(res);
            this.setState({ domains: res.data.domains });
        });
    }

    buildDomainTreeMap() {
        //
        ApiService.getDomainsMetrics().then((res) => {
            var response = res.data;
            var data_table = [['Name', 'Parent', 'Resources Number (num)'], ['Global', null, 0]]

            for (var index in response) {
                //column 0 is the ID and must be unique
                data_table[data_table.length] = [response[index].name, response[index].parent, response[index].value];
            }

            console.log(data_table);
            console.log(data_table.length);

            //we should map it to
            //[
            //    ['Location','Parent','Resources Number (num)'],
            //    ['All', null, 0],
            //    ['iam', 'All', 0],
            //    ['xva-management', 'All', 0],
            //    ['authn', 'iam', 11],
            //    ['authz', 'iam', 52],
            //]

            this.setState({ stats: data_table })
        });
    }

    handleClickOpen = () => {
        this.setState({ showDomainEditor: true, domainEditorError: "" });
    };

    handleClose = () => {
        this.setState({ showDomainEditor: false });
    };

    createDomain = (event) => {
        event.preventDefault();
        ApiService.createDomain({ id: NIL_UUID, name: this.state.name, description: this.state.description }).then((response) => {
            this.listAllDomains();
            this.setState({ showDomainEditor: false });
        }, (error) => {
            console.log(error);
            this.setState({ domainEditorError: error + "" });
        });
    }


    deleteDomain = (id) => {
        ApiService.deleteDomain(id).then((response) => {
            this.listAllDomains();
        }, (error) => {
            console.log(error);
        });
    }

    render() {
        return (
            <Box>
                <Card variant="outlined">
                    <CardContent>
                        <Typography component="h2" variant="h6" color="primary" gutterBottom>Domains Statistics</Typography>
                        <Typography variant="body1" gutterBottom>
                            The following diagram displays volume of resources per domain and subdomains, based on the Open API Specifications.
                        </Typography>
                        <Chart
                            chartType="TreeMap"
                            loader={<div>Loading Chart</div>}
                            data={this.state.stats}
                            options={{
                                highlightOnMouseOver: true,
                                maxDepth: 1,
                                maxPostDepth: 2,
                                minHighlightColor: '#ABB2B9',
                                midHighlightColor: '#7F8C8D',
                                maxHighlightColor: '#283747',
                                minColor: '#AED6F1',
                                midColor: '#3498DB',
                                maxColor: '#1B4F72',
                                headerHeight: 15,
                                height: 1000,
                                // fontColor: 'black',
                                showScale: true,
                                generateTooltip: (row, size, value) => {
                                    return (
                                        '<div style="background:#F5B041; border-radius: 8px; padding:8px"> # of resources: ' +
                                        size +
                                        '</div>'
                                    )
                                },
                            }}
                            rootProps={{ 'data-testid': '1' }}
                        />
                    </CardContent>
                    <CardContent>
                        <Grid container>
                            <Grid item xs={11}>
                                <Typography component="h2" variant="h6" color="primary" gutterBottom>Domains Catalog</Typography>
                            </Grid>
                            <Grid item xs={1}>
                                {/* <Fab
                            color="primary"
                            aria-label="add"
                            variant="extended"
                            className={this.props.classes.fab}
                            component={Link}
                            onClick={() => this.handleClickOpen()}
                            to="#"
                        >
                            <AddCircleTwoToneIcon />Add new domain
                        </Fab> */}

                                <IconButton className={this.props.classes.fab} color="primary" variant="outlined" aria-label="refresh" onClick={() => this.handleClickOpen()}>
                                    <AddCircleIcon color="primary" />
                                </IconButton>
                                <IconButton className={this.props.classes.fab} color="primary" variant="outlined" aria-label="refresh" onClick={() => { this.listAllDomains() }}>
                                    <SyncIcon color="primary"></SyncIcon>
                                </IconButton>
                                {/* <Button color="primary" className={this.props.classes.fab} onClick={() => this.handleClickOpen()}>
                            <AddCircleTwoToneIcon />Add new domain
                        </Button> */}
                                {/* <DomainEditor ref={this.domainEditorRef} /> */}
                                <Dialog fullWidth maxWidth="md" open={this.state.showDomainEditor} onClose={() => this.handleClose()} aria-labelledby="form-dialog-title">
                                    <DialogTitle id="form-dialog-title">Create a new Domain/SubDomain</DialogTitle>
                                    {/* <form onSubmit={() => this.handleSubmit()}> */}
                                    <DialogContent>
                                        {/* <DialogContentText>
                                    To subscribe to this website, please enter your email address here. We will send updates
                                    occasionally.
                                </DialogContentText> */}
                                        <form className={this.props.classes.root} noValidate autoComplete="on">
                                            <TextField
                                                required
                                                autoFocus
                                                margin="dense"
                                                id="domain"
                                                label="Domain / SubDomain Name"
                                                fullWidth
                                                onInput={e => this.setState({ name: e.target.value })}
                                            />
                                            <TextField
                                                required
                                                margin="dense"
                                                id="description"
                                                label="Description"
                                                type="description"
                                                multiline
                                                rows="4"
                                                rowsMax="4"
                                                fullWidth
                                                onInput={e => this.setState({ description: e.target.value })}
                                            />
                                            <Typography variant="body1" color="error" gutterBottom>{this.state.domainEditorError}</Typography>
                                        </form>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={() => this.handleClose()} >Cancel</Button>
                                        <Button onClick={(e) => this.createDomain(e)} type="submit" color="primary">Create</Button>
                                    </DialogActions>
                                    {/* </form> */}
                                </Dialog>
                                {/* <Route exact path="/domains/new" render={this.renderDomainEditor()} /> */}
                            </Grid>
                            <Grid item xs={12}>
                                <Table className={this.props.classes.table} component={Paper}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className={this.props.classes.head}>Domain / SubDomain Name</TableCell>
                                            <TableCell className={this.props.classes.head}>Description</TableCell>
                                            <TableCell className={this.props.classes.head}>Id</TableCell>
                                            <TableCell className={this.props.classes.head} />
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.state.domains.map(row => (
                                            <TableRow hover key={row.id}>
                                                <TableCell>{row.name}</TableCell>
                                                <TableCell>{row.description}</TableCell>
                                                <TableCell>{row.id}</TableCell>
                                                <TableCell>
                                                    <IconButton color="primary" variant="outlined" aria-label="refresh" onClick={() => { this.deleteDomain(row.id) }}>
                                                        <DeleteOutlineIcon color="primary"></DeleteOutlineIcon>
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Grid>
                        </Grid>
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
});

ListDomainsComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(ListDomainsComponent);