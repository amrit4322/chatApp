// import axios from 'axios';
// import { useSelector } from 'react-redux';
// // import config from "./../config";


// // default
// axios.defaults.baseURL = "http://10.10.1.75:3004/";
// const baseURL = "http://10.10.1.75:3004/";

// // content type
// axios.defaults.headers.common['Content-Type'] = 'application/json';

// axios.interceptors.request.use(
//     config => {
// 		if (localStorage.getItem["api-access-token"]) { 
// 			config.headers["api-access-token"] = localStorage.getItem["api-access-token"];
// 		}
//         return config;
//     },
//     err => {
//         return Promise.reject(err);
//     });

// // intercepting to capture errors

// axios.interceptors.response.use(function (response) {
//     return response.data ? response.data : response;
// }, function (error) {
//     // Any status codes that falls outside the range of 2xx cause this function to trigger
//     let message;
//     switch (error.status) {
//         case 500: message = 'Internal Server Error'; break;
//         case 401: message = 'Invalid credentials'; break;
//         case 404: message = "Sorry! the data you are looking for could not be found"; break;
//         default: message = error.message || error;
//     }
//     return Promise.reject(message);
// });

// /**
//  * Sets the default authorization
//  * @param {*} token 
//  */
// const setAuthorization = (token) => {
//     axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
// }


// class APIClient {
//     /**
//      * Fetches data from given url

//     */

    

//     fetch=async (url,paramObj={})=>{
//         try{
           
//             const res = await this.fetch(`${baseURL}/url`,{
//                 method:"GET",
//                 headers: {
//                     'Content-type': "application/json",
//                     'api-access-token': token }
//             })
//             // const response  = await
//         }catch(err){
//             console.log("error",err)

//         }
//     }

//     get = async (url, params={}) => {
//         console.log("testing in apiclient ",url,params)
//     try{

//         console.log("default is ",await axios.get(url))
//         const res = await axios.get(url, params)
//         console.log("resondv",res)
//     }catch(err){
//         console.log("Erro roisvr ",err)
//     }
    
//     }

//     /**
//      * post given data to url
//      */
//     create = (url, data) => {
//         return axios.post(url, data);
//     }

//     /**
//      * Updates data
//      */
//     update = (url, data) => {
//         return axios.patch(url, data);
//     }

//     /**
//      * Delete 
//      */
//     delete = (url) => {
//         return axios.put(url);
//     }
// }

// export { APIClient, setAuthorization };