import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { theme } from '../styles/theme';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
  accentColor?: string;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - theme.spacing.lg * 3) / 2; // Two columns grid

export const StatCard: React.FC<StatCardProps> = ({ label, value, accentColor = theme.colors.primary }) => {
  return (
    <View style={styles.card}>
      <View style={[styles.indicator, { backgroundColor: accentColor }]} />
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label} numberOfLines={2}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.roundness.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
    position: 'relative',
    overflow: 'hidden',
  },
  indicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  value: {
    fontSize: theme.typography.sizes.xxl,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  label: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '500',
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
});
