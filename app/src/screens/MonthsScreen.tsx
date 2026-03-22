import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { MONTHS, MonthInfo } from '../data/months';
import { getEntriesByMonth } from '../data';
import { colors, fonts, spacing } from '../utils/theme';

interface Props {
  navigation: any;
}

export default function MonthsScreen({ navigation }: Props) {
  const handleMonthPress = (month: MonthInfo) => {
    navigation.navigate('MonthDays', { month: month.name });
  };

  const renderMonth = ({ item, index }: { item: MonthInfo; index: number }) => {
    const entryCount = getEntriesByMonth(item.name).length;
    return (
      <TouchableOpacity
        style={styles.monthCard}
        onPress={() => handleMonthPress(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.monthColor, { backgroundColor: item.color }]}>
          <Text style={styles.monthNumber}>{index + 1}</Text>
          <Text style={styles.monthHe}>{item.nameHe}</Text>
        </View>
        <View style={styles.monthInfo}>
          <Text style={styles.monthName}>{item.name}</Text>
          <Text style={styles.monthDesc}>{item.description}</Text>
          <Text style={styles.monthDays}>{entryCount} дней</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={MONTHS}
        renderItem={renderMonth}
        keyExtractor={item => item.name}
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
  monthCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  monthColor: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  monthNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textLight,
  },
  monthHe: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: spacing.xs,
  },
  monthInfo: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'center',
  },
  monthName: {
    ...fonts.titleSmall,
  },
  monthDesc: {
    ...fonts.bodySmall,
    marginTop: spacing.xs,
  },
  monthDays: {
    ...fonts.caption,
    marginTop: spacing.xs,
  },
});
