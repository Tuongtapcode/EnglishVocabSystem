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
  TouchableOpacity,
  Image,
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
  Checkbox,
  IconButton,
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import { MyDispatchContext } from "../../configs/MyContexts";

const Register = ({ navigation }) => {
  // Form fields configuration
  const info = [
    {
      label: "Họ",
      field: "firstName",
      secureTextEntry: false,
      icon: "account",
      keyboardType: "default",
    },
    {
      label: "Tên",
      field: "lastName",
      secureTextEntry: false,
      icon: "account-outline",
      keyboardType: "default",
    },
    {
      label: "Email",
      field: "email",
      secureTextEntry: false,
      icon: "email",
      keyboardType: "email-address",
    },
    {
      label: "Số điện thoại",
      field: "phone",
      secureTextEntry: false,
      icon: "phone",
      keyboardType: "phone-pad",
    },
    {
      label: "Tên đăng nhập",
      field: "username",
      secureTextEntry: false,
      icon: "account-circle",
      keyboardType: "default",
    },
    {
      label: "Mật khẩu",
      field: "password",
      secureTextEntry: true,
      icon: "lock",
      keyboardType: "default",
    },
    {
      label: "Xác nhận mật khẩu",
      field: "confirmPassword",
      secureTextEntry: true,
      icon: "lock-check",
      keyboardType: "default",
    },
  ];

  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [avatarUri, setAvatarUri] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const dispatch = useContext(MyDispatchContext);

  // Request permission for image picker
  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Quyền truy cập",
        "Ứng dụng cần quyền truy cập thư viện ảnh để chọn avatar.",
        [{ text: "OK" }]
      );
      return false;
    }
    return true;
  };

  // Handle avatar selection
  const selectAvatar = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    Alert.alert("Chọn ảnh đại diện", "Bạn muốn chọn ảnh từ đâu?", [
      {
        text: "Thư viện ảnh",
        onPress: () => pickImageFromLibrary(),
      },
      {
        text: "Chụp ảnh",
        onPress: () => takePhoto(),
      },
      {
        text: "Hủy",
        style: "cancel",
      },
    ]);
  };

  // Pick image from library
  const pickImageFromLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Square aspect ratio
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        const selectedImage = result.assets[0];
        setAvatarUri(selectedImage.uri);

        // Update user state with avatar
        setUser((prev) => ({
          ...prev,
          avatar: selectedImage,
        }));
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Lỗi", "Không thể chọn ảnh. Vui lòng thử lại.");
    }
  };

  // Take photo with camera
  const takePhoto = async () => {
    try {
      const cameraPermission =
        await ImagePicker.requestCameraPermissionsAsync();
      if (cameraPermission.status !== "granted") {
        Alert.alert(
          "Quyền truy cập",
          "Ứng dụng cần quyền truy cập camera để chụp ảnh.",
          [{ text: "OK" }]
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        const takenPhoto = result.assets[0];
        setAvatarUri(takenPhoto.uri);

        // Update user state with avatar
        setUser((prev) => ({
          ...prev,
          avatar: takenPhoto,
        }));
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Lỗi", "Không thể chụp ảnh. Vui lòng thử lại.");
    }
  };

  // Remove avatar
  const removeAvatar = () => {
    Alert.alert("Xóa ảnh đại diện", "Bạn có chắc chắn muốn xóa ảnh đại diện?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Xóa",
        style: "destructive",
        onPress: () => {
          setAvatarUri(null);
          setUser((prev) => ({
            ...prev,
            avatar: null,
          }));
        },
      },
    ]);
  };

  // Handle input change
  const setState = (value, field) => {
    setUser((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error messages when user starts typing
    if (msg) {
      setMsg(null);
    }
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  // Client-side validation
  const validateClient = () => {
    const errors = {};
    let isValid = true;

    // Check required fields
    info.forEach((item) => {
      if (!user[item.field] || !user[item.field].trim()) {
        errors[item.field] = `Vui lòng nhập ${item.label.toLowerCase()}`;
        isValid = false;
      }
    });

    // Validate email format
    if (user.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      errors.email = "Email không hợp lệ";
      isValid = false;
    }

    // Validate phone format
    if (user.phone && !/^[0-9]{10,11}$/.test(user.phone.replace(/\s/g, ""))) {
      errors.phone = "Số điện thoại không hợp lệ";
      isValid = false;
    }

    // // Validate password length
    // if (user.password && user.password.length < 6) {
    //   errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    //   isValid = false;
    // }

    // // Validate password confirmation
    // if (user.password && user.confirmPassword && user.password !== user.confirmPassword) {
    //   errors.confirmPassword = "Mật khẩu xác nhận không khớp";
    //   isValid = false;
    // }

    // // Check if confirmPassword is provided when password is provided
    // if (user.password && !user.confirmPassword) {
    //   errors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    //   isValid = false;
    // }

    // Validate username length
    if (user.username && user.username.length < 3) {
      errors.username = "Tên đăng nhập phải có ít nhất 3 ký tự";
      isValid = false;
    }

    // Check terms acceptance
    if (!acceptTerms) {
      setMsg("Vui lòng đồng ý với điều khoản sử dụng!");
      isValid = false;
    }

    if (!isValid) {
      setFieldErrors(errors);
      if (Object.keys(errors).length > 0 && !msg) {
        setMsg("Vui lòng kiểm tra lại thông tin đã nhập!");
      }
    }

    return isValid;
  };

  // Handle server validation errors
  const handleServerErrors = (error) => {
    if (error.response && error.response.data) {
      const serverError = error.response.data;

      // Handle single field error
      if (serverError.field && serverError.message) {
        setFieldErrors({
          [serverError.field]: serverError.message,
        });
        return;
      }

      // Handle multiple field errors
      if (Array.isArray(serverError)) {
        const errors = {};
        serverError.forEach((err) => {
          if (err.field && err.message) {
            errors[err.field] = err.message;
          }
        });
        setFieldErrors(errors);
        return;
      }

      // Handle general error message
      if (serverError.message) {
        setMsg(serverError.message);
        return;
      }
    }

    // Default error message
    setMsg("Đăng ký thất bại. Vui lòng thử lại!");
  };

  // Register function
  const register = async () => {
    if (!validateClient()) return;

    try {
      setLoading(true);
      setMsg(null);
      setFieldErrors({});

      console.info(user);

      // Create FormData for multipart upload
      const formData = new FormData();

      // Remove confirmPassword and avatar from user data
      const { confirmPassword, avatar, ...userData } = user;

      // Append user data
      Object.keys(userData).forEach((key) => {
        formData.append(key, userData[key]);
      });

      // Append avatar if selected
      if (avatar && avatar.uri) {
        // For React Native, FormData expects this format
        formData.append("avatar", {
          uri: avatar.uri,
          type: avatar.mimeType || "image/jpeg",
          name: avatar.fileName || `avatar_${Date.now()}.jpg`,
        });
      }

      let res = await Apis.post(endpoints["register"], formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.info(res.data);

      // Show success message
      Alert.alert("Thành công", "Đăng ký thành công! Vui lòng đăng nhập.", [
        {
          text: "OK",
          onPress: () => navigation?.navigate("Login"),
        },
      ]);
    } catch (ex) {
      console.error(ex);
      handleServerErrors(ex);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegister = (provider) => {
    Alert.alert("Thông báo", `Đăng ký bằng ${provider} đang được phát triển`);
  };

  // Get error message for field
  const getFieldError = (field) => {
    return fieldErrors[field] || null;
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
                icon="account-plus"
                style={styles.logo}
                color="#6366f1"
              />
              <Text variant="headlineMedium" style={styles.welcomeTitle}>
                Tạo tài khoản mới
              </Text>
              <Text variant="bodyLarge" style={styles.welcomeSubtitle}>
                Đăng ký để bắt đầu sử dụng ứng dụng
              </Text>
            </LinearGradient>
          </Surface>

          {/* Register Form Card */}
          <Card style={styles.registerCard} mode="elevated">
            <Card.Content style={styles.cardContent}>
              {/* General Error Message */}
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

              {/* Avatar Upload Section */}
              <View style={styles.avatarSection}>
                <Text variant="titleSmall" style={styles.avatarTitle}>
                  Ảnh đại diện (tùy chọn)
                </Text>

                <View style={styles.avatarContainer}>
                  <TouchableOpacity
                    onPress={selectAvatar}
                    style={styles.avatarWrapper}
                    disabled={loading}
                  >
                    {avatarUri ? (
                      <Image
                        source={{ uri: avatarUri }}
                        style={styles.avatarImage}
                      />
                    ) : (
                      <Avatar.Icon
                        size={100}
                        icon="account-plus"
                        style={styles.defaultAvatar}
                        color="#6366f1"
                      />
                    )}

                    {/* Upload overlay */}
                    <View style={styles.avatarOverlay}>
                      <Avatar.Icon
                        size={32}
                        icon="camera"
                        style={styles.cameraIcon}
                        color="white"
                      />
                    </View>
                  </TouchableOpacity>

                  {/* Avatar actions */}
                  <View style={styles.avatarActions}>
                    <Button
                      mode="outlined"
                      onPress={selectAvatar}
                      style={styles.avatarButton}
                      labelStyle={styles.avatarButtonText}
                      icon="image"
                      compact
                      disabled={loading}
                    >
                      Chọn ảnh
                    </Button>

                    {avatarUri && (
                      <IconButton
                        icon="delete"
                        iconColor="#ef4444"
                        size={20}
                        onPress={removeAvatar}
                        disabled={loading}
                        style={styles.deleteButton}
                      />
                    )}
                  </View>
                </View>
              </View>

              {/* Dynamic Input Fields */}
              <View style={styles.inputContainer}>
                {info.map((i) => (
                  <View key={`${i.label}${i.field}`}>
                    <TextInput
                      value={user[i.field] || ""}
                      onChangeText={(t) => setState(t, i.field)}
                      style={styles.input}
                      label={i.label}
                      mode="outlined"
                      secureTextEntry={
                        i.secureTextEntry &&
                        (i.field === "password"
                          ? !showPassword
                          : !showConfirmPassword)
                      }
                      keyboardType={i.keyboardType || "default"}
                      left={<TextInput.Icon icon={i.icon} />}
                      right={
                        i.secureTextEntry ? (
                          <TextInput.Icon
                            icon={
                              (
                                i.field === "password"
                                  ? showPassword
                                  : showConfirmPassword
                              )
                                ? "eye-off"
                                : "eye"
                            }
                            onPress={() => {
                              if (i.field === "password") {
                                setShowPassword(!showPassword);
                              } else if (i.field === "confirmPassword") {
                                setShowConfirmPassword(!showConfirmPassword);
                              }
                            }}
                          />
                        ) : null
                      }
                      error={!!getFieldError(i.field)}
                      disabled={loading}
                      autoCapitalize={
                        i.field === "email" ? "none" : "sentences"
                      }
                      autoCorrect={false}
                    />
                    {getFieldError(i.field) && (
                      <HelperText
                        type="error"
                        visible={!!getFieldError(i.field)}
                        style={styles.fieldErrorText}
                      >
                        {getFieldError(i.field)}
                      </HelperText>
                    )}
                  </View>
                ))}
              </View>

              {/* Terms and Conditions */}
              <View style={styles.termsContainer}>
                <Checkbox
                  status={acceptTerms ? "checked" : "unchecked"}
                  onPress={() => setAcceptTerms(!acceptTerms)}
                  color="#6366f1"
                />
                <View style={styles.termsTextContainer}>
                  <Text style={styles.termsText}>Tôi đồng ý với </Text>
                  <TouchableOpacity
                    onPress={() =>
                      Alert.alert("Điều khoản", "Điều khoản sử dụng")
                    }
                  >
                    <Text style={styles.termsLink}>Điều khoản sử dụng</Text>
                  </TouchableOpacity>
                  <Text style={styles.termsText}> và </Text>
                  <TouchableOpacity
                    onPress={() =>
                      Alert.alert("Chính sách", "Chính sách bảo mật")
                    }
                  >
                    <Text style={styles.termsLink}>Chính sách bảo mật</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Register Button */}
              <Button
                mode="contained"
                onPress={register}
                loading={loading}
                disabled={loading || !acceptTerms}
                style={[
                  styles.registerButton,
                  (!acceptTerms || loading) && styles.disabledButton,
                ]}
                contentStyle={styles.registerButtonContent}
                labelStyle={styles.registerButtonLabel}
                buttonColor={acceptTerms && !loading ? "#6366f1" : "#94a3b8"}
              >
                {loading ? "Đang đăng ký..." : "Đăng ký"}
              </Button>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <Divider style={styles.divider} />
                <Text variant="bodySmall" style={styles.dividerText}>
                  HOẶC
                </Text>
                <Divider style={styles.divider} />
              </View>

              {/* Social Register Buttons */}
              <View style={styles.socialButtonsContainer}>
                <Button
                  mode="outlined"
                  onPress={() => handleSocialRegister("Google")}
                  style={[styles.socialButton, styles.googleButton]}
                  labelStyle={styles.socialButtonText}
                  icon="google"
                  disabled={loading}
                >
                  Google
                </Button>

                <Button
                  mode="outlined"
                  onPress={() => handleSocialRegister("Facebook")}
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

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text variant="bodyMedium" style={styles.loginText}>
              Đã có tài khoản?{" "}
            </Text>
            <Button
              mode="text"
              onPress={() => navigation?.navigate("Login")}
              labelStyle={styles.loginLink}
              compact
              disabled={loading}
            >
              Đăng nhập ngay
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
  registerCard: {
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

  // Avatar styles
  avatarSection: {
    marginBottom: 24,
    alignItems: "center",
  },
  avatarTitle: {
    color: "#374151",
    fontWeight: "500",
    marginBottom: 16,
    textAlign: "center",
  },
  avatarContainer: {
    alignItems: "center",
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 12,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#6366f1",
  },
  defaultAvatar: {
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    borderWidth: 2,
    borderColor: "#6366f1",
    borderStyle: "dashed",
  },
  avatarOverlay: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: "#6366f1",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "white",
  },
  cameraIcon: {
    backgroundColor: "transparent",
  },
  avatarActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  avatarButton: {
    borderColor: "#6366f1",
    borderRadius: 8,
  },
  avatarButtonText: {
    fontSize: 12,
    color: "#6366f1",
  },
  deleteButton: {
    margin: 0,
  },

  inputContainer: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 8,
    backgroundColor: "white",
  },
  fieldErrorText: {
    fontSize: 12,
    marginBottom: 8,
    marginTop: -4,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  termsTextContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginLeft: 8,
    lineHeight: 20,
  },
  termsText: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
  },
  termsLink: {
    fontSize: 14,
    color: "#6366f1",
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  registerButton: {
    borderRadius: 12,
    marginBottom: 24,
    elevation: 2,
  },
  disabledButton: {
    elevation: 0,
  },
  registerButtonContent: {
    paddingVertical: 8,
  },
  registerButtonLabel: {
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
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  loginText: {
    color: "#64748b",
  },
  loginLink: {
    color: "#6366f1",
    fontWeight: "600",
  },
});

export default Register;
