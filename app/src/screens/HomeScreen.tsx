import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { entries, Entry, getEntry } from '../data';
import { MONTHS } from '../data/months';
import { colors, fonts, spacing } from '../utils/theme';
import { getLastRead } from '../utils/bookmarks';

interface Props {
  navigation: any;
}

export default function HomeScreen({ navigation }: Props) {
  const [lastRead, setLastRead] = useState<{ month: string; day: number } | null>(null);
  const todayEntry = entries[0]; // Default to first entry

  useFocusEffect(
    useCallback(() => {
      getLastRead().then(setLastRead);
    }, [])
  );

  const handleOpenDay = (month: string, day: number) => {
    navigation.navigate('Календарь', {
      screen: 'Daily',
      params: { month, day },
    });
  };

  const handleOpenMonth = (month: string) => {
    navigation.navigate('Календарь', {
      screen: 'MonthDays',
      params: { month },
    });
  };

  const randomEntry = entries[Math.floor(Math.random() * entries.length)];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>365 молитв</Text>
        <Text style={styles.heroSubtitle}>Ежедневные духовные размышления</Text>
        <Text style={styles.heroCount}>{entries.length} записей</Text>
      </View>

      {/* Last Read */}
      {lastRead && (
        <TouchableOpacity
          style={styles.card}
          onPress={() => handleOpenDay(lastRead.month, lastRead.day)}
        >
          <Text style={styles.cardLabel}>Продолжить чтение</Text>
          <Text style={styles.cardTitle}>
            {lastRead.day} {lastRead.month}
          </Text>
          <Text style={styles.cardSubtitle}>
            {getEntry(lastRead.month, lastRead.day)?.title.replace(/\n/g, ' ')}
          </Text>
        </TouchableOpacity>
      )}

      {/* Random Entry */}
      <TouchableOpacity
        style={[styles.card, styles.randomCard]}
        onPress={() => handleOpenDay(randomEntry.month, randomEntry.day)}
      >
        <Text style={styles.cardLabel}>Случайная запись</Text>
        <Text style={[styles.cardTitle, { color: colors.textLight }]}>
          {randomEntry.day} {randomEntry.month}
        </Text>
        <Text style={[styles.cardSubtitle, { color: 'rgba(255,255,255,0.8)' }]}>
          {randomEntry.title.replace(/\n/g, ' ')}
        </Text>
      </TouchableOpacity>

      {/* Quick Access to Months */}
      <Text style={styles.sectionTitle}>Месяцы</Text>
      <View style={styles.monthsGrid}>
        {MONTHS.map((month, idx) => (
          <TouchableOpacity
            key={month.name}
            style={[styles.monthChip, { backgroundColor: month.color }]}
            onPress={() => handleOpenMonth(month.name)}
          >
            <Text style={styles.monthChipHe}>{month.nameHe}</Text>
            <Text style={styles.monthChipName}>{month.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: spacing.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  hero: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.textLight,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  heroCount: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginTop: spacing.xs,
  },
  card: {
    margin: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  randomCard: {
    backgroundColor: colors.primaryLight,
  },
  cardLabel: {
    ...fonts.caption,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: colors.accent,
    fontWeight: '700',
  },
  cardTitle: {
    ...fonts.titleMedium,
    marginTop: spacing.sm,
  },
  cardSubtitle: {
    ...fonts.bodySmall,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    ...fonts.titleMedium,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  monthsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.sm,
  },
  monthChip: {
    width: '30%',
    marginHorizontal: '1.5%',
    marginBottom: spacing.sm,
    borderRadius: 10,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  monthChipHe: {
    fontSize: 18,
    color: colors.textLight,
    fontWeight: '600',
  },
  monthChipName: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: spacing.xs,
  },
});
