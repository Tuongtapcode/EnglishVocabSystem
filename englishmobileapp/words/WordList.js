import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import {
  Searchbar,
  Card,
  Chip,
  FAB,
  Portal,
  Modal,
  Button,
  Text,
  Divider,
  Menu,
  DefaultTheme,
  IconButton,
  Badge,
  ActivityIndicator,
  TextInput,
  Switch,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Apis, { authApis, endpoints } from "../configs/Apis";
import { Audio } from "expo-av";

// Theme tùy chỉnh
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#6200ea",
    accent: "#03dac4",
    surface: "#f5f5f5",
  },
};

const VocabularyScreen = ({ route }) => {
  //Props
  const categoryId = route?.params?.categoryId || null;
  const level = route?.params?.level || null;
  //data
  const [categories, setCategories] = useState([]);
  const [vocabularyData, setVocabularyData] = useState([]);
  const [vocabularyList, setVocabularyList] = useState([]);
  // States
  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  //pagezing
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(categoryId || "");
  const [selectedLevel, setSelectedLevel] = useState(level || "");
  const [selectedWordType, setSelectedWordType] = useState("");

  // Menu states
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [levelMenuVisible, setLevelMenuVisible] = useState(false);
  const [wordTypeMenuVisible, setWordTypeMenuVisible] = useState(false);

  // Modal states
  const [addToListModalVisible, setAddToListModalVisible] = useState(false);
  const [createListModalVisible, setCreateListModalVisible] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);
  // Create Voacalist
  const [newListName, setNewListName] = useState("");
  const [newListDescription, setNewListDescription] = useState("");
  const [createListLoading, setCreateListLoading] = useState(false);
  const [newListPublic, setNewListPublic] = useState(false);
  // Categories, levels, word types for filters
  const loadCategories = async () => {
    try {
      let url = `${endpoints["category"]}`;
      let res = await Apis.get(url);
      setCategories(res.data.content);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải danh mục. Vui lòng thử lại.");
      console.error("Error fetching categories:", error);
    }
  };
  const loadVocabularyList = async () => {
    try {
      let url = `${endpoints["vocabulary"]}`;
      let res = await (await authApis()).get(url);
      setVocabularyList(res.data);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải danh sách từ vựng. Vui lòng thử lại.");
      console.error("Error fetching vocabulary list:", error);
    }
  };
  const levels = ["all", "A1", "A2", "B1", "B2", "C1", "C2"];
  const wordTypes = [
    "all",
    "NOUN",
    "VERB",
    "ADJECTIVE",
    "ADVERB",
    "PREPOSITION",
  ];

  // Load data function
  const loadWords = async (pageNumber = 0, size = 5) => {
    if (!hasMore && pageNumber !== 0) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageNumber.toString(),
        size: size.toString(),
      });
      // thêm filter
      if (selectedCategory) {
        params.append("category", selectedCategory.toString());
      }
      if (selectedLevel) {
        params.append("level", selectedLevel);
      }
      if (selectedWordType) {
        params.append("wordType", selectedWordType);
      }

      if (searchQuery) {
        params.append("keyword", searchQuery);
      }

      const url = `${endpoints["words"]}?${params.toString()}`;
      const res = await Apis.get(url);
      console.info("URL", url);
      const newData = res.data.content;

      if (pageNumber === 0) {
        // load lại từ đầu
        setVocabularyData(newData);
      } else {
        // load tiếp
        setVocabularyData((prev) => [...prev, ...newData]);
      }

      setHasMore(!res.data.last);
      setPage(pageNumber); // update state page = pageNumber
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadWords(page + 1);
    }
  };
  useEffect(() => {
    loadCategories();
    loadVocabularyList();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadWords(0); // luôn load lại từ đầu khi search
    }, 500); // debounce 500ms

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, selectedCategory, selectedLevel, selectedWordType]);

  // Handlers
  const handleRefresh = () => {
    setRefreshing(true);
    setPage(0);
    setHasMore(true);
    setVocabularyData([]);
    loadWords();
  };

  const handleAddToList = (word) => {
    setSelectedWord(word);
    setAddToListModalVisible(true);
  };

  const handleAddToExistingList = async (listId) => {
    if (!selectedWord) {
      Alert.alert("Lỗi", "Chưa chọn từ nào để thêm!");
      return;
    }
    try {
      const payload = {
        vocabularyListId: listId,
        wordId: selectedWord.id,
      };
      let url = `${endpoints["vocabularyListWords"]}/add`;
      console.info("Url add word to list:", url);
      let res = await (await authApis()).post(url, payload);
      console.info("Payload", payload);
      if (res.status === 201) {
        Alert.alert(
          "Thành công!",
          `Đã thêm từ "${selectedWord.englishWord}" vào danh sách!`
        );
      }
      setAddToListModalVisible(false);
    } catch (error) {
      if (error.response?.status === 400) {
        Alert.alert(
          "Lỗi",
          error.response.data?.error || "Từ đã có trong danh sách"
        );
      } else if (error.response?.status === 403) {
        Alert.alert(
          "Lỗi",
          error.response.data?.error ||
            "Bạn không có quyền thêm từ vào danh sách này"
        );
      } else {
        console.error(
          "Error creating list:",
          error.response?.data || error.message
        );
        Alert.alert("Lỗi", "Không thể tạo danh sách. Vui lòng thử lại!");
      }
    } finally {
      loadVocabularyList();
    }
  };
  const handleCreateNewListSubmit = async () => {
    if (!newListName.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên danh sách");
      return;
    }

    setCreateListLoading(true);
    try {
      const newList = {
        name: newListName.trim(),
        description: newListDescription.trim(),
        public: newListPublic,
      };
      let url = `${endpoints["vocabulary"]}/create`;
      console.log("API post create", url);
      let res = await (await authApis()).post(url, newList);
      // Reset form
      setNewListName("");
      setNewListDescription("");
      setNewListPublic(false);
      setCreateListModalVisible(false);

      if (res.status === 201) {
        setNewListName("");
        setNewListDescription("");
        setNewListPublic(false);
        setCreateListModalVisible(false);
        loadVocabularyList();

        Alert.alert(
          "Thành công!",
          `Đã tạo danh sách "${newList.name}" thành công!`,
          [
            {
              text: "OK",
              onPress: () => {
                console.log("Created new list:", res.data);
              },
            },
          ]
        );
      }
    } catch (error) {
      if (error.response?.status === 409) {
        // Lỗi trùng tên
        Alert.alert(
          "Lỗi",
          error.response.data?.error || "Tên danh sách đã tồn tại"
        );
        // Giữ form mở để người dùng sửa
      } else {
        console.error(
          "Error creating list:",
          error.response?.data || error.message
        );
        Alert.alert("Lỗi", "Không thể tạo danh sách. Vui lòng thử lại!");
      }
    } finally {
      setCreateListLoading(false);
    }
  };
  const handleCreateNewList = () => {
    setAddToListModalVisible(false);
    setCreateListModalVisible(true);
  };

  const playAudio = async (audioUrl) => {
    try {
      console.info("play", audioUrl);
      const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
      await sound.playAsync();
    } catch (error) {
      console.error("Error playing audio", error);
    }
  };
  const clearAllFilters = () => {
    setSelectedCategory("");
    setSelectedLevel("");
    setSelectedWordType("");
    setSearchQuery("");
  };

  // Render functions
  const renderFilterChips = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filtersContainer}
    >
      <Menu
        visible={categoryMenuVisible}
        onDismiss={() => setCategoryMenuVisible(false)}
        anchor={
          <Chip
            selected={selectedCategory !== ""}
            onPress={() => setCategoryMenuVisible(true)}
            style={styles.filterChip}
            icon="tag"
          >
            Danh mục:{" "}
            {selectedCategory === ""
              ? "Tất cả"
              : categories.find((c) => c.id === selectedCategory)?.name}
          </Chip>
        }
      >
        {/* Mục Tất cả */}
        <Menu.Item
          key="all"
          onPress={() => {
            setSelectedCategory("");
            setCategoryMenuVisible(false);
          }}
          title="Tất cả"
        />

        {/* Các category khác */}
        {categories.map((category) => (
          <Menu.Item
            key={category.id}
            onPress={() => {
              setSelectedCategory(category.id);
              setCategoryMenuVisible(false);
            }}
            title={category.name}
          />
        ))}
      </Menu>
      <Menu
        visible={levelMenuVisible}
        onDismiss={() => setLevelMenuVisible(false)}
        anchor={
          <Chip
            selected={selectedLevel !== ""}
            onPress={() => setLevelMenuVisible(true)}
            style={styles.filterChip}
            icon="signal"
          >
            Cấp độ: {selectedLevel === "" ? "Tất cả" : selectedLevel}
          </Chip>
        }
      >
        {/* Mục tất cả */}
        <Menu.Item
          key="all"
          onPress={() => {
            setSelectedLevel(""); // all = ""
            setLevelMenuVisible(false);
          }}
          title="Tất cả"
        />

        {/* Các level khác */}
        {levels.map((level) => (
          <Menu.Item
            key={level}
            onPress={() => {
              setSelectedLevel(level);
              setLevelMenuVisible(false);
            }}
            title={level}
          />
        ))}
      </Menu>
      <Menu
        visible={wordTypeMenuVisible}
        onDismiss={() => setWordTypeMenuVisible(false)}
        anchor={
          <Chip
            selected={selectedWordType !== ""}
            onPress={() => setWordTypeMenuVisible(true)}
            style={styles.filterChip}
            icon="format-text"
          >
            Loại từ: {selectedWordType === "" ? "Tất cả" : selectedWordType}
          </Chip>
        }
      >
        {/* Mục tất cả */}
        <Menu.Item
          key="all"
          onPress={() => {
            setSelectedWordType(""); // all = ""
            setWordTypeMenuVisible(false);
          }}
          title="Tất cả"
        />

        {/* Các loại từ khác */}
        {wordTypes.map((type) => (
          <Menu.Item
            key={type}
            onPress={() => {
              setSelectedWordType(type);
              setWordTypeMenuVisible(false);
            }}
            title={type}
          />
        ))}
      </Menu>

      {(selectedCategory !== "" ||
        selectedLevel !== "" ||
        selectedWordType !== "") && (
        <Chip
          onPress={clearAllFilters}
          style={[styles.filterChip, styles.clearFilterChip]}
          icon="close"
        >
          Xóa bộ lọc
        </Chip>
      )}
    </ScrollView>
  );

  const renderVocabularyCard = ({ item }) => (
    <Card style={styles.vocabularyCard}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.wordInfo}>
            <Text variant="titleLarge" style={styles.englishWord}>
              {item.englishWord}
            </Text>
            <View style={styles.pronunciationContainer}>
              <Text style={styles.pronunciation}>{item.pronunciation}</Text>
              <IconButton
                icon="volume-high"
                size={20}
                onPress={() => playAudio(item.audioUrl)}
              />
            </View>
          </View>
          <View style={styles.cardActions}>
            <IconButton
              icon="plus"
              size={24}
              onPress={() => handleAddToList(item)}
            />
          </View>
        </View>

        <Text variant="bodyMedium" style={styles.vietnameseMeaning}>
          {item.vietnameseMeaning}
        </Text>
        <View style={styles.tagsContainer}>
          <Badge style={[styles.badge, styles.levelBadge]}>{item.level}</Badge>
          <Badge style={[styles.badge, styles.typeBadge]}>
            {item.wordType}
          </Badge>
          <Badge style={[styles.badge, styles.categoryBadge]}>
            {item.category.name}
          </Badge>
        </View>
      </Card.Content>
    </Card>
  );

  const renderAddToListModal = () => (
    <Portal>
      <Modal
        visible={addToListModalVisible}
        onDismiss={() => setAddToListModalVisible(false)}
        contentContainerStyle={styles.modalContainer}
      >
        <Text variant="titleLarge" style={styles.modalTitle}>
          Thêm "{selectedWord?.englishWord}" vào danh sách
        </Text>
        <ScrollView style={styles.listContainer}>
          {vocabularyList.map((list) => (
            <TouchableOpacity
              key={list.id}
              onPress={() => handleAddToExistingList(list.id)}
              style={styles.listItem}
            >
              <View style={styles.listInfo}>
                <Text style={styles.listName}>{list.name}</Text>
                <Text style={styles.listCount}>{list.wordCount} từ</Text>
              </View>
              <Icon name="chevron-right" size={24} color="#666" />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Divider style={styles.divider} />

        <Button
          mode="contained"
          onPress={handleCreateNewList}
          style={styles.createListButton}
          icon="plus"
        >
          Tạo danh sách mới
        </Button>

        <Button
          mode="text"
          onPress={() => setAddToListModalVisible(false)}
          style={styles.cancelButton}
        >
          Hủy
        </Button>
      </Modal>
    </Portal>
  );
  const renderCreateNewListModal = () => (
    <Portal>
      <Modal
        visible={createListModalVisible}
        onDismiss={() => setCreateListModalVisible(false)}
        contentContainerStyle={styles.modalContainer}
      >
        <Text variant="titleLarge" style={styles.modalTitle}>
          Tạo danh sách học tập mới
        </Text>

        {selectedWord && (
          <View style={styles.selectedWordInfo}>
            <Icon name="information-outline" size={16} color="#666" />
            <Text style={styles.selectedWordText}>
              Từ "{selectedWord.englishWord}" sẽ được thêm vào danh sách này
            </Text>
          </View>
        )}

        <View style={styles.formContainer}>
          <TextInput
            label="Tên danh sách *"
            value={newListName}
            onChangeText={setNewListName}
            style={styles.textInput}
            mode="outlined"
            placeholder="VD: Từ vựng IELTS, Từ khó nhớ..."
            maxLength={50}
            disabled={createListLoading}
          />

          <Text style={styles.characterCount}>{newListName.length}/50</Text>

          <TextInput
            label="Mô tả (không bắt buộc)"
            value={newListDescription}
            onChangeText={setNewListDescription}
            style={styles.textInput}
            mode="outlined"
            multiline
            numberOfLines={3}
            placeholder="Mô tả ngắn về danh sách này..."
            maxLength={200}
            disabled={createListLoading}
          />

          <Text style={styles.characterCount}>
            {newListDescription.length}/200
          </Text>

          <View style={styles.switchContainer}>
            <View style={styles.switchLabelContainer}>
              <Text style={styles.switchLabel}>Công khai danh sách?</Text>
              <Text style={styles.switchSubLabel}>
                Cho phép người khác xem và sử dụng danh sách này
              </Text>
            </View>
            <Switch
              value={newListPublic}
              onValueChange={setNewListPublic}
              disabled={createListLoading}
            />
          </View>
        </View>

        <View style={styles.modalActions}>
          <Button
            mode="contained"
            onPress={handleCreateNewListSubmit}
            style={styles.createButton}
            icon="plus"
            loading={createListLoading}
            disabled={createListLoading || !newListName.trim()}
          >
            {createListLoading ? "Đang tạo..." : "Tạo danh sách"}
          </Button>

          <Button
            mode="text"
            onPress={() => setCreateListModalVisible(false)}
            style={styles.cancelButton}
            disabled={createListLoading}
          >
            Hủy
          </Button>
        </View>
      </Modal>
    </Portal>
  );
  const renderHeader = () => (
    <View style={styles.headerSurface}>
      <Searchbar
        placeholder="Tìm kiếm từ vựng..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />
      {renderFilterChips()}
      <View style={styles.resultInfo}>
        <Text style={styles.resultText}>
          Tìm thấy {vocabularyData.length} từ vựng
        </Text>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Icon name="book-search" size={80} color="#ccc" />
      <Text style={styles.emptyText}>Không tìm thấy từ vựng nào</Text>
      <Text style={styles.emptySubText}>
        Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}

      <FlatList
        data={vocabularyData}
        renderItem={renderVocabularyCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={!loading ? renderEmptyComponent : null}
        showsVerticalScrollIndicator={false}
      />

      {renderAddToListModal()}
      {renderCreateNewListModal()}

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => Alert.alert("Thêm từ mới", "Chức năng đang phát triển")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerSurface: {
    elevation: 4,
    paddingBottom: 8,
  },
  searchbar: {
    margin: 16,
    marginBottom: 8,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  clearFilterChip: {
    backgroundColor: "#ffebee",
  },
  resultInfo: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  resultText: {
    fontSize: 14,
    color: "#666",
  },
  listContainer: {
    padding: 16,
    paddingBottom: 150,
  },
  vocabularyCard: {
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  wordInfo: {
    flex: 1,
  },
  englishWord: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  pronunciationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  pronunciation: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  cardActions: {
    flexDirection: "row",
  },
  vietnameseMeaning: {
    fontSize: 16,
    color: "#333",
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  badge: {
    fontSize: 12,
  },

  levelBadge: {
    backgroundColor: "#e3f2fd", // xanh nhạt
    color: "blue", // chữ đậm rõ
  },

  typeBadge: {
    backgroundColor: "#f3e5f5", // tím nhạt
    color: "purple",
  },

  categoryBadge: {
    backgroundColor: "#e8f5e8", // xanh lá nhạt
    color: "black",
  },
  modalContainer: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 8,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: "center",
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  listInfo: {
    flex: 1,
  },
  listName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  listCount: {
    fontSize: 14,
    color: "#666",
  },
  divider: {
    marginVertical: 16,
  },
  createListButton: {
    marginBottom: 8,
  },
  cancelButton: {
    marginTop: 8,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  loadingFooter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 8,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },

  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  switchLabelContainer: {
    flex: 1,
    marginRight: 16,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  switchSubLabel: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});

export default VocabularyScreen;
