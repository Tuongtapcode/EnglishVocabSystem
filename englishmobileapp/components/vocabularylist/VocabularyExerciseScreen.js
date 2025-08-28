import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
  TouchableOpacity,
  Image,
  StatusBar,
  Animated,
} from "react-native";
import {
  Text,
  Button,
  ProgressBar,
  IconButton,
  RadioButton,
  TextInput,
  Surface,
  Chip,
  ActivityIndicator,
  Appbar,
  Portal,
  Dialog,
} from "react-native-paper";
import { Audio } from "expo-av";
import { authApis, endpoints } from "../../configs/Apis";
import SessionResultScreen from "./SessionResultScreen";

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width - 40;
const CARD_HEIGHT = height * 0.55;

const VocabularyExerciseScreen = ({ route, navigation }) => {
  // Nhận word từ props
  const { word } = route.params || {};

  // States
  const [showFlashcard, setShowFlashcard] = useState(true);
  const [sessionData, setSessionData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [textAnswer, setTextAnswer] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // New states for feedback
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [questionStartTime, setQuestionStartTime] = useState(null);

  //state cho kết quả session
  const [sessionResult, setSessionResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

  // Animation
  const flipAnimation = useRef(new Animated.Value(0)).current;

  // Level and word type colors (giống QuickLearningScreen)
  const levelColors = {
    A1: "#4CAF50",
    A2: "#8BC34A",
    B1: "#FF9800",
    B2: "#FF5722",
    C1: "#9C27B0",
    C2: "#E91E63",
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

  const loadSessionQuestions = async () => {
    setLoading(true);
    try {
      let url = `${endpoints["study"]}`;
      const payload = {
        wordIds: [word.id],
      };
      let res = await (await authApis()).post(url, payload);
      setSessionData(res.data);
      // Set start time for first question
      setQuestionStartTime(Date.now());
    } catch (error) {
      console.error("Error loading session questions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Cleanup audio khi component unmount
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  // Set start time when moving to next question
  useEffect(() => {
    if (!showFlashcard && sessionData && questionStartTime === null) {
      setQuestionStartTime(Date.now());
    }
  }, [currentQuestionIndex, showFlashcard, sessionData]);

  const playAudio = async (audioUrl) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      setIsPlaying(true);
      const { sound: audioSound } = await Audio.Sound.createAsync({
        uri: audioUrl,
      });
      setSound(audioSound);
      await audioSound.playAsync();

      audioSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlaying(false);
    }
  };

  // Flip card animation (giống QuickLearningScreen)
  const flipCard = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    Animated.spring(flipAnimation, {
      toValue: isFlipped ? 0 : 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start(() => {
      setIsAnimating(false);
    });
    setIsFlipped(!isFlipped);
  };

  const startLearningSession = () => {
    setShowFlashcard(false);
    loadSessionQuestions();
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < sessionData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer("");
      setTextAnswer("");
      // Reset timer for next question
      setQuestionStartTime(Date.now());
    } else {
      // Kết thúc phiên học - gọi API complete session
      try {
        setLoading(true);
        const completeUrl = `${endpoints["completeSession"]}/${sessionData.sessionId}`;
        console.info("Completing session URL:", completeUrl);

        const res = await (await authApis()).post(completeUrl);
        console.log("Session completed successfully:", res.data);

        // Lưu kết quả và hiển thị màn hình kết quả
        setSessionResult(res.data);
        setShowResult(true);
      } catch (error) {
        console.error("Error completing session:", error);
        Alert.alert(
          "Lỗi",
          "Đã có lỗi xảy ra khi hoàn thành phiên học. Vui lòng thử lại.",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const renderResult = () => {
    if (!sessionResult) return null;

    return (
      <SessionResultScreen
        result={sessionResult}
        onFinish={() => navigation.goBack()}
      />
    );
  };

  const calculateTimeSpent = () => {
    if (!questionStartTime) return 0;
    return Math.floor((Date.now() - questionStartTime) / 1000);
  };

  const submitAnswer = async () => {
    const currentQuestion = sessionData.questions[currentQuestionIndex];
    const answer = selectedAnswer || textAnswer;

    if (!answer.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập câu trả lời trước khi tiếp tục.");
      return;
    }

    const timeSpent = calculateTimeSpent();
    const payload = {
      sessionId: sessionData.sessionId,
      questionId: currentQuestion.questionId,
      userAnswer: answer,
      timeSpentSeconds: timeSpent,
      pronunciationScore: 0,
      quality: 0,
    };

    try {
      setLoading(true);
      let url = `${endpoints["submitAnswer"]}`;
      console.info("Submitting answer URL:", url);
      console.info("Submitting answer payload:", payload);

      let res = await (await authApis()).post(url, payload);
      console.log("Answer submitted successfully:", res.data);

      // Show feedback dialog
      setCurrentFeedback(res.data);
      setShowFeedback(true);
    } catch (error) {
      console.error("Error submitting answer:", error);
      Alert.alert(
        "Lỗi",
        "Đã có lỗi xảy ra khi gửi câu trả lời. Vui lòng thử lại.",
        [
          {
            text: "Thử lại",
            onPress: () => submitAnswer(),
          },
          {
            text: "Bỏ qua",
            onPress: handleNextQuestion,
          },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const closeFeedback = () => {
    setShowFeedback(false);
    setCurrentFeedback(null);
    handleNextQuestion();
  };

  const exitLearning = () => {
    navigation.goBack();
  };

  // Animation interpolations (giống QuickLearningScreen)
  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  const frontOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });

  const backOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  const renderFeedbackDialog = () => {
    if (!currentFeedback) return null;

    return (
      <Portal>
        <Dialog visible={showFeedback} onDismiss={closeFeedback}>
          <Dialog.Title>
            {currentFeedback.isCorrect ? "🎉 Chính xác!" : "❌ Chưa đúng"}
          </Dialog.Title>
          <Dialog.Content>
            <View style={styles.feedbackContainer}>
              <Text variant="bodyMedium" style={styles.feedbackText}>
                <Text style={styles.boldText}>Câu trả lời của bạn: </Text>
                {currentFeedback.userAnswer}
              </Text>

              {!currentFeedback.isCorrect && (
                <Text variant="bodyMedium" style={styles.feedbackText}>
                  <Text style={styles.boldText}>Đáp án đúng: </Text>
                  <Text style={styles.correctAnswer}>
                    {currentFeedback.correctAnswer}
                  </Text>
                </Text>
              )}

              {currentFeedback.explanation && (
                <Text variant="bodyMedium" style={styles.feedbackText}>
                  <Text style={styles.boldText}>Giải thích: </Text>
                  {currentFeedback.explanation}
                </Text>
              )}

              <Text variant="bodyMedium" style={styles.feedbackText}>
                <Text style={styles.boldText}>Thời gian: </Text>
                {currentFeedback.timeSpentSeconds} giây
              </Text>

              {currentFeedback.feedback && (
                <Text
                  variant="bodyMedium"
                  style={[styles.feedbackText, styles.feedbackMessage]}
                >
                  {currentFeedback.feedback}
                </Text>
              )}
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={closeFeedback} mode="contained">
              {currentQuestionIndex < sessionData.questions.length - 1
                ? "Câu tiếp theo"
                : "Hoàn thành"}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  };

  const renderFlashcard = () => (
    <View style={styles.container}>
      <StatusBar backgroundColor="#6200ea" barStyle="light-content" />
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={exitLearning} color="white" />
        <Appbar.Content title="Học từ vựng" titleStyle={styles.headerTitle} />
        <IconButton
          icon="volume-high"
          iconColor="white"
          size={24}
          onPress={() => word?.audioUrl && playAudio(word.audioUrl)}
          disabled={!word?.audioUrl || isPlaying}
        />
      </Appbar.Header>

      {/* Card Container - style giống QuickLearningScreen */}
      <View style={styles.cardContainer}>
        <View style={styles.cardWrapper}>
          {/* Front Card (English) */}
          <Animated.View
            style={[
              styles.card,
              styles.cardFront,
              {
                transform: [{ rotateY: frontInterpolate }],
                opacity: frontOpacity,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.cardTouchable}
              onPress={flipCard}
              activeOpacity={0.8}
              disabled={isAnimating}
            >
              <View style={styles.cardHeader}>
                <Chip
                  style={[
                    styles.chip,
                    { backgroundColor: levelColors[word?.level] || "#666" },
                  ]}
                  textStyle={styles.chipText}
                >
                  {word?.level || "A1"}
                </Chip>
                <Chip
                  style={[
                    styles.chip,
                    {
                      backgroundColor: wordTypeColors[word?.wordType] || "#666",
                    },
                  ]}
                  textStyle={styles.chipText}
                >
                  {word?.wordType || "NOUN"}
                </Chip>
              </View>

              <View style={styles.cardContent}>
                {word?.imageUrl && (
                  <Image
                    source={{ uri: word.imageUrl }}
                    style={styles.wordImage}
                    resizeMode="cover"
                  />
                )}
                <Text style={styles.englishWord}>
                  {word?.englishWord || "Clean"}
                </Text>
                <Text style={styles.pronunciation}>
                  {word?.pronunciation || "/kliːn/"}
                </Text>
                <Text style={styles.category}>
                  📚 {word?.category?.name || "Daily Activities"}
                </Text>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.flipHint}>👆 Nhấn để xem nghĩa</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Back Card (Vietnamese) */}
          <Animated.View
            style={[
              styles.card,
              styles.cardBack,
              {
                transform: [{ rotateY: backInterpolate }],
                opacity: backOpacity,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.cardTouchable}
              onPress={flipCard}
              activeOpacity={0.8}
              disabled={isAnimating}
            >
              <View style={styles.cardHeader}>
                <Chip
                  style={[
                    styles.chip,
                    { backgroundColor: levelColors[word?.level] || "#666" },
                  ]}
                  textStyle={styles.chipText}
                >
                  {word?.level || "A1"}
                </Chip>
                <Chip
                  style={[
                    styles.chip,
                    {
                      backgroundColor: wordTypeColors[word?.wordType] || "#666",
                    },
                  ]}
                  textStyle={styles.chipText}
                >
                  {word?.wordType || "NOUN"}
                </Chip>
              </View>

              <View style={styles.cardContent}>
                <Text style={styles.vietnameseMeaning}>
                  {word?.vietnameseMeaning || "Sạch sẽ, làm sạch"}
                </Text>
                <Text style={styles.englishWordSmall}>
                  {word?.englishWord || "Clean"}
                </Text>
                <Text style={styles.pronunciationSmall}>
                  {word?.pronunciation || "/kliːn/"}
                </Text>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.flipHint}>
                  Sẵn sàng để bắt đầu bài tập?
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <Button
          mode="contained"
          onPress={startLearningSession}
          style={styles.startButton}
          contentStyle={styles.startButtonContent}
          buttonColor="#6200ea"
          icon="play"
        >
          Bắt đầu học
        </Button>
      </View>
    </View>
  );

  const renderQuestion = () => {
    const currentQuestion = sessionData.questions[currentQuestionIndex];
    const progress = (currentQuestionIndex + 1) / sessionData.totalQuestions;

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#6200ea" barStyle="light-content" />
        <Appbar.Header style={styles.header}>
          <Appbar.BackAction onPress={exitLearning} color="white" />
          <Appbar.Content
            title="Học từ vựng"
            subtitle={`${currentQuestionIndex + 1}/${
              sessionData.totalQuestions
            }`}
            titleStyle={styles.headerTitle}
            subtitleStyle={styles.headerSubtitle}
          />
        </Appbar.Header>

        {/* Progress Section */}
        <Surface style={styles.progressContainer} elevation={2}>
          <ProgressBar
            progress={progress}
            color="#6200ea"
            style={styles.progressBar}
          />
          <Text style={styles.progressText}>
            {currentQuestionIndex + 1}/{sessionData.totalQuestions} -{" "}
            {Math.round(progress * 100)}% hoàn thành
          </Text>
        </Surface>

        <ScrollView contentContainerStyle={styles.questionContainer}>
          <Surface style={styles.questionCard}>
            <Text variant="titleMedium" style={styles.questionText}>
              {currentQuestion.questionText}
            </Text>

            {currentQuestion.audioUrl && (
              <Button
                mode="outlined"
                icon={isPlaying ? "pause" : "play"}
                onPress={() => playAudio(currentQuestion.audioUrl)}
                style={styles.audioButton}
                disabled={isPlaying}
              >
                {isPlaying ? "Đang phát..." : "Phát âm thanh"}
              </Button>
            )}

            {currentQuestion.imageUrl && (
              <Image
                source={{ uri: currentQuestion.imageUrl }}
                style={styles.questionImage}
                resizeMode="contain"
              />
            )}

            {renderAnswerInput(currentQuestion)}
          </Surface>

          <Button
            mode="contained"
            onPress={submitAnswer}
            disabled={!selectedAnswer && !textAnswer}
            style={styles.submitButton}
            contentStyle={styles.submitButtonContent}
            buttonColor="#6200ea"
          >
            Trả lời
          </Button>
        </ScrollView>

        {renderFeedbackDialog()}
      </View>
    );
  };

  const renderAnswerInput = (question) => {
    switch (question.questionFormat) {
      case "MULTIPLE_CHOICE":
        return (
          <View style={styles.optionsContainer}>
            <RadioButton.Group
              onValueChange={(value) => setSelectedAnswer(value)}
              value={selectedAnswer}
            >
              {question.options.map((option) => (
                <TouchableOpacity
                  key={option.optionId}
                  style={[
                    styles.optionItem,
                    selectedAnswer === option.optionText &&
                      styles.selectedOption,
                  ]}
                  onPress={() => setSelectedAnswer(option.optionText)}
                >
                  <RadioButton value={option.optionText} />
                  <Text variant="bodyMedium" style={styles.optionText}>
                    {option.optionText}
                  </Text>
                </TouchableOpacity>
              ))}
            </RadioButton.Group>
          </View>
        );

      case "FILL_BLANK":
      case "LISTENING_GAP":
        return (
          <TextInput
            label="Nhập câu trả lời"
            value={textAnswer}
            onChangeText={setTextAnswer}
            style={styles.textInput}
            mode="outlined"
          />
        );

      case "SPEAKING":
        return (
          <View style={styles.speakingContainer}>
            <Button
              mode="contained-tonal"
              icon="microphone"
              onPress={() => {
                // TODO: Implement speech recognition
                Alert.alert(
                  "Chức năng ghi âm",
                  "Tính năng này sẽ được phát triển sau."
                );
              }}
              style={styles.recordButton}
            >
              Nhấn để ghi âm
            </Button>
            <TextInput
              label="Hoặc nhập câu trả lời"
              value={textAnswer}
              onChangeText={setTextAnswer}
              style={styles.textInput}
              mode="outlined"
            />
          </View>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" />
        <Text variant="bodyMedium" style={styles.loadingText}>
          Đang tải...
        </Text>
      </View>
    );
  }

  return showResult
    ? renderResult()
    : showFlashcard
    ? renderFlashcard()
    : renderQuestion();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#6200ea",
    elevation: 4,
  },
  headerTitle: {
    color: "white",
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.7)",
  },
  // Progress section styles (thêm từ QuickLearningScreen)
  progressContainer: {
    padding: 16,
    backgroundColor: "white",
  },
  progressText: {
    textAlign: "center",
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },

  // Card styles (giống QuickLearningScreen)
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    position: "relative",
  },
  card: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    backfaceVisibility: "hidden",
  },
  cardFront: {
    backgroundColor: "#ffffff",
  },
  cardBack: {
    backgroundColor: "#f8f9fa",
  },
  cardTouchable: {
    flex: 1,
    padding: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardFooter: {
    alignItems: "center",
    marginTop: 20,
  },
  wordImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "#e0e0e0",
  },
  englishWord: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  pronunciation: {
    fontSize: 18,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 16,
  },
  category: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  vietnameseMeaning: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2196F3",
    textAlign: "center",
    marginBottom: 20,
  },
  englishWordSmall: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  pronunciationSmall: {
    fontSize: 16,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
  },
  chip: {
    height: 32,
    elevation: 2,
  },
  chipText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  flipHint: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    fontStyle: "italic",
  },

  // Action buttons
  actionButtons: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "white",
    elevation: 4,
  },
  startButton: {
    borderRadius: 25,
    elevation: 2,
  },
  startButtonContent: {
    paddingVertical: 8,
  },

  // Question styles
  questionContainer: {
    padding: 16,
  },
  questionCard: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 12,
    elevation: 2,
    marginBottom: 20,
  },
  questionText: {
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 24,
  },
  questionImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginVertical: 15,
  },
  optionsContainer: {
    marginTop: 15,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  selectedOption: {
    backgroundColor: "#e3f2fd",
    borderColor: "#1976d2",
    borderWidth: 2,
  },
  optionText: {
    marginLeft: 8,
    flex: 1,
  },
  textInput: {
    marginTop: 15,
    backgroundColor: "white",
  },
  speakingContainer: {
    marginTop: 15,
  },
  recordButton: {
    marginBottom: 15,
  },
  submitButton: {
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 25,
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
  loadingText: {
    marginTop: 16,
    color: "#666",
  },
  audioButton: {
    marginTop: 10,
  },

  // Feedback dialog styles
  feedbackContainer: {
    paddingVertical: 10,
  },
  feedbackText: {
    marginBottom: 12,
    lineHeight: 20,
  },
  boldText: {
    fontWeight: "bold",
    color: "#333",
  },
  correctAnswer: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  feedbackMessage: {
    marginTop: 8,
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    fontStyle: "italic",
  },
});

export default VocabularyExerciseScreen;
