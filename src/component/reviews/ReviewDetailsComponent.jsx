import React, { Component } from 'react'
import Box from '@material-ui/core/Box';
import { deepOrange, lightGreen, blueGrey, blue } from '@material-ui/core/colors';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Avatar, TextField } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';

import Typography from '@material-ui/core/Typography';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';

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
                        <Grid container direction="row" justify="flex-start" alignItems="flex-start" spacing={1}>
                            <Grid container xs={12} spacing={1} item={true}>
                                <Grid item xs={4}>
                                    <TextField id="id" variant="outlined" value={this.state.review.id} label="ID" fullWidth margin="normal" />
                                </Grid>
                                <Grid item xs={8}>
                                    <TextField id="title" variant="outlined" value={this.state.review.title} label="TITLE" fullWidth margin="normal" />
                                </Grid>
                                <Grid item xs={6}>
                                    <Card>
                                        <CardHeader title="Added Zally Ignore" avatar={<Avatar aria-label="recipe" className={this.props.classes.avatargreen}>A</Avatar>} />
                                        <CardContent>
                                            <Typography variant="body2" color="textSecondary" component="p">
                                                {this.state.added_zally}</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={6}>
                                    <Card>
                                        <CardHeader title="Removed Zally Ignore" avatar={<Avatar aria-label="recipe" className={this.props.classes.avatarorange}>A</Avatar>} />
                                        <CardContent>
                                            <Typography variant="body2" color="textSecondary" component="p">
                                                {this.state.removed_zally}</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={6}>
                                    <Card>
                                        <CardHeader title="Added Path(s)" avatar={<Avatar aria-label="recipe" className={this.props.classes.avatargreen}>A</Avatar>} />
                                        <CardContent>
                                            <List>
                                                {this.state.added_paths.map(diff => (
                                                    <ListItem>
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
                                        <CardHeader title="Removed Path(s)" avatar={<Avatar aria-label="recipe" className={this.props.classes.avatarorange}>A</Avatar>} />
                                        <CardContent>
                                            <List>
                                                {this.state.removed_paths.map(diff => (
                                                    <ListItem>
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
                                        <CardHeader title="Added Permission(s)" avatar={<Avatar aria-label="recipe" className={this.props.classes.avatargreen}>A</Avatar>} />
                                        <CardContent>
                                            <List>
                                                {this.state.added_permissions.map(diff => (
                                                    <ListItem>
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
                                        <CardHeader title="Removed Permission(s)" avatar={<Avatar aria-label="recipe" className={this.props.classes.avatarorange}>A</Avatar>} />
                                        <CardContent>
                                            <List>
                                                {this.state.removed_permissions.map(diff => (
                                                    <ListItem>
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
                </Card>
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