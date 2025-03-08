import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated } from 'react-native';
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
  const { colors } = useTheme();
  const slideAnim = React.useRef(new Animated.Value(visible ? 0 : 1000)).current; // animated value for sliding

  React.useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: visible ? 0 : 1000, // slide in when visible, slide out when not
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start(); // start slide animation
  }, [visible, slideAnim]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // format time to HH:MM
  };

  if (!visible) return null; // don't render if not visible

  return (
    <Animated.View 
      style={[
        styles.container,
        { 
          transform: [{ translateY: slideAnim }],
          backgroundColor: colors.historyBackground
        }
      ]}
    >
      <View style={[styles.header, { borderBottomColor: colors.historyItemBorder }]}>
        <Text style={[styles.title, { color: colors.text }]}>History</Text>
        <View style={styles.headerButtons}>
          {history.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={onClearHistory} // clear history on press
              activeOpacity={0.7}
            >
              <Text style={[styles.clearButtonText, { color: colors.primary }]}>Clear</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onClose} // close modal on press
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={28} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calculator-outline" size={80} color={colors.secondary} />
          <Text style={[styles.emptyText, { color: colors.text }]}>No calculations yet</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.historyItem, { backgroundColor: colors.historyBackground }]}
              onPress={() => onItemPress(item)} // handle item press
              activeOpacity={0.7}
            >
              <View style={styles.historyItemContent}>
                <Text style={[styles.expressionText, { color: colors.text }]}>{item.expression}</Text>
                <Text style={[styles.resultText, { color: colors.text }]}>{item.result}</Text>
              </View>
              <Text style={[styles.timeText, { color: colors.text }]}>{formatTime(item.timestamp)}</Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: colors.historyItemBorder }]} />} // add separator between items
        />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: SIZES.large,
    borderTopRightRadius: SIZES.large,
    paddingTop: SIZES.medium,
    paddingHorizontal: SIZES.medium,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 1000, 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: SIZES.medium,
    borderBottomWidth: 1,
    height: SIZES.historyHeaderHeight,
  },
  title: {
    ...FONTS.bold,
    fontSize: SIZES.xLarge,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButton: {
    marginRight: SIZES.medium,
    paddingVertical: SIZES.xSmall,
    paddingHorizontal: SIZES.small,
  },
  clearButtonText: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
  },
  closeButton: {
    padding: SIZES.xSmall,
  },
  listContent: {
    paddingVertical: SIZES.small,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.medium,
    height: (SIZES.historyItemHeight ?? 80) + 10, // increased height for better spacing
  },
  historyItemContent: {
    flex: 1,
    marginRight: SIZES.small,
  },
  expressionText: {
    ...FONTS.regular,
    fontSize: SIZES.medium,
    opacity: 0.7,
    marginBottom: 6,
  },
  resultText: {
    ...FONTS.semiBold,
    fontSize: SIZES.large,
  },
  timeText: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    opacity: 0.5,
  },
  separator: {
    height: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...FONTS.medium,
    fontSize: SIZES.large,
    opacity: 0.5,
    marginTop: SIZES.medium,
  },
});

export default CalculatorHistory;