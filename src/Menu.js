import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
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
              <a className="MuiButtonBase-root MuiListItem-root MuiListItem-gutters MuiListItem-padding MuiListItem-button css-rxp3g8-MuiButtonBase-root-MuiListItem-root" tabIndex="0" role="button" aria-disabled="false"
                href={process.env.REACT_APP_PACT_DOC_URL} target="_blank">
                <div className="MuiListItemIcon-root css-cveggr-MuiListItemIcon-root"><svg className="MuiSvgIcon-root MuiSvgIcon-colorPrimary MuiSvgIcon-fontSizeMedium css-1vn2d77-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"></path></svg></div>
                <div className="MuiListItemText-root css-tlelie-MuiListItemText-root"><span className="MuiTypography-root MuiTypography-body1 MuiListItemText-primary css-10hburv-MuiTypography-root">PACT Broker</span></div><span className="MuiTouchRipple-root"></span>
              </a>
              : null
            }
            <li>
              <a className="MuiButtonBase-root MuiListItem-root MuiListItem-gutters MuiListItem-padding MuiListItem-button css-rxp3g8-MuiButtonBase-root-MuiListItem-root" tabIndex="0" role="button" aria-disabled="false"
                href={process.env.REACT_APP_API_DOC_URL} target="_blank">
                <div className="MuiListItemIcon-root css-cveggr-MuiListItemIcon-root"><svg className="MuiSvgIcon-root MuiSvgIcon-colorPrimary MuiSvgIcon-fontSizeMedium css-1vn2d77-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"></path></svg></div>
                <div className="MuiListItemText-root css-tlelie-MuiListItemText-root"><span className="MuiTypography-root MuiTypography-body1 MuiListItemText-primary css-10hburv-MuiTypography-root">APIs Doc</span></div><span className="MuiTouchRipple-root"></span>
              </a>
            </li>
          </List>
        </Paper>
      </div >
    </Router >
  );
}
