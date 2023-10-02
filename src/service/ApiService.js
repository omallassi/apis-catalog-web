import axios from 'axios';

class ApiService {
    listAllApis() {
        return axios.get('/v1/apis');
    }

    loadApiById(selectedApi) {
        console.info("ApiService - Get Api for api [" + selectedApi + "]");
        return axios.get('/v1/apis/' + selectedApi);
    }

    listAllDomains() {
        console.info("ApiService - List all domains");
        return axios.get('/v1/domains');
    }

    listAllDomainsErrors() {
        console.info("ApiService - list all domains errors");
        return axios.get('/v1/domains/errors');
    }

    createDomain(domain) {
        console.info("ApiService - Creating Domain [" + domain + "]");
        return axios.post('/v1/domains', domain);
    }
    deleteDomain(id) {
        console.info("ApiService - Deleting Domain [" + id + "]");
        return axios.delete('/v1/domains/' + id);
    }

    getDomainsMetrics() {
        console.info("ApiService - get Domain metrics");
        return axios.get('/v1/domains/stats');
    }

    listAllEnvs() {
        console.info("ApiService - get all envs");
        return axios.get('/v1/envs');
    }

    listSpecsForApi(selectedApi) {
        console.info("ApiService - Get Specs for api [" + selectedApi + "]");
        return axios.get('/v1/specs');
    }

    listDeploymentsForApi(selectedApi) {
        console.info("ApiService - Get Deployments for api [" + selectedApi + "]");
        return axios.get('/v1/deployments/' + selectedApi);
    }

    listEnvForId(envId) {
        console.info("ApiService - Get Env for id [" + envId + "]");
        return axios.get('/v1/envs/' + envId);
    }

    getStats() {
        console.info("ApiService - getting last version of metrics from /v1/metrics")
        return axios.get('/v1/metrics');
    }

    refreshMetrics() {
        console.log("ApiService - is refreshing metrics (on server)");
        return axios.post('/v1/metrics/refresh');
    }

    getOldestPr() {
        console.log("ApiService - getting oldest PR");
        return axios.get('/v1/pull-requests?limit=5');
    }

    getMergedPr() {
        console.log("ApiService - Getting merged PR (for graphics)");
        return axios.get('/v1/merged-pull-requests');
    }

    listAllReviews() {
        console.log("ApiService - list all reviews");
        return axios.get('/v1/reviews');
    }

    listAllSystems(){
        console.log("ApiService - list all systems and layers");
        return axios.get('/v1/systems');
    }

    listAllDomainsPerSystemAndLayer(system, layer){
        console.info("ApiService - Get Domains for System [" + system + "] and Layer [" + layer + "]");

        return axios.get('/v1/systems/' + system + '/layers/' + layer, {timeout: 60000});
    }
}

export default new ApiService();


