import React, { Component } from 'react'
import { withStyles } from "@material-ui/core";

import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Grid, Link } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import { blue, lightGreen, deepOrange } from '@material-ui/core/colors';
import Chip from '@material-ui/core/Chip';

import ApiService from "../../service/ApiService";
import ReviewDetailsComponent from './ReviewDetailsComponent';

class ListReviewsComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            reviews: [], //TODO to obsolete
            reviews_stats: [],
            showDetails: false,
            selectedReview: 0
        }

        this.reviewDetails = React.createRef();

        this.listAllReviews = this.listAllReviews.bind(this);
    }

    componentDidMount() {
        this.listAllReviews();
    }

    listAllReviews() {
        ApiService.listAllReviews().then((res) => {
            this.setState({ reviews: res.data.reviews });

            let reviews_stats = [];
            var index = 0;

            res.data.reviews.forEach(function (review, index) {
                //check diffs
                var added_path = 0;
                var removed_path = 0;
                var added_permission = 0;
                var removed_permission = 0;
                var added_zally = 0;
                var removed_zally = 0;

                review.diffs.forEach(function (diff, index) {
                    if (diff.type === "ADDED" && diff.objectType === "PATH") {
                        added_path = added_path + 1;
                    }
                    else if (diff.type === "REMOVED" && diff.objectType === "PATH") {
                        removed_path = removed_path + 1;
                    }
                    //
                    if (diff.type === "ADDED" && diff.objectType === "PERMISSION") {
                        added_permission = added_permission + 1;
                    }
                    else if (diff.type === "REMOVED" && diff.objectType === "PERMISSION") {
                        removed_permission = removed_permission + 1;
                    }
                    //
                    if (diff.type === "ADDED" && diff.objectType === "ZALLY") {
                        added_zally = added_zally + 1;
                    }
                    else if (diff.type === "REMOVED" && diff.objectType === "ZALLY") {
                        removed_zally = removed_zally + 1;
                    }
                });

                reviews_stats[index] = {
                    id: review.id,
                    title: review.title,
                    added_path: added_path,
                    removed_path: removed_path,
                    added_permission: added_permission,
                    removed_permission: removed_permission,
                    added_zally: added_zally,
                    removed_zally: removed_zally
                };
                index = index + 1;
            });

            this.setState({ reviews_stats: reviews_stats });
        });

    }

    displayReviewDetail(id) {
        this.setState({ showDetails: true });
        this.setState({ selectedReview: id });

        if (this.reviewDetails.current !== null) {
            var kept;
            this.state.reviews.forEach(function (review, index) {
                if (id === review.id) {
                    kept = review;
                    //TODO return stop looping faster
                }
            });
            this.reviewDetails.current.updateSelectedReview(id, kept);
        }
    }

    render() {
        const { classes } = this.props;

        return (
            <Box>
                <Card variant="outlined">
                    <CardContent>
                        <Grid container>
                            <Grid item xs={11}>
                                <Typography variant="h6" color="primary">APIs Reviews - Statistics</Typography>
                            </Grid>
                            <Grid item xs={1}></Grid>
                        </Grid>
                    </CardContent>
                    <CardContent>
                        <Grid item xs={12}>
                            <TableContainer>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className={this.props.classes.head}>Review Id</TableCell>
                                            <TableCell className={this.props.classes.head}>Review Title</TableCell>
                                            <TableCell className={this.props.classes.head}>Added Path(s)</TableCell>
                                            <TableCell className={this.props.classes.head}>Removed Path(s)</TableCell>
                                            <TableCell className={this.props.classes.head}>Added Permission(s)</TableCell>
                                            <TableCell className={this.props.classes.head}>Removed Permission(s)</TableCell>
                                            <TableCell className={this.props.classes.head}>Added x-zally-ignore</TableCell>
                                            <TableCell className={this.props.classes.head}>Removed x-zally-ignore</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.state.reviews_stats.map(row => (
                                            <TableRow hover key={row.id}>
                                                <TableCell>
                                                    <a className="MuiButtonBase-root MuiListItem-root MuiListItem-gutters MuiListItem-button" tabIndex="0" role="button" aria-disabled="false"
                                                        href={process.env.REACT_APP_STASH_BASE_URL + "/pull-requests/" + row.id + "/overview"} target="_blank">
                                                        <div className="MuiListItemIcon-root">
                                                            <svg className="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                                                                <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"></path>
                                                            </svg>
                                                        </div>
                                                        <div className="MuiListItemText-root">
                                                            <span className="MuiTypography-root MuiListItemText-primary MuiTypography-body1 MuiTypography-displayBlock">{row.id}</span>
                                                        </div>
                                                    </a>
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    <Link component="button" variant="body2" onClick={() => {
                                                        this.displayReviewDetail(row.id)
                                                    }}>
                                                        {row.title}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    {row.added_path !== 0 &&
                                                        <Chip
                                                            label={row.added_path}
                                                            color="primary"
                                                            className={this.props.classes.green}
                                                        />
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {row.removed_path !== 0 &&
                                                        <Chip
                                                            label={row.removed_path}
                                                            color="primary"
                                                            className={this.props.classes.red}
                                                        />
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {row.added_permission !== 0 &&
                                                        <Chip
                                                            label={row.added_permission}
                                                            color="primary"
                                                            className={this.props.classes.green}
                                                        />
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {row.removed_permission !== 0 &&
                                                        <Chip
                                                            label={row.removed_permission}
                                                            color="primary"
                                                            className={this.props.classes.red}
                                                        />
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {row.added_zally !== 0 &&
                                                        <Chip
                                                            label={row.added_zally}
                                                            color="primary"
                                                            className={this.props.classes.green}
                                                        />
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {row.removed_zally !== 0 &&
                                                        <Chip
                                                            label={row.removed_zally}
                                                            color="primary"
                                                            className={this.props.classes.red}
                                                        />
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </CardContent>
                </Card>
                <Divider />
                {
                    this.state.showDetails ? <ReviewDetailsComponent ref={this.reviewDetails} review={this.state.selectedReview} /> : null
                }
            </Box >
        );
    }
}

const useStyles = theme => ({
    head: {
        backgroundColor: blue[700],
        color: theme.palette.getContrastText(blue[700])
    },
    avatar: {
        color: theme.palette.getContrastText(blue[700]),
        backgroundColor: blue[700],
        fontSize: '90%',
    },
    green: {
        backgroundColor: lightGreen[500],
        color: theme.palette.getContrastText(lightGreen[500])
    },
    red: {
        backgroundColor: deepOrange[500],
        color: theme.palette.getContrastText(deepOrange[500])
    },
});

ListReviewsComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(ListReviewsComponent);