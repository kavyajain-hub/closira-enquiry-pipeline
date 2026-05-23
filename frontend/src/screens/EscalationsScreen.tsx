import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { theme } from '../styles/theme';
import { EscalationCard } from '../components/EscalationCard';
import { mockLeads, Lead } from '../mock/data';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;

export const EscalationsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [escalations, setEscalations] = useState<Lead[]>(
    mockLeads.filter((lead) => lead.status === 'escalated')
  );

  const resolveEscalation = (id: string, name: string) => {
    setEscalations(escalations.filter((esc) => esc.id !== id));
    Alert.alert(
      "Escalation Resolved",
      `Successfully marked ${name}'s escalation as resolved. Auto-notifying customer.`,
      [{ text: "OK" }]
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🎉</Text>
      <Text style={styles.emptyTitle}>All Clear!</Text>
      <Text style={styles.emptySubtitle}>
        There are currently no active escalations requiring manual action. Your Closira AI assistant is handling things smoothly!
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.infoBar}>
        <Text style={styles.infoText}>
          ⚠️ {escalations.length} Active {escalations.length === 1 ? 'Escalation' : 'Escalations'} requiring review
        </Text>
      </View>

      <FlatList
        data={escalations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <EscalationCard
            lead={item}
            onResolve={() => resolveEscalation(item.id, item.customerName)}
            onPress={() => navigation.navigate('ConversationDetail', { leadId: item.id })}
          />
        )}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  infoBar: {
    backgroundColor: theme.colors.urgencyHigh + '15',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.urgencyHigh + '30',
  },
  infoText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.urgencyHigh,
    fontWeight: '700',
    textAlign: 'center',
  },
  listContent: {
    padding: theme.spacing.lg,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xxl,
    marginTop: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: theme.spacing.md,
  },
  emptyTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '800',
    color: theme.colors.whatsapp, // emerald celebration color
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
