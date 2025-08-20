import AsyncStorage from "@react-native-async-storage/async-storage";

const userReducer = (current, action) => {
  switch (action.type) {
    case "login":
      return action.payload; // state = user thật
    case "logout":
      AsyncStorage.removeItem("token"); // async ok, nhưng không await
      return null;
    default:
      return current;
  }
};

export default userReducer;
