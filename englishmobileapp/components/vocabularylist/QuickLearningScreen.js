import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  Alert,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import {
  Appbar,
  Text,
  Button,
  Chip,
  Surface,
  ProgressBar,
  Portal,
  Dialog,
  Paragraph,
  IconButton,
  Card,
} from "react-native-paper";
import { Audio } from "expo-av";
import { authApis, endpoints } from "../../configs/Apis";

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width - 40;
const CARD_HEIGHT = height * 0.6;

const QuickLearningScreen = ({ route, navigation }) => {
  const { vocabularyList, words, mode } = route.params;

  // States
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [rememberedWords, setRememberedWords] = useState([]);
  const [forgottenWords, setForgottenWords] = useState([]);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [sound, setSound] = useState(null);
  const [finalStats, setFinalStats] = useState({ remembered: 0, forgotten: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  // Animations
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;
  const opacityAnimation = useRef(new Animated.Value(1)).current;

  // Level and word type colors
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

  // Current word and progress
  const isLastCard = currentIndex >= words.length;
  const currentWord = !isLastCard ? words[currentIndex] : null;
  const progress = currentIndex / words.length;
  const displayIndex = isLastCard ? words.length : currentIndex + 1;

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  // Update final stats when reaching end
  useEffect(() => {
    if (currentIndex >= words.length) {
      const timer = setTimeout(() => {
        setFinalStats({
          remembered: rememberedWords.length,
          forgotten: forgottenWords.length,
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, words.length, rememberedWords, forgottenWords]);

  // Show completion dialog
  useEffect(() => {
    if (
      currentIndex >= words.length &&
      finalStats.remembered + finalStats.forgotten > 0
    ) {
      const timer = setTimeout(() => setShowCompletionDialog(true), 500);
      return () => clearTimeout(timer);
    }
  }, [finalStats, currentIndex, words.length]);

  // Reset animations - FIX: Đảm bảo reset hoàn toàn
  const resetAnimations = () => {
    flipAnimation.setValue(0);
    slideAnimation.setValue(0);
    scaleAnimation.setValue(1);
    opacityAnimation.setValue(1);
    setIsAnimating(false); // FIX: Reset isAnimating state
  };

  // Previous card - FIX: Cải thiện logic
  const previousCard = () => {
    if (currentIndex === 0 || isAnimating) return;
    if (showCompletionDialog) setShowCompletionDialog(false);

    setIsAnimating(true);
    const previousIndex = currentIndex - 1;
    const previousWord = words[previousIndex];

    // Remove word from remembered/forgotten lists when going back
    if (previousWord?.id) {
      setRememberedWords((prev) => prev.filter((id) => id !== previousWord.id));
      setForgottenWords((prev) => prev.filter((id) => id !== previousWord.id));
    }

    setCurrentIndex(previousIndex);
    setIsFlipped(false);

    // FIX: Đảm bảo reset animations sau khi update state
    setTimeout(() => {
      resetAnimations();
    }, 50);
  };

  // Play audio
  const playAudio = async () => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      if (currentWord?.audioUrl) {
        const { sound: newSound } = await Audio.Sound.createAsync({
          uri: currentWord.audioUrl,
        });
        setSound(newSound);
        await newSound.playAsync();
      } else {
        Alert.alert("Audio", "No audio available for this word");
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      Alert.alert("Error", "Could not play audio");
    }
  };

  // Flip card animation - FIX: Cải thiện animation
  const flipCard = () => {
    if (isLastCard || isAnimating) return;

    setIsAnimating(true);
    Animated.spring(flipAnimation, {
      toValue: isFlipped ? 0 : 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start(() => {
      setIsAnimating(false); // FIX: Reset isAnimating sau khi animation hoàn thành
    });
    setIsFlipped(!isFlipped);
  };

  // Next card with animation - FIX: Cải thiện logic chuyển card
  const nextCard = (action = "next") => {
    if (isLastCard || isAnimating) return;

    setIsAnimating(true);
    const currentWordId = words[currentIndex]?.id;

    // Update word lists based on action BEFORE animation
    if (action === "remembered" && currentWordId) {
      setRememberedWords((prev) =>
        prev.includes(currentWordId) ? prev : [...prev, currentWordId]
      );
      setForgottenWords((prev) => prev.filter((id) => id !== currentWordId));
    } else if (action === "forgot" && currentWordId) {
      setForgottenWords((prev) =>
        prev.includes(currentWordId) ? prev : [...prev, currentWordId]
      );
      setRememberedWords((prev) => prev.filter((id) => id !== currentWordId));
    }

    const slideDirection =
      action === "remembered" ? width : action === "forgot" ? -width : 0;

    if (slideDirection !== 0) {
      // FIX: Cải thiện animation sequence
      Animated.parallel([
        Animated.timing(slideAnimation, {
          toValue: slideDirection,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // FIX: Đảm bảo update state trước khi reset animations
        setCurrentIndex((prevIndex) => prevIndex + 1);
        setIsFlipped(false);

        // FIX: Reset animations sau một delay nhỏ để đảm bảo smooth transition
        setTimeout(() => {
          resetAnimations();
        }, 50);
      });
    } else {
      // FIX: Cải thiện logic cho trường hợp không có slide animation
      setIsFlipped(false);
      setCurrentIndex((prevIndex) => prevIndex + 1);

      setTimeout(() => {
        flipAnimation.setValue(0);
        setIsAnimating(false);
      }, 50);
    }
  };

  // Handle button actions
  const handleRemembered = () => {
    if (!isAnimating) {
      nextCard("remembered");
    }
  };

  const handleForgot = () => {
    if (!isAnimating) {
      nextCard("forgot");
    }
  };

  // Restart learning - FIX: Cải thiện reset logic
  const restartLearning = () => {
    setShowCompletionDialog(false);
    setCurrentIndex(0);
    setIsFlipped(false);
    setRememberedWords([]);
    setForgottenWords([]);
    setFinalStats({ remembered: 0, forgotten: 0 });

    // FIX: Đảm bảo reset hoàn toàn tất cả animations
    setTimeout(() => {
      resetAnimations();
    }, 100);
  };

  // Exit learning
  const exitLearning = async () => {
    try {
      let promises = words.map(async (word) => {
        let url = `${endpoints["wordProgress"]}/update`;
        return (await authApis()).post(url, {
          wordId: word.id,
          lastScore: 1,
          easeFactor: 2.3,
          intervalDays: 3,
          repetitionCount: 4,
          difficultyLevel: 0.3,
          isLearning: true,
        });
      });
      let results = await Promise.all(promises);
      console.info(
        "All updated",
        results.map((r) => r.data)
      );
    } catch (error) {
      console.error("Error updating word progress:", error);
    } finally {
      navigation.goBack();
    }
  };

  // Animation interpolations
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

  // Completion dialog
  const renderCompletionDialog = () => (
    <Portal>
      <Dialog
        visible={showCompletionDialog}
        onDismiss={() => setShowCompletionDialog(false)}
        style={styles.dialog}
      >
        <Dialog.Title style={styles.dialogTitle}>
          🎉 Hoàn thành xuất sắc!
        </Dialog.Title>
        <Dialog.Content>
          <Paragraph style={styles.dialogText}>
            Bạn đã học xong {words.length} từ vựng!
          </Paragraph>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: "#4CAF50" }]}>
                {finalStats.remembered}
              </Text>
              <Text style={styles.statLabel}>Đã nhớ</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: "#F44336" }]}>
                {finalStats.forgotten}
              </Text>
              <Text style={styles.statLabel}>Chưa nhớ</Text>
            </View>
          </View>
          {finalStats.forgotten > 0 && (
            <Text style={styles.suggestionText}>
              💡 Gợi ý: Hãy ôn lại những từ chưa nhớ để cải thiện kết quả!
            </Text>
          )}
        </Dialog.Content>
        <Dialog.Actions style={styles.dialogActions}>
          <Button
            mode="outlined"
            onPress={restartLearning}
            style={styles.dialogButton}
          >
            Học lại
          </Button>
          <Button
            mode="contained"
            onPress={exitLearning}
            style={styles.dialogButton}
          >
            Hoàn thành
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );

  // Completion screen
  if (isLastCard) {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#6200ea" barStyle="light-content" />
        <Appbar.Header style={styles.header}>
          <Appbar.BackAction onPress={exitLearning} color="white" />
          <Appbar.Content
            title={mode === "quick" ? "Học nhanh" : "Học từ vựng"}
            subtitle="Hoàn thành"
            titleStyle={styles.headerTitle}
            subtitleStyle={styles.headerSubtitle}
          />
        </Appbar.Header>

        <Surface style={styles.progressContainer} elevation={2}>
          <ProgressBar
            progress={1}
            color="#4CAF50"
            style={styles.progressBar}
          />
          <Text style={styles.progressText}>
            {words.length}/{words.length} - 100% hoàn thành
          </Text>
        </Surface>

        <View style={styles.completionContainer}>
          <Text style={styles.completionTitle}>🎉 Xuất sắc!</Text>
          <Text style={styles.completionText}>
            Bạn đã hoàn thành việc học {words.length} từ vựng
          </Text>

          <Card style={styles.statsCard}>
            <Card.Content>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: "#4CAF50" }]}>
                    {finalStats.remembered}
                  </Text>
                  <Text style={styles.statLabel}>Đã nhớ</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: "#F44336" }]}>
                    {finalStats.forgotten}
                  </Text>
                  <Text style={styles.statLabel}>Chưa nhớ</Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          {finalStats.forgotten > 0 && (
            <Text style={styles.suggestionText}>
              💡 Hãy ôn lại những từ chưa nhớ để cải thiện kết quả!
            </Text>
          )}
        </View>

        <View style={styles.actionButtons}>
          <Button
            mode="outlined"
            icon="arrow-left"
            onPress={previousCard}
            style={styles.actionButton}
            labelStyle={styles.buttonLabel}
          >
            Quay lại
          </Button>

          <Button
            mode="contained"
            icon="restart"
            onPress={restartLearning}
            style={[styles.actionButton, styles.primaryButton]}
            buttonColor="#6200ea"
            labelStyle={styles.buttonLabel}
          >
            Học lại
          </Button>
        </View>

        {renderCompletionDialog()}
      </View>
    );
  }

  if (!currentWord) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.emptyText}>Không có từ vựng nào để học</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#6200ea" barStyle="light-content" />

      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={exitLearning} color="white" />
        <Appbar.Content
          title={mode === "quick" ? "Học nhanh" : "Học từ vựng"}
          subtitle={`${displayIndex}/${words.length}`}
          titleStyle={styles.headerTitle}
          subtitleStyle={styles.headerSubtitle}
        />
        <IconButton
          icon="volume-high"
          iconColor="white"
          size={24}
          onPress={playAudio}
          disabled={!currentWord.audioUrl}
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
          {displayIndex}/{words.length} - {Math.round(progress * 100)}% hoàn
          thành
        </Text>
      </Surface>

      {/* Card Container */}
      <View style={styles.cardContainer}>
        {/* FIX: Thêm key prop để force re-render khi chuyển card */}
        <Animated.View
          key={currentIndex} // FIX: Key quan trọng để đảm bảo re-render đúng
          style={[
            styles.cardWrapper,
            {
              transform: [
                { translateX: slideAnimation },
                { scale: scaleAnimation },
              ],
              opacity: opacityAnimation,
            },
          ]}
        >
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
                    { backgroundColor: levelColors[currentWord.level] },
                  ]}
                  textStyle={styles.chipText}
                >
                  {currentWord.level}
                </Chip>
                <Chip
                  style={[
                    styles.chip,
                    { backgroundColor: wordTypeColors[currentWord.wordType] },
                  ]}
                  textStyle={styles.chipText}
                >
                  {currentWord.wordType}
                </Chip>
              </View>

              <View style={styles.cardContent}>
                {currentWord.imageUrl && (
                  <Image
                    source={{ uri: currentWord.imageUrl }}
                    style={styles.wordImage}
                    resizeMode="cover"
                  />
                )}
                <Text style={styles.englishWord}>
                  {currentWord.englishWord}
                </Text>
                <Text style={styles.pronunciation}>
                  {currentWord.pronunciation}
                </Text>
                <Text style={styles.category}>
                  📚 {currentWord.category.name}
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
                    { backgroundColor: levelColors[currentWord.level] },
                  ]}
                  textStyle={styles.chipText}
                >
                  {currentWord.level}
                </Chip>
                <Chip
                  style={[
                    styles.chip,
                    { backgroundColor: wordTypeColors[currentWord.wordType] },
                  ]}
                  textStyle={styles.chipText}
                >
                  {currentWord.wordType}
                </Chip>
              </View>

              <View style={styles.cardContent}>
                <Text style={styles.vietnameseMeaning}>
                  {currentWord.vietnameseMeaning}
                </Text>
                <Text style={styles.englishWordSmall}>
                  {currentWord.englishWord}
                </Text>
                <Text style={styles.pronunciationSmall}>
                  {currentWord.pronunciation}
                </Text>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.flipHint}>
                  Chọn mức độ hiểu biết bên dưới
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button
          mode="outlined"
          icon="arrow-left"
          onPress={previousCard}
          disabled={currentIndex === 0 || isAnimating}
          style={styles.actionButton}
          labelStyle={styles.buttonLabel}
        >
          Trước
        </Button>

        <Button
          mode="text"
          icon="close"
          onPress={handleForgot}
          disabled={isAnimating}
          style={[styles.actionButton, styles.forgotButton]}
          labelStyle={[styles.buttonLabel, { color: "#F44336" }]}
        >
          Chưa nhớ
        </Button>

        <Button
          mode="contained"
          icon="check"
          onPress={handleRemembered}
          disabled={isAnimating}
          style={[styles.actionButton, styles.rememberedButton]}
          buttonColor="#4CAF50"
          labelStyle={styles.buttonLabel}
        >
          Đã nhớ
        </Button>
      </View>

      {renderCompletionDialog()}
    </View>
  );
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
    color: "rgba(255, 255, 255, 0.7)",
  },
  progressContainer: {
    padding: 16,
    backgroundColor: "white",
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressText: {
    textAlign: "center",
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
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
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 10,
    backgroundColor: "white",
    elevation: 4,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  forgotButton: {
    borderColor: "#F44336",
  },
  rememberedButton: {
    elevation: 2,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  // Completion screen styles
  completionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  completionTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#6200ea",
    textAlign: "center",
    marginBottom: 16,
  },
  completionText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  statsCard: {
    width: "100%",
    marginBottom: 24,
    elevation: 4,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#e0e0e0",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  suggestionText: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    fontStyle: "italic",
    lineHeight: 22,
    backgroundColor: "#fff3cd",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#ffc107",
  },
  primaryButton: {
    elevation: 2,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
  },
  // Dialog styles
  dialog: {
    borderRadius: 12,
  },
  dialogTitle: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#6200ea",
  },
  dialogText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  dialogActions: {
    justifyContent: "space-around",
    paddingHorizontal: 8,
  },
  dialogButton: {
    minWidth: 100,
  },
});

export default QuickLearningScreen;
