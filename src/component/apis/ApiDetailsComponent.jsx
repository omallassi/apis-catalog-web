import React, {Component} from 'react'
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
import { blueGrey, lightBlue } from '@material-ui/core/colors';
import { deepOrange, green } from '@material-ui/core/colors';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';


class ApiDetailsComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            id: props.api,
            api: {},
            specs: [],
            deployments: []
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
            this.setState( {specs: res.data.specs} );
        });
    }

    listDeploymentsForApi(id) {
        ApiService.listDeploymentsForApi(id).then( (res) => {
            let new_deployments = [];
            let deployments = res.data.deployments;
            let index = 0;
            deployments.map( val => {
                let item = {};
                //get env object for current env
                ApiService.listEnvForId(val.env).then( (res) => {
                    let env_object = res.data;
                    item = {'env_avatar': val.env, 'env': val.env, 'api': val.api, 'env_name': env_object.name};
                    new_deployments[index] = item;
                    index += 1;
                    this.setState( {deployments: new_deployments} );
                });
            });
        });
    }

    loadApiById(id) {
        ApiService.loadApiById(id).then( (res) => {
            this.setState( {api: res.data} );
        });
    }

    updateSelectedApi(api) {
        this.setState( {id: api} );
        this.loadApiById(api);
        this.listSpecsForApi(api);
        this.listDeploymentsForApi(api);
    }

    statusClass(classes, status) {
        if( status ==  "VALIDATED")
            return classes.validated;
        else if (status == "DEPRECATED")
            return classes.deprecated;
        else
            return classes.unknown;
    }

    render() {
        const { classes } = this.props;

        return (
            <Box>
                <Typography component="h6" variant="h6" color="primary" gutterBottom>API Details</Typography>
                <Card variant="outlined">
                <CardContent>
                    <Grid container direction="row" justify="flex-start" alignItems="flex-start" spacing={1}>
                        <Grid container xs="12" spacing="1">
                            <Grid item xs={12} sm={2}>
                                <TextField id="status" className = "textfield" inputProps={{className: this.statusClass(classes, this.state.api.status)}} variant="outlined" value={this.state.api.status} label="Status (mocked)" fullWidth margin="normal"/>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField id="sample" variant="outlined" value={this.state.id} label="ID" fullWidth margin="normal"/>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField id="sample" variant="outlined" value={this.state.api.name} label="Name" fullWidth margin="normal"/>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField id="sample" variant="outlined" value={this.state.api.domain_name} label="Domain" fullWidth margin="normal"/>
                            </Grid>
                        <Grid container xs="12" spacing="1">
                            <Grid item xs={12} sm={2}/>
                            <Grid item xs={12} sm={5}>
                                <TextField id="sample" variant="outlined" value="TBD" label="Product Manager" fullWidth margin="normal"/>
                            </Grid>
                            <Grid item xs={12} sm={5}>
                                <TextField id="sample" variant="outlined" value="TBD" label="Architect" fullWidth margin="normal"/>
                            </Grid>
                        </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
     
                <CardContent>
                    <Typography variant="body1" className={classes.root} color="inherit"  gutterBottom>Related Specifications</Typography>
                    <TableContainer>
                        <Table stickyHeader>
                            <TableHead>
                            <TableRow>
                                <TableCell>Id</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Audience (mocked)</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    this.state.specs.map ( row => (
                                        <TableRow hover key = {row.id}>
                                            <TableCell component="th" scope="row">
                                                {row.id}
                                            </TableCell>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>
                                            <div className={classes.audience}>{"external-partner"}</div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
                <CardContent>
                    <Typography variant="body1" className={classes.root} color="inherit" gutterBottom>Related Deployments</Typography>
                    <TableContainer>
                    <Table stickyHeader>
                        <TableHead>
                        <TableRow>
                            <TableCell/>
                            <TableCell>Env Id</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Api Id</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.deployments.map ( row => (
                                <TableRow hover key = {row.env}>
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
                </CardContent>
                </Card>
            </Box>  
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
        color: theme.palette.getContrastText(blueGrey[200]),
        padding: '.2em .5em .2em .5em',
        fontWeight: '500',
        borderRadius: '.25em',
        fontSize: '90%',
        backgroundColor: blueGrey[200],
    },
    avatar: {
        color: theme.palette.getContrastText(lightBlue[200]),
        backgroundColor: lightBlue[200],
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
});

ApiDetailsComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(ApiDetailsComponent);