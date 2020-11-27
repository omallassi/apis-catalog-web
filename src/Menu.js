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
import RateReviewIcon from '@material-ui/icons/RateReview';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';


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
            <ListItemLink to="/reviews" primary="APIs Reviews" icon={<RateReviewIcon />} />
            <ListItemLink to="/domains" primary="Domains" icon={<FilterTiltShiftIcon />} />
            <ListItemLink to="/apis" primary="Apis" icon={<ListAltIcon />} />
            <ListItemLink to="/envs" primary="Environments" icon={<ComputerIcon />} />
            <li>
              <a className="MuiButtonBase-root MuiListItem-root MuiListItem-gutters MuiListItem-button" tabIndex="0" role="button" aria-disabled="false"
                href={process.env.REACT_APP_PACT_DOC_URL} target="_blank">
                <div className="MuiListItemIcon-root"><svg className="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"></path></svg></div>
                <div className="MuiListItemText-root"><span className="MuiTypography-root MuiListItemText-primary MuiTypography-body1 MuiTypography-displayBlock">PACT Broker</span></div><span className="MuiTouchRipple-root"></span>
              </a>
            </li>
            <li>
              <a className="MuiButtonBase-root MuiListItem-root MuiListItem-gutters MuiListItem-button" tabIndex="0" role="button" aria-disabled="false"
                href={process.env.REACT_APP_API_DOC_URL} target="_blank">
                <div className="MuiListItemIcon-root"><svg className="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"></path></svg></div>
                <div className="MuiListItemText-root"><span className="MuiTypography-root MuiListItemText-primary MuiTypography-body1 MuiTypography-displayBlock">APIs Doc</span></div><span className="MuiTouchRipple-root"></span>
              </a>
            </li>
          </List>
        </Paper>
      </div>
    </Router>
  );
}
