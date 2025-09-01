import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useContext } from "react";
import { MyDispatchContext, MyUserContext } from "../configs/MyContexts";
import Login from "../components/User/Login";
import Register from "../components/User/Register";
import Category from "../components/category/Category";
import VocabularyScreen from "../words/WordList";
import LevelSelection from "../components/category/LevelSelection";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import VocabularyListManager from "../components/vocabularylist/VocabularyList";
import VocabularyWordsScreen from "../components/vocabularylist/VocabularyWords";
import QuickLearningScreen from "../components/vocabularylist/QuickLearningScreen";
import VocabularyExerciseScreen from "../components/vocabularylist/VocabularyExerciseScreen";
import SessionResultScreen from "../components/vocabularylist/SessionResultScreen";
import ReviewWordsList from "../components/wordprogress/ReviewWordsList";
import Profile from "../components/User/Profile";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function MainTabNavigator() {
  const user = useContext(MyUserContext);
  // const dispatch = useContext(MyDispatchContext);
  console.log("user", user);
  const wordProgressStack = () => {
    return (
      <>
        <Stack.Navigator>
          <Stack.Screen
            name="ReviewWordsList "
            component={ReviewWordsList}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="VocabularyExercise"
            component={VocabularyExerciseScreen}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </>
    );
  };
  const WordStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Category"
          component={Category}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="LevelSelection"
          component={LevelSelection}
          options={{
            headerShown: true,
            title: "Chọn độ khó",
          }}
        />
        <Stack.Screen name="DictionaryApp" component={VocabularyScreen} />
      </Stack.Navigator>
    );
  };

  const VocabularyNavigator = () => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false, // Vì chúng ta đã có Appbar riêng
        }}
      >
        <Stack.Screen
          name="VocabularyList"
          component={VocabularyListManager}
          options={{ title: "Danh sách từ vựng" }}
        />
        <Stack.Screen
          name="VocabularyWords"
          component={VocabularyWordsScreen}
          options={{ title: "Chi tiết từ vựng" }}
        />
        <Stack.Screen
          name="QuickLearning"
          component={QuickLearningScreen}
          options={{ title: "Học nhanh" }}
        />
        <Stack.Screen
          name="SessionResultScreen"
          component={SessionResultScreen}
          options={{ title: "Kết quả" }}
        />

        <Stack.Screen
          name="VocabularyExercise"
          component={VocabularyExerciseScreen}
          screenOptions={{
            headerShown: true,
            title: "Học từ",
          }}
        />
      </Stack.Navigator>
    );
  };

  if (user === null) {
    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: true,
          tabBarActiveTintColor: "#4A90E2",
          tabBarInactiveTintColor: "#8E8E93",
          tabBarStyle: { paddingVertical: 5 },
        }}
      >
        <Tab.Screen
          name="Login"
          component={Login}
          options={{
            title: "Đăng nhập",
            tabBarIcon: ({ color, size }) => (
              <Icon size={size} color={color} name="account" />
            ),
          }}
        ></Tab.Screen>

        <Tab.Screen
          name="Register"
          component={Register}
          options={{
            title: "Đăng ký",
            tabBarIcon: ({ color, size }) => (
              <Icon size={size} color={color} name="account-plus" />
            ),
          }}
        ></Tab.Screen>
      </Tab.Navigator>
    );
  }
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: "#4A90E2",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: { paddingVertical: 5 },
      }}
    >
      <Tab.Screen
        name="CategoryTab"
        component={WordStack}
        options={{
          headerShown: false,
          title: "Category",
          tabBarIcon: ({ color, size }) => (
            <Icon size={size} color={color} name="shape-outline" />
          ),
        }}
      ></Tab.Screen>

      <Tab.Screen
        name="vocabularyScreen"
        component={VocabularyScreen}
        options={{
          title: "Từ vựng",
          tabBarIcon: ({ color, size }) => (
            <Icon size={size} color={color} name="book" />
          ),
        }}
      ></Tab.Screen>

      <Tab.Screen
        name="vocabularyList"
        component={VocabularyNavigator}
        options={{
          title: "Danh sách",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon size={size} color={color} name="view-list" />
          ),
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="wordProgressScreen"
        component={wordProgressStack}
        options={{
          title: "SM2",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon size={size} color={color} name="book" />
          ),
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="profileScreen"
        component={Profile}
        options={{
          title: "Profile",
          headerShown:  true,
          tabBarIcon: ({ color, size }) => (
            <Icon size={size} color={color} name="account" />
          ),
        }}
      ></Tab.Screen>
    </Tab.Navigator>
  );
}
