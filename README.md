![logo](https://raw.githubusercontent.com/wiki/omallassi/apis-catalog/assets/logo.png)

[![npm build](https://github.com/omallassi/apis-catalog-web/actions/workflows/actions.yml/badge.svg)](https://github.com/omallassi/apis-catalog-web/actions/workflows/actions.yml) [![Coverage Status](https://coveralls.io/repos/github/omallassi/apis-catalog-web/badge.svg)](https://coveralls.io/github/omallassi/apis-catalog-web)

## Overview 
> :warning: All of this is, at this stage ideas and POC

The Web UI (at this stage, mostly providing read-only access) to [apis-catalog](https://github.com/omallassi/apis-catalog/). 

The [dashboard provides](https://github.com/omallassi/apis-catalog/wiki/stats-overview)

* metrics w.r.t pull requests: # of pull requests, metrics regarding how long pull requests stay opened..
* metrics w.r.t. the catalog: # of operations, # of resources per domains
* metrics w.r.t. zally: # and types of zally ignore
* others. 

Please, refer to [Web UIs](https://github.com/omallassi/apis-catalog/wiki/Web-UI-Overview) for more details about available UIs and information.

These metrics are also "enriched" with pull-requests so that you can understand which PR made your stats drifted. 

### Metrics related dashboards

![screenshot](img/dashboard.png)
![screenshot](img/dashboard_2.png)

### Domains related dashboards 

You can view the repartition of `operations` per domains

![screenshot](img/screen-treemap.png)

You can also compare your specifications with a domain catalog (assuming the domain catalog is some sort of "validated")
![screenshot](img/screen-domains-violations.png)

Then, you can create APIs and manage their lifecycles; 

![screenshot](img/screen.png)

HTTP backend is available here https://github.com/omallassi/apis-catalog

### Full text search across specifications

There is a full-text search available that will help you find specifications. 

## Installation 

Please refer to [apis-catalog installation](https://github.com/omallassi/apis-catalog/wiki/installation). 


## More Details
All details are available and centralized in the [wiki](https://github.com/omallassi/apis-catalog/wiki).
