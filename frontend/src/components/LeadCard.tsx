import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../styles/theme';
import { ChannelBadge } from './ChannelBadge';
import { StatusBadge } from './StatusBadge';
import { Lead } from '../mock/data';

interface LeadCardProps {
  lead: Lead;
  onPress: () => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead, onPress }) => {
  const formattedTime = new Date(lead.receivedAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.name}>{lead.customerName}</Text>
        <Text style={styles.time}>{formattedTime}</Text>
      </View>
      
      <Text style={styles.message} numberOfLines={2}>
        {lead.message}
      </Text>
      
      <View style={styles.footer}>
        <ChannelBadge channel={lead.channel} />
        <StatusBadge status={lead.status} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.roundness.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  name: {
    fontSize: theme.typography.sizes.md,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  time: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textMuted,
  },
  message: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
