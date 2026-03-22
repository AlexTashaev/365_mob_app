import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Share,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Entry, getEntry } from '../data';
import { MONTHS } from '../data/months';
import { colors, fonts, spacing } from '../utils/theme';
import {
  makeKey,
  toggleBookmark,
  isBookmarked,
  saveLastRead,
} from '../utils/bookmarks';

interface Props {
  route: any;
  navigation: any;
}

export default function DailyScreen({ route, navigation }: Props) {
  const { month, day } = route.params;
  const [entry, setEntry] = useState<Entry | undefined>();
  const [bookmarked, setBookmarked] = useState(false);
  const monthInfo = MONTHS.find(m => m.name === month);

  useEffect(() => {
    const e = getEntry(month, day);
    setEntry(e);
    if (e) {
      navigation.setOptions({
        title: `${day} ${month}`,
      });
      saveLastRead(month, day);
    }
  }, [month, day]);

  useFocusEffect(
    useCallback(() => {
      isBookmarked(makeKey(month, day)).then(setBookmarked);
    }, [month, day])
  );

  const handleBookmark = async () => {
    const result = await toggleBookmark(makeKey(month, day));
    setBookmarked(result);
  };

  const handleShare = async () => {
    if (!entry) return;
    const text = `${day} ${month} — ${entry.title}\n\nЛуч света:\n${entry.light}\n\nМудрость дня:\n${entry.wisdom}${entry.prayer ? `\n\nМолитва:\n${entry.prayer}` : ''}\n\n— 365 молитв`;
    await Share.share({ message: text });
  };

  const handlePrev = () => {
    if (day > 1) {
      navigation.setParams({ day: day - 1 });
    } else {
      const idx = MONTHS.findIndex(m => m.name === month);
      if (idx > 0) {
        const prevMonth = MONTHS[idx - 1];
        navigation.setParams({ month: prevMonth.name, day: prevMonth.days });
      }
    }
  };

  const handleNext = () => {
    const maxDay = monthInfo?.days || 30;
    if (day < maxDay) {
      navigation.setParams({ day: day + 1 });
    } else {
      const idx = MONTHS.findIndex(m => m.name === month);
      if (idx < MONTHS.length - 1) {
        navigation.setParams({ month: MONTHS[idx + 1].name, day: 1 });
      }
    }
  };

  if (!entry) {
    return (
      <View style={styles.center}>
        <Text style={fonts.body}>Запись не найдена</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: monthInfo?.color || colors.primary }]}>
          <Text style={styles.headerDay}>{day}</Text>
          <Text style={styles.headerMonth}>{month}</Text>
          {monthInfo && <Text style={styles.headerHe}>{monthInfo.nameHe}</Text>}
        </View>

        {/* Title */}
        <Text style={styles.title}>{entry.title.replace(/\n/g, ' ')}</Text>

        {/* Light Section */}
        {entry.light ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>✦</Text>
              <Text style={styles.sectionTitle}>Луч света</Text>
            </View>
            <Text style={styles.sectionText}>{entry.light}</Text>
          </View>
        ) : null}

        {/* Wisdom Section */}
        {entry.wisdom ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>◆</Text>
              <Text style={styles.sectionTitle}>Мудрость дня</Text>
            </View>
            <Text style={styles.sectionText}>{entry.wisdom}</Text>
          </View>
        ) : null}

        {/* Prayer Section */}
        {entry.prayer ? (
          <View style={[styles.section, styles.prayerSection]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>❖</Text>
              <Text style={styles.sectionTitle}>Молитва</Text>
            </View>
            <Text style={[styles.sectionText, styles.prayerText]}>{entry.prayer}</Text>
          </View>
        ) : null}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={handlePrev} style={styles.navButton}>
          <Text style={styles.navButtonText}>‹ Назад</Text>
        </TouchableOpacity>

        <View style={styles.bottomActions}>
          <TouchableOpacity onPress={handleBookmark} style={styles.actionButton}>
            <Text style={[styles.actionIcon, bookmarked && styles.bookmarkedIcon]}>
              {bookmarked ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
            <Text style={styles.actionIcon}>↗</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleNext} style={styles.navButton}>
          <Text style={styles.navButtonText}>Вперед ›</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  header: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  headerDay: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.textLight,
  },
  headerMonth: {
    fontSize: 20,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginTop: spacing.xs,
  },
  headerHe: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.7)',
    marginTop: spacing.xs,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  section: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionIcon: {
    fontSize: 16,
    color: colors.accent,
    marginRight: spacing.sm,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionText: {
    ...fonts.body,
    color: colors.text,
  },
  prayerSection: {
    backgroundColor: '#FFF8E1',
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  prayerText: {
    fontStyle: 'italic',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  navButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  navButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  bottomActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    padding: spacing.sm,
  },
  actionIcon: {
    fontSize: 24,
    color: colors.textSecondary,
  },
  bookmarkedIcon: {
    color: colors.bookmark,
  },
});
