import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Dimensions,
  StatusBar,
} from "react-native";
import Apis, { endpoints } from "../../configs/Apis";
import { Appbar } from "react-native-paper";

const { width } = Dimensions.get("window");

const LevelSelection = ({ navigation, route }) => {
  const { categoryId } = route.params;
  const [levelCounts, setLevelCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Danh sách tất cả levels cố định
  const allLevels = [
    {
      level: "A1",
      name: "A1 - Beginner",
      description: "Từ vựng cơ bản cho người mới bắt đầu",
      color: "#4CAF50",
      difficulty: "Cơ bản",
    },
    {
      level: "A2",
      name: "A2 - Elementary",
      description: "Từ vựng sơ cấp cho người học tiếp theo",
      color: "#8BC34A",
      difficulty: "Sơ cấp",
    },
    {
      level: "B1",
      name: "B1 - Intermediate",
      description: "Từ vựng trung cấp phát triển kỹ năng",
      color: "#FF9800",
      difficulty: "Trung cấp",
    },
    {
      level: "B2",
      name: "B2 - Upper Intermediate",
      description: "Từ vựng trung cấp cao nâng cao khả năng",
      color: "#FF5722",
      difficulty: "Trung cao",
    },
    {
      level: "C1",
      name: "C1 - Advanced",
      description: "Từ vựng nâng cao cho người thành thạo",
      color: "#9C27B0",
      difficulty: "Nâng cao",
    },
    {
      level: "C2",
      name: "C2 - Proficiency",
      description: "Từ vựng thành thạo cho người chuyên nghiệp",
      color: "#3F51B5",
      difficulty: "Thành thạo",
    },
  ];

  const loadWordCounts = async () => {
    try {
      setLoading(true);
      // Gọi API để lấy số lượng từ vựng cho từng level trong category này
      let url = `${endpoints["category"]}/${categoryId}/stats`;
      let res = await Apis.get(url);
      console.info("Word counts data:", res.data);

      setLevelCounts(res.data.difficultyStats || {});
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải thông tin từ vựng. Vui lòng thử lại.");
      console.error("Error fetching word counts:", error);
      // Nếu lỗi, set counts = 0 cho tất cả levels
      const emptyCounts = {};
      allLevels.forEach((level) => {
        emptyCounts[level.level] = 0;
      });
      setLevelCounts(emptyCounts);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadWordCounts();
  }, [categoryId]);

  const onRefresh = () => {
    setRefreshing(true);
    loadWordCounts();
  };

  const handleLevelPress = (level) => {
    const wordCount = levelCounts[level.level] || 0;

    if (wordCount === 0) {
      Alert.alert(
        "Thông báo",
        `Chưa có từ vựng nào cho độ khó ${level.name} trong danh mục này.`,
        [{ text: "OK" }]
      );
      return;
    }

    // Điều hướng đến trang danh sách từ vựng
    navigation.navigate("DictionaryApp", {
      categoryId: categoryId,
      level: level.level,
    });
  };

  const renderLevelItem = ({ item, index }) => {
    const wordCount = levelCounts[item.level] || 0;
    const isDisabled = wordCount === 0;

    return (
      <TouchableOpacity
        style={[
          styles.levelCard,
          { backgroundColor: isDisabled ? "#CCCCCC" : item.color },
          isDisabled && styles.disabledCard,
        ]}
        onPress={() => handleLevelPress(item)}
        activeOpacity={isDisabled ? 0.5 : 0.9}
        disabled={isDisabled}
      >
        <View style={styles.levelCardContent}>
          <View style={styles.levelHeader}>
            <Text style={[styles.levelName, isDisabled && styles.disabledText]}>
              {item.name}
            </Text>
            <Text
              style={[styles.wordCount, isDisabled && styles.disabledBadge]}
            >
              {wordCount} từ
            </Text>
          </View>
          <Text
            style={[styles.levelDescription, isDisabled && styles.disabledText]}
          >
            {item.description}
          </Text>
          <View style={styles.levelFooter}>
            <Text
              style={[
                styles.difficultyBadge,
                isDisabled && styles.disabledBadge,
              ]}
            >
              {item.difficulty}
            </Text>
            {!isDisabled && <Text style={styles.learnButton}>Học ngay →</Text>}
            {isDisabled && (
              <Text style={styles.disabledButton}>Chưa có từ</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Appbar.Header mode="small" elevated={true}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Chọn độ khó" />
      </Appbar.Header>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>📚</Text>
      <Text style={styles.emptyStateTitle}>Đang tải dữ liệu</Text>
      <Text style={styles.emptyStateDescription}>
        Vui lòng đợi trong giây lát...
      </Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Đang tải thông tin từ vựng...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <FlatList
        data={allLevels}
        renderItem={renderLevelItem}
        keyExtractor={(item) => item.level}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#007AFF"]}
            tintColor="#007AFF"
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingTop:10,
  },
  listContainer: {
    paddingBottom: 100,
  },

  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
  },

  levelCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  disabledCard: {
    elevation: 2,
    shadowOpacity: 0.05,
  },
  levelCardContent: {
    padding: 24,
  },
  levelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  levelName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    flex: 1,
    marginRight: 10,
  },
  disabledText: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  wordCount: {
    fontSize: 14,
    color: "#FFFFFF",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: "600",
  },
  disabledBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "rgba(255, 255, 255, 0.6)",
  },
  levelDescription: {
    fontSize: 15,
    color: "#FFFFFF",
    lineHeight: 20,
    marginBottom: 16,
    opacity: 0.9,
  },
  levelFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  difficultyBadge: {
    fontSize: 12,
    color: "#FFFFFF",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  learnButton: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  disabledButton: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666666",
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 12,
  },
  emptyStateDescription: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 22,
  },
});

export default LevelSelection;
