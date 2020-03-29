import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

class ApiService {
    listAllApis() {
        return axios.get(API_BASE_URL + '/v1/apis');
    }

    listAllDomains() {
        return axios.get(API_BASE_URL + '/v1/domains');
    }

    listAllEnvs() {
        return axios.get(API_BASE_URL + '/v1/envs');
    }

    listSpecsForApi(selectedApi) {
        console.info("Get Specs for api [" + selectedApi + "]");
        return axios.get(API_BASE_URL + '/v1/specs');
    }

    listDeploymentsForApi(selectedApi) {
        console.info("Get Deployments for api [" + selectedApi + "]");
        return axios.get(API_BASE_URL + '/v1/deployments');
    }

    getPullRequestNumber() {
        return axios.get(API_BASE_URL + '/v1/metrics');
    }
}

export default new ApiService();


