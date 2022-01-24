import React, { Component } from 'react'
import Box from '@mui/material/Box';
import { deepOrange, lightGreen, blueGrey } from '@mui/material/colors';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import { TextField } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';

import Typography from '@mui/material/Typography';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';


// function TabPanel(props) {
//     const { children, value, index, ...other } = props;

//     return (
//         <div
//             role="tabpanel"
//             hidden={value !== index}
//             id={`scrollable-auto-tabpanel-${index}`}
//             aria-labelledby={`scrollable-auto-tab-${index}`}
//             {...other}
//         >
//             {value === index && (
//                 <Box p={3}>
//                     <Typography>{children}</Typography>
//                 </Box>
//             )}
//         </div>
//     );
// }

// TabPanel.propTypes = {
//     children: PropTypes.node,
//     index: PropTypes.any.isRequired,
//     value: PropTypes.any.isRequired,
// };

class ReviewDetailsComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            review: { 'id': '', 'title': '' },
            added_paths: [],
            removed_paths: [],
            added_permissions: [],
            removed_permissions: [],
            added_zally: 0,
            removed_zally: 0,
        }

        this.updateSelectedReview = this.updateSelectedReview.bind(this);
    }

    componentDidMount() {
    }

    updateSelectedReview(id, review) {
        this.setState({ review: { 'id': id, 'title': review.title } });
        //
        var added_path = [];
        var removed_path = [];
        var added_permission = [];
        var removed_permission = [];
        var added_zally = 0;
        var removed_zally = 0;

        review.diffs.forEach(function (diff, index) {
            if (diff.type === "ADDED" && diff.objectType === "PATH") {
                added_path[added_path.length + 1] = diff;
            }
            else if (diff.type === "REMOVED" && diff.objectType === "PATH") {
                removed_path[removed_path.length + 1] = diff;
            }
            //
            if (diff.type === "ADDED" && diff.objectType === "PERMISSION") {
                added_permission[added_permission.length + 1] = diff;
            }
            else if (diff.type === "REMOVED" && diff.objectType === "PERMISSION") {
                removed_permission[removed_permission.length + 1] = diff;
            }
            //
            if (diff.type === "ADDED" && diff.objectType === "ZALLY") {
                added_zally = added_zally + 1;
            }
            else if (diff.type === "REMOVED" && diff.objectType === "ZALLY") {
                removed_zally = removed_zally + 1;
            }
        });

        this.setState({
            added_paths: added_path,
            removed_paths: removed_path,
            added_permissions: added_permission,
            removed_permissions: removed_permission,
            added_zally: added_zally,
            removed_zally: removed_zally
        });
    }

    // statusClass(classes, status) {
    //     if (status === "VALIDATED")
    //         return classes.validated;
    //     else if (status === "DEPRECATED")
    //         return classes.deprecated;
    //     else
    //         return classes.none;
    // }

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
                                <Grid item xs={2}>
                                    <Card>
                                        <CardHeader title="Added Zally Ignore" titleTypographyProps={{ color: "textPrimary", variant: "overline" }} />
                                        <CardContent>
                                            <Typography variant="h3" color="textSecondary" component="p">
                                                {this.state.added_zally}</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={2}>
                                    <Card>
                                        <CardHeader title="Removed Zally Ignore" titleTypographyProps={{ color: "textPrimary", variant: "overline" }} />
                                        <CardContent>
                                            <Typography variant="h3" color="textSecondary" component="p">
                                                {this.state.removed_zally}</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField id="id" variant="outlined" value={this.state.review.id} label="ID" fullWidth margin="normal" />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField id="title" variant="outlined" value={this.state.review.title} label="REVIEW TITLE" fullWidth margin="normal" />
                                </Grid>

                                <Grid item xs={6}>
                                    <Card>
                                        <CardHeader title="Added Path(s)"
                                            avatar={<TrendingUpIcon color="primary" />}
                                            titleTypographyProps={{ color: "textPrimary", variant: "overline" }} />
                                        <CardContent>
                                            <List>
                                                {this.state.added_paths.map(diff => (
                                                    <ListItem>
                                                        <ListItemIcon>
                                                            <ArrowRightIcon />
                                                        </ListItemIcon>
                                                        <ListItemText key={diff.line}
                                                            primary={diff.line}
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={6}>
                                    <Card>
                                        <CardHeader title="Removed Path(s)"
                                            avatar={<TrendingDownIcon color="primary" />}
                                            titleTypographyProps={{ color: "textPrimary", variant: "overline" }} />
                                        <CardContent>
                                            <List>
                                                {this.state.removed_paths.map(diff => (
                                                    <ListItem>
                                                        <ListItemIcon>
                                                            <ArrowRightIcon />
                                                        </ListItemIcon>
                                                        <ListItemText key={diff.line}
                                                            primary={diff.line}
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={6}>
                                    <Card>
                                        <CardHeader title="Added Permission(s)"
                                            avatar={<TrendingUpIcon color="primary" />}
                                            titleTypographyProps={{ color: "textPrimary", variant: "overline" }} />
                                        <CardContent>
                                            <List>
                                                {this.state.added_permissions.map(diff => (
                                                    <ListItem>
                                                        <ListItemIcon>
                                                            <ArrowRightIcon />
                                                        </ListItemIcon>
                                                        <ListItemText key={diff.line}
                                                            primary={diff.line}
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={6}>
                                    <Card>
                                        <CardHeader title="Removed Permission(s)"
                                            avatar={<TrendingDownIcon color="primary" />}
                                            titleTypographyProps={{ color: "textPrimary", variant: "overline" }} />
                                        <CardContent>
                                            <List>
                                                {this.state.removed_permissions.map(diff => (
                                                    <ListItem>
                                                        <ListItemIcon>
                                                            <ArrowRightIcon />
                                                        </ListItemIcon>
                                                        <ListItemText key={diff.line}
                                                            primary={diff.line}
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>

                            </Grid>
                        </Grid>
                    </CardContent>
                </Card >
            </Box >
        );
    }
}

const useStyles = theme => ({
    display: 'flex',
    root: {
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(1),
        flexGrow: 1,
    },
    avatargreen: {
        color: theme.palette.getContrastText(lightGreen[500]),
        backgroundColor: lightGreen[500],
        fontSize: '90%',
    },
    avatarorange: {
        color: theme.palette.getContrastText(deepOrange[500]),
        backgroundColor: deepOrange[500],
        fontSize: '90%',
    },
    none: {
        color: blueGrey[600],
        textTransform: 'uppercase',
    },
});

ReviewDetailsComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(ReviewDetailsComponent);