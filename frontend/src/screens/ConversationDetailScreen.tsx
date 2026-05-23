import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from '../styles/theme';
import { mockLeads } from '../mock/data';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { ChannelBadge } from '../components/ChannelBadge';
import { StatusBadge } from '../components/StatusBadge';

type RoutePropType = RouteProp<RootStackParamList, 'ConversationDetail'>;

export const ConversationDetailScreen = () => {
  const route = useRoute<RoutePropType>();
  const navigation = useNavigation();
  const { leadId } = route.params;

  const lead = mockLeads.find((l) => l.id === leadId);

  if (!lead) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Enquiry details not found.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Customer Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{lead.customerName}</Text>
          <StatusBadge status={lead.status} />
        </View>
        <View style={styles.headerBadges}>
          <ChannelBadge channel={lead.channel} />
          <Text style={styles.leadId}>{lead.id}</Text>
        </View>
      </View>

      {/* Conversation Thread */}
      <Text style={styles.sectionTitle}>Conversation Audit Log</Text>
      <View style={styles.threadContainer}>
        {/* Customer Inbound Bubble */}
        <View style={styles.bubbleCustomer}>
          <Text style={styles.bubbleAuthor}>{lead.customerName} (Inbound)</Text>
          <Text style={styles.bubbleText}>{lead.message}</Text>
          <Text style={styles.bubbleTime}>
            {new Date(lead.receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>

        {/* Suggested Response (if matched) */}
        {lead.suggestedResponse && (
          <View style={styles.bubbleSystem}>
            <Text style={styles.bubbleSystemAuthor}>AI Copilot (Suggested response)</Text>
            <Text style={styles.bubbleSystemText}>{lead.suggestedResponse}</Text>
            <View style={styles.badgeSop}>
              <Text style={styles.badgeSopText}>Matched: {lead.matchedSop}</Text>
            </View>
          </View>
        )}
      </View>

      {/* AI Summary Box */}
      {lead.summary && (
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>🧠 AI Intent Analysis Summary</Text>
          <Text style={styles.summaryText}>{lead.summary}</Text>
        </View>
      )}

      {/* Audit Status Timeline */}
      <Text style={styles.sectionTitle}>Status History Audit Timeline</Text>
      <View style={styles.timelineContainer}>
        {lead.timeline.map((event, index) => {
          const isLast = index === lead.timeline.length - 1;
          const formattedTime = new Date(event.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });

          return (
            <View key={index} style={styles.timelineItem}>
              {/* Vertical line connector */}
              <View style={styles.timelineLeft}>
                <View style={[styles.timelineDot, index === 0 && styles.timelineDotActive]} />
                {!isLast && <View style={styles.timelineLine} />}
              </View>
              
              <View style={styles.timelineRight}>
                <View style={styles.timelineMeta}>
                  <Text style={styles.timelineEvent}>{event.event}</Text>
                  <Text style={styles.timelineTime}>{formattedTime}</Text>
                </View>
                <Text style={styles.timelineNotes}>{event.notes}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  errorText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.md,
    marginBottom: theme.spacing.lg,
  },
  backButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.roundness.md,
  },
  backText: {
    color: '#000000',
    fontWeight: '700',
  },
  header: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.roundness.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  name: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  headerBadges: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  leadId: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontFamily: 'monospace',
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  threadContainer: {
    marginBottom: theme.spacing.xl,
  },
  bubbleCustomer: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    borderRadius: theme.roundness.md,
    borderTopLeftRadius: 0,
    alignSelf: 'flex-start',
    maxWidth: '85%',
    marginBottom: theme.spacing.md,
  },
  bubbleAuthor: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  bubbleText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textPrimary,
    lineHeight: 20,
  },
  bubbleTime: {
    fontSize: 9,
    color: theme.colors.textMuted,
    textAlign: 'right',
    marginTop: 4,
  },
  bubbleSystem: {
    backgroundColor: theme.colors.primary + '10',
    borderWidth: 1,
    borderColor: theme.colors.primary + '30',
    padding: theme.spacing.md,
    borderRadius: theme.roundness.md,
    borderTopRightRadius: 0,
    alignSelf: 'flex-end',
    maxWidth: '85%',
  },
  bubbleSystemAuthor: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.accent,
    marginBottom: 4,
  },
  bubbleSystemText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textPrimary,
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  badgeSop: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.roundness.sm,
    alignSelf: 'flex-start',
  },
  badgeSopText: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  summaryBox: {
    backgroundColor: '#1E1B4B', // indigo 950 base
    borderWidth: 1,
    borderColor: '#312E81',     // indigo 900 border
    padding: theme.spacing.lg,
    borderRadius: theme.roundness.md,
    marginBottom: theme.spacing.xl,
  },
  summaryTitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '700',
    color: '#A5B4FC',           // indigo 300
    marginBottom: 6,
  },
  summaryText: {
    fontSize: theme.typography.sizes.sm,
    color: '#E0E7FF',           // indigo 100
    lineHeight: 20,
  },
  timelineContainer: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.roundness.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.textMuted,
    zIndex: 2,
  },
  timelineDotActive: {
    backgroundColor: theme.colors.primary,
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: theme.colors.border,
    marginTop: 4,
    marginBottom: -16,
  },
  timelineRight: {
    flex: 1,
  },
  timelineMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  timelineEvent: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  timelineTime: {
    fontSize: 10,
    color: theme.colors.textMuted,
  },
  timelineNotes: {
    fontSize: theme.typography.sizes.xs + 1,
    color: theme.colors.textSecondary,
    lineHeight: 16,
  },
});
