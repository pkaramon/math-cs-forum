import axios from "axios";

class ServerUserService {
  constructor() {
    this.url = "http://localhost:5000/";
    this.http = axios.create({
      baseURL: this.url,
    });
  }

  async register({ firstName, lastName, email, password, birthDate }) {
    try {
      birthDate = new Date(birthDate);
      const data = {
        firstname: firstName,
        lastname: lastName,
        email,
        password,
        birthday: this.convertDate(birthDate),
      };

      const response = await this.http.post("/register", data);
      return response.data;
    } catch (err) {
      throw new Error(err.response.data.message);
    }
  }

  async authenticate(email, password) {
    try {
      const data = {
        email,
        password,
      };
      const response = await this.http.post("/login", data);
      return {
        token: response.data.token,
      };
    } catch (err) {
      throw new Error(err.response.data.message);
    }
  }

  async getUserDetails(token) {
    try {
      const response = await this.http.get("/get_user_details", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = response.data;

      return {
        userId: user["user_id"],
        firstName: user["firstname"],
        lastName: user["lastname"],
        email: user["email"],
        role: user["role"],
        birthDate: new Date(user["birthday"]),
        about: user["about"],
      };
    } catch (err) {
      console.log(err);
      throw new Error(err.response.data.message);
    }
  }

  async updateUserDetails(token, userDetails) {
    try {
      const birthDate = new Date(userDetails.birthDate);
      const data = {
        firstname: userDetails.firstName,
        lastname: userDetails.lastName,
        about: userDetails.about,
        birthday: this.convertDate(birthDate),
      };
      const response = await this.http.put("/modify_user_details", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      throw new Error(err.response.data.message);
    }
  }

  convertDate(date) {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }
}

export default ServerUserService;
