import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radii } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MOCK_PERSONAS = [
  { id: '1', title: 'Elon Musk', sub: 'CEO of Tesla, SpaceX', author: '@techvisionary', interactions: '4.2m', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80' },
  { id: '2', title: 'Naruto Uzumaki', sub: 'Believe it! Ninja of the Leaf', author: '@animefan99', interactions: '8.5m', image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80' },
  { id: '3', title: 'Iron Man', sub: 'Genius, billionaire, playboy...', author: '@starkindustries', interactions: '6.1m', image: 'https://images.unsplash.com/photo-1634828221818-503587f19d4d?w=400&q=80' },
  { id: '4', title: 'Cristiano Ronaldo', sub: 'Siuuuu! Legend of football.', author: '@cr7fanclub', interactions: '12.6m', image: 'https://images.unsplash.com/photo-1508344928928-7157b87de1ce?w=400&q=80' },
];

export default function DiscoverScreen() {
  const [activeTab, setActiveTab] = useState('Explore');
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header & Search */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerLogo}>(c.ai)</Text>
          <View style={styles.headerRight}>
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>Get (c.ai+)</Text>
            </View>
            <Feather name="plus-square" size={24} color={Colors.text} style={{ marginHorizontal: 16 }} />
            <Feather name="bell" size={24} color={Colors.text} />
          </View>
        </View>
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color={Colors.textMuted} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search characters"
            placeholderTextColor={Colors.textMuted}
          />
        </View>
      </View>

      {/* Pills */}
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsContainer}>
          {['For You', 'Following', 'Trending', 'Scenarios'].map((tab) => (
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
        </ScrollView>
      </View>

      {/* Grid */}
      <FlatList
        data={MOCK_PERSONAS}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('Chat')}
          >
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.cardSub} numberOfLines={2}>{item.sub}</Text>
              <View style={styles.cardFooter}>
                <Feather name="message-square" size={12} color={Colors.textMuted} />
                <Text style={styles.cardInteractions}>{item.interactions}</Text>
                <Text style={styles.cardAuthor} numberOfLines={1}>{item.author}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bg },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  headerLogo: {
    ...Typography.h2,
    color: Colors.text,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumBadge: {
    backgroundColor: Colors.primarySolid,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  premiumText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.glass.bg,
    borderRadius: 20,
    paddingHorizontal: Spacing.md,
    height: 40,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: Colors.text,
    fontSize: 16,
  },
  pillsContainer: {
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
    paddingBottom: 100, // Space for bottom tab bar
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    marginBottom: Spacing.lg,
    borderRadius: Radii.lg,
    backgroundColor: Colors.bg,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 180,
    borderRadius: Radii.lg,
  },
  cardInfo: {
    paddingTop: 8,
  },
  cardTitle: {
    ...Typography.body,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 6,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardInteractions: {
    fontSize: 11,
    color: Colors.textMuted,
    marginLeft: 4,
    marginRight: 8,
  },
  cardAuthor: {
    fontSize: 11,
    color: Colors.textMuted,
    flex: 1,
  },
});
