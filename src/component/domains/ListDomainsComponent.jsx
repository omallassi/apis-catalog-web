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
import DatasetLinkedIcon from '@mui/icons-material/DatasetLinked';

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

import Inventory2Icon from '@mui/icons-material/Inventory2';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import { blue, blueGrey, lightGreen, purple } from '@mui/material/colors';

import Link from '@mui/material/Link';
import LinkIcon from '@mui/icons-material/Link';

import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';

import Tooltip from '@mui/material/Tooltip';

import CircularProgress from '@mui/material/CircularProgress';
import DoneIcon from '@mui/icons-material/Done';

import Badge from '@mui/material/Badge';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LensBlurOutlinedIcon from '@mui/icons-material/LensBlurOutlined';

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
            loading: false,
            //will be an array of tuple, each line of systems will be [system_name, layer_name, domains[<Str>]]
            domains_per_system_and_layer: [],
            catalogs: new Map(),
            systems: new Map(),
            config: {}
        }

        this.listAllDomains = this.listAllDomains.bind(this);
        this.buildDomainTreeMap = this.buildDomainTreeMap.bind(this);
        this.listAllDomainsErrors = this.listAllDomainsErrors.bind(this);
        this.listAllDomainsPerLayersAndSystems = this.listAllDomainsPerLayersAndSystems.bind(this);
        this.listAllCatalogs = this.listAllCatalogs.bind(this);
        this.listConfig = this.listConfig.bind(this);
        //
        // this.domainEditorRef = React.createRef();
    }

    componentDidMount() {
        this.listAllDomains();
        this.listAllDomainsErrors();
        this.buildDomainTreeMap();
        this.listAllDomainsPerLayersAndSystems();
        this.listAllCatalogs();
        this.listConfig();
    }

    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return;
        };
    }

    listConfig(){
        ApiService.listConfig().then( (res) => {
          this.setState( { config: res.data } );
        } ).catch( (err) => {
          console.error("Error while getting config " + err);
        });
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

    listAllCatalogs() {
        ApiService.listAllCatalogs().then((res) => {
            console.log(res);
            let res_as_map = res.data.map( obj => {
                    return this.state.catalogs.set(obj.id, obj);
                }
            )
        }).catch( (err) => {
            console.error("Error while getting catalogs " + err);
            this.setState({message: "Error while getting catalogs - " + err.message, message_level: 'error'});
        });
    }

    buildDomainTreeMap() {
        //
        this.setState({loading: true});
        ApiService.getDomainsMetrics().then((res) => {
            console.log(res);

            var response = res.data;
            var data_table = [['Name', 'Parent', 'Resources Number (num)'], ['Global', null, 0]]

            for (var index in response) {
                //column 0 is the ID and must be unique
                data_table[data_table.length] = [response[index].name, response[index].parent, response[index].value];
            }

            console.debug("domain stats for treemap : " + data_table);
            console.debug("domain stats length for treemap : " + data_table.length);

            //we should map it to
            //[
            //    ['Location','Parent','Resources Number (num)'],
            //    ['All', null, 0],
            //    ['iam', 'All', 0],
            //    ['xva-management', 'All', 0],
            //    ['authn', 'iam', 11],
            //    ['authz', 'iam', 52],
            //]

            this.setState({ stats: data_table, loading: false })
        }).catch( (err) => {
            console.error("Error while getting domain stats " + err);
            this.setState({message: "Error while loading domain statistics - " + err.message, message_level: 'error', loading: false});
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



    listAllDomainsPerLayersAndSystems() {

        ApiService.listAllSystems().then((res) => {
            var systems = res.data.systems;
            var index = 0
            var array_of_response = []
            //for loop .... and get domains for each (system, layer)
            for (var i = 0; i < systems.length; i++){
                for(var j = 0; j < systems[i].layers.length; j++){
                    var system_name = systems[i].name;
                    var layer_name = systems[i].layers[j].name;
                    //keep the list, will be used in the <Table>
                    this.state.systems.set(system_name + layer_name, systems[i].layers[j])

                    ApiService.listAllDomainsPerSystemAndLayer(system_name, layer_name).then( (res) => {                        
                        array_of_response[index] = [res.data.system, res.data.layer, res.data.domains];
                        array_of_response.sort();
                        index = index + 1;

                        console.log("all domains per system and layer " + array_of_response);
                        this.setState( {domains_per_system_and_layer: array_of_response} );

                    }).catch( (err) => {
                        console.error("Error while getting domain stats " + err);
                        //TODO
                        this.setState({message: "Error while listing domains - " + err.message, message_level: 'error'});
                    });  
                    
                }
            }
        }).catch( (err) => {
            console.error("Error while getting systems " + err);
            this.setState({message: "Error while listing systems - " + err.message, message_level: 'error'});
        });

    }

    getHtmlDocUri(system, layer) {
        if( "default" ===  system.toLowerCase() ){
            return "/default.html";
        }
        else {
            return "/" + system.toLowerCase() + layer.toLowerCase() + ".html";
        }
    }

    a11yProps(index) {
        return {
            id: `full-width-tab-${index}`,
            'aria-controls': `full-width-tabpanel-${index}`,
        };
    }

    render() {
        const { classes, theme } = this.props;

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
                                <Typography variant="h6" color="primary">Domain Governance Overview</Typography>
                                {message_component}
                            </Grid>
                            <Grid item xs={1}></Grid>
                        </Grid>
                    </CardContent>
                    <CardContent>
                        <Grid container>
                            <Grid item xs={11}>
                                <Typography>The following groups all information to help understanding domains and subdomains, how they relates, their "volumes" w.r.t numer of endpoints, their organisation per layer etc.</Typography>
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
                            
                            <Tab label="Domain Org. Across Catalogs" icon={<Inventory2Icon />} {...this.a11yProps(0)} />
                            <Tab label="Domain Violation(s)" icon={<Badge badgeContent={this.state.errors.length} showZero color={this.state.errors.length == 0 ? "success" : "error"}><AssignmentLateIcon/></Badge>} {...this.a11yProps(1)} />
                            <Tab label="Governed Domain Catalog" icon={<AssignmentIcon />} {...this.a11yProps(2)} />
                            <Tab label="Domain Statistics" icon={<TableChartTwoToneIcon />} {...this.a11yProps(3)} />
                            
                        </Tabs>

                        <TabPanel value={this.state.value} index={0}>
                            <CardContent>
                                <Grid container>
                                    <Grid item xs={11}>
                                        <Typography>The following table groups all defined layers per systems</Typography>
                                    </Grid>
                                    <Grid item xs={1}></Grid>
                                </Grid>
                            </CardContent>
                            
                            <CardContent>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <TableContainer>
                                            <Table className={this.props.classes.table}>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell className={this.props.classes.head}>Doc</TableCell>
                                                        <TableCell className={this.props.classes.head} >System Name</TableCell>
                                                        <TableCell className={this.props.classes.head}>Layer Name</TableCell>
                                                        <TableCell className={this.props.classes.head}>Domains</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {this.state.domains_per_system_and_layer.map(row => ( 
                                                            <TableRow hover key={row[0] + row[1] }>
                                                                <TableCell style={{ verticalAlign: 'top' }}>
                                                                    <ListItem button component="a" href={this.state.config.api_doc_url + this.getHtmlDocUri(row[0], row[1])} target="_blank">
                                                                        <Tooltip title="Link to HTML API doc (do not contain all specs depending on catalogs)">
                                                                            <DatasetLinkedIcon fontSize='small' color='primary'/>
                                                                        </Tooltip>
                                                                    </ListItem>
                                                                </TableCell>
                                                                <TableCell style={{ verticalAlign: 'top' }} ><Typography style={{  color: theme.palette.getContrastText(blueGrey[100]),
                                                                    padding: '.3em .3em .3em .3em',
                                                                    margin: 'auto',
                                                                    textAlign: 'center',
                                                                    verticalAlign: 'middle',
                                                                    fontWeight: '500',
                                                                    borderRadius: '.25em',
                                                                    fontSize: '90%',
                                                                    backgroundColor: blueGrey[100],
                                                                    textTransform: 'uppercase' }}> 
                                                                        { row[0] }  
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell style={{ verticalAlign: 'top' }}>
                                                                    <Typography style={{  color: theme.palette.getContrastText(blue[700]),
                                                                        padding: '.3em .3em .3em .3em',
                                                                        margin: 'auto',
                                                                        textAlign: 'center',
                                                                        verticalAlign: 'middle',
                                                                        fontWeight: '500',
                                                                        borderRadius: '.25em',
                                                                        fontSize: '90%',
                                                                        backgroundColor: this.state.systems.get(row[0] + row[1]).color,
                                                                        textTransform: 'uppercase' }}> 
                                                                        { row[1] }  
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography > 
                                                                        <List>
                                                                        {row[2].map( curr_domain => (     
                                                                            <ListItem>
                                                                                {/* <ListItemIcon>
                                                                                    <LensBlurOutlinedIcon fontSize="small" color="info"/>
                                                                                </ListItemIcon> */}
                                                                                <ListItemText>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item xs={2}>
                                                                                            <Typography>
                                                                                                {curr_domain.name}
                                                                                            </Typography>
                                                                                        </Grid>
                                                                                        <Grid item xs={10}>
                                                                                            {curr_domain.specs.map( spec => ( 
                                                                                             <Grid container spacing={2}>
                                                                                                <ListItem>
                                                                                                {/* <ListItemText> */}
                                                                                                    <Grid item xs={9}> 
                                                                                                        <Box m={1}> 
                                                                                                        <Typography className={classes.customTypography}>
                                                                                                            <Link href={this.state.catalogs.get(spec.catalog_id).http_base_uri + spec.spec_path} target="_blank">
                                                                                                            {spec.spec_path}
                                                                                                            </Link>
                                                                                                        </Typography>
                                                                                                        </Box>
                                                                                                    </Grid>
                                                                                                    <Grid item xs={1}>
                                                                                                        <Box m={1}>
                                                                                                        <Typography align="right" className={classes.customTypography} style={{  color: spec.grammar === "OpenAPI.v3" ? theme.palette.getContrastText(lightGreen[300]) : spec.grammar === "AsyncAPI.v1" ? theme.palette.getContrastText(purple[500]) : spec.grammar === "AsyncAPI.v2" ? theme.palette.getContrastText(purple[500]) : theme.palette.getContrastText(blueGrey[100]),
                                                                                                            //padding: '.3em .3em .3em .3em',
                                                                                                            margin: 'auto',
                                                                                                            textAlign: 'center',
                                                                                                            verticalAlign: 'middle',
                                                                                                            //fontWeight: '500',
                                                                                                            borderRadius: '.25em',
                                                                                                            fontSize: '70%',
                                                                                                            backgroundColor: spec.grammar === "OpenAPI.v3" ? lightGreen[300] : spec.grammar === "AsyncAPI.v1" ? purple[500] : spec.grammar === "AsyncAPI.v2" ? purple[500] : blueGrey[100],
                                                                                                            textTransform: 'uppercase' }}>
                                                                                                        { spec.grammar }
                                                                                                        </Typography>
                                                                                                        </Box>
                                                                                                    </Grid>
                                                                                                    <Grid item xs={2}>
                                                                                                        <Box m={1}>
                                                                                                        <Typography align="right" className={classes.customTypography} style={{  color: theme.palette.getContrastText(blueGrey[100]),
                                                                                                            //padding: '.3em .3em .3em .3em',
                                                                                                            margin: 'auto',
                                                                                                            textAlign: 'center',
                                                                                                            verticalAlign: 'middle',
                                                                                                            //fontWeight: '500',
                                                                                                            borderRadius: '.25em',
                                                                                                            fontSize: '70%',
                                                                                                            backgroundColor: blueGrey[100],
                                                                                                            textTransform: 'uppercase' }}>
                                                                                                        { this.state.catalogs.get(spec.catalog_id).name }
                                                                                                        </Typography>
                                                                                                        </Box>
                                                                                                    </Grid>
                                                                                                {/* </ListItemText> */}
                                                                                                </ListItem>
                                                                                            </Grid>
                                                                                            
                                                                                            

                                                                                            ))}
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </ListItemText>
                                                                            </ListItem>
                                                                        ))}
                                                                        </List>
                                                                    </Typography>
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

                        <TabPanel value={this.state.value} index={3}>
                            <CardContent>
                                <Typography variant="body1" gutterBottom>
                                    The following diagram displays volume of resources per domain and subdomains, based on the Open API Specifications (available in git).
                                </Typography>
                                { !this.state.loading && 
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
                                }
                                { this.state.loading && 
                                    <CircularProgress size={30} /> 
                                }
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
                                                            <TableCell className={this.props.classes.head}>Declared Domain</TableCell>
                                                            <TableCell className={this.props.classes.head} >OpenAPI Specification</TableCell>
                                                            <TableCell className={this.props.classes.head}>Catalog</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {this.state.errors.map(row => (
                                                            <TableRow hover key={row.spec_path}>
                                                                <TableCell>
                                                                    <ErrorOutlineIcon color="error" fontSize="small"/>
                                                                </TableCell>
                                                                <TableCell>{row.spec_domain}</TableCell>
                                                                <TableCell>
                                                                    {/* <LinkIcon fontSize="small"/> */}
                                                                    <Link href={this.state.catalogs.get(row.spec_catalog_id).http_base_uri + row.spec_path} target="_blank">{row.spec_path}</Link>
                                                                </TableCell>
                                                                <TableCell><Typography style={{  color: theme.palette.getContrastText(blueGrey[100]),
                                                                                            padding: '.3em .3em .3em .3em',
                                                                                            margin: 'auto',
                                                                                            textAlign: 'center',
                                                                                            verticalAlign: 'middle',
                                                                                            fontWeight: '500',
                                                                                            borderRadius: '.25em',
                                                                                            fontSize: '90%',
                                                                                            backgroundColor: blueGrey[100],
                                                                                            textTransform: 'uppercase' }}>
                                                                    { this.state.catalogs.get(row.spec_catalog_id).name }
                                                                    </Typography>
                                                                </TableCell>
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
                                    <Grid item xs={12}>
                                        <Typography variant="body1" gutterBottom>
                                            The following table is the list of official Domains and Subdomains that have been defined in your domain catalog. 
                                            Is Void indicates that no endpoints for this domain have been found in any of the OAI spec declared catalogs. 
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={11}>
                                        {this.state.is_domain_repo_read_only && (
                                            <Alert severity="info">
                                                The domain repository is <strong>read-only</strong>
                                            </Alert>
                                        )}
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
                                            <Tooltip title = "Refresh Domain List">
                                            <SyncIcon color="primary"></SyncIcon>
                                            </Tooltip>
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
                                                        <TableCell className={this.props.classes.head} >
                                                            Domain / SubDomain Name
                                                        </TableCell>
                                                        <TableCell className={this.props.classes.head}>Is void</TableCell>
                                                        <TableCell className={this.props.classes.head}>Description</TableCell>
                                                        <TableCell className={this.props.classes.head}>Owner</TableCell>
                                                        <TableCell className={this.props.classes.head}>Id</TableCell>
                                                        <TableCell className={this.props.classes.head} />
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {this.state.domains.map(row => (
                                                        <TableRow hover key={row.id}>
                                                            { row.is_empty &&
                                                                <TableCell 
                                                                    className={this.props.classes.table_cell_is_empty}>
                                                                        {row.name}
                                                            </TableCell>
                                                            }
                                                            { !row.is_empty &&
                                                                <TableCell>{row.name}</TableCell>
                                                            }
                                                            <TableCell>{ row.is_empty ? <DoneIcon/> : "" }</TableCell>
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
    table_cell_is_empty: {
        color: theme.palette.error.dark
    }, 
    customTypography: {
        lineHeight: 2,
      },
});

ListDomainsComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles, { withTheme: true })(ListDomainsComponent);