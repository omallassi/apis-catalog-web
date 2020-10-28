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
import { deepOrange, green, blueGrey, blue } from '@material-ui/core/colors';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import ListAltIcon from '@material-ui/icons/ListAlt';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

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
                        <Grid container direction="row" justify="flex-start" alignItems="flex-start" spacing={1}>
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
                                            <TableCell>Id</TableCell>
                                            <TableCell>Title</TableCell>
                                            <TableCell>Audience</TableCell>
                                            <TableCell>Version</TableCell>
                                            <TableCell>Description</TableCell>
                                            <TableCell>Name</TableCell>
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
                                                        <a className="MuiButtonBase-root MuiListItem-root MuiListItem-gutters MuiListItem-button" tabIndex="0" role="button" aria-disabled="false"
                                                            href={process.env.REACT_APP_STASH_BASE_URL + "/browse/catalog/" + row.name}
                                                            target="_blank">
                                                            <div className="MuiListItemIcon-root"><svg className="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                                                                <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"></path></svg></div>
                                                            <div className="MuiListItemText-root"><span className="MuiTypography-root MuiListItemText-primary MuiTypography-body1 MuiTypography-displayBlock">{row.name}</span></div><span className="MuiTouchRipple-root"></span>
                                                        </a>
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
                                            <TableCell />
                                            <TableCell>Env Id</TableCell>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Api Id</TableCell>
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
});

ApiDetailsComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(ApiDetailsComponent);