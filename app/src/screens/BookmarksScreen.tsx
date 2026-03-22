import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getEntry, Entry } from '../data';
import { MONTHS } from '../data/months';
import { colors, fonts, spacing } from '../utils/theme';
import { getBookmarks, BookmarkKey } from '../utils/bookmarks';

interface Props {
  navigation: any;
}

export default function BookmarksScreen({ navigation }: Props) {
  const [entries, setEntries] = useState<Entry[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadBookmarks();
    }, [])
  );

  const loadBookmarks = async () => {
    const bookmarks = await getBookmarks();
    const bookmarkedEntries: Entry[] = [];
    bookmarks.forEach((key: BookmarkKey) => {
      const [month, dayStr] = key.split(':');
      const entry = getEntry(month, parseInt(dayStr, 10));
      if (entry) bookmarkedEntries.push(entry);
    });
    // Sort by month order then day
    bookmarkedEntries.sort((a, b) => {
      const aIdx = MONTHS.findIndex(m => m.name === a.month);
      const bIdx = MONTHS.findIndex(m => m.name === b.month);
      if (aIdx !== bIdx) return aIdx - bIdx;
      return a.day - b.day;
    });
    setEntries(bookmarkedEntries);
  };

  const handlePress = (entry: Entry) => {
    navigation.navigate('Календарь', {
      screen: 'Daily',
      params: { month: entry.month, day: entry.day },
    });
  };

  if (entries.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>☆</Text>
        <Text style={styles.emptyTitle}>Нет закладок</Text>
        <Text style={styles.emptyText}>
          Нажмите ★ на странице дня, чтобы добавить закладку
        </Text>
      </View>
    );
  }

  const renderEntry = ({ item }: { item: Entry }) => {
    const monthInfo = MONTHS.find(m => m.name === item.month);
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handlePress(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.badge, { backgroundColor: monthInfo?.color || colors.primary }]}>
          <Text style={styles.badgeDay}>{item.day}</Text>
          <Text style={styles.badgeMonth}>{item.month}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title.replace(/\n/g, ' ')}
          </Text>
          <Text style={styles.cardPreview} numberOfLines={2}>
            {item.light?.substring(0, 120)}...
          </Text>
        </View>
        <Text style={styles.star}>★</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={entries}
        renderItem={renderEntry}
        keyExtractor={item => `${item.month}-${item.day}`}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.md,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  emptyIcon: {
    fontSize: 64,
    color: colors.divider,
  },
  emptyTitle: {
    ...fonts.titleMedium,
    marginTop: spacing.md,
  },
  emptyText: {
    ...fonts.bodySmall,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 10,
    marginBottom: spacing.sm,
    padding: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  badge: {
    width: 56,
    borderRadius: 8,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  badgeDay: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textLight,
  },
  badgeMonth: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  cardInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  cardTitle: {
    ...fonts.titleSmall,
    fontSize: 15,
  },
  cardPreview: {
    ...fonts.caption,
    marginTop: 2,
  },
  star: {
    fontSize: 20,
    color: colors.bookmark,
    marginLeft: spacing.sm,
  },
});
