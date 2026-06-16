import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ResearchItem } from '../api/client';
import { Colors } from '../theme/colors';

const STATUS_COLORS: Record<ResearchItem['status'], string> = {
  active: Colors.success,
  completed: Colors.primary,
  pending: Colors.warning,
  archived: Colors.textDisabled,
};

interface Props {
  item: ResearchItem;
  onPress: (item: ResearchItem) => void;
}

export function ResearchCard({ item, onPress }: Props) {
  const statusColor = STATUS_COLORS[item.status];

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)} activeOpacity={0.8}>
      <View style={styles.header}>
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
        <Text style={[styles.status, { color: statusColor }]}>{item.status.toUpperCase()}</Text>
        <Text style={styles.category}>{item.category}</Text>
      </View>

      <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.description} numberOfLines={2}>{item.description}</Text>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${item.progress}%`, backgroundColor: statusColor }]} />
        </View>
        <Text style={styles.progressText}>{item.progress}%</Text>
      </View>

      <Text style={styles.date}>Updated {item.updated_at}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  status: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    flex: 1,
  },
  category: {
    fontSize: 11,
    color: Colors.textSecondary,
    backgroundColor: Colors.background,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 6,
    lineHeight: 22,
  },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.divider,
    borderRadius: 3,
    marginRight: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    width: 36,
    textAlign: 'right',
  },
  date: {
    fontSize: 11,
    color: Colors.textDisabled,
  },
});
