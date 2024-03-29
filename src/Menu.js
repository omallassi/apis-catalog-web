import React, { Component } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DatasetLinkedIcon from '@mui/icons-material/DatasetLinked';
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

import ApiService from "./service/ApiService"

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


class ListRouter extends Component {

  constructor(props) {
    super(props)
    this.state = {
      config: {}
    }

    this.listConfig = this.listConfig.bind(this);
  }

  componentDidMount(){
    this.listConfig();
  }

  componentWillUnmount(){
    this.setState = (state,callback)=>{
        return;
    };
  }

  listConfig(){
    ApiService.listConfig().then( (res) => {
      this.setState( { config: res.data } );
    } ).catch( (err) => {
      console.error("Error while getting config " + err);
    });
  }

  render() {
    return (      
      <div className={this.props.classes.root}>
        <Paper elevation={0}>
          <List>
           <ListItemLink to="/layers" primary="Systems & Layers" icon={<LayersIcon color="primary" />} />
           <ListItemLink to="/domains" primary="Domain Governance" icon={<FilterTiltShiftIcon color="primary" />} />

            {this.state.config.beta
              ? <Stack direction="row" spacing={1}><Chip label="beta" color="warning" variant="outlined" size="small" />< ListItemLink to="/" primary="Dashboard" icon={<DashboardIcon color="primary" />} /></Stack>
              : null
            }
            {this.state.config.beta
              ? <Stack direction="row" spacing={1}><Chip label="beta" color="warning" variant="outlined"  size="small" /><ListItemLink to="/reviews" primary="APIs Reviews" icon={<RateReviewIcon color="primary" />} /></Stack>
              : null
            }
            
            {this.state.config.beta
              ? <Stack direction="row" spacing={1}><Chip label="beta" color="warning" variant="outlined"  size="small" />< ListItemLink to="/apis" primary="Apis" icon={<ListAltIcon color="primary" />} /></Stack>
              : null
            }
            {this.state.config.beta
              ? <Stack direction="row" spacing={1}><Chip label="beta" color="warning" variant="outlined" size="small" />< ListItemLink to="/envs" primary="Environments" icon={<ComputerIcon color="primary" />} /></Stack>
              : null
            }

            <Stack direction="row" spacing={1}>
              <ListItem button component="a" href={this.state.config.pact_url} target="_blank">
                <ListItemIcon>
                  <LinkIcon /> 
                </ListItemIcon>
                <ListItemText primary="PACT Broker"/>
              </ListItem>
            </Stack>

            <Stack direction="row" spacing={1}>
              <ListItem button component="a" href={this.state.config.api_doc_url} target="_blank">
                <ListItemIcon>
                <DatasetLinkedIcon/>
                </ListItemIcon>
                <ListItemText primary="APIs Doc" />
              </ListItem> 
            </Stack>
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