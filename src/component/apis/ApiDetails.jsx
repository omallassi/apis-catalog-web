import React, {Component} from 'react'
import ApiService from "../../service/ApiService";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import { blueGrey, lightBlue } from '@material-ui/core/colors';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';

class ApiDetails extends Component {

    constructor(props) {
        super(props)
        this.state = {
            api: props.api,
            name: props.api_name,
            specs: [],
            deployments: []
        }

        this.listSpecsForApi = this.listSpecsForApi.bind(this);
        this.listDeploymentsForApi = this.listDeploymentsForApi.bind(this);
        this.updateSelectedApi = this.updateSelectedApi.bind(this);
    }

    componentDidMount() {
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

    updateSelectedApi(api, name) {
        this.setState( {api: api} );
        this.setState( {name: name} );
        this.listSpecsForApi(api);
        this.listDeploymentsForApi(api);
    }

    render() {
        const { classes } = this.props;

        return (
            <Box component="span">
                <Typography component="h6" variant="h6" color="primary" gutterBottom>API Details</Typography>
                <Card variant="outlined">
                <CardContent>
                
                    <Typography gutterBottom>API Name</Typography>
                    <TextField id="sample" disabled="false" value={this.state.name}/>
                
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
    });

ApiDetails.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(ApiDetails);