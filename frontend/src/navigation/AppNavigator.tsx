import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

// Import screens
import { DashboardScreen } from '../screens/DashboardScreen';
import { LeadsScreen } from '../screens/LeadsScreen';
import { EscalationsScreen } from '../screens/EscalationsScreen';
import { FollowupsScreen } from '../screens/FollowupsScreen';
import { ConversationDetailScreen } from '../screens/ConversationDetailScreen';

export type RootStackParamList = {
  MainTabs: undefined;
  ConversationDetail: { leadId: string };
};

export type TabParamList = {
  Home: undefined;
  Leads: undefined;
  Escalations: undefined;
  Followups: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

// Simple Tab Bar Icon Helper
const TabBarIcon = ({ label, focused }: { label: string; focused: boolean }) => {
  return (
    <View style={styles.iconContainer}>
      <Text style={[
        styles.iconText, 
        { color: focused ? theme.colors.primary : theme.colors.textSecondary }
      ]}>
        {label}
      </Text>
    </View>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          color: theme.colors.textPrimary,
          fontWeight: '700',
          fontSize: theme.typography.sizes.lg,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={DashboardScreen}
        options={{
          title: "Closira HQ",
          tabBarLabel: "Home",
          tabBarIcon: ({ focused }) => <TabBarIcon label="⌂" focused={focused} />,
        }}
      />
      <Tab.Screen 
        name="Leads" 
        component={LeadsScreen}
        options={{
          title: "Inbound Leads",
          tabBarLabel: "Leads",
          tabBarIcon: ({ focused }) => <TabBarIcon label="⚡" focused={focused} />,
        }}
      />
      <Tab.Screen 
        name="Escalations" 
        component={EscalationsScreen}
        options={{
          title: "Urgent Escalations",
          tabBarLabel: "Escalations",
          tabBarIcon: ({ focused }) => <TabBarIcon label="⚠️" focused={focused} />,
        }}
      />
      <Tab.Screen 
        name="Followups" 
        component={FollowupsScreen}
        options={{
          title: "Scheduled Tasks",
          tabBarLabel: "Tasks",
          tabBarIcon: ({ focused }) => <TabBarIcon label="📅" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.surface,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTitleStyle: {
            color: theme.colors.textPrimary,
            fontWeight: '700',
          },
          headerTintColor: theme.colors.primary,
          cardStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen 
          name="MainTabs" 
          component={TabNavigator} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ConversationDetail" 
          component={ConversationDetailScreen} 
          options={{ title: "Conversation Audit" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 22,
    fontWeight: '800',
  },
});
