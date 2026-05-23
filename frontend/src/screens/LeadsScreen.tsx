import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { theme } from '../styles/theme';
import { LeadCard } from '../components/LeadCard';
import { mockLeads, Lead } from '../mock/data';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;

export const LeadsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [activeFilter, setActiveFilter] = useState<'all' | 'new' | 'qualified' | 'escalated'>('all');

  const filteredLeads = leads.filter((lead) => {
    if (activeFilter === 'all') return true;
    return lead.status === activeFilter;
  });

  const clearAllLeadsForDemo = () => {
    setLeads([]);
  };

  const reloadMockLeads = () => {
    setLeads(mockLeads);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📭</Text>
      <Text style={styles.emptyTitle}>No Leads Found</Text>
      <Text style={styles.emptySubtitle}>
        There are currently no inbound customer enquiries matching the "{activeFilter}" status filter.
      </Text>
      {leads.length === 0 ? (
        <TouchableOpacity style={styles.reloadButton} onPress={reloadMockLeads}>
          <Text style={styles.reloadButtonText}>Reload Prototype Data</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Top Filter Tabs */}
      <View style={styles.filterBar}>
        {(['all', 'new', 'qualified', 'escalated'] as const).map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterTab,
              activeFilter === filter && styles.activeFilterTab
            ]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text style={[
              styles.filterText,
              activeFilter === filter && styles.activeFilterText
            ]}>
              {filter.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Demo Controls */}
      <View style={styles.demoBar}>
        <Text style={styles.demoTitle}>Interactive Controls:</Text>
        <TouchableOpacity onPress={clearAllLeadsForDemo}>
          <Text style={styles.demoAction}>Empty State Demo</Text>
        </TouchableOpacity>
      </View>

      {/* Leads List */}
      <FlatList
        data={filteredLeads}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <LeadCard
            lead={item}
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
  filterBar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    justifyContent: 'space-between',
  },
  filterTab: {
    paddingVertical: theme.spacing.xs + 2,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.roundness.full,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeFilterTab: {
    backgroundColor: theme.colors.primary + '15',
    borderColor: theme.colors.primary + '40',
  },
  filterText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    letterSpacing: 0.5,
  },
  activeFilterText: {
    color: theme.colors.primary,
  },
  demoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.surface + '80',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  demoTitle: {
    fontSize: 10,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  demoAction: {
    fontSize: 10,
    color: theme.colors.accent,
    fontWeight: '700',
    textDecorationLine: 'underline',
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
    marginTop: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: theme.spacing.md,
  },
  emptyTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: theme.spacing.xl,
  },
  reloadButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.roundness.md,
  },
  reloadButtonText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: theme.typography.sizes.sm,
  },
});
