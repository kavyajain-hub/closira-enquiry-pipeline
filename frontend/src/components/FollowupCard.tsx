import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../styles/theme';
import { ChannelBadge } from './ChannelBadge';
import { FollowUp } from '../mock/data';

interface FollowupCardProps {
  task: FollowUp;
  onComplete: () => void;
}

export const FollowupCard: React.FC<FollowupCardProps> = ({ task, onComplete }) => {
  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.name}>{task.customerName}</Text>
          <Text style={styles.dueTime}>Due: {formatDueDate(task.dueTime)}</Text>
        </View>
        <ChannelBadge channel={task.channel} />
      </View>

      <View style={styles.previewContainer}>
        <Text style={styles.previewLabel}>Message Preview:</Text>
        <Text style={styles.previewText} numberOfLines={2}>
          "{task.messagePreview}"
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.doneButton} 
        onPress={onComplete}
        activeOpacity={0.8}
      >
        <Text style={styles.doneText}>✓ Mark as Completed</Text>
      </TouchableOpacity>
    </View>
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
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  name: {
    fontSize: theme.typography.sizes.md,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  dueTime: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  previewContainer: {
    backgroundColor: theme.colors.card + '50',
    padding: theme.spacing.md,
    borderRadius: theme.roundness.sm,
    borderWidth: 1,
    borderColor: theme.colors.border + '50',
    marginBottom: theme.spacing.md,
  },
  previewLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  previewText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  doneButton: {
    backgroundColor: theme.colors.primary + '15',
    borderWidth: 1,
    borderColor: theme.colors.primary + '40',
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    borderRadius: theme.roundness.md,
  },
  doneText: {
    color: theme.colors.primary,
    fontWeight: '700',
    fontSize: theme.typography.sizes.sm,
  },
});
