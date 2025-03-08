import AsyncStorage from '@react-native-async-storage/async-storage';
import { HistoryItem } from '../components/CalculatorHistory';

const HISTORY_STORAGE_KEY = 'calculator_history';

/**
 * save calculator history to asyncstorage
 */
export const saveHistory = async (history: HistoryItem[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(history);
    await AsyncStorage.setItem(HISTORY_STORAGE_KEY, jsonValue);
  } catch (error) {
    // log error if saving history fails
    console.error('Error saving history:', error);
  }
};

/**
 * load calculator history from asyncstorage
 */
export const loadHistory = async (): Promise<HistoryItem[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
    if (jsonValue !== null) {
      const history = JSON.parse(jsonValue);
      
      // convert string dates back to date objects after loading
      return history.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }));
    }
    // return empty array if no history is found
    return [];
  } catch (error) {
    // log error and return empty array if loading history fails
    console.error('Error loading history:', error);
    return [];
  }
};

/**
 * clear calculator history from asyncstorage
 */
export const clearHistory = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (error) {
    // log error if clearing history fails
    console.error('Error clearing history:', error);
  }
};