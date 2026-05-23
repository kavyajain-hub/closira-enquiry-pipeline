import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

interface StatusBadgeProps {
  status: 'new' | 'qualified' | 'escalated';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'new':
        return {
          bg: theme.colors.new + '20',
          text: theme.colors.new,
          label: 'New'
        };
      case 'qualified':
        return {
          bg: theme.colors.qualified + '20',
          text: theme.colors.qualified,
          label: 'Qualified'
        };
      case 'escalated':
        return {
          bg: theme.colors.escalated + '20',
          text: theme.colors.escalated,
          label: 'Escalated'
        };
    }
  };

  const config = getBadgeStyle();

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <View style={[styles.dot, { backgroundColor: config.text }]} />
      <Text style={[styles.text, { color: config.text }]}>{config.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.roundness.full,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  text: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: '600',
  },
});
