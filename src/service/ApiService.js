import axios from 'axios';

class ApiService {
    listAllApis() {
        return axios.get('/v1/apis');
    }

    loadApiById(selectedApi) {
        console.info("Get Api for api [" + selectedApi + "]");
        return axios.get('/v1/apis/' + selectedApi);
    }

    listAllDomains() {
        return axios.get('/v1/domains');
    }

    listAllDomainsErrors() {
        console.log("listAllDomainsErrors");
        return axios.get('/v1/domains/errors');
    }

    createDomain(domain) {
        console.info("Creating Domain [" + domain + "]");
        return axios.post('/v1/domains', domain);
    }
    deleteDomain(id) {
        console.info("Deleting Domain [" + id + "]");
        return axios.delete('/v1/domains/' + id);
    }

    getDomainsMetrics() {
        return axios.get('/v1/domains/stats');
    }

    listAllEnvs() {
        return axios.get('/v1/envs');
    }

    listSpecsForApi(selectedApi) {
        console.info("Get Specs for api [" + selectedApi + "]");
        return axios.get('/v1/specs');
    }

    listDeploymentsForApi(selectedApi) {
        console.info("Get Deployments for api [" + selectedApi + "]");
        return axios.get('/v1/deployments/' + selectedApi);
    }

    listEnvForId(envId) {
        console.info("Get Env for id [" + envId + "]");
        return axios.get('/v1/envs/' + envId);
    }

    getStats() {
        return axios.get('/v1/metrics');
    }

    refreshMetrics() {
        console.log("refreshing metrics");
        return axios.post('/v1/metrics/refresh');
    }

    getOldestPr() {
        console.log("getting oldest PR");
        return axios.get('v1/pull-requests');
    }

    getMergedPr() {
        console.log("getting merged PR");
        return axios.get('/v1/merged-pull-requests');
    }
}

export default new ApiService();


