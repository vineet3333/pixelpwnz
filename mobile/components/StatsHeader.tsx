import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, Radii } from '../constants/theme';

interface StatsHeaderProps {
  userName: string;
  pairCount: number;
}

export default function StatsHeader({ userName, pairCount }: StatsHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Conversing as <Text style={styles.userName}>{userName}</Text>
      </Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>
          {pairCount} {pairCount === 1 ? 'memory' : 'memories'} loaded
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  title: {
    ...Typography.body,
    color: Colors.textSecondary,
    flexShrink: 1,
  },
  userName: {
    color: Colors.text,
    fontWeight: '600',
  },
  badge: {
    backgroundColor: 'rgba(139,92,246,0.12)',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: Radii.button,
    marginLeft: Spacing.sm,
  },
  badgeText: {
    ...Typography.small,
    color: Colors.primarySolid,
  },
});
