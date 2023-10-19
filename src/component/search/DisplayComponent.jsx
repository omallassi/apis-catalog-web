import React, { useEffect, useState } from 'react'
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
import IconButton from '@mui/material/IconButton';
import { Grid, TableContainer } from '@mui/material';
import { blue, blueGrey, red, green, orange, deepPurple } from '@mui/material/colors';
import { useLocation } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import LinkIcon from '@mui/icons-material/Link';

const useStyles = makeStyles(theme => ({
    head: {
        backgroundColor: blue[700],
        color: theme.palette.getContrastText(blue[700])
    },
    blueGrey: {
        color: theme.palette.getContrastText(blueGrey[100]),
        padding: '.3em .3em .3em .3em',
        margin: 'auto',
        textAlign: 'center',
        verticalAlign: 'middle',
        fontWeight: '500',
        borderRadius: '.25em',
        fontSize: '90%',
        backgroundColor: blueGrey[100],
        textTransform: 'uppercase' 
    },
    ope: {
        color: theme.palette.getContrastText(blueGrey[100]),
        //padding: '.3em .3em .3em .3em',
        margin: 'auto',
        textAlign: 'center',
        verticalAlign: 'middle',
        fontWeight: '500',
        borderRadius: '.25em',
        fontSize: '70%',
        backgroundColor: blueGrey[100],
        textTransform: 'uppercase' 
    },
    post: {
        color: theme.palette.getContrastText(blue[600]),
        padding: '.1em .1em .1em .1em',
        margin: 'auto',
        textAlign: 'center',
        verticalAlign: 'middle',
        fontWeight: '500',
        borderRadius: '.25em',
        fontSize: '70%',
        backgroundColor: blue[600],
        textTransform: 'uppercase' 
    },
    get: {
        color: theme.palette.getContrastText(green[600]),
        padding: '.1em .1em .1em .1em',
        margin: 'auto',
        textAlign: 'center',
        verticalAlign: 'middle',
        fontWeight: '500',
        borderRadius: '.25em',
        fontSize: '70%',
        backgroundColor: green[600],
        textTransform: 'uppercase' 
    },
    delete: {
        color: theme.palette.getContrastText(red[400]),
        padding: '.1em .1em .1em .1em',
        margin: 'auto',
        textAlign: 'center',
        verticalAlign: 'middle',
        fontWeight: '500',
        borderRadius: '.25em',
        fontSize: '70%',
        backgroundColor: red[400],
        textTransform: 'uppercase' 
    },
    put: {
        color: theme.palette.getContrastText(deepPurple[800]),
        padding: '.1em .1em .1em .1em',
        margin: 'auto',
        textAlign: 'center',
        verticalAlign: 'middle',
        fontWeight: '500',
        borderRadius: '.25em',
        fontSize: '70%',
        backgroundColor: deepPurple[800],
        textTransform: 'uppercase' 
    },
    patch: {
        color: theme.palette.getContrastText(orange[800]),
        padding: '.1em .1em .1em .1em',
        margin: 'auto',
        textAlign: 'center',
        verticalAlign: 'middle',
        fontWeight: '500',
        borderRadius: '.25em',
        fontSize: '70%',
        backgroundColor: orange[800],
        textTransform: 'uppercase' 
    }
}));


const DisplayComponent = (props) => {
    const theme = props.theme;
    const classes = useStyles(); 
    const location = useLocation();
    const state = location.state;
    const [searchResult, setSearchResult] = useState([]);
    const [catalogs, setCatalogs] = useState(new Map());
    // const [systems, setSystems] = useState([])
        
    useEffect(() => {
        
        ApiService.search(state.query).then((res) => {
            console.log(res);
            let results = res.data;
            ApiService.listAllCatalogs().then((res) => {
                let res_as_map = new Map();
                for (let i = 0; i < res.data.length; i++) {
                    res_as_map.set(res.data[i].id, res.data[i]);
                }
                setCatalogs( res_as_map );
                setSearchResult(results);

            }).catch( (err) => {
                console.error("Error while getting catalogs " + err);
                //this.setState({message: "Error while getting catalogs - " + err.message, message_level: 'error'});
            });

        }).catch( (err) => {
            console.error("Error while search for query " + state.query + " - " + err);
            //this.setState({message: "Error while listing domains - " + err.message, message_level: 'error'});
        });

      }, [location.state]);

    function operationsClass(classes, status) {
        if (status === "GET")
            return classes.get;
        else if (status === "POST")
            return classes.post;
        else if (status === "DELETE")
            return classes.delete;
        else if (status === "PUT")
            return classes.put;
        else if (status === "PATCH")
            return classes.patch;
        else
            return classes.ope;
    }

    let message_component;
    // if (this.state.message)
    // {
    //     message_component =  <Collapse in = {true} ><Alert severity={this.state.message_level} action={<IconButton aria-label="close" color={this.state.message_level} size="small"
    //         onClick={() => {
    //             this.setState({message: ''});
    //         }}
    //         >
    //         <CloseIcon fontSize="inherit" />
    //         </IconButton>}>
    //             <AlertTitle><strong>{this.state.message_level}</strong></AlertTitle>
    //             {this.state.message}
    //         </Alert></Collapse>
    // }

    return (
        <>
        <Box>
            <Card variant="outlined">
                <CardContent>
                    <Grid container>
                        <Grid item xs={11}>
                            <Typography variant="h6" color="primary">Search Results for: {state.query}</Typography>
                            {message_component}
                        </Grid>
                        <Grid item xs={1}></Grid>
                    </Grid>
                </CardContent>
                <CardContent>
                    <Grid container>
                        <Grid item xs={12}>
                            <TableContainer>
                                <Table className={classes.table}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className={classes.head}>Catalog</TableCell>
                                            <TableCell className={classes.head} >Audience</TableCell>
                                            <TableCell className={classes.head}>System(s)</TableCell>
                                            <TableCell className={classes.head}>Layer</TableCell>
                                            <TableCell className={classes.head}>Domain</TableCell>
                                            <TableCell className={classes.head}>Operations</TableCell>
                                            <TableCell className={classes.head}>Path</TableCell>
                                            <TableCell className={classes.head}>Link to Spec</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {searchResult.map( row => (
                                            <TableRow hover key={row.spec_path}>
                                                <TableCell>
                                                    <Typography align="right" className={classes.blueGrey}>
                                                        {catalogs.get(row.catalog_id) ? catalogs.get(row.catalog_id).name : row.catalog_id}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography align="right" className={classes.blueGrey}>
                                                        {row.audience}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    {row.systems.map( system => (
                                                        <Box m={1}>
                                                            <Typography variant="button" display="block" className={classes.blueGrey}>{system}</Typography>
                                                        </Box>
                                                    ))}
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="button" display="block" className={classes.blueGrey}>
                                                        {row.layer}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{row.domain}</TableCell>
                                                <TableCell>
                                                    {row.operations.map( ope => (
                                                        <Box m={1}>
                                                            <Typography variant="button" display="block" className={operationsClass(classes, ope)}>
                                                                {ope}
                                                            </Typography>
                                                        </Box>
                                                    ))}
                                                </TableCell>
                                                <TableCell>{row.path}</TableCell>
                                                <TableCell>
                                                    <a href={catalogs.get(row.catalog_id).http_base_uri + row.spec_path} target="_blank" rel="noopener noreferrer">
                                                        <IconButton color="primary">
                                                            <LinkIcon fontSize="small"/>
                                                        </IconButton>
                                                    </a>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>

        </>
      );
}

// export default withStyles(useStyles, { withTheme: true })(DisplayComponent);
export default DisplayComponent;