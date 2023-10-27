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
import { deepOrange, green, blueGrey, blue } from '@mui/material/colors';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import { TextField } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import Link from '@mui/material/Link';
import LinkIcon from '@mui/icons-material/Link';
import ListAltIcon from '@mui/icons-material/ListAlt';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

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
                    <Typography>{children}</Typography>
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

class ApiDetailsComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            id: props.api,
            api: { "id": "", "name": "", "status": "", "domain_id": "", "domain_name": "", "spec_ids": [] },
            specs: [],
            deployments: [],
            value: 0,
        }

        this.listSpecsForApi = this.listSpecsForApi.bind(this);
        this.listDeploymentsForApi = this.listDeploymentsForApi.bind(this);
        this.updateSelectedApi = this.updateSelectedApi.bind(this);
    }

    componentDidMount() {
        this.loadApiById(this.state.id);
        this.loadApiById(this.state.id);
        this.listSpecsForApi(this.state.id);
        this.listDeploymentsForApi(this.state.id);
    }

    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return;
        };
    }

    listSpecsForApi(id) {
        ApiService.listSpecsForApi(id).then((res) => {
            this.setState({ specs: res.data.specs });
        });
    }

    listDeploymentsForApi(id) {
        ApiService.listDeploymentsForApi(id).then((res) => {
            let new_deployments = [];
            let deployments = res.data.deployments;
            let index = 0;
            deployments.map(val => {
                let item = {};
                //get env object for current env
                ApiService.listEnvForId(val.env).then((res) => {
                    let env_object = res.data;
                    item = { 'env_avatar': val.env, 'env': val.env, 'api': val.api, 'env_name': env_object.name };
                    new_deployments[index] = item;
                    index += 1;
                    this.setState({ deployments: new_deployments });
                });
            });
        });
    }

    loadApiById(id) {
        ApiService.loadApiById(id).then((res) => {
            this.setState({ api: res.data });
        });
    }

    updateSelectedApi(api) {
        this.setState({ id: api });
        this.loadApiById(api);
        this.listSpecsForApi(api);
        this.listDeploymentsForApi(api);
    }

    statusClass(classes, status) {
        if (status === "VALIDATED")
            return classes.validated;
        else if (status === "DEPRECATED")
            return classes.deprecated;
        else
            return classes.none;
    }

    a11yProps(index) {
        return {
            id: `full-width-tab-${index}`,
            'aria-controls': `full-width-tabpanel-${index}`,
        };
    }

    render() {
        const { classes } = this.props;

        return (
            <Box>
                <Card variant="outlined">
                    <CardContent>
                        <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={1}>
                            <Grid container xs={12} spacing={1} item={true}>
                                <Grid item xs={12} sm={2}>
                                    <TextField id="status" className="textfield" inputProps={{ className: this.statusClass(classes, this.state.api.status) }} variant="outlined" value={this.state.api.status} label="Status" fullWidth margin="normal" />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField id="id" variant="outlined" value={this.state.id} label="ID" fullWidth margin="normal" />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <TextField id="name" variant="outlined" value={this.state.api.name} label="Name" fullWidth margin="normal" />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <TextField id="domain" variant="outlined" value={this.state.api.domain_name} label="Domain" fullWidth margin="normal" />
                                </Grid>
                                <Grid container xs={12} spacing={1} item={true}>
                                    <Grid item xs={12} sm={2} />
                                    <Grid item xs={12} sm={5}>
                                        <TextField id="pm" variant="outlined" value="TBD" label="Product Manager" fullWidth margin="normal" />
                                    </Grid>
                                    <Grid item xs={12} sm={5}>
                                        <TextField id="arch" variant="outlined" value="TBD" label="Architect" fullWidth margin="normal" />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardContent>

                    <CardContent>
                        <Tabs
                            value={this.state.value}
                            onChange={(event, newValue) => this.setState({ value: newValue })}
                            indicatorColor="primary"
                            textColor="primary">
                            <Tab label="Related Specifications" icon={<PlaylistAddCheckIcon />} {...this.a11yProps(0)} />
                            <Tab label="Related Deployments" icon={<ListAltIcon />} {...this.a11yProps(1)} />
                        </Tabs>
                        <TabPanel value={this.state.value} index={0}>
                            <TableContainer>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className={this.props.classes.head}>Id</TableCell>
                                            <TableCell className={this.props.classes.head}>Title</TableCell>
                                            <TableCell className={this.props.classes.head}>Audience</TableCell>
                                            <TableCell className={this.props.classes.head}>Version</TableCell>
                                            <TableCell className={this.props.classes.head}>Description</TableCell>
                                            <TableCell className={this.props.classes.head}>Name</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            this.state.specs.map(row => (
                                                <TableRow hover key={row.id}>
                                                    <TableCell component="th" scope="row">
                                                        {row.id}
                                                    </TableCell>
                                                    <TableCell>{row.title}</TableCell>
                                                    <TableCell>
                                                        <div className={classes.audience}>{row.audience}</div>
                                                    </TableCell>
                                                    <TableCell>{row.version}</TableCell>
                                                    <TableCell>{row.description}</TableCell>
                                                    <TableCell>
                                                    <LinkIcon/>
                                                    <Link href={this.state.config.stash_base_url + "/browse/catalog/" + row.name} target="_blank">{row.name}</Link>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </TabPanel>
                        <TabPanel value={this.state.value} index={1}>
                            <TableContainer>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className={this.props.classes.head} />
                                            <TableCell className={this.props.classes.head}>Env Id</TableCell>
                                            <TableCell className={this.props.classes.head}>Name</TableCell>
                                            <TableCell className={this.props.classes.head}>Api Id</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.state.deployments.map(row => (
                                            <TableRow hover key={row.env}>
                                                <TableCell>
                                                    <Avatar className={classes.avatar}>{row.env_avatar}</Avatar>
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {row.env}
                                                </TableCell>
                                                <TableCell>{row.env_name}</TableCell>
                                                <TableCell>{row.api}</TableCell>
                                            </TableRow>
                                        ))
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </TabPanel>
                    </CardContent>
                </Card>
            </Box >
        );
    }
}

const useStyles = theme => ({
    display: 'flex',
    justifyContent: 'center',
    root: {
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(1),
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    audience: {
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
    avatar: {
        color: theme.palette.getContrastText(blue[700]),
        backgroundColor: blue[700],
        fontSize: '90%',
    },
    deprecated: {
        color: deepOrange[500],
        textTransform: 'uppercase',
    },
    validated: {
        color: green[500],
        textTransform: 'uppercase',
    },
    none: {
        color: blueGrey[600],
        textTransform: 'uppercase',
    },
    head: {
        backgroundColor: blue[700],
        color: theme.palette.getContrastText(blue[700])
    },
});

ApiDetailsComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(ApiDetailsComponent);