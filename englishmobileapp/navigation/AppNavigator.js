import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabNavigator from "./MainTabNavigator";
import { ImageBackground, StyleSheet, View } from "react-native";
import { useEffect, useRef } from "react";
import { Animated } from "react-native";

function WelcomeScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 4000,
      useNativeDriver: true,
    }).start(() => {
      navigation.replace("MainTabs");
    });
  }, [fadeAnim, navigation]);

  return (
    <ImageBackground
      source={require("../assets/bgWelCome.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Animated.Text style={[styles.welcomeText, { opacity: fadeAnim }]}>
          Welcome To App
        </Animated.Text>
      </View>
    </ImageBackground>
  );
}
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
    </Stack.Navigator>
  );
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: "40%",
  },
  welcomeText: {
    color: "#ffffff",
    fontSize: 45,
    fontWeight: "bold",
    textAlign: "center",
    textShadowColor: "#000000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
});
