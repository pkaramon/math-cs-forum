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
        birthday: `${birthDate.getMonth() + 1}/${birthDate.getDate()}/${birthDate.getFullYear()}`,
      };

      const response = await this.http.post("/register", data);
      return response.data;
    } catch (err) {
      throw new Error(err.response.data.message);
    }
  }
}

export default ServerUserService;
