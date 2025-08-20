import React, { useContext, useState } from "react";
import {
  View,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  StatusBar,
  Alert,
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  Card,
  Divider,
  HelperText,
  Avatar,
  Surface,
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import { MyDispatchContext } from "../../configs/MyContexts";
import { useNavigation } from "@react-navigation/native";

const Login = ({ navigation }) => {
  // Form fields configuration
  const info = [
    {
      label: "Tên đăng nhập",
      field: "username",
      secureTextEntry: false,
      icon: "account",
    },
    {
      label: "Mật khẩu",
      field: "password",
      secureTextEntry: true,
      icon: "lock",
    },
  ];

  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useContext(MyDispatchContext);
  const nav = useNavigation();
  // Handle input change
  const setState = (value, field) => {
    setUser((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error message when user starts typing
    if (msg) {
      setMsg(null);
    }
  };

  // Validation function
  const validate = () => {
    if (!user?.username || !user?.password) {
      setMsg("Vui lòng nhập tên đăng nhập và mật khẩu!");
      return false;
    }

    setMsg(null);
    return true;
  };

  // Login function
  const login = async () => {
    if (validate() === true) {
      try {
        setLoading(true);

        console.info(user);
        let res = await Apis.post(endpoints["login"], {
          ...user,
          // client_id: "your_client_id",
          // client_secret: "your_client_secret",
          // grant_type: "password",
        });

        console.info(res.data.token);
        await AsyncStorage.setItem("token", res.data.token);

        let u = await (await authApis()).get(endpoints["profile"]);
        console.info(u.data);
        dispatch({
          type: "login",
          payload: u.data,
        });

        // nav.navigate("Category");
      } catch (ex) {
        console.error(ex);
        setMsg("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSocialLogin = (provider) => {
    Alert.alert("Thông báo", `Đăng nhập bằng ${provider} đang được phát triển`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6366f1" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header with gradient background */}
          <Surface style={styles.headerContainer} elevation={0}>
            <LinearGradient
              colors={["#6366f1", "#8b5cf6", "#a855f7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientHeader}
            >
              <Avatar.Icon
                size={80}
                icon="account-circle"
                style={styles.logo}
                color="#6366f1"
              />
              <Text variant="headlineMedium" style={styles.welcomeTitle}>
                Chào mừng trở lại!
              </Text>
              <Text variant="bodyLarge" style={styles.welcomeSubtitle}>
                Đăng nhập để tiếp tục sử dụng ứng dụng
              </Text>
            </LinearGradient>
          </Surface>

          {/* Login Form Card */}
          <Card style={styles.loginCard} mode="elevated">
            <Card.Content style={styles.cardContent}>
              {/* Error Message */}
              {msg && (
                <View style={styles.errorContainer}>
                  <HelperText
                    type="error"
                    visible={!!msg}
                    style={styles.errorText}
                  >
                    {msg}
                  </HelperText>
                </View>
              )}

              {/* Dynamic Input Fields */}
              <View style={styles.inputContainer}>
                {info.map((i) => (
                  <TextInput
                    key={`${i.label}${i.field}`}
                    value={user[i.field] || ""}
                    onChangeText={(t) => setState(t, i.field)}
                    style={styles.input}
                    label={i.label}
                    mode="outlined"
                    secureTextEntry={i.secureTextEntry && !showPassword}
                    left={<TextInput.Icon icon={i.icon} />}
                    right={
                      i.secureTextEntry ? (
                        <TextInput.Icon
                          icon={showPassword ? "eye-off" : "eye"}
                          onPress={() => setShowPassword(!showPassword)}
                        />
                      ) : null
                    }
                    disabled={loading}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                ))}
              </View>

              {/* Login Button */}
              <Button
                mode="contained"
                onPress={login}
                loading={loading}
                disabled={loading}
                style={styles.loginButton}
                contentStyle={styles.loginButtonContent}
                labelStyle={styles.loginButtonLabel}
                buttonColor="#6366f1"
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
              <Button
                mode="text"
                onPress={() =>
                  Alert.alert("Thông báo", "Tính năng đang phát triển")
                }
                labelStyle={styles.forgotButton}
                compact
              >
                Lấy lại mật khẩu?
              </Button>
              {/* Divider */}
              <View style={styles.dividerContainer}>
                <Divider style={styles.divider} />
                <Text variant="bodySmall" style={styles.dividerText}>
                  HOẶC
                </Text>
                <Divider style={styles.divider} />
              </View>

              {/* Social Login Buttons */}
              <View style={styles.socialButtonsContainer}>
                <Button
                  mode="outlined"
                  onPress={() => handleSocialLogin("Google")}
                  style={[styles.socialButton, styles.googleButton]}
                  labelStyle={styles.socialButtonText}
                  icon="google"
                  disabled={loading}
                >
                  Google
                </Button>

                <Button
                  mode="outlined"
                  onPress={() => handleSocialLogin("Facebook")}
                  style={[styles.socialButton, styles.facebookButton]}
                  labelStyle={styles.socialButtonText}
                  icon="facebook"
                  disabled={loading}
                >
                  Facebook
                </Button>
              </View>
            </Card.Content>
          </Card>

          {/* Register Link */}
          <View style={styles.registerContainer}>
            <Text variant="bodyMedium" style={styles.registerText}>
              Chưa có tài khoản?{" "}
            </Text>
            <Button
              mode="text"
              onPress={() => navigation?.navigate("Register")}
              labelStyle={styles.registerLink}
              compact
            >
              Đăng ký ngay
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerContainer: {
    marginBottom: 32,
  },
  gradientHeader: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: "center",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  logo: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    marginBottom: 16,
  },
  welcomeTitle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  welcomeSubtitle: {
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    lineHeight: 22,
  },
  loginCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 16,
    elevation: 8,
  },
  cardContent: {
    padding: 24,
  },
  errorContainer: {
    marginBottom: 16,
    backgroundColor: "#ffebee",
    borderRadius: 8,
    padding: 12,
  },
  errorText: {
    fontSize: 14,
    margin: 0,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: "white",
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginBottom: 24,
    marginTop: 8,
  },
  loginButton: {
    borderRadius: 12,
    elevation: 2,
  },
  loginButtonContent: {
    paddingVertical: 8,
  },
  loginButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#64748b",
    fontWeight: "500",
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  socialButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  googleButton: {
    borderColor: "#db4437",
  },
  facebookButton: {
    borderColor: "#4267B2",
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  registerText: {
    color: "#64748b",
  },
  registerLink: {
    color: "#6366f1",
    fontWeight: "600",
  },
});

export default Login;
