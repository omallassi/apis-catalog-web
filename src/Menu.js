import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LinkIcon from '@mui/icons-material/Link';
import ListAltIcon from '@mui/icons-material/ListAlt';
import FilterTiltShiftIcon from '@mui/icons-material/FilterTiltShift';
import ComputerIcon from '@mui/icons-material/Computer';
import RateReviewIcon from '@mui/icons-material/RateReview';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';


function ListItemLink(props) {
  const { icon, primary, to } = props;

  const renderLink = React.useMemo(
    () => React.forwardRef((itemProps, ref) => <RouterLink to={to} ref={ref} {...itemProps} />),
    [to],
  );

  return (
    <li>
      <ListItem button component={renderLink}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}

ListItemLink.propTypes = {
  icon: PropTypes.element,
  primary: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};

const useStyles = makeStyles({
  root: {
    width: 360,
  },
});

export default function ListRouter() {
  const classes = useStyles();

  return (

    <Router forceRefresh={true}>
      <div className={classes.root}>
        <Route element="{location.pathname}">
          {/* {({ location, history, route }) => (
            //history.push(location)
            // <Typography gutterBottom>Current route: {location.pathname}</Typography>
            // <Redirect to="/somewhere/else" />
            // <AppRouter/>
            //history.push("/first")
          )} */}
        </Route>


        <Paper elevation={0}>
          <List aria-label="main mailbox folders">

            <ListItemLink to="/" primary="Dashboard" icon={<DashboardIcon color="primary" />} />
            <ListItemLink to="/reviews" primary="APIs Reviews" icon={<RateReviewIcon color="primary" />} />
            <ListItemLink to="/domains" primary="Domains" icon={<FilterTiltShiftIcon color="primary" />} />

            {"true" == process.env.REACT_APP_BETA
              ? < ListItemLink to="/apis" primary="Apis" icon={<ListAltIcon color="primary" />} />
              : null
            }
            {"true" == process.env.REACT_APP_BETA
              ? < ListItemLink to="/envs" primary="Environments" icon={<ComputerIcon color="primary" />} />
              : null
            }
            {"true" == process.env.REACT_APP_BETA
              ?
              <ListItem button component="a" href="{process.env.REACT_APP_PACT_DOC_URL}" target="_blank">
                <ListItemIcon>
                  <LinkIcon /> 
                </ListItemIcon>
                <ListItemText primary="PACT Broker" />
              </ListItem>
              : null
            }

            <ListItem button component="a" href="{process.env.REACT_APP_API_DOC_URL}" target="_blank">
              <ListItemIcon>
                <LinkIcon /> 
              </ListItemIcon>
              <ListItemText primary="APIs Doc" />
            </ListItem>
          </List>
        </Paper>
      </div >
    </Router >
  );
}
