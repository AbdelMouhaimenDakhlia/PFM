// ✅ BottomTabNavigator.tsx adapté à la palette Attijari avec thème dynamique appliqué

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import CompteScreen from '../screens/CompteScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PredictionScreen from '../screens/PredictionScreen';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';

function Dummy() {
  return null;
}

const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.tabBarContainer, { backgroundColor: theme.navBackground }]}>
      <View
        style={[styles.tabBar, {
          backgroundColor: theme.navBackground,
          borderTopColor: theme.border,
          shadowColor: theme.cardShadow,
        }]}
      >
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel || options.title || route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const getIcon = () => {
            const iconColor = isFocused ? theme.navIcon : theme.navInactive;
            const iconSize = 26;
            switch (route.name) {
              case 'Accueil':
                return <Ionicons name="home" color={iconColor} size={iconSize} />;
              case 'Comptes':
                return <MaterialCommunityIcons name="wallet" color={iconColor} size={iconSize} />;
              case 'Vue Future':
                return <MaterialCommunityIcons name="telescope" color={iconColor} size={iconSize} />;
              case 'Transactions':
                return <MaterialCommunityIcons name="receipt" color={iconColor} size={iconSize} />;
              case 'Profil':
                return <Ionicons name="person-circle" color={iconColor} size={iconSize} />;
              default:
                return <Ionicons name="help" color={iconColor} size={iconSize} />;
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tab}
            >
              {isFocused ? (
                <View style={[styles.activeBubble, { backgroundColor: theme.navInactive, shadowColor: theme.cardShadow }]}>
                  <View style={styles.bubbleIcon}>{getIcon()}</View>
                </View>
              ) : (
                <>
                  <View style={styles.iconContainer}>{getIcon()}</View>
                  <Text style={[styles.tabLabel, { color: theme.mutedText }]}>{label}</Text>
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default function BottomTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Accueil" component={HomeScreen} options={{ tabBarLabel: 'Accueil' }} />
      <Tab.Screen name="Comptes" component={CompteScreen} options={{ tabBarLabel: 'Comptes' }} />
      <Tab.Screen name="Vue Future" component={PredictionScreen} options={{ tabBarLabel: 'Vue Future' }} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} options={{ tabBarLabel: 'Transactions' }} />
      <Tab.Screen name="Profil" component={ProfileScreen} options={{ tabBarLabel: 'Profil' }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'relative',
  },
  tabBar: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    elevation: 8,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    height: 85,
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    position: 'relative',
    height: '100%',
  },
  iconContainer: {
    marginBottom: 6,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  activeBubble: {
    position: 'absolute',
    top: -25,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    zIndex: 10,
  },
  bubbleIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});