import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ListAltIcon from '@material-ui/icons/ListAlt';
import FilterTiltShiftIcon from '@material-ui/icons/FilterTiltShift';
import ComputerIcon from '@material-ui/icons/Computer';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';

function  ListItemLink(props) {
  const {icon, primary, to} = props;

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
        <Route exact path="{location.pathname}">
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
            <ListItemLink to="/" primary="Dashboard" icon={<DashboardIcon />} />
            <ListItemLink to="/apis" primary="Apis" icon={<ListAltIcon />} />
            <ListItemLink to="/domains" primary="Domains" icon={<FilterTiltShiftIcon />} />
            <ListItemLink to="/envs" primary="Environments" icon={<ComputerIcon />} />
          </List>
        </Paper>
      </div>
    </Router>
  );
}
