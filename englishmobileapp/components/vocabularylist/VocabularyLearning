import React, { useState, useEffect } from "react";
import { View, ScrollView, Image, Dimensions, Animated } from "react-native";
import {
  Appbar,
  Card,
  Text,
  Chip,
  ActivityIndicator,
  Snackbar,
  IconButton,
  Button,
  ProgressBar,
  FAB,
  Portal,
  Modal,
  Divider,
} from "react-native-paper";
import { authApis, endpoints } from "../../configs/Apis";

const { width } = Dimensions.get("window");

const VocabularyLearningScreen = ({ route, navigation }) => {
  const { vocabularyId, vocabularyName } = route.params;

  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [learnedWords, setLearnedWords] = useState(new Set());
  const [favoriteWords, setFavoriteWords] = useState(new Set());
  
  // Learning modes
  const [learningMode, setLearningMode] = useState("flashcard"); // flashcard, quiz, review
  const [quizOptions, setQuizOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  
  // Modal states
  const [modeModalVisible, setModeModalVisible] = useState(false);
  const [statsModalVisible, setStatsModalVisible] = useState(false);
  
  // Animation
  const [cardAnimation] = useState(new Animated.Value(0));
  
  // Snackbar
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Load words from vocabulary
  const loadWords = async () => {
    try {
      setLoading(true);
      let url = `${endpoints["vocabulary"]}/${vocabularyId}/words`;
      let res = await (await authApis()).get(url);
      setWords(res.data);
      if (res.data.length > 0) {
        generateQuizOptions(res.data, 0);
      }
    } catch (error) {
      showSnackbar("Lỗi kết nối: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Generate quiz options
  const generateQuizOptions = (allWords, currentIndex) => {
    if (allWords.length < 4) return;
    
    const currentWord = allWords[currentIndex];
    const otherWords = allWords.filter((_, index) => index !== currentIndex);
    const randomWords = otherWords.sort(() => 0.5 - Math.random()).slice(0, 3);
    const options = [currentWord, ...randomWords].sort(() => 0.5 - Math.random());
    
    setQuizOptions(options);
  };

  // Helper functions
  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const playAudio = (audioUrl) => {
    console.log("Playing audio:", audioUrl);
    showSnackbar("Đang phát âm thanh...");
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "A1":
      case "A2":
        return "#4CAF50";
      case "B1":
      case "B2":
        return "#FF9800";
      case "C1":
      case "C2":
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  };

  const getWordTypeColor = (type) => {
    switch (type) {
      case "NOUN":
        return "#2196F3";
      case "VERB":
        return "#4CAF50";
      case "ADJECTIVE":
        return "#FF9800";
      case "ADVERB":
        return "#9C27B0";
      default:
        return "#757575";
    }
  };

  // Card flip animation
  const flipCard = () => {
    if (learningMode === "flashcard") {
      Animated.timing(cardAnimation, {
        toValue: showMeaning ? 0 : 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setShowMeaning(!showMeaning);
    }
  };

  // Navigation functions
  const goToNextWord = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setShowMeaning(false);
      setSelectedAnswer(null);
      setShowQuizResult(false);
      cardAnimation.setValue(0);
      generateQuizOptions(words, currentWordIndex + 1);
    }
  };

  const goToPrevWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
      setShowMeaning(false);
      setSelectedAnswer(null);
      setShowQuizResult(false);
      cardAnimation.setValue(0);
      generateQuizOptions(words, currentWordIndex - 1);
    }
  };

  const markAsLearned = () => {
    const newLearned = new Set(learnedWords);
    const wordId = words[currentWordIndex].id;
    
    if (newLearned.has(wordId)) {
      newLearned.delete(wordId);
      showSnackbar("Đã bỏ đánh dấu đã học");
    } else {
      newLearned.add(wordId);
      showSnackbar("Đã đánh dấu đã học");
    }
    setLearnedWords(newLearned);
  };

  const toggleFavorite = () => {
    const newFavorites = new Set(favoriteWords);
    const wordId = words[currentWordIndex].id;
    
    if (newFavorites.has(wordId)) {
      newFavorites.delete(wordId);
      showSnackbar("Đã bỏ yêu thích");
    } else {
      newFavorites.add(wordId);
      showSnackbar("Đã thêm vào yêu thích");
    }
    setFavoriteWords(newFavorites);
  };

  // Quiz functions
  const selectAnswer = (option) => {
    setSelectedAnswer(option);
    setShowQuizResult(true);
    
    if (option.id === words[currentWordIndex].id) {
      setCorrectAnswers(correctAnswers + 1);
      showSnackbar("Chính xác! 🎉");
    } else {
      showSnackbar("Sai rồi! 😔");
    }
  };

  const resetProgress = () => {
    setCurrentWordIndex(0);
    setLearnedWords(new Set());
    setCorrectAnswers(0);
    setShowMeaning(false);
    setSelectedAnswer(null);
    setShowQuizResult(false);
    cardAnimation.setValue(0);
    if (words.length > 0) {
      generateQuizOptions(words, 0);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadWords();
  }, [vocabularyId]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 16 }}>Đang tải từ vựng...</Text>
      </View>
    );
  }

  if (words.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title={vocabularyName} />
        </Appbar.Header>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 32 }}>
          <Text variant="bodyLarge" style={{ textAlign: "center", color: "#666" }}>
            Danh sách chưa có từ vựng nào để học
          </Text>
        </View>
      </View>
    );
  }

  const currentWord = words[currentWordIndex];
  const progress = (currentWordIndex + 1) / words.length;
  const learnedProgress = learnedWords.size / words.length;

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      {/* App Bar */}
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={vocabularyName} />
        <Appbar.Action 
          icon="chart-line" 
          onPress={() => setStatsModalVisible(true)} 
        />
        <Appbar.Action 
          icon="cog" 
          onPress={() => setModeModalVisible(true)} 
        />
      </Appbar.Header>

      {/* Progress Section */}
      <View style={{ padding: 16, backgroundColor: "white" }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
          <Text variant="bodyMedium">Tiến độ học: {currentWordIndex + 1}/{words.length}</Text>
          <Text variant="bodyMedium">Đã học: {learnedWords.size}</Text>
        </View>
        <ProgressBar progress={progress} color="#2196F3" style={{ height: 6, marginBottom: 4 }} />
        <ProgressBar progress={learnedProgress} color="#4CAF50" style={{ height: 4 }} />
      </View>

      {/* Learning Content */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        {learningMode === "flashcard" && (
          <View>
            {/* Flashcard */}
            <Card style={{ marginBottom: 16, minHeight: 300 }}>
              <Card.Content style={{ alignItems: "center", padding: 24 }}>
                {/* Word Image */}
                {currentWord.imageUrl && (
                  <Image
                    source={{ uri: currentWord.imageUrl }}
                    style={{
                      width: width - 80,
                      height: 150,
                      borderRadius: 12,
                      marginBottom: 16,
                      backgroundColor: "#f0f0f0",
                    }}
                    resizeMode="cover"
                  />
                )}

                {/* Front of card - English word */}
                {!showMeaning && (
                  <View style={{ alignItems: "center" }}>
                    <Text variant="headlineMedium" style={{ fontWeight: "bold", textAlign: "center", marginBottom: 12 }}>
                      {currentWord.englishWord}
                    </Text>
                    
                    {currentWord.pronunciation && (
                      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
                        <Text variant="bodyLarge" style={{ fontStyle: "italic", color: "#666" }}>
                          {currentWord.pronunciation}
                        </Text>
                        {currentWord.audioUrl && (
                          <IconButton
                            icon="volume-high"
                            size={24}
                            onPress={() => playAudio(currentWord.audioUrl)}
                            style={{ marginLeft: 8 }}
                          />
                        )}
                      </View>
                    )}

                    <Text variant="bodyMedium" style={{ color: "#888", textAlign: "center" }}>
                      Nhấn để xem nghĩa
                    </Text>
                  </View>
                )}

                {/* Back of card - Vietnamese meaning */}
                {showMeaning && (
                  <View style={{ alignItems: "center" }}>
                    <Text variant="headlineSmall" style={{ fontWeight: "bold", textAlign: "center", marginBottom: 8 }}>
                      {currentWord.englishWord}
                    </Text>
                    
                    <Text variant="headlineMedium" style={{ color: "#2196F3", textAlign: "center", marginBottom: 16 }}>
                      {currentWord.vietnameseMeaning}
                    </Text>

                    {currentWord.pronunciation && (
                      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
                        <Text variant="bodyLarge" style={{ fontStyle: "italic", color: "#666" }}>
                          {currentWord.pronunciation}
                        </Text>
                        {currentWord.audioUrl && (
                          <IconButton
                            icon="volume-high"
                            size={24}
                            onPress={() => playAudio(currentWord.audioUrl)}
                            style={{ marginLeft: 8 }}
                          />
                        )}
                      </View>
                    )}

                    {/* Word info chips */}
                    <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
                      <Chip
                        mode="outlined"
                        compact
                        textStyle={{ color: getLevelColor(currentWord.level), fontSize: 12 }}
                        style={{ borderColor: getLevelColor(currentWord.level) }}
                      >
                        {currentWord.level}
                      </Chip>
                      
                      <Chip
                        mode="outlined"
                        compact
                        textStyle={{ color: getWordTypeColor(currentWord.wordType), fontSize: 12 }}
                        style={{ borderColor: getWordTypeColor(currentWord.wordType) }}
                      >
                        {currentWord.wordType}
                      </Chip>
                      
                      {currentWord.category && (
                        <Chip
                          mode="outlined"
                          compact
                          icon="tag-outline"
                        >
                          {currentWord.category.name}
                        </Chip>
                      )}
                    </View>
                  </View>
                )}
              </Card.Content>
            </Card>

            {/* Tap to flip instruction */}
            <Button
              mode="contained"
              onPress={flipCard}
              style={{ marginBottom: 16 }}
              icon={showMeaning ? "eye-off" : "eye"}
            >
              {showMeaning ? "Ẩn nghĩa" : "Hiện nghĩa"}
            </Button>
          </View>
        )}

        {learningMode === "quiz" && quizOptions.length > 0 && (
          <View>
            {/* Quiz Question */}
            <Card style={{ marginBottom: 16 }}>
              <Card.Content style={{ alignItems: "center", padding: 24 }}>
                {currentWord.imageUrl && (
                  <Image
                    source={{ uri: currentWord.imageUrl }}
                    style={{
                      width: width - 80,
                      height: 120,
                      borderRadius: 12,
                      marginBottom: 16,
                      backgroundColor: "#f0f0f0",
                    }}
                    resizeMode="cover"
                  />
                )}
                
                <Text variant="headlineMedium" style={{ fontWeight: "bold", textAlign: "center", marginBottom: 8 }}>
                  {currentWord.englishWord}
                </Text>
                
                {currentWord.pronunciation && (
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
                    <Text variant="bodyLarge" style={{ fontStyle: "italic", color: "#666" }}>
                      {currentWord.pronunciation}
                    </Text>
                    {currentWord.audioUrl && (
                      <IconButton
                        icon="volume-high"
                        size={24}
                        onPress={() => playAudio(currentWord.audioUrl)}
                        style={{ marginLeft: 8 }}
                      />
                    )}
                  </View>
                )}
                
                <Text variant="bodyLarge" style={{ textAlign: "center", color: "#666" }}>
                  Chọn nghĩa đúng:
                </Text>
              </Card.Content>
            </Card>

            {/* Quiz Options */}
            {quizOptions.map((option, index) => {
              let buttonColor = "outline";
              let textColor = "#000";
              
              if (showQuizResult && selectedAnswer) {
                if (option.id === currentWord.id) {
                  buttonColor = "contained";
                  textColor = "#fff";
                } else if (option.id === selectedAnswer.id && option.id !== currentWord.id) {
                  buttonColor = "outlined";
                  textColor = "#f44336";
                }
              }
              
              return (
                <Button
                  key={option.id}
                  mode={buttonColor}
                  onPress={() => !showQuizResult && selectAnswer(option)}
                  style={{ 
                    marginBottom: 12,
                    backgroundColor: buttonColor === "contained" ? "#4CAF50" : undefined,
                    borderColor: textColor === "#f44336" ? "#f44336" : undefined
                  }}
                  labelStyle={{ color: textColor }}
                  disabled={showQuizResult}
                >
                  {option.vietnameseMeaning}
                </Button>
              );
            })}

            {showQuizResult && (
              <Text variant="bodyMedium" style={{ textAlign: "center", marginTop: 8, color: "#666" }}>
                Đáp án đúng: {currentWord.vietnameseMeaning}
              </Text>
            )}
          </View>
        )}

        {/* Action Buttons */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 16 }}>
          <Button
            mode="outlined"
            onPress={toggleFavorite}
            icon={favoriteWords.has(currentWord.id) ? "heart" : "heart-outline"}
            style={{ flex: 1, marginRight: 8 }}
          >
            Yêu thích
          </Button>
          
          <Button
            mode={learnedWords.has(currentWord.id) ? "contained" : "outlined"}
            onPress={markAsLearned}
            icon="check"
            style={{ flex: 1, marginLeft: 8 }}
          >
            {learnedWords.has(currentWord.id) ? "Đã học" : "Đánh dấu"}
          </Button>
        </View>
      </ScrollView>

      {/* Navigation FABs */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 16 }}>
        <FAB
          icon="chevron-left"
          onPress={goToPrevWord}
          disabled={currentWordIndex === 0}
          style={{ backgroundColor: currentWordIndex === 0 ? "#ccc" : "#2196F3" }}
        />
        
        <FAB
          icon="chevron-right"
          onPress={goToNextWord}
          disabled={currentWordIndex === words.length - 1}
          style={{ backgroundColor: currentWordIndex === words.length - 1 ? "#ccc" : "#2196F3" }}
        />
      </View>

      {/* Mode Selection Modal */}
      <Portal>
        <Modal
          visible={modeModalVisible}
          onDismiss={() => setModeModalVisible(false)}
          contentContainerStyle={{ backgroundColor: "white", padding: 20, margin: 20, borderRadius: 12 }}
        >
          <Text variant="headlineSmall" style={{ marginBottom: 16, textAlign: "center" }}>
            Chế độ học
          </Text>
          
          <Button
            mode={learningMode === "flashcard" ? "contained" : "outlined"}
            onPress={() => {
              setLearningMode("flashcard");
              setModeModalVisible(false);
              setShowMeaning(false);
              setSelectedAnswer(null);
              setShowQuizResult(false);
            }}
            style={{ marginBottom: 12 }}
            icon="card-outline"
          >
            Flashcard - Thẻ từ vựng
          </Button>
          
          <Button
            mode={learningMode === "quiz" ? "contained" : "outlined"}
            onPress={() => {
              setLearningMode("quiz");
              setModeModalVisible(false);
              setShowMeaning(false);
              setSelectedAnswer(null);
              setShowQuizResult(false);
            }}
            icon="help-circle-outline"
          >
            Quiz - Trắc nghiệm
          </Button>
        </Modal>

        {/* Stats Modal */}
        <Modal
          visible={statsModalVisible}
          onDismiss={() => setStatsModalVisible(false)}
          contentContainerStyle={{ backgroundColor: "white", padding: 20, margin: 20, borderRadius: 12 }}
        >
          <Text variant="headlineSmall" style={{ marginBottom: 16, textAlign: "center" }}>
            Thống kê học tập
          </Text>
          
          <View style={{ marginBottom: 12 }}>
            <Text variant="bodyMedium">Tổng số từ: {words.length}</Text>
            <Text variant="bodyMedium">Đã học: {learnedWords.size}</Text>
            <Text variant="bodyMedium">Yêu thích: {favoriteWords.size}</Text>
            <Text variant="bodyMedium">Tiến độ: {Math.round(progress * 100)}%</Text>
            {learningMode === "quiz" && (
              <Text variant="bodyMedium">Câu trả lời đúng: {correctAnswers}</Text>
            )}
          </View>
          
          <Divider style={{ marginVertical: 12 }} />
          
          <Button
            mode="outlined"
            onPress={() => {
              resetProgress();
              setStatsModalVisible(false);
            }}
            icon="refresh"
          >
            Đặt lại tiến độ
          </Button>
        </Modal>
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
  );
};

export default VocabularyLearningScreen;