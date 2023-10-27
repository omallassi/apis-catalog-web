import React, { Component } from 'react'
import withStyles from '@mui/styles/withStyles';

import PropTypes from 'prop-types';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Grid, Link } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import Divider from '@mui/material/Divider';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import { blue, lightGreen, deepOrange } from '@mui/material/colors';
import Chip from '@mui/material/Chip';

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

    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return;
        };
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
                                                    <LinkIcon/>
                                                    <Link href={this.state.config.stash_base_url + "/pull-requests/" + row.id + "/overview"} target="_blank">{row.id}</Link>
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