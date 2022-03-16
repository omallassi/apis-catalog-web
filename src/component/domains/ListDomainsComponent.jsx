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

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Box>{children}</Box>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

class ListDomainsComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            domains: [],
            stats: [],
            errors: [],
            showDomainEditor: false,
            showErrorEditor: false,
            errorMessage: "",
            domainEditorError: "",
            domain: { name: "", description: "", owner: "" },
            is_domain_repo_read_only: false,
            value: 0,
            message: '',
            message_level: '',
        }

        this.listAllDomains = this.listAllDomains.bind(this);
        this.buildDomainTreeMap = this.buildDomainTreeMap.bind(this);
        this.listAllDomainsErrors = this.listAllDomainsErrors.bind(this);
        //
        // this.domainEditorRef = React.createRef();
    }

    componentDidMount() {
        this.listAllDomains();
        this.listAllDomainsErrors();
        this.buildDomainTreeMap();
    }

    listAllDomains() {
        ApiService.listAllDomains().then((res) => {
            console.log(res);

            var sorted_domains = res.data.domains.sort((a, b) => {
                return a.name.localeCompare(b.name);
            });

            this.setState({ is_domain_repo_read_only: res.data.is_read_only, domains: sorted_domains });
        }).catch( (err) => {
            console.error("Error while getting domain stats " + err);
            this.setState({message: "Error while listing domains - " + err.message, message_level: 'error'});
        });
    }

    listAllDomainsErrors() {
        ApiService.listAllDomainsErrors().then((res) => {
            console.log(res);
            this.setState({ errors: res.data.errors });
        }).catch( (err) => {
            console.error("Error while getting domain stats " + err);
            this.setState({message: "Error while loading domains - " + err.message, message_level: 'error'});
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

            console.debug(data_table);
            console.debug(data_table.length);

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
        }).catch( (err) => {
            console.error("Error while getting domain stats " + err);
            this.setState({message: "Error while loading domain statistics - " + err.message, message_level: 'error'});
        });
    }

    handleClickOpen = () => {
        this.setState({ showDomainEditor: true, domainEditorError: "" });
    };

    handleClose = () => {
        this.setState({ showDomainEditor: false });
        this.setState({ showErrorEditor: false, errorMessage: "" });
    };

    createDomain = (event) => {
        event.preventDefault();
        ApiService.createDomain({
            id: NIL_UUID,
            name: this.state.name,
            description: this.state.description,
            owner: this.state.owner
        }).then((response) => {
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
            console.log(error.response.status);
            //display message
            this.setState({ showErrorEditor: true, errorMessage: error + "" });
        });
    }

    a11yProps(index) {
        return {
            id: `full-width-tab-${index}`,
            'aria-controls': `full-width-tabpanel-${index}`,
        };
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
                                <Typography variant="h6" color="primary">Domain Management</Typography>
                                {message_component}
                            </Grid>
                            <Grid item xs={1}></Grid>
                        </Grid>
                    </CardContent>
                    <CardContent>
                        <Tabs
                            value={this.state.value}
                            onChange={(event, newValue) => this.setState({ value: newValue })}
                            indicatorColor="primary"
                            textColor="primary">
                            <Tab label="Domain Statistics" icon={<TableChartTwoToneIcon />} {...this.a11yProps(0)} />
                            <Tab label="Violation(s)" icon={<AssignmentLateIcon />} {...this.a11yProps(1)} />
                            <Tab label="Domain Catalog" icon={<AssignmentIcon />} {...this.a11yProps(2)} />
                        </Tabs>
                        <TabPanel value={this.state.value} index={0}>
                            <CardContent>
                                <Typography variant="body1" gutterBottom>
                                    The following diagram displays volume of resources per domain and subdomains, based on the Open API Specifications (available in git).
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

                        </TabPanel>

                        <TabPanel value={this.state.value} index={1}>
                            <CardContent>
                                <Grid container>
                                    <Grid item xs={12}>
                                        {Array.isArray(this.state.errors) && this.state.errors.length > 0 && (
                                            <Typography variant="body1" gutterBottom>
                                                The following table lists the OpenAPI Specifications whose domain is not in "Domains Catalog"
                                            </Typography>
                                        )}
                                    </Grid>
                                    <Grid item xs={12}>
                                        {Array.isArray(this.state.errors) && this.state.errors.length > 0 && (
                                            <TableContainer>
                                                <Table className={this.props.classes.table}>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell className={this.props.classes.head} ></TableCell>
                                                            <TableCell className={this.props.classes.head} >
                                                                OpenAPI Specification
                                                            </TableCell>
                                                            <TableCell className={this.props.classes.head}>Declared Domain</TableCell>
                                                            <TableCell className={this.props.classes.head}># of resources</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {this.state.errors.map(row => (
                                                            <TableRow hover key={row.spec_path}>
                                                                <TableCell>
                                                                    <ErrorOutlineIcon color="error" />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <LinkIcon/>
                                                                    <Link href={process.env.REACT_APP_STASH_BASE_URL + "/browse/catalog/" + row.spec_path} target="_blank">{row.spec_path}</Link>
                                                                </TableCell>
                                                                <TableCell>{row.spec_domain}</TableCell>
                                                                <TableCell>{row.resources}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        )}
                                        {Array.isArray(this.state.errors) && this.state.errors.length === 0 && (
                                            <Alert severity="info">
                                                <strong>No</strong> violation detected.
                                            </Alert>
                                        )}
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </TabPanel>

                        <TabPanel value={this.state.value} index={2}>
                            <CardContent>
                                <Grid container>
                                    <Grid item xs={11}>
                                        <Typography variant="body1" gutterBottom>
                                            The following table is the list of "declared" Domains and Subdomains.
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <IconButton
                                            className={this.props.classes.fab}
                                            color="primary"
                                            variant="outlined"
                                            aria-label="refresh"
                                            onClick={ () => {
                                                if (! this.state.is_domain_repo_read_only)
                                                    this.handleClickOpen()
                                            } }
                                            size="large">
                                            <Tooltip title = "Add Domain">
                                                <AddCircleIcon color={this.state.is_domain_repo_read_only? "disabled": "primary"} />
                                            </Tooltip>
                                        </IconButton>
                                        <IconButton
                                            className={this.props.classes.fab}
                                            color="primary"
                                            variant="outlined"
                                            aria-label="refresh"
                                            onClick={() => { this.listAllDomains() }}
                                            size="large">
                                            <SyncIcon color="primary"></SyncIcon>
                                        </IconButton>
                                       
                                        <Dialog fullWidth maxWidth="md" open={this.state.showDomainEditor} onClose={() => this.handleClose()} aria-labelledby="form-dialog-title">
                                            <DialogTitle id="form-dialog-title">Create a new Domain/SubDomain</DialogTitle>
                                            
                                            <DialogContent>
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
                                                        maxRows="4"
                                                        fullWidth
                                                        onInput={e => this.setState({ description: e.target.value })}
                                                    />
                                                    <TextField
                                                        required
                                                        margin="dense"
                                                        id="owner"
                                                        label="Owner"
                                                        type="owner"
                                                        fullWidth
                                                        onInput={e => this.setState({ owner: e.target.value })}
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
                                        <Dialog fullWidth maxWidth="md" open={this.state.showErrorEditor} onClose={() => this.handleClose()} aria-labelledby="error-dialog-title">
                                            <DialogTitle id="error-dialog-title">Action Failed</DialogTitle>
                                            <DialogContent>
                                                <Typography variant="body1" color="error" gutterBottom>{this.state.errorMessage}</Typography>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={() => this.handleClose()}>Close</Button>
                                            </DialogActions>
                                        </Dialog>
                                        {/* <Route exact path="/domains/new" render={this.renderDomainEditor()} /> */}
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TableContainer>
                                            <Table className={this.props.classes.table}>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell key="domain" className={this.props.classes.head} >
                                                            Domain / SubDomain Name
                                                        </TableCell>
                                                        <TableCell className={this.props.classes.head}>Description</TableCell>
                                                        <TableCell className={this.props.classes.head}>Owner</TableCell>
                                                        <TableCell className={this.props.classes.head}>Id</TableCell>
                                                        <TableCell className={this.props.classes.head} />
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {this.state.domains.map(row => (
                                                        <TableRow hover key={row.id}>
                                                            <TableCell>{row.name}</TableCell>
                                                            <TableCell>{row.description}</TableCell>
                                                            <TableCell>{row.owner}</TableCell>
                                                            <TableCell>{row.id}</TableCell>
                                                            <TableCell>
                                                                <IconButton
                                                                    color="primary"
                                                                    variant="outlined"
                                                                    aria-label="refresh"
                                                                    onClick={ () => {
                                                                        if (! this.state.is_domain_repo_read_only)
                                                                            this.deleteDomain(row.id)
                                                                    } }
                                                                    size="large">
                                                                     <Tooltip title = "Delete Domain">
                                                                        <DeleteOutlineIcon color={this.state.is_domain_repo_read_only? "disabled": "primary"} />
                                                                    </Tooltip>
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </TabPanel>
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