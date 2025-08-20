import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  Appbar,
  Text,
  Button,
  Card,
  Chip,
  Surface,
  IconButton,
  ProgressBar,
  Portal,
  Dialog,
  Paragraph,
} from "react-native-paper";
import { Audio } from "expo-av";

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width - 40;
const CARD_HEIGHT = height * 0.6;

const QuickLearningScreen = ({ route, navigation }) => {
  const { vocabularyList, words, mode } = route.params;

  // States
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [learnedWords, setLearnedWords] = useState([]);
  const [skippedWords, setSkippedWords] = useState([]);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [sound, setSound] = useState(null);

  // Animations
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;

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

  // Current word
  const currentWord = words[currentIndex];
  const progress = (currentIndex + 1) / words.length;

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  // Play audio
  const playAudio = async () => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      if (currentWord.audioUrl) {
        const { sound: newSound } = await Audio.Sound.createAsync({
          uri: currentWord.audioUrl,
        });
        setSound(newSound);
        await newSound.playAsync();
      }
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  // Flip card animation
  const flipCard = () => {
    if (isFlipped) {
      // Flip to front (English)
      Animated.spring(flipAnimation, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      // Flip to back (Vietnamese)
      Animated.spring(flipAnimation, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
    setIsFlipped(!isFlipped);
  };

  // Next card
  const nextCard = (action = "next") => {
    if (currentIndex === words.length - 1) {
      // Last card
      if (action === "learned") {
        setLearnedWords([...learnedWords, currentWord.id]);
      } else if (action === "skipped") {
        setSkippedWords([...skippedWords, currentWord.id]);
      }
      setShowCompletionDialog(true);
      return;
    }

    // Track learned/skipped words
    if (action === "learned") {
      setLearnedWords([...learnedWords, currentWord.id]);
    } else if (action === "skipped") {
      setSkippedWords([...skippedWords, currentWord.id]);
    }

    // Slide animation
    Animated.sequence([
      Animated.timing(slideAnimation, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();

    // Reset flip state and move to next card
    setIsFlipped(false);
    flipAnimation.setValue(0);
    setCurrentIndex(currentIndex + 1);
  };

  // Previous card
  const previousCard = () => {
    if (currentIndex === 0) return;

    // Slide animation
    Animated.sequence([
      Animated.timing(slideAnimation, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();

    // Reset flip state and move to previous card
    setIsFlipped(false);
    flipAnimation.setValue(0);
    setCurrentIndex(currentIndex - 1);

    // Remove from learned/skipped arrays if going back
    const prevWord = words[currentIndex - 1];
    setLearnedWords(learnedWords.filter((id) => id !== prevWord.id));
    setSkippedWords(skippedWords.filter((id) => id !== prevWord.id));
  };

  // Pan responder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 20 || Math.abs(gestureState.dy) > 20;
      },
      onPanResponderMove: (evt, gestureState) => {
        slideAnimation.setValue(gestureState.dx);
        const scale = 1 - Math.abs(gestureState.dx) / (width * 2);
        scaleAnimation.setValue(Math.max(0.9, scale));
      },
      onPanResponderRelease: (evt, gestureState) => {
        const threshold = width * 0.3;

        if (gestureState.dx > threshold) {
          // Swipe right - Previous card
          previousCard();
        } else if (gestureState.dx < -threshold) {
          // Swipe left - Next card (skip)
          nextCard("skipped");
        } else {
          // Return to center
          Animated.parallel([
            Animated.spring(slideAnimation, {
              toValue: 0,
              useNativeDriver: true,
            }),
            Animated.spring(scaleAnimation, {
              toValue: 1,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    })
  ).current;

  // Restart learning
  const restartLearning = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setLearnedWords([]);
    setSkippedWords([]);
    setShowCompletionDialog(false);
    flipAnimation.setValue(0);
    slideAnimation.setValue(0);
    scaleAnimation.setValue(1);
  };

  // Exit learning
  const exitLearning = () => {
    navigation.goBack();
  };

  // Completion dialog
  const renderCompletionDialog = () => (
    <Portal>
      <Dialog visible={showCompletionDialog} onDismiss={() => {}}>
        <Dialog.Title>🎉 Hoàn thành!</Dialog.Title>
        <Dialog.Content>
          <Paragraph style={styles.dialogText}>
            Bạn đã học xong {words.length} từ vựng!
          </Paragraph>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: "#4CAF50" }]}>
                {learnedWords.length}
              </Text>
              <Text style={styles.statLabel}>Đã học</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: "#FF9800" }]}>
                {skippedWords.length}
              </Text>
              <Text style={styles.statLabel}>Bỏ qua</Text>
            </View>
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={restartLearning}>Học lại</Button>
          <Button onPress={exitLearning}>Hoàn thành</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );

  // Front interpolation
  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  // Back interpolation
  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  // Opacity interpolations
  const frontOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });

  const backOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  if (!currentWord) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={exitLearning} />
        <Appbar.Content
          title={mode === "quick" ? "Học nhanh" : "Học từ vựng"}
          subtitle={`${currentIndex + 1}/${words.length}`}
        />
        <Appbar.Action
          icon="volume-high"
          onPress={playAudio}
          disabled={!currentWord.audioUrl}
        />
      </Appbar.Header>

      {/* Progress bar */}
      <Surface style={styles.progressContainer}>
        <ProgressBar
          progress={progress}
          color="#4CAF50"
          style={styles.progressBar}
        />
        <Text style={styles.progressText}>
          {Math.round(progress * 100)}% hoàn thành
        </Text>
      </Surface>

      {/* Card container */}
      <View style={styles.cardContainer}>
        <Animated.View
          style={[
            styles.cardWrapper,
            {
              transform: [
                { translateX: slideAnimation },
                { scale: scaleAnimation },
              ],
            },
          ]}
          {...panResponder.panHandlers}
        >
          {/* Front card (English) */}
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
            <TouchableOpacity style={styles.cardTouchable} onPress={flipCard}>
              <View style={styles.cardHeader}>
                <Chip
                  style={[
                    styles.levelChip,
                    { backgroundColor: levelColors[currentWord.level] },
                  ]}
                  textStyle={styles.chipText}
                >
                  {currentWord.level}
                </Chip>
                <Chip
                  style={[
                    styles.typeChip,
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

          {/* Back card (Vietnamese) */}
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
            <TouchableOpacity style={styles.cardTouchable} onPress={flipCard}>
              <View style={styles.cardHeader}>
                <Chip
                  style={[
                    styles.levelChip,
                    { backgroundColor: levelColors[currentWord.level] },
                  ]}
                  textStyle={styles.chipText}
                >
                  {currentWord.level}
                </Chip>
                <Chip
                  style={[
                    styles.typeChip,
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
                <Text style={styles.flipHint}>👆 Nhấn để xem từ tiếng Anh</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>

      {/* Swipe hints */}
      <View style={styles.swipeHints}>
        <View style={styles.swipeHint}>
          <Text style={styles.swipeText}>← Từ trước</Text>
        </View>
        <View style={styles.swipeHint}>
          <Text style={styles.swipeText}>Bỏ qua →</Text>
        </View>
      </View>

      {/* Action buttons */}
      <View style={styles.actionButtons}>
        <Button
          mode="outlined"
          icon="arrow-left"
          onPress={previousCard}
          disabled={currentIndex === 0}
          style={styles.actionButton}
        >
          Trước
        </Button>

        <Button
          mode="contained"
          icon="check"
          onPress={() => nextCard("learned")}
          style={[styles.actionButton, styles.learnedButton]}
          buttonColor="#4CAF50"
        >
          Đã học
        </Button>

        <Button
          mode="outlined"
          icon="skip-next"
          onPress={() => nextCard("skipped")}
          style={styles.actionButton}
        >
          Bỏ qua
        </Button>
      </View>

      {renderCompletionDialog()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  progressContainer: {
    padding: 16,
    elevation: 2,
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
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  card: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    backfaceVisibility: "hidden",
  },
  cardFront: {
    backgroundColor: "#fff",
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
  flipHint: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  swipeHints: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 40,
    paddingVertical: 10,
  },
  swipeHint: {
    backgroundColor: "rgba(0,0,0,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  swipeText: {
    fontSize: 12,
    color: "#666",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  learnedButton: {
    flex: 1.2,
  },
  dialogText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
});

export default QuickLearningScreen;
