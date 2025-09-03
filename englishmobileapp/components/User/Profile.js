import React, { useState, useEffect, useContext } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  RefreshControl,
} from "react-native";
import {
  Avatar,
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  Divider,
  List,
  IconButton,
  ActivityIndicator,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";
import { MyDispatchContext, MyUserContext } from "../../configs/MyContexts";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = ({ navigation, route }) => {
  const theme = useTheme();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);
  // Mock user data - thay thế bằng API call thực tế

  useEffect(() => {
    fetchUserProfile();
  }, []);
  const handleLogout = async () => {
    try {
      let tokenBefore = await AsyncStorage.getItem("token");
      console.log("Token trước khi xoá:", tokenBefore);

      await AsyncStorage.removeItem("token");

      let tokenAfter = await AsyncStorage.getItem("token");
      console.log("Token sau khi xoá:", tokenAfter); // phải là null

      dispatch({ type: "logout" });
      Alert.alert("Thông báo", "Đã đăng xuất thành công, chuyển đến trang đăng nhập");
    } catch (err) {
      console.error("Lỗi khi logout:", err);
    }
  };
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      // TODO: Thay thế bằng API call thực tế
      // const response = await fetch('YOUR_API_ENDPOINT');
      // const data = await response.json();

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setUserData(user);
    } catch (error) {
      console.error("Error fetching profile:", error);
      Alert.alert("Lỗi", "Không thể tải thông tin profile");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserProfile();
    setRefreshing(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getUserTypeColor = (userType) => {
    switch (userType) {
      case "FREE":
        return theme.colors.outline;
      case "PREMIUM":
        return theme.colors.primary;
      case "VIP":
        return "#FFD700";
      default:
        return theme.colors.outline;
    }
  };

  const getUserTypeLabel = (userType) => {
    switch (userType) {
      case "FREE":
        return "Miễn phí";
      case "PREMIUM":
        return "Premium";
      case "VIP":
        return "VIP";
      default:
        return userType;
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 16 }}>Đang tải thông tin...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View
        style={[
          styles.errorContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Text>Không thể tải thông tin profile</Text>
        <Button
          mode="contained"
          onPress={fetchUserProfile}
          style={{ marginTop: 16 }}
        >
          Thử lại
        </Button>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header Section */}
      <Surface
        style={[
          styles.headerSection,
          { backgroundColor: theme.colors.primaryContainer },
        ]}
      >
        <View style={styles.avatarContainer}>
          <Avatar.Image
            size={120}
            source={{ uri: userData.avatar }}
            style={styles.avatar}
          />
          <IconButton
            icon="camera"
            size={24}
            iconColor={theme.colors.primary}
            containerColor={theme.colors.surface}
            style={styles.cameraIcon}
            onPress={() => {
              // TODO: Implement avatar update
              Alert.alert(
                "Thông báo",
                "Tính năng cập nhật avatar sẽ được thêm sau"
              );
            }}
          />
        </View>

        <View style={styles.userInfo}>
          <Title style={styles.userName}>
            {userData.firstName} {userData.lastName}
          </Title>
          <Paragraph style={styles.username}>@{userData.username}</Paragraph>

          <View style={styles.chipContainer}>
            <Chip
              icon="account"
              mode="outlined"
              style={[
                styles.chip,
                { borderColor: getUserTypeColor(userData.userType) },
              ]}
              textStyle={{ color: getUserTypeColor(userData.userType) }}
            >
              {getUserTypeLabel(userData.userType)}
            </Chip>
            <Chip
              icon={userData.active ? "check-circle" : "close-circle"}
              mode="outlined"
              style={[
                styles.chip,
                {
                  borderColor: userData.active
                    ? theme.colors.primary
                    : theme.colors.error,
                },
              ]}
              textStyle={{
                color: userData.active
                  ? theme.colors.primary
                  : theme.colors.error,
              }}
            >
              {userData.active ? "Đang hoạt động" : "Không hoạt động"}
            </Chip>
          </View>
        </View>
      </Surface>

      {/* Profile Information */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Thông tin cá nhân</Title>
          <List.Item
            title="Email"
            description={userData.email}
            left={(props) => <List.Icon {...props} icon="email" />}
          />
          <Divider />
          <List.Item
            title="Số điện thoại"
            description={userData.phone}
            left={(props) => <List.Icon {...props} icon="phone" />}
          />
          <Divider />
          <List.Item
            title="Ngày tạo tài khoản"
            description={formatDate(userData.createdAt)}
            left={(props) => <List.Icon {...props} icon="calendar" />}
          />
          <Divider />
          <List.Item
            title="Lần đăng nhập cuối"
            description={formatDate(userData.lastLoginAt)}
            left={(props) => <List.Icon {...props} icon="clock" />}
          />
        </Card.Content>
      </Card>

      {/* Account Actions */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Quản lý tài khoản</Title>
          <List.Item
            title="Cập nhật thông tin"
            description="Chỉnh sửa thông tin cá nhân"
            left={(props) => <List.Icon {...props} icon="account-edit" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {
              // TODO: Navigate to edit profile screen
              Alert.alert(
                "Thông báo",
                "Tính năng cập nhật thông tin sẽ được thêm sau"
              );
            }}
          />
          <Divider />
          <List.Item
            title="Đổi mật khẩu"
            description="Thay đổi mật khẩu tài khoản"
            left={(props) => <List.Icon {...props} icon="lock" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {
              // TODO: Navigate to change password screen
              Alert.alert(
                "Thông báo",
                "Tính năng đổi mật khẩu sẽ được thêm sau"
              );
            }}
          />
        </Card.Content>
      </Card>

      {/* Premium Features */}
      {userData.userType === "FREE" && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Nâng cấp tài khoản</Title>
            <Paragraph style={{ marginBottom: 16 }}>
              Nâng cấp lên Premium để trải nghiệm tính năng cao cấp
            </Paragraph>
            <Button
              mode="contained"
              icon="star"
              onPress={() => {
                // TODO: Navigate to payment/upgrade screen
                Alert.alert(
                  "Thông báo",
                  "Tính năng thanh toán sẽ được thêm sau"
                );
              }}
            >
              Nâng cấp Premium
            </Button>
          </Card.Content>
        </Card>
      )}

      {/* Payment History for Premium users */}
      {userData.userType !== "FREE" && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Lịch sử thanh toán</Title>
            <List.Item
              title="Xem lịch sử giao dịch"
              description="Quản lý các giao dịch đã thực hiện"
              left={(props) => <List.Icon {...props} icon="credit-card" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {
                // TODO: Navigate to payment history screen
                Alert.alert(
                  "Thông báo",
                  "Tính năng lịch sử thanh toán sẽ được thêm sau"
                );
              }}
            />
          </Card.Content>
        </Card>
      )}

      {/* Settings */}
      <Card style={[styles.card, styles.lastCard]}>
        <Card.Content>
          <Title>Cài đặt</Title>
          <List.Item
            title="Thông báo"
            description="Quản lý thông báo"
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {
              // TODO: Navigate to notification settings
              Alert.alert(
                "Thông báo",
                "Tính năng cài đặt thông báo sẽ được thêm sau"
              );
            }}
          />
          <Divider />
          <List.Item
            title="Bảo mật"
            description="Cài đặt bảo mật tài khoản"
            left={(props) => <List.Icon {...props} icon="shield" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {
              // TODO: Navigate to security settings
              Alert.alert("Thông báo", "Tính năng bảo mật sẽ được thêm sau");
            }}
          />
          <Divider />
          <List.Item
            title="Đăng xuất"
            description="Đăng xuất khỏi tài khoản"
            left={(props) => (
              <List.Icon {...props} icon="logout" color={theme.colors.error} />
            )}
            titleStyle={{ color: theme.colors.error }}
            onPress={() => {
              Alert.alert("Xác nhận", "Bạn có chắc chắn muốn đăng xuất?", [
                { text: "Hủy", style: "cancel" },
                {
                  text: "Đăng xuất",
                  style: "destructive",
                  onPress: handleLogout,
                },
              ]);
            }}
          />
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  headerSection: {
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
    elevation: 2,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    elevation: 4,
  },
  cameraIcon: {
    position: "absolute",
    bottom: -5,
    right: -5,
    elevation: 6,
  },
  userInfo: {
    alignItems: "center",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  chip: {
    marginHorizontal: 4,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  lastCard: {
    marginBottom: 32,
  },
});

export default Profile;
