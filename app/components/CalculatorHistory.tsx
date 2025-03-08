import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated, Platform } from 'react-native';
import { SIZES, FONTS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: Date;
}

interface CalculatorHistoryProps {
  history: HistoryItem[];
  visible: boolean;
  onClose: () => void;
  onItemPress: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

/**
 * renders the calculator history modal with list of calculations
 */
const CalculatorHistory: React.FC<CalculatorHistoryProps> = ({
  history,
  visible,
  onClose,
  onItemPress,
  onClearHistory,
}) => {
  // get theme colors from context for dynamic styling
  const { colors } = useTheme();
  // create animated value for slide-in effect
  const slideAnim = React.useRef(new Animated.Value(visible ? 0 : 1000)).current;

  // animate the modal sliding in and out when visibility changes
  React.useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: visible ? 0 : 1000,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  }, [visible, slideAnim]);

  // format the timestamp to show only hours and minutes
  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      hour: '2-digit' as const, 
      minute: '2-digit' as const,
      hour12: Platform.OS === 'android' ? true : undefined
    };
    return date.toLocaleTimeString([], options);
  };

  // early return if modal is not visible
  if (!visible) return null;

  return (
    // animated container that slides up from bottom
    <Animated.View 
      style={[
        styles.container,
        { 
          transform: [{ translateY: slideAnim }],
          backgroundColor: colors.historyBackground
        }
      ]}
    >
      {/* header with title and action buttons */}
      <View style={[styles.header, { borderBottomColor: colors.historyItemBorder }]}>
        <Text style={[styles.title, { color: colors.text }]}>History</Text>
        <View style={styles.headerButtons}>
          {/* conditional rendering of clear button only when history exists */}
          {history.length > 0 && (
            <TouchableOpacity 
              style={[styles.clearButton, { backgroundColor: colors.primary + '15' }]}
              onPress={onClearHistory}
              activeOpacity={0.7}
            >
              <Text style={[styles.clearButtonText, { color: colors.primary }]}>Clear All</Text>
            </TouchableOpacity>
          )}
          {/* close button to dismiss the modal */}
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* conditional rendering based on history availability */}
      {history.length === 0 ? (
        // empty state with informative message
        <View style={styles.emptyContainer}>
          <Ionicons name="calculator-outline" size={100} color={colors.secondary + '50'} />
          <Text style={[styles.emptyText, { color: colors.text }]}>No calculations yet</Text>
          <Text style={[styles.emptySubText, { color: colors.text + '80' }]}>Your calculation history will appear here</Text>
        </View>
      ) : (
        // list of history items with virtualized rendering for performance
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            // clickable history item to restore calculation
            <TouchableOpacity 
              style={[
                styles.historyItem, 
                { backgroundColor: colors.historyBackground }
              ]}
              onPress={() => onItemPress(item)}
              activeOpacity={0.7}
            >
              {/* content area with expression and result */}
              <View style={styles.historyItemContent}>
                <Text style={[styles.expressionText, { color: colors.text + '99' }]} numberOfLines={1}>
                  {item.expression}
                </Text>
                <Text style={[styles.resultText, { color: colors.text }]} numberOfLines={1}>
                  {item.result}
                </Text>
              </View>
              {/* timestamp display with icon for better visual hierarchy */}
              <View style={[styles.timeContainer, { backgroundColor: colors.text + '10' }]}>
                <Ionicons name="time-outline" size={14} color={colors.text + '99'} style={styles.timeIcon} />
                <Text style={[styles.timeText, { color: colors.text + '99' }]}>{formatTime(item.timestamp)}</Text>
              </View>
            </TouchableOpacity>
          )}
          // separator between list items for visual distinction
          ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: colors.historyItemBorder + '20' }]} />}
        />
      )}
    </Animated.View>
  );
};

// styles for component with responsive sizing from theme constants
const styles = StyleSheet.create({
  // main container with overlay positioning and shadow effects
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: SIZES.large * 2,
    borderTopRightRadius: SIZES.large * 2,
    paddingTop: SIZES.large,
    paddingHorizontal: SIZES.large,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 20,
    zIndex: 1000,
  },
  // header section with title and action buttons
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: SIZES.medium,
    borderBottomWidth: 1,
    height: SIZES.historyHeaderHeight,
  },
  // main title styling
  title: {
    ...FONTS.bold,
    fontSize: SIZES.xLarge * 1.2,
  },
  // container for header action buttons
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.small,
  },
  // styling for clear history button
  clearButton: {
    paddingVertical: SIZES.small,
    paddingHorizontal: SIZES.medium,
    borderRadius: SIZES.medium,
  },
  // text styling for clear button
  clearButtonText: {
    ...FONTS.semiBold,
    fontSize: SIZES.medium,
  },
  // close button with touch area
  closeButton: {
    padding: SIZES.xSmall,
  },
  // padding for list content
  listContent: {
    paddingVertical: SIZES.medium,
  },
  // history item card styling
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.medium,
    paddingHorizontal: SIZES.small,
    minHeight: SIZES.historyItemHeight ?? 90,
    borderRadius: SIZES.medium,
    marginVertical: 4,
  },
  // container for expression and result text
  historyItemContent: {
    flex: 1,
    marginRight: SIZES.medium,
  },
  // styling for mathematical expression
  expressionText: {
    ...FONTS.regular,
    fontSize: SIZES.medium,
    marginBottom: 8,
  },
  // styling for calculation result with emphasis
  resultText: {
    ...FONTS.bold,
    fontSize: SIZES.xLarge,
  },
  // container for timestamp display
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.large,
  },
  // spacing for time icon
  timeIcon: {
    marginRight: 6,
  },
  // styling for time text
  timeText: {
    ...FONTS.medium,
    fontSize: SIZES.small,
  },
  // divider between list items
  separator: {
    height: 1,
    marginVertical: 4,
  },
  // container for empty state display
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SIZES.small,
  },
  // styling for primary empty state text
  emptyText: {
    ...FONTS.bold,
    fontSize: SIZES.xLarge,
    opacity: 0.7,
  },
  // styling for secondary empty state text
  emptySubText: {
    ...FONTS.regular,
    fontSize: SIZES.medium,
  }
});

export default CalculatorHistory;