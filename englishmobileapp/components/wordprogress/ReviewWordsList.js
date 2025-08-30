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
  Image,
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
  ProgressBar,
} from "react-native-paper";
import { Audio } from "expo-av";
import { authApis, endpoints } from "../../configs/Apis";
import VocabularyExerciseScreen from "../vocabularylist/VocabularyExerciseScreen";

const { width } = Dimensions.get("window");

const ReviewWordsList = ({ navigation }) => {
  // States
  const [dueWords, setDueWords] = useState([]);
  const [filteredWords, setFilteredWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedWordType, setSelectedWordType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [menuVisible, setMenuVisible] = useState(false);
  const [sortBy, setSortBy] = useState("nextReviewDate");
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0,
  });

  // Collapsible sections
  const [showSearch, setShowSearch] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const searchHeight = useState(new Animated.Value(0))[0];
  const statsHeight = useState(new Animated.Value(1))[0];

  // Colors
  const levelColors = {
    a1: "#4CAF50",
    a2: "#8BC34A",
    b1: "#FF9800",
    b2: "#FF5722",
    c1: "#9C27B0",
    c2: "#E91E63",
  };

  const wordTypeColors = {
    NOUN: "#2196F3",
    VERB: "#4CAF50",
    ADJECTIVE: "#FF9800",
    ADVERB: "#9C27B0",
    PREPOSITION: "#795548",
    CONJUNCTION: "#607D8B",
    PRONOUN: "#E91E63",
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

  // Fetch due words
  const loadDueWords = async (page = 0, isLoadMore = false) => {
    try {
      if (!isLoadMore) {
        setLoading(true);
      }

      const params = new URLSearchParams({
        page: page.toString(),
        size: pagination.size.toString(),
        sortBy,
        direction: "asc",
      });

      // Add filters
      if (searchQuery) params.append("keyword", searchQuery);
      if (selectedLevel !== "all") params.append("level", selectedLevel);
      if (selectedWordType !== "all")
        params.append("wordType", selectedWordType);
      if (selectedCategory !== "all")
        params.append("category", selectedCategory);
      // /?${params.toString()}
      const url = `${endpoints["review"]}`;
      console.log("Fetching due words:", url);

      const api = await authApis(); // <-- await ở đây
      const res = await api.get(url);
      const newWords = res.data.content || [];

      if (isLoadMore) {
        setDueWords((prev) => [...prev, ...newWords]);
        setFilteredWords((prev) => [...prev, ...newWords]);
      } else {
        setDueWords(newWords);
        setFilteredWords(newWords);
      }

      setPagination({
        page: res.data.number || 0,
        size: res.data.size || 20,
        totalElements: res.data.totalElements || 0,
        totalPages: res.data.totalPages || 0,
      });
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải danh sách từ cần ôn tập");
      console.error("Error fetching due words:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load more words
  const loadMoreWords = () => {
    if (pagination.page + 1 < pagination.totalPages && !loading) {
      loadDueWords(pagination.page + 1, true);
    }
  };

  useEffect(() => {
    loadDueWords();
  }, [sortBy, searchQuery, selectedLevel, selectedWordType, selectedCategory]);

  // Refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDueWords(0);
    setRefreshing(false);
  }, []);

  // Play audio
  const playAudio = async (audioUrl) => {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
      await sound.playAsync();
    } catch (error) {
      console.error("Error playing audio", error);
    }
  };

  // Start review session
  const startReviewSession = () => {
    if (dueWords.length === 0) {
      Alert.alert("Thông báo", "Không có từ nào cần ôn tập. Hãy quay lại sau!");
      return;
    }

    // Prioritize words by review priority
    const prioritizedWords = [...dueWords].sort((a, b) => {
      // Words with lower ease factor (harder words) go first
      if (a.easeFactor !== b.easeFactor) {
        return (a.easeFactor || 2.5) - (b.easeFactor || 2.5);
      }

      // Then by total reviews (less reviewed first)
      if (a.totalReviews !== b.totalReviews) {
        return a.totalReviews - b.totalReviews;
      }

      // Finally by next review date (overdue first)
      return new Date(a.nextReviewDate) - new Date(b.nextReviewDate);
    });

    const BATCH_SIZE = 15;
    const selectedWords = prioritizedWords.slice(
      0,
      Math.min(BATCH_SIZE, prioritizedWords.length)
    );

    navigation.navigate("ReviewSession", {
      words: selectedWords,
      totalWordsAvailable: prioritizedWords.length,
      mode: "spaced_repetition",
    });
  };

  // Start flashcard review
  const startFlashcardReview = () => {
    if (dueWords.length === 0) {
      Alert.alert("Thông báo", "Không có từ nào cần ôn tập");
      return;
    }

    navigation.navigate("FlashcardReview", {
      words: dueWords,
    });
  };

  // Calculate stats
  const getStats = () => {
    const now = new Date();
    const overdueWords = dueWords.filter(
      (word) => new Date(word.nextReviewDate) < now
    ).length;

    const lowConfidenceWords = dueWords.filter(
      (word) => (word.easeFactor || 2.5) < 2.0
    ).length;

    const averageReviews =
      dueWords.length > 0
        ? (
            dueWords.reduce((sum, word) => sum + word.totalReviews, 0) /
            dueWords.length
          ).toFixed(1)
        : 0;

    return {
      total: dueWords.length,
      overdue: overdueWords,
      lowConfidence: lowConfidenceWords,
      averageReviews,
    };
  };

  // Render word card
  const renderWordCard = (word) => {
    const isOverdue = new Date(word.nextReviewDate) < new Date();
    const confidenceLevel =
      word.easeFactor >= 2.5
        ? "Cao"
        : word.easeFactor >= 2.0
        ? "Trung bình"
        : "Thấp";
    const confidenceColor =
      word.easeFactor >= 2.5
        ? "#4CAF50"
        : word.easeFactor >= 2.0
        ? "#FF9800"
        : "#F44336";

    return (
      <Card
        key={word.Id}
        style={[styles.wordCard, isOverdue && styles.overdueCard]}
      >
        <Card.Content>
          <View style={styles.wordHeader}>
            <View style={styles.wordInfo}>
              <View style={styles.wordTitleRow}>
                <Text style={styles.englishWord}>{word.englishWord}</Text>
                {isOverdue && (
                  <Badge style={styles.overdueBadge}>Quá hạn</Badge>
                )}
              </View>
              <Text style={styles.pronunciation}>{word.pronunciation}</Text>
              <Text style={styles.vietnameseMeaning}>
                {word.vietnameseMeaning}
              </Text>
            </View>

            {word.imageUrl && (
              <Image
                source={{ uri: word.imageUrl }}
                style={styles.wordImage}
                resizeMode="cover"
              />
            )}
          </View>

          <View style={styles.wordMeta}>
            <View style={styles.metaRow}>
              <Chip
                style={[
                  styles.levelChip,
                  { backgroundColor: levelColors[word.level] || "#9E9E9E" },
                ]}
                textStyle={styles.chipText}
              >
                {word.level?.toUpperCase()}
              </Chip>
              <Chip
                style={[
                  styles.typeChip,
                  {
                    backgroundColor: wordTypeColors[word.wordType] || "#9E9E9E",
                  },
                ]}
                textStyle={styles.chipText}
              >
                {word.wordType}
              </Chip>
              <Chip
                style={[
                  styles.confidenceChip,
                  { backgroundColor: confidenceColor },
                ]}
                textStyle={styles.chipText}
              >
                {confidenceLevel}
              </Chip>
            </View>

            {word.category && (
              <Text style={styles.categoryText}>📚 {word.category.name}</Text>
            )}
          </View>

          <View style={styles.progressInfo}>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>Tiến độ:</Text>
              <Text style={styles.progressValue}>
                {word.correctReviews}/{word.totalReviews} đúng
              </Text>
            </View>
            <ProgressBar
              progress={
                word.totalReviews > 0
                  ? word.correctReviews / word.totalReviews
                  : 0
              }
              color={confidenceColor}
              style={styles.progressBar}
            />
            <View style={styles.reviewInfo}>
              <Text style={styles.reviewText}>
                Lần ôn: {word.repetitionCount} | Khoảng cách:{" "}
                {word.intervalDays} ngày
              </Text>
            </View>
          </View>

          <View style={styles.wordActions}>
            <Button
              mode="contained-tonal"
              icon="play"
              onPress={() => playAudio(word.audioUrl)}
              style={styles.actionButton}
              compact
            >
              Phát âm
            </Button>
            <Button
              mode="contained-tonal"
              icon="book-open-variant"
              onPress={() => {
                navigation.navigate("WordDetail", { word });
              }}
              style={styles.actionButton}
              compact
            >
              Chi tiết
            </Button>
            <Button
              mode="contained"
              icon="refresh"
              onPress={() => {
                navigation.navigate("VocabularyExercise", {
                  word: word,
                });
              }}
              style={styles.reviewButton}
              compact
            >
              Ôn ngay
            </Button>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const stats = getStats();

  if (loading && dueWords.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Đang tải từ cần ôn tập...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Ôn tập từ vựng" />
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
              setSortBy("nextReviewDate");
              setMenuVisible(false);
            }}
            title="Sắp xếp theo hạn ôn"
            leadingIcon="clock"
          />
          <Menu.Item
            onPress={() => {
              setSortBy("easeFactor");
              setMenuVisible(false);
            }}
            title="Sắp xếp theo độ khó"
            leadingIcon="trending-down"
          />
          <Menu.Item
            onPress={() => {
              setSortBy("totalReviews");
              setMenuVisible(false);
            }}
            title="Sắp xếp theo số lần ôn"
            leadingIcon="counter"
          />
          <Divider />
          <Menu.Item
            onPress={() => {
              setSortBy("englishWord");
              setMenuVisible(false);
            }}
            title="Sắp xếp A-Z"
            leadingIcon="sort-alphabetical-ascending"
          />
        </Menu>
      </Appbar.Header>

      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={({ nativeEvent }) => {
          if (
            nativeEvent.layoutMeasurement.height +
              nativeEvent.contentOffset.y >=
            nativeEvent.contentSize.height - 20
          ) {
            loadMoreWords();
          }
        }}
        scrollEventThrottle={400}
      >
        {/* Collapsible Search Section */}
        <Animated.View
          style={[
            styles.collapsibleSection,
            {
              maxHeight: searchHeight.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 250],
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
              {["a1", "a2", "b1", "b2", "c1", "c2"].map((level) => (
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
                  {level.toUpperCase()}
                </Chip>
              ))}
            </ScrollView>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterContainer}
            >
              <Chip
                selected={selectedWordType === "all"}
                onPress={() => setSelectedWordType("all")}
                style={styles.filterChip}
              >
                Tất cả loại từ
              </Chip>
              {Object.keys(wordTypeColors).map((type) => (
                <Chip
                  key={type}
                  selected={selectedWordType === type}
                  onPress={() => setSelectedWordType(type)}
                  style={[
                    styles.filterChip,
                    selectedWordType === type && {
                      backgroundColor: wordTypeColors[type],
                    },
                  ]}
                >
                  {type}
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
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>Tổng từ</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: "#F44336" }]}>
                {stats.overdue}
              </Text>
              <Text style={styles.statLabel}>Quá hạn</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: "#FF9800" }]}>
                {stats.lowConfidence}
              </Text>
              <Text style={styles.statLabel}>Khó nhớ</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.averageReviews}</Text>
              <Text style={styles.statLabel}>TB ôn tập</Text>
            </View>
          </Surface>
        </Animated.View>

        {/* Quick Action Buttons */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity
            style={styles.primaryActionButton}
            onPress={startReviewSession}
            activeOpacity={0.8}
          >
            <View style={styles.primaryActionContent}>
              <Text style={styles.primaryActionEmoji}>🧠</Text>
              <View style={styles.primaryActionText}>
                <Text style={styles.primaryActionTitle}>
                  Bắt đầu ôn tập thông minh
                </Text>
                <Text style={styles.primaryActionSubtitle}>
                  Hệ thống sẽ ưu tiên từ khó nhớ
                </Text>
              </View>
              <Text style={styles.primaryActionArrow}>▶</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.secondaryActions}>
            <Button
              mode="contained"
              icon="cards-outline"
              onPress={startFlashcardReview}
              style={[
                styles.secondaryActionBtn,
                { backgroundColor: "#2196F3" },
              ]}
              labelStyle={styles.secondaryActionLabel}
            >
              Flashcard
            </Button>
            <Button
              mode="contained"
              icon="help-circle"
              onPress={() => {
                if (dueWords.length >= 4) {
                  navigation.navigate("ReviewQuiz", { words: dueWords });
                } else {
                  Alert.alert(
                    "Thông báo",
                    "Cần ít nhất 4 từ để làm bài kiểm tra"
                  );
                }
              }}
              style={[
                styles.secondaryActionBtn,
                { backgroundColor: "#4CAF50" },
              ]}
              labelStyle={styles.secondaryActionLabel}
            >
              Kiểm tra
            </Button>
          </View>
        </View>

        {/* Words List */}
        <View style={styles.wordsContainer}>
          <Text style={styles.sectionTitle}>
            Từ cần ôn tập ({filteredWords.length})
          </Text>

          {filteredWords.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🎉</Text>
              <Text style={styles.emptyTitle}>Tuyệt vời!</Text>
              <Text style={styles.emptyText}>
                Bạn không có từ nào cần ôn tập ngay bây giờ.
              </Text>
              <Text style={styles.emptySubtext}>
                Hãy quay lại sau để tiếp tục học tập!
              </Text>
            </View>
          ) : (
            <>
              {filteredWords.map(renderWordCard)}

              {/* Load More Button */}
              {pagination.page + 1 < pagination.totalPages && (
                <Button
                  mode="outlined"
                  onPress={loadMoreWords}
                  style={styles.loadMoreButton}
                  loading={loading}
                >
                  Tải thêm từ
                </Button>
              )}
            </>
          )}
        </View>
      </ScrollView>
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
    marginBottom: 8,
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
  quickActionsContainer: {
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  primaryActionButton: {
    backgroundColor: "#FF6B35",
    borderRadius: 12,
    elevation: 3,
    marginBottom: 12,
  },
  primaryActionContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  primaryActionEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  primaryActionText: {
    flex: 1,
  },
  primaryActionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  primaryActionSubtitle: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2,
  },
  primaryActionArrow: {
    fontSize: 14,
    color: "white",
    fontWeight: "bold",
  },
  secondaryActions: {
    flexDirection: "row",
    gap: 8,
  },
  secondaryActionBtn: {
    flex: 1,
  },
  secondaryActionLabel: {
    fontSize: 14,
    fontWeight: "bold",
  },
  wordsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    marginTop: 8,
  },
  wordCard: {
    marginBottom: 12,
    elevation: 2,
    borderRadius: 12,
  },
  overdueCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#F44336",
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
  wordTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  englishWord: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginRight: 8,
  },
  overdueBadge: {
    backgroundColor: "#F44336",
    color: "white",
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
  wordImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginLeft: 12,
  },
  wordMeta: {
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 8,
  },
  levelChip: {
    height: 28,
  },
  typeChip: {
    height: 28,
  },
  confidenceChip: {
    height: 28,
  },
  chipText: {
    color: "white",
    fontSize: 11,
    fontWeight: "bold",
  },
  categoryText: {
    fontSize: 14,
    color: "#666",
  },
  progressInfo: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  progressValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 8,
  },
  reviewInfo: {
    alignItems: "center",
  },
  reviewText: {
    fontSize: 12,
    color: "#666",
  },
  wordActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  reviewButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
    color: "#999",
  },
  loadMoreButton: {
    marginTop: 16,
    marginBottom: 20,
  },
});

export default ReviewWordsList;
