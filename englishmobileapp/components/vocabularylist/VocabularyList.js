import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import {
  Provider as PaperProvider,
  Appbar,
  FAB,
  Card,
  Text,
  IconButton,
  Portal,
  Dialog,
  TextInput,
  Button,
  Switch,
  Snackbar,
  ActivityIndicator,
  Chip,
} from "react-native-paper";
import { authApis, endpoints } from "../../configs/Apis";

const VocabularyListManager = ({ navigation }) => {
  const [vocabularyList, setVocabularyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Dialog states
  const [createDialogVisible, setCreateDialogVisible] = useState(false);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [selectedVocabulary, setSelectedVocabulary] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    public: false,
  });

  const [idEdit, setIdEdit] = useState("");

  // Snackbar
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Load vocabularies
  const loadVocabularyList = async () => {
    try {
      setLoading(true);
      let url = `${endpoints["vocabulary"]}`;
      let res = await (await authApis()).get(url);

      setVocabularyList(res.data);
    } catch (error) {
      showSnackbar("Lỗi kết nối: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    await loadVocabularyList();
    setRefreshing(false);
  };

  // Navigate to words screen
  const navigateToWords = (vocabulary) => {
    navigation.navigate("VocabularyWords", {
      vocabularyList: vocabulary, // truyền nguyên object
    });
  };

  // Create vocabulary
  const createVocabulary = async () => {
    if (!formData.name.trim()) {
      showSnackbar("Vui lòng nhập tên danh sách");
      return;
    }
    try {
      let url = `${endpoints["vocabulary"]}/create`;
      console.log("API post create", url);
      let res = await (await authApis()).post(url, formData);
      console.info("formData", formData);
      if (res.status === 201) {
        showSnackbar("Tạo danh sách thành công");
        setCreateDialogVisible(false);
        resetForm();
        loadVocabularyList();
      }
    } catch (error) {
      if (error.response?.status === 409) {
        // Lỗi trùng tên
        Alert.alert(
          "Lỗi",
          error.response.data?.error || "Tên danh sách đã tồn tại"
        );
        // Giữ form mở để người dùng sửa
      }
      showSnackbar("Lỗi kết nối: " + error.message);
    }
  };

  // Update vocabulary
  const updateVocabulary = async () => {
    if (!formData.name.trim()) {
      showSnackbar("Vui lòng nhập tên danh sách");
      return;
    }
    try {
      let url = `${endpoints["vocabulary"]}/${idEdit}`;
      console.log("API put create", url);

      let res = await (await authApis()).put(url, formData);
      console.info("formData", formData);
      if (res.status === 200) {
        showSnackbar("Cập nhật thành công");
        setEditDialogVisible(false);
        resetForm();
        loadVocabularyList();
      }
    } catch (error) {
      if (error.response?.status === 409) {
        // Lỗi trùng tên
        Alert.alert(
          "Lỗi",
          error.response.data?.error || "Tên danh sách đã tồn tại"
        );
        // Giữ form mở để người dùng sửa
      }
      showSnackbar("Lỗi kết nối: " + error.message);
    }
  };

  // Delete vocabulary
  const deleteVocabulary = (vocabulary) => {
    Alert.alert(
      "Xác nhận xóa",
      `Bạn có chắc chắn muốn xóa danh sách "${vocabulary.name}"?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              let url = `${endpoints["vocabulary"]}/${vocabulary.id}`;
              console.log("API delete", url);

              let response = await (await authApis()).delete(url);

              if (response.status === 204) {
                showSnackbar("Xóa thành công");
                loadVocabularyList();
              } else {
                showSnackbar("Lỗi khi xóa danh sách");
              }
            } catch (error) {
              showSnackbar("Lỗi kết nối: " + error.message);
            }
          },
        },
      ]
    );
  };

  // Helper functions
  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      public: false,
    });
    setSelectedVocabulary(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setCreateDialogVisible(true);
  };

  const openEditDialog = (vocabulary) => {
    setSelectedVocabulary(vocabulary);
    setFormData({
      name: vocabulary.name,
      description: vocabulary.description || "",
      public: vocabulary.public || false,
    });
    setIdEdit(vocabulary.id);
    setEditDialogVisible(true);
  };

  const closeDialogs = () => {
    setCreateDialogVisible(false);
    setEditDialogVisible(false);
    resetForm();
  };

  // Load data on mount
  useEffect(() => {
    loadVocabularyList();
  }, []);

  // Render vocabulary item
  const renderVocabularyItem = (vocabulary) => (
    <TouchableOpacity
      key={vocabulary.id}
      onPress={() => navigateToWords(vocabulary)}
      activeOpacity={0.7}
    >
      <Card style={{ margin: 8, elevation: 2 }}>
        <Card.Content>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
                {vocabulary.name}
              </Text>
              {vocabulary.description && (
                <Text
                  variant="bodyMedium"
                  style={{ marginTop: 4, color: "#666" }}
                >
                  {vocabulary.description}
                </Text>
              )}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 8,
                }}
              >
                <Chip
                  icon="book-outline"
                  mode="outlined"
                  compact
                  style={{ marginRight: 8 }}
                >
                  {vocabulary.wordCount || 0} từ
                </Chip>
                {vocabulary.public && (
                  <Chip
                    icon="earth"
                    mode="outlined"
                    compact
                    textStyle={{ fontSize: 12 }}
                  >
                    Công khai
                  </Chip>
                )}
              </View>

              {/* Tap to view indicator */}
              <Text
                variant="bodySmall"
                style={{ marginTop: 8, color: "#999", fontStyle: "italic" }}
              >
                Nhấn để xem từ vựng
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <IconButton
                icon="eye"
                size={20}
                iconColor="#2196F3"
                onPress={() => navigateToWords(vocabulary)}
              />
              <IconButton
                icon="pencil"
                size={20}
                onPress={() => openEditDialog(vocabulary)}
              />
              <IconButton
                icon="delete"
                size={20}
                iconColor="#f44336"
                onPress={() => deleteVocabulary(vocabulary)}
              />
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  // Render form dialog
  const renderFormDialog = (
    visible,
    onDismiss,
    onSubmit,
    title,
    submitText
  ) => (
    <Dialog visible={visible} onDismiss={onDismiss}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Content>
        <TextInput
          label="Tên danh sách *"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          mode="outlined"
          style={{ marginBottom: 16 }}
        />
        <TextInput
          label="Mô tả"
          value={formData.description}
          onChangeText={(text) =>
            setFormData({ ...formData, description: text })
          }
          mode="outlined"
          multiline
          numberOfLines={3}
          style={{ marginBottom: 16 }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text variant="bodyMedium">Công khai danh sách</Text>
          <Switch
            value={formData.public}
            onValueChange={(value) =>
              setFormData({ ...formData, public: value })
            }
          />
        </View>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onDismiss}>Hủy</Button>
        <Button onPress={onSubmit} mode="contained">
          {submitText}
        </Button>
      </Dialog.Actions>
    </Dialog>
  );

  return (
    <PaperProvider>
      <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
        {/* App Bar */}
        <Appbar.Header>
          <Appbar.Content title="Danh sách từ vựng" />
          <Appbar.Action icon="refresh" onPress={loadVocabularyList} />
        </Appbar.Header>

        {/* Content */}
        {loading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" />
            <Text style={{ marginTop: 16 }}>Đang tải...</Text>
          </View>
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={{ paddingBottom: 80 }}
          >
            {vocabularyList.length === 0 ? (
              <View style={{ padding: 32, alignItems: "center" }}>
                <Text
                  variant="bodyLarge"
                  style={{ textAlign: "center", color: "#666" }}
                >
                  Chưa có danh sách từ vựng nào
                </Text>
                <Text
                  variant="bodyMedium"
                  style={{ textAlign: "center", color: "#999", marginTop: 8 }}
                >
                  Nhấn nút + để tạo danh sách mới
                </Text>
              </View>
            ) : (
              vocabularyList.map(renderVocabularyItem)
            )}
          </ScrollView>
        )}

        {/* Floating Action Button */}
        <FAB
          icon="plus"
          style={{
            position: "absolute",
            margin: 16,
            right: 0,
            bottom: 0,
          }}
          onPress={openCreateDialog}
        />

        {/* Dialogs */}
        <Portal>
          {renderFormDialog(
            createDialogVisible,
            closeDialogs,
            createVocabulary,
            "Tạo danh sách mới",
            "Tạo"
          )}

          {renderFormDialog(
            editDialogVisible,
            closeDialogs,
            updateVocabulary,
            "Chỉnh sửa danh sách",
            "Cập nhật"
          )}
        </Portal>

        {/* Snackbar */}
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
        >
          {snackbarMessage}
        </Snackbar>
      </View>
    </PaperProvider>
  );
};

export default VocabularyListManager;
