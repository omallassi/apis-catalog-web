import React, { Component } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LinkIcon from '@mui/icons-material/Link';
import ListAltIcon from '@mui/icons-material/ListAlt';
import FilterTiltShiftIcon from '@mui/icons-material/FilterTiltShift';
import ComputerIcon from '@mui/icons-material/Computer';
import RateReviewIcon from '@mui/icons-material/RateReview';
import LayersIcon from '@mui/icons-material/Layers';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';

import Divider from '@mui/material/Divider';


function ListItemLink(props) {
  const { icon, primary, to } = props;

  const renderLink = React.useMemo(
    () => 
      React.forwardRef((itemProps, ref) => <Link to={to} ref={ref} {...itemProps} role={undefined} />),
    [to],
  );

  return (
    <li>
      {/* <Link to={to}>{primary}</Link> */}
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

// export default function ListRouter() {
class ListRouter extends Component {
  // const classes = useStyles();

  render() {
    return (      
      <div className={this.props.classes.root}>
        <Paper elevation={0}>
          <List>
           <ListItemLink to="/layers" primary="System & Layer Mgmt" icon={<LayersIcon color="primary" />} />
           <ListItemLink to="/domains" primary="Domain Mgmt" icon={<FilterTiltShiftIcon color="primary" />} />

            {process.env.REACT_APP_BETA
              ? <Stack direction="row" spacing={1}><Chip label="beta" color="warning" variant="outlined" size="small" />< ListItemLink to="/" primary="Dashboard" icon={<DashboardIcon color="primary" />} /></Stack>
              : null
            }
            {process.env.REACT_APP_BETA
              ? <Stack direction="row" spacing={1}><Chip label="beta" color="warning" variant="outlined"  size="small" /><ListItemLink to="/reviews" primary="APIs Reviews" icon={<RateReviewIcon color="primary" />} /></Stack>
              : null
            }
            
            

            {process.env.REACT_APP_BETA
              ? <Stack direction="row" spacing={1}><Chip label="beta" color="warning" variant="outlined"  size="small" />< ListItemLink to="/apis" primary="Apis" icon={<ListAltIcon color="primary" />} /></Stack>
              : null
            }
            {process.env.REACT_APP_BETA
              ? <Stack direction="row" spacing={1}><Chip label="beta" color="warning" variant="outlined" size="small" />< ListItemLink to="/envs" primary="Environments" icon={<ComputerIcon color="primary" />} /></Stack>
              : null
            }
            {process.env.REACT_APP_BETA
              ?
              
              <Stack direction="row" spacing={1}><Chip label="beta" color="warning" variant="outlined" size="small" />
              <ListItem button component="a" href={process.env.REACT_APP_PACT_DOC_URL} target="_blank">
                <ListItemIcon>
                  <LinkIcon /> 
                </ListItemIcon>
                <ListItemText primary="PACT Broker" />
              </ListItem>
              </Stack>
              : null
            }

            <ListItem button component="a" href={process.env.REACT_APP_API_DOC_URL} target="_blank">
              <ListItemIcon>
                <LinkIcon /> 
              </ListItemIcon>
              <ListItemText primary="APIs Doc" />
            </ListItem> 
            
          </List>
        </Paper>
      </div >
    )
  }
}

const useStyles = theme => ({
  root: {
    width: 360,
  },
});


ListRouter.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(ListRouter);