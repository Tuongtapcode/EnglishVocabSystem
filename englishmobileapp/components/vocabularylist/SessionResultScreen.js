import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  StatusBar,
} from "react-native";
import {
  Text,
  Card,
  Button,
  ProgressBar,
  Surface,
  Chip,
  Appbar,
  Divider,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const SessionResultScreen = ({ result, onFinish }) => {
  const { summary, questions, wordUpdates, durationMinutes } = result;

  // Performance colors
  const getPerformanceColor = (performance) => {
    switch (performance) {
      case "excellent":
        return "#4CAF50";
      case "good":
        return "#8BC34A";
      case "average":
        return "#FF9800";
      case "needs_improvement":
        return "#F44336";
      default:
        return "#666";
    }
  };

  const getPerformanceIcon = (performance) => {
    switch (performance) {
      case "excellent":
        return "trophy";
      case "good":
        return "thumb-up";
      case "average":
        return "star-half-full";
      case "needs_improvement":
        return "trending-up";
      default:
        return "chart-line";
    }
  };

  const getPerformanceText = (performance) => {
    switch (performance) {
      case "excellent":
        return "Xuất sắc!";
      case "good":
        return "Tốt!";
      case "average":
        return "Trung bình";
      case "needs_improvement":
        return "Cần cải thiện";
      default:
        return "Hoàn thành";
    }
  };

  const renderStatCard = (title, value, icon, color = "#6200ea") => (
    <Surface style={[styles.statCard]} elevation={2}>
      <View style={styles.statContent}>
        <MaterialCommunityIcons name={icon} size={32} color={color} />
        <Text variant="headlineSmall" style={[styles.statValue, { color }]}>
          {value}
        </Text>
        <Text variant="bodyMedium" style={styles.statTitle}>
          {title}
        </Text>
      </View>
    </Surface>
  );

  const renderQuestionResult = (question, index) => {
    // Fix: Check if answer is correct by comparing user answer with correct answer
    // or use the correct property if it exists and is not null
    const isCorrect = question.correct !== null 
      ? question.correct 
      : question.userAnswer === question.correctAnswer;
      
    return (
      <Surface key={`question-${question.questionId}-${index}`} style={styles.questionCard} elevation={1}>
        <View style={styles.questionHeader}>
          <View style={styles.questionNumber}>
            <Text variant="labelMedium" style={styles.questionNumberText}>
              Câu {index + 1}
            </Text>
            <MaterialCommunityIcons
              name={isCorrect ? "check-circle" : "close-circle"}
              size={20}
              color={isCorrect ? "#4CAF50" : "#F44336"}
            />
          </View>
          <Chip
            style={[
              styles.wordChip,
              { backgroundColor: isCorrect ? "#E8F5E8" : "#FFEBEE" },
            ]}
            textStyle={{
              color: isCorrect ? "#4CAF50" : "#F44336",
              fontWeight: "bold",
            }}
          >
            {question.englishWord}
          </Chip>
        </View>

        <Text variant="bodyMedium" style={styles.questionText}>
          {question.questionText}
        </Text>

        <View style={styles.answerSection}>
          <Text variant="bodySmall" style={styles.answerLabel}>
            Câu trả lời của bạn:
          </Text>
          <Text
            variant="bodyMedium"
            style={[
              styles.userAnswer,
              { color: isCorrect ? "#4CAF50" : "#F44336" },
            ]}
          >
            {question.userAnswer}
          </Text>

          {!isCorrect && (
            <>
              <Text variant="bodySmall" style={styles.answerLabel}>
                Đáp án đúng:
              </Text>
              <Text variant="bodyMedium" style={styles.correctAnswer}>
                {question.correctAnswer}
              </Text>
            </>
          )}

          {question.explanation && (
            <View style={styles.explanationContainer}>
              <Text variant="bodySmall" style={styles.explanationTitle}>
                💡 Giải thích:
              </Text>
              <Text variant="bodySmall" style={styles.explanationText}>
                {question.explanation}
              </Text>
            </View>
          )}

          {question.feedback && (
            <View style={styles.feedbackContainer}>
              <Text variant="bodySmall" style={styles.feedbackText}>
                📝 {question.feedback}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.timeContainer}>
          <MaterialCommunityIcons name="timer" size={16} color="#666" />
          <Text variant="bodySmall" style={styles.timeText}>
            {question.timeSpentSeconds} giây
          </Text>
        </View>
      </Surface>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#6200ea" barStyle="light-content" />
      <Appbar.Header style={styles.header}>
        <Appbar.Content
          title="Kết quả học tập"
          titleStyle={styles.headerTitle}
        />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Performance Section */}
        <Surface style={styles.performanceCard} elevation={3}>
          <View style={styles.performanceHeader}>
            <MaterialCommunityIcons
              name={getPerformanceIcon(summary.performance)}
              size={48}
              color={getPerformanceColor(summary.performance)}
            />
            <Text
              variant="headlineMedium"
              style={[
                styles.performanceTitle,
                { color: getPerformanceColor(summary.performance) },
              ]}
            >
              {getPerformanceText(summary.performance)}
            </Text>
          </View>

          <View style={styles.scoreContainer}>
            <Text variant="displaySmall" style={styles.scoreText}>
              {summary.scorePercentage}%
            </Text>
            <ProgressBar
              progress={summary.scorePercentage / 100}
              color={getPerformanceColor(summary.performance)}
              style={styles.scoreProgress}
            />
          </View>

          <View style={styles.durationContainer}>
            <MaterialCommunityIcons name="clock" size={20} color="#666" />
            <Text variant="bodyMedium" style={styles.durationText}>
              Thời gian học: {durationMinutes} phút
            </Text>
          </View>
        </Surface>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            {renderStatCard(
              "Tổng số câu",
              summary.totalQuestions,
              "format-list-numbered",
              "#2196F3"
            )}
            {renderStatCard(
              "Trả lời đúng",
              summary.correctAnswers,
              "check-circle",
              "#4CAF50"
            )}
          </View>
          <View style={styles.statsRow}>
            {renderStatCard(
              "Từ đã học",
              summary.wordsLearned,
              "book-open-variant",
              "#FF9800"
            )}
            {renderStatCard(
              "Từ thành thạo",
              summary.wordsMastered,
              "star",
              "#9C27B0"
            )}
          </View>
        </View>

        {/* Efficiency Section */}
        <Surface style={styles.efficiencyCard} elevation={2}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            📊 Hiệu quả học tập
          </Text>
          <View style={styles.efficiencyContent}>
            <Text variant="bodyMedium">
              Hiệu quả tổng thể: {summary.overallEfficiency}%
            </Text>
            <ProgressBar
              progress={summary.overallEfficiency / 100}
              color="#6200ea"
              style={styles.efficiencyProgress}
            />
          </View>
        </Surface>

        {/* Questions Review */}
        <Surface style={styles.reviewCard} elevation={2}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            📝 Chi tiết từng câu
          </Text>
          <Divider style={styles.divider} />
          {questions.map((question, index) =>
            renderQuestionResult(question, index)
          )}
        </Surface>

        {/* Word Updates */}
        {wordUpdates && wordUpdates.length > 0 && (
          <Surface style={styles.wordUpdatesCard} elevation={2}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              📚 Cập nhật từ vựng
            </Text>
            <Divider style={styles.divider} />
            {wordUpdates.map((word, index) => (
              <View key={`word-${word.wordId}-${index}`} style={styles.wordUpdateItem}>
                <View style={styles.wordInfo}>
                  <Text variant="bodyLarge" style={styles.wordEnglish}>
                    {word.englishWord}
                  </Text>
                  <Text variant="bodyMedium" style={styles.wordVietnamese}>
                    {word.vietnameseMeaning}
                  </Text>
                </View>
                <View style={styles.wordStats}>
                  <Chip
                    style={[
                      styles.statusChip,
                      {
                        backgroundColor: word.improvedThisSession
                          ? "#E8F5E8"
                          : "#FFF3E0",
                      },
                    ]}
                    textStyle={{
                      color: word.improvedThisSession ? "#4CAF50" : "#FF9800",
                      fontSize: 12,
                    }}
                  >
                    {word.improvedThisSession ? "Cải thiện" : "Cần ôn"}
                  </Chip>
                  <Text variant="bodySmall" style={styles.nextReview}>
                    Ôn lại: {new Date(word.nextReviewDate).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            ))}
          </Surface>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <Surface style={styles.actionContainer} elevation={4}>
        <Button
          mode="contained"
          onPress={onFinish}
          style={styles.finishButton}
          contentStyle={styles.finishButtonContent}
          buttonColor="#6200ea"
          icon="home"
        >
          Hoàn thành
        </Button>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  header: {
    backgroundColor: "#6200ea",
    elevation: 4,
  },
  headerTitle: {
    color: "white",
    fontWeight: "bold",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },

  // Performance Card
  performanceCard: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: "white",
    marginBottom: 16,
  },
  performanceHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  performanceTitle: {
    marginTop: 8,
    fontWeight: "bold",
    textAlign: "center",
  },
  scoreContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  scoreText: {
    fontWeight: "bold",
    color: "#6200ea",
    marginBottom: 8,
  },
  scoreProgress: {
    height: 8,
    width: "100%",
    borderRadius: 4,
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  durationText: {
    marginLeft: 8,
    color: "#666",
  },

  // Stats Grid
  statsContainer: {
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "white",
  },
  statContent: {
    alignItems: "center",
  },
  statValue: {
    fontWeight: "bold",
    marginVertical: 4,
  },
  statTitle: {
    textAlign: "center",
    color: "#666",
    fontSize: 12,
  },

  // Efficiency Card
  efficiencyCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "white",
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  efficiencyContent: {
    marginTop: 8,
  },
  efficiencyProgress: {
    height: 6,
    marginTop: 8,
    borderRadius: 3,
  },

  // Review Card
  reviewCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "white",
    marginBottom: 16,
  },
  divider: {
    marginBottom: 16,
  },

  // Question Cards
  questionCard: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#fafafa",
    marginBottom: 12,
  },
  questionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  questionNumber: {
    flexDirection: "row",
    alignItems: "center",
  },
  questionNumberText: {
    marginRight: 8,
    fontWeight: "bold",
  },
  wordChip: {
    height: 24,
  },
  questionText: {
    marginBottom: 12,
    color: "#333",
  },
  answerSection: {
    marginBottom: 8,
  },
  answerLabel: {
    color: "#666",
    marginBottom: 4,
    fontWeight: "500",
  },
  userAnswer: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  correctAnswer: {
    color: "#4CAF50",
    fontWeight: "bold",
    marginBottom: 8,
  },
  explanationContainer: {
    backgroundColor: "#e3f2fd",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  explanationTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  explanationText: {
    color: "#1565c0",
  },
  feedbackContainer: {
    backgroundColor: "#fff3e0",
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  feedbackText: {
    color: "#e65100",
    fontStyle: "italic",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  timeText: {
    marginLeft: 4,
    color: "#666",
  },

  // Word Updates
  wordUpdatesCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "white",
    marginBottom: 16,
  },
  wordUpdateItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  wordInfo: {
    flex: 1,
  },
  wordEnglish: {
    fontWeight: "bold",
    color: "#333",
  },
  wordVietnamese: {
    color: "#666",
    marginTop: 2,
  },
  wordStats: {
    alignItems: "flex-end",
  },
  statusChip: {
    height: 24,
    marginBottom: 4,
  },
  nextReview: {
    color: "#666",
    fontSize: 10,
  },

  // Action Container
  actionContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "white",
  },
  finishButton: {
    borderRadius: 25,
  },
  finishButtonContent: {
    paddingVertical: 8,
  },
});

export default SessionResultScreen;