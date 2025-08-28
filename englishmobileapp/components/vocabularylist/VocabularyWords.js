import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import {
  Appbar,
  Card,
  Text,
  Chip,
  IconButton,
  FAB,
  Searchbar,
  Menu,
  Divider,
  Button,
  Portal,
  Modal,
  List,
  ActivityIndicator,
  Surface,
  Badge,
} from "react-native-paper";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import { Audio } from "expo-av";

const { width } = Dimensions.get("window");

const VocabularyWordsScreen = ({ route, navigation }) => {
  const { vocabularyList } = route.params;

  // States
  const [words, setWords] = useState([]);
  const [filteredWords, setFilteredWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedWordType, setSelectedWordType] = useState("all");
  const [menuVisible, setMenuVisible] = useState(false);
  const [sortBy, setSortBy] = useState("alphabetical");
  const [showAddWordModal, setShowAddWordModal] = useState(false);
  const [availableWords, setAvailableWords] = useState([]);
  const [selectedWordsToAdd, setSelectedWordsToAdd] = useState([]);

  const [wordStatuses, setWordStatuses] = useState({});
  // NEW STATES for collapsible sections
  const [showSearch, setShowSearch] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const searchHeight = useState(new Animated.Value(0))[0];
  const statsHeight = useState(new Animated.Value(1))[0];

  // Level colors
  const levelColors = {
    A1: "#4CAF50",
    A2: "#8BC34A",
    B1: "#FF9800",
    B2: "#FF5722",
    C1: "#9C27B0",
    C2: "#E91E63",
  };

  // Word type colors
  const wordTypeColors = {
    NOUN: "#2196F3",
    VERB: "#4CAF50",
    ADJECTIVE: "#FF9800",
    ADVERB: "#9C27B0",
    PREPOSITION: "#795548",
    CONJUNCTION: "#607D8B",
    PRONOUN: "#E91E63",
  };

  // Word status colors
  const statusColors = {
    UNLEARNED: "#9E9E9E",
    LEARNING: "#FF9800",
    LEARNED: "#4CAF50",
    REVIEW: "#2196F3",
    MASTERED: "#9C27B0",
  };

  const statusLabels = {
    UNLEARNED: "Unlearned",
    LEARNING: "Learning",
    LEARNED: "Learned",
    REVIEW: "Review",
    MASTERED: "Mastered",
  };

  // Toggle search section
  const toggleSearch = () => {
    setShowSearch(!showSearch);
    Animated.timing(searchHeight, {
      toValue: showSearch ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // Toggle stats section
  const toggleStats = () => {
    setShowStats(!showStats);
    Animated.timing(statsHeight, {
      toValue: showStats ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // Fetch vocabulary words
  const loadWordList = async () => {
    try {
      setLoading(true);
      let url = `${endpoints["vocabulary"]}/${vocabularyList.id}/words`;
      let res = await (await authApis()).get(url);
      setWords(res.data);
      setFilteredWords(res.data);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể kết nối đến server");
      console.error("Error fetching words:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWordList();
  }, []);

  // Fetch available words for adding
  const fetchAvailableWords = async () => {
    try {
      const url = `${endpoints["words"]}`;
      const res = await Apis.get(url);
      setAvailableWords(res.data.content);
      console.info(res.data);
    } catch (error) {
      console.error("Error fetching available words:", error);
    }
  };

  // Remove word from list
  const removeWordFromList = async (wordId) => {
    try {
      const payload = {
        vocabularyListId: vocabularyList.id,
        wordId: wordId,
      };
      console.info("Payload", payload);
      const url = `${endpoints["vocabularyListWords"]}/remove`;
      console.info("Url remove word to list:", url);
      const api = await authApis();
      const res = await api.delete(url, { data: payload });

      if (res.status == 204) {
        Alert.alert("Xóa thành công", "Đã xóa từ thành công khỏi danh sách");
        loadWordList();
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể kết nối đến server");
      console.error("Error removing word:", error);
    }
  };

  const addWordsToList = async () => {
    if (selectedWordsToAdd.length === 0) {
      Alert.alert("Thông báo", "Vui lòng chọn ít nhất một từ để thêm");
      return;
    }

    try {
      const api = await authApis();
      let successCount = 0;
      let failCount = 0;

      for (let wordId of selectedWordsToAdd) {
        const payload = {
          vocabularyListId: vocabularyList.id,
          wordId: wordId,
        };

        const url = `${endpoints["vocabularyListWords"]}/add`;
        console.info("Url add word to list:", url);
        console.info("Payload:", payload);

        try {
          const res = await api.post(url, payload);

          if (res.status === 201) {
            successCount++;
            const addedWord = availableWords.find((w) => w.id === wordId);
            console.info(
              `Đã thêm từ: ${addedWord ? addedWord.englishWord : wordId}`
            );
          } else {
            failCount++;
            console.warn("Unexpected response:", res.status, res.data);
          }
        } catch (err) {
          failCount++;
          if (err.response?.status === 400) {
            console.warn(`Từ ${wordId} đã có trong danh sách`);
          } else if (err.response?.status === 403) {
            console.warn(`Không có quyền thêm từ ${wordId}`);
          } else {
            console.error(
              "Error adding word:",
              err.response?.data || err.message
            );
          }
        }
      }
      setShowAddWordModal(false);
      setSelectedWordsToAdd([]);
      loadWordList();
      Alert.alert(
        "Kết quả",
        `Thêm thành công ${successCount} từ, thất bại ${failCount} từ.`
      );
    } catch (error) {
      Alert.alert("Lỗi", "Không thể kết nối đến server");
      console.error("Error adding words:", error);
    }
  };

  // Filter and sort words
  const filterAndSortWords = useCallback(() => {
    let filtered = [...words];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (word) =>
          word.englishWord.toLowerCase().includes(searchQuery.toLowerCase()) ||
          word.vietnameseMeaning
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Filter by level
    if (selectedLevel !== "all") {
      filtered = filtered.filter((word) => word.level === selectedLevel);
    }

    // Filter by word type
    if (selectedWordType !== "all") {
      filtered = filtered.filter((word) => word.wordType === selectedWordType);
    }

    // Sort words
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "alphabetical":
          return a.englishWord.localeCompare(b.englishWord);
        case "level":
          const levelOrder = ["A1", "A2", "B1", "B2", "C1", "C2"];
          return levelOrder.indexOf(a.level) - levelOrder.indexOf(b.level);
        case "wordType":
          return a.wordType.localeCompare(b.wordType);
        case "dateAdded":
          return new Date(b.addedAt) - new Date(a.addedAt);
        default:
          return 0;
      }
    });

    setFilteredWords(filtered);
  }, [words, searchQuery, selectedLevel, selectedWordType, sortBy]);

  useEffect(() => {
    filterAndSortWords();
  }, [filterAndSortWords]);

  // Refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadWordList();
    setRefreshing(false);
  }, [loadWordList]);

  // Confirm delete
  const confirmDelete = (word) => {
    Alert.alert(
      "Xác nhận xóa",
      `Bạn có chắc muốn xóa từ "${word.englishWord}" khỏi danh sách?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => removeWordFromList(word.id),
        },
      ]
    );
  };

  // Start quick learning session
  const startQuickLearning = () => {
    if (words.length === 0) {
      Alert.alert(
        "Thông báo",
        "Danh sách từ vựng trống. Hãy thêm từ để bắt đầu học"
      );
      return;
    }

    const wordsToLearn = filteredWords.length > 0 ? filteredWords : words;

    const prioritizedWords = wordsToLearn.sort((a, b) => {
      const statusPriority = {
        UNLEARNED: 1,
        LEARNING: 2,
        REVIEW: 3,
        LEARNED: 4,
        MASTERED: 5,
      };

      const aPriority = statusPriority[a.status || "UNLEARNED"];
      const bPriority = statusPriority[b.status || "UNLEARNED"];

      if (aPriority === bPriority) {
        const levelOrder = ["A1", "A2", "B1", "B2", "C1", "C2"];
        return levelOrder.indexOf(a.level) - levelOrder.indexOf(b.level);
      }

      return aPriority - bPriority;
    });

    const BATCH_SIZE = 10;
    const selectedWords = prioritizedWords.slice(
      0,
      Math.min(BATCH_SIZE, prioritizedWords.length)
    );

    if (selectedWords.length === 0) {
      Alert.alert(
        "Thông báo",
        "Không có từ phù hợp để học. Hãy thử điều chỉnh bộ lọc."
      );
      return;
    }

    navigation.navigate("QuickLearning", {
      vocabularyList,
      words: selectedWords,
      mode: "flashcard",
      totalWordsAvailable: prioritizedWords.length,
    });
  };
  // Start learning session
  const startLearningSession = () => {
    if (words.length === 0) {
      Alert.alert(
        "Thông báo",
        "Danh sách từ vựng trống. Hãy thêm từ để bắt đầu học"
      );
      return;
    }
    navigation.navigate("LearningSession", {
      vocabularyList,
      words: filteredWords.length > 0 ? filteredWords : words,
    });
  };

  // Start quiz
  const startQuiz = () => {
    if (words.length < 5) {
      Alert.alert("Thông báo", "Cần ít nhất 5 từ để bắt đầu làm bài kiểm tra");
      return;
    }
    navigation.navigate("Quiz", {
      vocabularyList,
      words: filteredWords.length >= 5 ? filteredWords : words,
    });
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

  // Render word card
  const renderWordCard = (word) => (
    <Card key={word.id} style={styles.wordCard}>
      <Card.Content>
        <View style={styles.wordHeader}>
          <View style={styles.wordInfo}>
            <Text style={styles.englishWord}>{word.englishWord}</Text>
            <Text style={styles.pronunciation}>{word.pronunciation}</Text>
            <Text style={styles.vietnameseMeaning}>
              {word.vietnameseMeaning}
            </Text>
          </View>
          <View style={styles.wordMeta}>
            <Chip
              style={[
                styles.statusChip,
                {
                  backgroundColor: statusColors[word.wordStatus || "UNLEARNED"],
                },
              ]}
              textStyle={styles.chipText}
            >
              {statusLabels[word.wordStatus || "UNLEARNED"]}
            </Chip>
            <Chip
              style={[
                styles.levelChip,
                { backgroundColor: levelColors[word.level] },
              ]}
              textStyle={styles.chipText}
            >
              {word.level}
            </Chip>
            <Chip
              style={[
                styles.typeChip,
                { backgroundColor: wordTypeColors[word.wordType] },
              ]}
              textStyle={styles.chipText}
            >
              {word.wordType}
            </Chip>
          </View>
        </View>

        <View style={styles.categoryInfo}>
          <Text style={styles.categoryText}>📚 {word.category.name}</Text>
        </View>

        <View style={styles.wordActions}>
          <Button
            mode="contained-tonal"
            icon="play"
            onPress={() => {
              playAudio(word.audioUrl);
            }}
            style={styles.actionButton}
          >
            Phát âm
          </Button>
          <Button
            mode="contained-tonal"
            icon="book-open-variant"
            onPress={() => {
              navigation.navigate("VocabularyExercise", {
                word: word
              });
            }}
            style={styles.actionButton}
          >
            Học từ
          </Button>
          <IconButton
            icon="delete"
            iconColor="#e53e3e"
            onPress={() => confirmDelete(word)}
          />
        </View>
      </Card.Content>
    </Card>
  );

  // Render add word modal
  const renderAddWordModal = () => (
    <Portal>
      <Modal
        visible={showAddWordModal}
        onDismiss={() => {
          setShowAddWordModal(false);
          setSelectedWordsToAdd([]);
        }}
        contentContainerStyle={styles.modalContainer}
      >
        <Text style={styles.modalTitle}>Thêm từ vào danh sách</Text>

        <ScrollView style={styles.modalContent}>
          {availableWords.map((word) => (
            <List.Item
              key={word.id}
              title={word.englishWord}
              description={word.vietnameseMeaning}
              left={() => (
                <View style={styles.wordPreview}>
                  <Chip
                    size="small"
                    style={[
                      styles.levelChip,
                      { backgroundColor: levelColors[word.level] },
                    ]}
                  >
                    {word.level}
                  </Chip>
                </View>
              )}
              right={() => (
                <IconButton
                  icon={
                    selectedWordsToAdd.includes(word.id)
                      ? "checkbox-marked"
                      : "checkbox-blank-outline"
                  }
                  onPress={() => {
                    if (selectedWordsToAdd.includes(word.id)) {
                      setSelectedWordsToAdd((prev) =>
                        prev.filter((id) => id !== word.id)
                      );
                    } else {
                      setSelectedWordsToAdd((prev) => [...prev, word.id]);
                    }
                  }}
                />
              )}
            />
          ))}
        </ScrollView>

        <View style={styles.modalActions}>
          <Button
            mode="outlined"
            onPress={() => {
              setShowAddWordModal(false);
              setSelectedWordsToAdd([]);
            }}
            style={styles.modalButton}
          >
            Hủy
          </Button>
          <Button
            mode="contained"
            onPress={addWordsToList}
            style={styles.modalButton}
            disabled={selectedWordsToAdd.length === 0}
          >
            Thêm ({selectedWordsToAdd.length})
          </Button>
        </View>
      </Modal>
    </Portal>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Đang tải danh sách từ vựng...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={vocabularyList.name} />
        <Appbar.Action icon="magnify" onPress={toggleSearch} />
        <Appbar.Action icon="chart-bar" onPress={toggleStats} />
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Appbar.Action icon="sort" onPress={() => setMenuVisible(true)} />
          }
        >
          <Menu.Item
            onPress={() => {
              setSortBy("alphabetical");
              setMenuVisible(false);
            }}
            title="Sắp xếp A-Z"
            leadingIcon="sort-alphabetical-ascending"
          />
          <Menu.Item
            onPress={() => {
              setSortBy("level");
              setMenuVisible(false);
            }}
            title="Sắp xếp theo cấp độ"
            leadingIcon="stairs"
          />
          <Menu.Item
            onPress={() => {
              setSortBy("wordType");
              setMenuVisible(false);
            }}
            title="Sắp xếp theo loại từ"
            leadingIcon="tag"
          />
          <Divider />
          <Menu.Item
            onPress={() => {
              setSortBy("dateAdded");
              setMenuVisible(false);
            }}
            title="Mới nhất"
            leadingIcon="clock"
          />
        </Menu>
      </Appbar.Header>

      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Collapsible Search Section */}
        <Animated.View
          style={[
            styles.collapsibleSection,
            {
              maxHeight: searchHeight.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 200],
              }),
              opacity: searchHeight,
            },
          ]}
        >
          <Surface style={styles.searchContainer}>
            <Searchbar
              placeholder="Tìm kiếm từ vựng..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchBar}
            />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterContainer}
            >
              <Chip
                selected={selectedLevel === "all"}
                onPress={() => setSelectedLevel("all")}
                style={styles.filterChip}
              >
                Tất cả cấp độ
              </Chip>
              {["A1", "A2", "B1", "B2", "C1", "C2"].map((level) => (
                <Chip
                  key={level}
                  selected={selectedLevel === level}
                  onPress={() => setSelectedLevel(level)}
                  style={[
                    styles.filterChip,
                    selectedLevel === level && {
                      backgroundColor: levelColors[level],
                    },
                  ]}
                >
                  {level}
                </Chip>
              ))}
            </ScrollView>
          </Surface>
        </Animated.View>

        {/* Collapsible Stats Section */}
        <Animated.View
          style={[
            styles.collapsibleSection,
            {
              maxHeight: statsHeight.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 100],
              }),
              opacity: statsHeight,
            },
          ]}
        >
          <Surface style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{words.length}</Text>
              <Text style={styles.statLabel}>Tổng từ</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{filteredWords.length}</Text>
              <Text style={styles.statLabel}>Đang hiển thị</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {words.filter((w) => ["A1", "A2"].includes(w.level)).length}
              </Text>
              <Text style={styles.statLabel}>Cơ bản</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {words.filter((w) => ["C1", "C2"].includes(w.level)).length}
              </Text>
              <Text style={styles.statLabel}>Nâng cao</Text>
            </View>
          </Surface>
        </Animated.View>

        {/* Compact Quick Learning Button */}
        <View style={styles.compactQuickLearningContainer}>
          <TouchableOpacity
            style={styles.compactQuickLearningButton}
            onPress={startQuickLearning}
            activeOpacity={0.8}
          >
            <View style={styles.compactQuickLearningContent}>
              <Text style={styles.compactQuickLearningEmoji}>⚡</Text>
              <View style={styles.compactQuickLearningText}>
                <Text style={styles.compactQuickLearningTitle}>
                  Học ngay 10 từ
                </Text>
              </View>
              <Text style={styles.compactQuickLearningArrow}>▶</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Compact Action buttons */}
        <View style={styles.compactActionButtonsContainer}>
          <Button
            mode="contained"
            icon="school"
            onPress={startLearningSession}
            style={[styles.compactActionBtn, { backgroundColor: "#4CAF50" }]}
            labelStyle={styles.compactActionBtnLabel}
            compact
          >
            Học từ vựng
          </Button>
          <Button
            mode="contained"
            icon="help-circle"
            onPress={startQuiz}
            style={[styles.compactActionBtn, { backgroundColor: "#2196F3" }]}
            labelStyle={styles.compactActionBtnLabel}
            compact
          >
            Kiểm tra
          </Button>
        </View>

        {/* Words list */}
        <View style={styles.wordsContainer}>
          {filteredWords.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {words.length === 0
                  ? "Danh sách từ vựng trống. Hãy thêm từ để bắt đầu học!"
                  : "Không tìm thấy từ nào phù hợp với bộ lọc."}
              </Text>
            </View>
          ) : (
            filteredWords.map(renderWordCard)
          )}
        </View>
      </ScrollView>

      {/* Add word FAB */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {
          fetchAvailableWords();
          setShowAddWordModal(true);
        }}
      />

      {renderAddWordModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  collapsibleSection: {
    overflow: "hidden",
  },
  searchContainer: {
    padding: 16,
    elevation: 2,
    margin: 8,
    marginBottom: 12,
    borderRadius: 12,
  },
  searchBar: {
    marginBottom: 12,
  },
  filterContainer: {
    flexDirection: "row",
  },
  filterChip: {
    marginRight: 8,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 12,
    margin: 8,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2196F3",
  },
  statLabel: {
    fontSize: 11,
    color: "#666",
    marginTop: 2,
  },
  // COMPACT QUICK LEARNING STYLES
  compactQuickLearningContainer: {
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  compactQuickLearningButton: {
    backgroundColor: "#FF6B35",
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#FF6B35",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  compactQuickLearningContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  compactQuickLearningEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  compactQuickLearningText: {
    flex: 1,
  },
  compactQuickLearningTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  compactQuickLearningArrow: {
    fontSize: 14,
    color: "white",
    fontWeight: "bold",
  },
  // COMPACT ACTION BUTTONS
  compactActionButtonsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginVertical: 8,
    gap: 8,
  },
  compactActionBtn: {
    flex: 1,
    paddingVertical: 4,
  },
  compactActionBtnLabel: {
    fontSize: 14,
    fontWeight: "bold",
  },
  wordsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80, // Space for FAB
  },
  wordCard: {
    marginBottom: 12,
    elevation: 2,
  },
  wordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  wordInfo: {
    flex: 1,
  },
  englishWord: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  pronunciation: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    marginTop: 2,
  },
  vietnameseMeaning: {
    fontSize: 16,
    color: "#555",
    marginTop: 4,
  },
  wordMeta: {
    alignItems: "flex-end",
    gap: 4,
  },
  statusChip: {
    height: 32,
    marginBottom: 4,
  },
  levelChip: {
    height: 32,
  },
  typeChip: {
    height: 32,
  },
  chipText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  categoryInfo: {
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 14,
    color: "#666",
  },
  wordActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionButton: {
    marginRight: 8,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 12,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 20,
    paddingBottom: 10,
  },
  modalContent: {
    maxHeight: 400,
  },
  wordPreview: {
    justifyContent: "center",
    marginRight: 8,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
    gap: 12,
  },
  modalButton: {
    minWidth: 80,
  },
});

export default VocabularyWordsScreen;
