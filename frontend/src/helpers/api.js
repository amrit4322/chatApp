// api.js
import config from "./../config";
class API {
  constructor() {
    this.baseURL = config.API_URL;
  }

  // Function to handle errors
  handleErrors(response) {
    if (response.errors) {
      return response.errors;
    }
    return response.data.result;
  }

  // Function to make a GET request
  async get(endpoint) {
    try {
      const response = await fetch(this.baseURL + endpoint, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      });
      const data = await response.json();
      let result = this.handleErrors(data);

      return { message: result, status: !data.errors };
    } catch (error) {
      console.error("Error during GET request:", error);
      throw error;
    }
  }

  async getWithToken(endpoint, token = null) {
    try {
      const response = await fetch(this.baseURL + endpoint, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          "api-access-token": token,
        },
      });
      const data = await response.json();
      let result = this.handleErrors(data);
      return { message: result, status: !data.errors };
    } catch (error) {
      console.error("Error during GET request:", error);
      return { message: error, status: false };
    }
  }

  // Function to make a POST request
  async post(endpoint, formdata) {
    try {
      const response = await fetch(this.baseURL + endpoint, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      const data = await response.json();
      let result = this.handleErrors(data);

      return { message: result, status: !data.errors };
    } catch (error) {
      console.error("Error during POST request:", error);
      throw error;
    }
  }
  async download(endpoint, token = null) {
    try {
      const response = await fetch(this.baseURL + endpoint, {
        method: "GET",
        headers: {
          "api-access-token": token,
          
        },
      });
      const blob = await response.blob();
    
      return {message:blob,status: true };
    } catch (error) {
      console.error("Error during GET request:", error);
      return {status: false };
    }
  }

  //Function to make Post request with token
  async postWithToken(endpoint, formdata, token = null) {
    try {
      const response = await fetch(this.baseURL + endpoint, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "api-access-token": token,
        },
        body: JSON.stringify(formdata),
      });
      const data = await response.json();
      let result = this.handleErrors(data);

      return { message: result, status: !data.errors };
    } catch (error) {
      console.error("Error during POST request:", error);
      throw error;
    }
  }

  // Function to make a PUT request
  async patchWithToken(endpoint, formdata, token = null) {
    try {
      const response = await fetch(this.baseURL + endpoint, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          "api-access-token": token,
        },
        body: JSON.stringify(formdata),
      });
      const data = await response.json();
      let result = this.handleErrors(data);

      return { message: result, status: !data.errors };
    } catch (error) {
      console.error("Error during PUT request:", error);
      throw error;
    }
  }

  // Function to make a PUT request
  async uploadFile(endpoint, formdata, token = null) {
    try {
      const response = await fetch(this.baseURL + endpoint, {
        method: "POST",
        headers: {
          "api-access-token": token,
        },
        body: formdata,
      });
      const data = await response.json();
      let result = this.handleErrors(data);

      return { message: result, status: !data.errors };
    } catch (error) {
      console.error("Error during PUT request:", error);
      throw error;
    }
  }
  // Function to make a DELETE request
  async remove(endpoint,token=null) {
    try {
      const response = await fetch(this.baseURL + endpoint, {
        method: "DELETE",
        headers: {
          "api-access-token": token,
        },
      });
      const data = await response.json();
      let result = this.handleErrors(data);
      return { message: result, status: !data.errors };
    } catch (error) {
      console.error("Error during DELETE request:", error);
      throw error;
    }
  }

}

export default API;
