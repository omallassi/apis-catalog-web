import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

class ApiService {
    listAllApis() {
        return axios.get(API_BASE_URL + '/v1/apis');
    }
}

export default new ApiService();


