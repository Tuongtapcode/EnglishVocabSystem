import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://192.168.1.6:8080/api/";
// const BASE_URL = "http://10.17.29.141:8080/api/";

export const endpoints = {
  register: "/users",
  login: "/login",
  profile: "/secure/profile",
  category: "/category",
  words: "/words",
  vocabulary: "/secure/vocabulary",
  vocabularyListWords: "/secure/vocabulary-list-words",
};
export default axios.create({
  baseURL: BASE_URL,
});
export const authApis = async () => {
  let token = await AsyncStorage.getItem("token");
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
