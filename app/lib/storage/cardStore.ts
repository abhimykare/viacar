// Card storage utilities for web (using localStorage)
import type { SavedCardMeta } from "../types/payment";

const KEY = "saved_cards";

export const saveCards = (cardData: SavedCardMeta[]): void => {
  try {
    localStorage.setItem(KEY, JSON.stringify(cardData));
  } catch (error) {
    console.error("Error saving cards:", error);
  }
};

export const getCards = (): SavedCardMeta[] => {
  try {
    const cardData = localStorage.getItem(KEY);
    if (!cardData) return [];
    return JSON.parse(cardData) as SavedCardMeta[];
  } catch (error) {
    console.error("Error getting cards:", error);
    return [];
  }
};

export const deleteCard = (cardIndex: number): void => {
  try {
    const cards = getCards();
    const updatedCards = cards.filter((_, index) => index !== cardIndex);
    saveCards(updatedCards);
  } catch (error) {
    console.error("Error deleting card:", error);
  }
};

export const updateCard = (cardIndex: number, updatedCard: SavedCardMeta): void => {
  try {
    const cards = getCards();
    cards[cardIndex] = updatedCard;
    saveCards(cards);
  } catch (error) {
    console.error("Error updating card:", error);
  }
};
