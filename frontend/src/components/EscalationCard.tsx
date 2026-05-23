import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../styles/theme';
import { ChannelBadge } from './ChannelBadge';
import { Lead } from '../mock/data';

interface EscalationCardProps {
  lead: Lead;
  onResolve: () => void;
  onPress: () => void;
}

export const EscalationCard: React.FC<EscalationCardProps> = ({ lead, onResolve, onPress }) => {
  const isHighUrgency = lead.urgency === 'high';
  const urgencyColor = isHighUrgency ? theme.colors.urgencyHigh : theme.colors.urgencyMedium;

  return (
    <TouchableOpacity style={[
      styles.card, 
      { borderColor: isHighUrgency ? theme.colors.urgencyHigh + '40' : theme.colors.border }
    ]} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.name}>{lead.customerName}</Text>
          <View style={[styles.urgencyBadge, { backgroundColor: urgencyColor + '15' }]}>
            <Text style={[styles.urgencyText, { color: urgencyColor }]}>
              {lead.urgency?.toUpperCase()} URGENCY
            </Text>
          </View>
        </View>
        <ChannelBadge channel={lead.channel} />
      </View>

      <Text style={styles.reasonLabel}>Escalation Reason:</Text>
      <Text style={styles.reasonText}>{lead.escalationReason || 'Unknown exception.'}</Text>
      
      {lead.summary && (
        <>
          <Text style={styles.reasonLabel}>AI Summary:</Text>
          <Text style={styles.summaryText} numberOfLines={2}>{lead.summary}</Text>
        </>
      )}

      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={[styles.resolveButton, { backgroundColor: theme.colors.whatsapp }]} 
          onPress={onResolve}
        >
          <Text style={styles.resolveButtonText}>Mark Resolved</Text>
        </TouchableOpacity>
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
    marginBottom: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  headerLeft: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  name: {
    fontSize: theme.typography.sizes.md,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  urgencyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.roundness.sm,
    alignSelf: 'flex-start',
  },
  urgencyText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  reasonLabel: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: '600',
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  reasonText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
    lineHeight: 18,
  },
  summaryText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 18,
    marginBottom: theme.spacing.md,
  },
  actionContainer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
    alignItems: 'flex-end',
  },
  resolveButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.roundness.md,
  },
  resolveButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: theme.typography.sizes.sm,
  },
});
