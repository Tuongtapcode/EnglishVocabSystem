import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigation/AppNavigator";
import { MyUserContext, MyDispatchContext } from "./configs/MyContexts";
import { useEffect, useReducer, useState } from "react";
import MyUserReducer from "./reducers/MyUserReducer";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PaperProvider } from "react-native-paper";
import { authApis, endpoints } from "./configs/Apis";
import { Alert, Text } from "react-native";
import messaging from "@react-native-firebase/messaging"; // ✅ thêm

export default function App() {
  const [user, dispatch] = useReducer(MyUserReducer, null);
  const [loading, setLoading] = useState(true);

  // 🔹 Hàm setup Firebase Notification
  const setupFCM = async () => {
    try {
      // Yêu cầu quyền (iOS)
      await messaging().requestPermission();

      // Lấy token FCM
      const fcmToken = await messaging().getToken();
      console.log("FCM Token:", fcmToken);

      // 👉 TODO: Gửi fcmToken này về Spring Boot backend để lưu theo user
      // Ví dụ: await api.post(endpoints["saveToken"], { token: fcmToken });

      // Nghe thông báo foreground
      const unsubscribe = messaging().onMessage(async (remoteMessage) => {
        Alert.alert(
          remoteMessage.notification?.title || "Thông báo",
          remoteMessage.notification?.body || ""
        );
      });

      return unsubscribe;
    } catch (err) {
      console.error("FCM setup error:", err);
    }
  };

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

    // 🔹 Setup FCM khi app khởi động
    setupFCM();
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
