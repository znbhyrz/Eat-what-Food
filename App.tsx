import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';

import WheelScreen from './src/screens/WheelScreen';
import FoodScreen from './src/screens/FoodScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import { Food } from './src/data/defaults';
import { loadFoods } from './src/utils/storage';

const Tab = createBottomTabNavigator();

function TabIcon({ icon, label, focused }: { icon: string; label: string; focused: boolean }) {
  return (
    <View style={tabStyles.iconContainer}>
      <Text style={[tabStyles.icon, focused && tabStyles.iconActive]}>{icon}</Text>
      <Text style={[tabStyles.label, focused && tabStyles.labelActive]}>{label}</Text>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
  },
  icon: {
    fontSize: 22,
    opacity: 0.5,
  },
  iconActive: {
    opacity: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    color: '#B2BEC3',
  },
  labelActive: {
    color: '#FF6B35',
  },
});

export default function App() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const refreshFoods = useCallback(async () => {
    const data = await loadFoods();
    setFoods(data);
  }, []);

  useEffect(() => {
    refreshFoods().then(() => setLoaded(true));
  }, [refreshFoods]);

  const onFoodsChange = useCallback(() => {
    refreshFoods();
    setRefreshKey((k) => k + 1);
  }, [refreshFoods]);

  if (!loaded) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>今天吃什么</Text>
        <Text style={styles.headerSubtitle}>转盘决定，不再纠结</Text>
      </View>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: 'rgba(255,255,255,0.95)',
              borderTopColor: '#F0E8E0',
              height: 64,
              paddingBottom: 4,
              paddingTop: 6,
            },
            tabBarShowLabel: false,
          }}
        >
          <Tab.Screen
            name="Wheel"
            options={{
              tabBarIcon: ({ focused }) => (
                <TabIcon icon="🎡" label="转盘" focused={focused} />
              ),
            }}
          >
            {() => <WheelScreen foods={foods} onFoodsChange={onFoodsChange} />}
          </Tab.Screen>
          <Tab.Screen
            name="Foods"
            options={{
              tabBarIcon: ({ focused }) => (
                <TabIcon icon="🍽️" label="美食" focused={focused} />
              ),
            }}
          >
            {() => <FoodScreen foods={foods} onFoodsChange={onFoodsChange} />}
          </Tab.Screen>
          <Tab.Screen
            name="History"
            options={{
              tabBarIcon: ({ focused }) => (
                <TabIcon icon="📋" label="记录" focused={focused} />
              ),
            }}
          >
            {() => <HistoryScreen refreshKey={refreshKey} />}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 48,
    paddingBottom: 8,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#FFF8F0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FF6B35',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#636E72',
    marginTop: 2,
  },
});
