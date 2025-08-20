import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigation/AppNavigator";
import { MyUserContext, MyDispatchContext } from "./configs/MyContexts";
import { useEffect, useReducer, useRef, useState } from "react";
import MyUserReducer from "./reducers/MyUserReducer";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PaperProvider } from "react-native-paper";
import { authApis, endpoints } from "./configs/Apis";
import { Text } from "react-native";
export default function App() {
  const [user, dispatch] = useReducer(MyUserReducer, null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadUser = async () => {
      try {
        let token = await AsyncStorage.getItem("token");
        if (token) {
          let api = await authApis();
          let res = await api.get(endpoints["profile"]);
          dispatch({
            type: "login",
            payload: res.data,
          });
        }
      } catch (err) {
        console.error("Token không hợp lệ hoặc lỗi:", err);
        await AsyncStorage.removeItem("token"); // clear token nếu lỗi
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  if (loading) {
    // có thể thay bằng màn hình splash
    return (
      <SafeAreaProvider>
        <PaperProvider>
          <Text>Loading...</Text>
        </PaperProvider>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <MyUserContext.Provider value={user}>
          <MyDispatchContext.Provider value={dispatch}>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </MyDispatchContext.Provider>
        </MyUserContext.Provider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
