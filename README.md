![logo](https://raw.githubusercontent.com/wiki/omallassi/apis-catalog/assets/logo.png)

![Node CI](https://github.com/omallassi/apis-catalog-web/workflows/Node%20CI/badge.svg) [![Build Status](https://travis-ci.org/omallassi/apis-catalog-web.svg?branch=master)](https://travis-ci.org/omallassi/apis-catalog-web) [![Coverage Status](https://coveralls.io/repos/github/omallassi/apis-catalog-web/badge.svg?branch=master)](https://coveralls.io/github/omallassi/apis-catalog-web?branch=master)

## Overview 
> :warning: All of this is, at this stage ideas and POC

The Web UI (at this stage, mostly providing read-only access) to [apis-catalog](https://github.com/omallassi/apis-catalog/). 

The [dashboard provides](https://github.com/omallassi/apis-catalog/wiki/stats-overview)

* metrics w.r.t pull requests: # of pull requests, metrics regarding how long pull requests stay opened..
* metrics w.r.t. the catalog: # of operations, # of resources per domains
* metrics w.r.t. zally: # and types of zally ignore

These metrics are also "enriched" with pull-requests so that you can understand which PR made your stats drifted. 

![screenshot](img/dashboard.png)
![screenshot](img/dashboard_2.png)
![screenshot](img/screen-treemap.png)

Then, you can create APIs and manage their lifecycles; 

![screenshot](img/screen.png)

HTTP backend is available here https://github.com/omallassi/apis-catalog


## Installation 

Please refer to [apis-catalog installation](https://github.com/omallassi/apis-catalog/wiki/installation). 


## More Details
All details are available and centralized in the [wiki](https://github.com/omallassi/apis-catalog/wiki).
