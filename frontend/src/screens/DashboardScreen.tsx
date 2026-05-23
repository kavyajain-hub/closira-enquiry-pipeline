import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { theme } from '../styles/theme';
import { StatCard } from '../components/StatCard';
import { LeadCard } from '../components/LeadCard';
import { mockStats, mockLeads } from '../mock/data';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;

export const DashboardScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [leads, setLeads] = useState(mockLeads);
  const [stats, setStats] = useState(mockStats);

  const simulateNewLead = () => {
    const names = ["Oliver Thorne", "Amara Okafor", "Kenji Sato", "Sofia Rossi"];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const channels: ('whatsapp' | 'email' | 'call')[] = ["whatsapp", "email", "call"];
    const randomChannel = channels[Math.floor(Math.random() * channels.length)];
    
    const newLead = {
      id: `enq_${Date.now()}`,
      customerName: randomName,
      channel: randomChannel,
      status: "new" as const,
      receivedAt: new Date().toISOString(),
      message: "Hey Closira! I saw your service online. Can you share catalog costs or book a consultation tomorrow?",
      summary: "Simulated new inbound qualifying query.",
      timeline: [
        { event: "Enquiry Created", timestamp: new Date().toISOString(), notes: "Inbound log simulated via control dashboard." }
      ]
    };

    setLeads([newLead, ...leads]);
    setStats({
      ...stats,
      totalLeadsToday: stats.totalLeadsToday + 1,
    });
    
    Alert.alert("Prototype Notification", `Simulated new inbound ${randomChannel} lead from ${randomName}!`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Welcome Title */}
      <View style={styles.header}>
        <Text style={styles.title}>Welcome back, Closira HQ</Text>
        <Text style={styles.subtitle}>Here is your communication dashboard metrics today.</Text>
      </View>

      {/* Metrics Row Grid */}
      <View style={styles.statsGrid}>
        <StatCard label="Total Leads Today" value={stats.totalLeadsToday} accentColor={theme.colors.primary} />
        <StatCard label="Missed Enquiries" value={stats.missedEnquiries} accentColor={theme.colors.call} />
        <StatCard label="Open Escalations" value={stats.openEscalations} accentColor={theme.colors.escalated} />
        <StatCard label="Follow-ups Due" value={stats.followupsDue} accentColor={theme.colors.accent} />
      </View>

      {/* Quick Action Shortcuts */}
      <Text style={styles.sectionTitle}>Dashboard Control Simulator</Text>
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={simulateNewLead}>
          <Text style={styles.actionButtonText}>⚡ Simulate New Lead</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { borderColor: theme.colors.escalated + '50' }]} onPress={() => Alert.alert("Trigger Simulated Alert", "Triggering push notifications mock.")}>
          <Text style={[styles.actionButtonText, { color: theme.colors.escalated }]}>⚠️ Trigger Mock Alert</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Feed */}
      <Text style={styles.sectionTitle}>Recent Activity Feed</Text>
      {leads.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No recent activity found.</Text>
        </View>
      ) : (
        leads.slice(0, 3).map((lead) => (
          <LeadCard 
            key={lead.id} 
            lead={lead} 
            onPress={() => navigation.navigate('ConversationDetail', { leadId: lead.id })}
          />
        ))
      )}
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
  header: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  actionButton: {
    flex: 0.48,
    borderWidth: 1,
    borderColor: theme.colors.primary + '50',
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    borderRadius: theme.roundness.md,
    backgroundColor: theme.colors.surface,
  },
  actionButtonText: {
    color: theme.colors.primary,
    fontWeight: '700',
    fontSize: theme.typography.sizes.sm,
  },
  emptyContainer: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xxl,
    borderRadius: theme.roundness.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.md,
  },
});
