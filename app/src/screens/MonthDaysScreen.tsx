import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getEntriesByMonth, Entry } from '../data';
import { MONTHS } from '../data/months';
import { colors, fonts, spacing } from '../utils/theme';
import { getBookmarks, makeKey, BookmarkKey } from '../utils/bookmarks';

interface Props {
  route: any;
  navigation: any;
}

export default function MonthDaysScreen({ route, navigation }: Props) {
  const { month } = route.params;
  const monthInfo = MONTHS.find(m => m.name === month);
  const entries = getEntriesByMonth(month);
  const [bookmarks, setBookmarks] = useState<Set<BookmarkKey>>(new Set());

  useFocusEffect(
    useCallback(() => {
      getBookmarks().then(setBookmarks);
    }, [])
  );

  React.useEffect(() => {
    navigation.setOptions({
      title: `${month} ${monthInfo?.nameHe || ''}`,
    });
  }, [month]);

  const handleDayPress = (entry: Entry) => {
    navigation.navigate('Daily', { month: entry.month, day: entry.day });
  };

  const renderEntry = ({ item }: { item: Entry }) => {
    const isBookmarked = bookmarks.has(makeKey(item.month, item.day));
    return (
      <TouchableOpacity
        style={styles.dayCard}
        onPress={() => handleDayPress(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.dayNumber, { backgroundColor: monthInfo?.color || colors.primary }]}>
          <Text style={styles.dayNumberText}>{item.day}</Text>
        </View>
        <View style={styles.dayInfo}>
          <Text style={styles.dayTitle} numberOfLines={1}>
            {item.title.replace(/\n/g, ' ')}
          </Text>
          <Text style={styles.dayPreview} numberOfLines={2}>
            {item.light?.substring(0, 100)}...
          </Text>
        </View>
        {isBookmarked && <Text style={styles.bookmarkIcon}>★</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Month Header */}
      <View style={[styles.header, { backgroundColor: monthInfo?.color || colors.primary }]}>
        <Text style={styles.headerName}>{month}</Text>
        <Text style={styles.headerHe}>{monthInfo?.nameHe}</Text>
        <Text style={styles.headerDesc}>{monthInfo?.description}</Text>
      </View>

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
  header: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  headerName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textLight,
  },
  headerHe: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.8)',
    marginTop: spacing.xs,
  },
  headerDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  list: {
    padding: spacing.md,
  },
  dayCard: {
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
  dayNumber: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayNumberText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textLight,
  },
  dayInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  dayTitle: {
    ...fonts.titleSmall,
    fontSize: 15,
  },
  dayPreview: {
    ...fonts.caption,
    marginTop: 2,
  },
  bookmarkIcon: {
    fontSize: 18,
    color: colors.bookmark,
    marginLeft: spacing.sm,
  },
});
