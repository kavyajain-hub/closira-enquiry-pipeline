import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { theme } from '../styles/theme';
import { FollowupCard } from '../components/FollowupCard';
import { mockFollowups, FollowUp } from '../mock/data';

export const FollowupsScreen = () => {
  const [tasks, setTasks] = useState<FollowUp[]>(
    mockFollowups.filter((task) => !task.completed)
  );

  const completeTask = (id: string, name: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
    Alert.alert(
      "Task Completed",
      `Follow-up message sent successfully to ${name}.`,
      [{ text: "Great!" }]
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🎯</Text>
      <Text style={styles.emptyTitle}>All Tasks Completed!</Text>
      <Text style={styles.emptySubtitle}>
        Great job! There are no outstanding follow-up actions scheduled for today. All customer communications are fully satisfied.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.infoBar}>
        <Text style={styles.infoText}>
          📅 {tasks.length} {tasks.length === 1 ? 'Follow-up Task' : 'Follow-up Tasks'} pending today
        </Text>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <FollowupCard
            task={item}
            onComplete={() => completeTask(item.id, item.customerName)}
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
    backgroundColor: theme.colors.accent + '15',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.accent + '30',
  },
  infoText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.accent,
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
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
