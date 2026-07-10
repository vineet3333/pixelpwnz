import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radii } from '../constants/theme';
import { useAppNavigation } from '../store/hooks'; // I need to import standard navigation, let's use useNavigation
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MOCK_CHATS = [
  { id: '1', name: 'ur latina bsf', image: 'https://i.pravatar.cc/150?img=1' },
];

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('Recent Chats');
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitleActive}>Chats</Text>
          <Text style={styles.headerTitleInactive}>Gallery</Text>
        </View>
        <View style={styles.headerRight}>
          <Feather name="search" size={24} color={Colors.text} style={{ marginRight: 16 }} />
          <Feather name="bell" size={24} color={Colors.text} />
        </View>
      </View>

      {/* Pills */}
      <View style={styles.pillsContainer}>
        {['Recent Chats', 'Liked', 'Mine'].map((tab) => (
          <TouchableOpacity 
            key={tab}
            style={[styles.pill, activeTab === tab && styles.pillActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.pillText, activeTab === tab && styles.pillTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={MOCK_CHATS}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.chatItem}
            onPress={() => navigation.navigate('Chat')}
          >
            <Image source={{ uri: item.image }} style={styles.avatar} />
            <Text style={styles.chatName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No chats yet</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 16,
  },
  headerTitleActive: {
    ...Typography.h2,
    color: Colors.text,
  },
  headerTitleInactive: {
    ...Typography.h2,
    color: Colors.textMuted,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pillsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pillActive: {
    backgroundColor: Colors.text,
    borderColor: Colors.text,
  },
  pillText: {
    ...Typography.body,
    color: Colors.textMuted,
  },
  pillTextActive: {
    color: Colors.bg,
    fontWeight: 'bold',
  },
  listContent: {
    padding: Spacing.lg,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 16,
    marginRight: Spacing.md,
  },
  chatName: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyStateText: {
    ...Typography.body,
    color: Colors.textMuted,
  }
});
