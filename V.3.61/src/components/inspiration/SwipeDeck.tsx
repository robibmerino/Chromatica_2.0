import React, { useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import { SwipeCard, type SwipeDirection } from './SwipeCard';

export interface CardData {
  id: string | number;
  [key: string]: unknown;
}

export type MatchedCard<T> = { card: T; direction: 'right' | 'up' };

interface SwipeDeckProps<T extends CardData> {
  cards: T[];
  renderCard: (card: T, index: number) => ReactNode | { card: ReactNode; labels: ReactNode | null };
  onSwipeLeft?: (card: T) => void;
  onSwipeRight?: (card: T) => void;
  onSwipeUp?: (card: T) => void;
  /** Llamado cuando se han recorrido todas las tarjetas (para pasar a la siguiente fase) */
  onComplete?: () => void;
  onEmpty?: () => ReactNode;
  maxVisible?: number;
  /** Tema oscuro Chromatica */
  dark?: boolean;
}

export function SwipeDeck<T extends CardData>({
  cards,
  renderCard,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onComplete,
  onEmpty,
  maxVisible = 3,
  dark = true,
}: SwipeDeckProps<T>) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipedCards, setSwipedCards] = useState<{ card: T; direction: SwipeDirection['direction'] }[]>([]);
  const hasCalledComplete = useRef(false);

  const remainingCards = cards.slice(currentIndex);

  useEffect(() => {
    if (remainingCards.length === 0 && cards.length > 0 && onComplete && !hasCalledComplete.current) {
      hasCalledComplete.current = true;
      onComplete();
    }
  }, [remainingCards.length, cards.length, onComplete]);
  const visibleCards = remainingCards.slice(0, maxVisible);
  const currentCard = remainingCards[0] ?? null;
  const renderResult = currentCard ? renderCard(currentCard, currentIndex) : null;
  const isStructured =
    renderResult !== null &&
    typeof renderResult === 'object' &&
    !React.isValidElement(renderResult) &&
    'card' in renderResult &&
    'labels' in renderResult;
  const labelsForCurrent =
    isStructured && renderResult !== null ? (renderResult as { labels: ReactNode }).labels : null;

  const handleSwipe = useCallback(
    (direction: SwipeDirection['direction']) => {
      const card = cards[currentIndex];
      if (!card) return;

      setSwipedCards((prev) => [...prev, { card, direction }]);

      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);

        switch (direction) {
          case 'left':
            onSwipeLeft?.(card);
            break;
          case 'right':
            onSwipeRight?.(card);
            break;
          case 'up':
            onSwipeUp?.(card);
            break;
        }
      }, 300);
    },
    [cards, currentIndex, onSwipeLeft, onSwipeRight, onSwipeUp]
  );

  const undoLastSwipe = useCallback(() => {
    if (swipedCards.length === 0) return;
    setSwipedCards((prev) => prev.slice(0, -1));
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, [swipedCards.length]);

  const btnBase = dark
    ? 'rounded-full shadow-lg border-2 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200'
    : 'rounded-full bg-white shadow-lg border-2 flex items-center justify-center hover:scale-110 hover:shadow-xl active:scale-95 transition-all duration-200';

  if (remainingCards.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 w-full">
        <div className="relative w-full max-w-xs aspect-[3/4] flex items-center justify-center">
          {onEmpty ? (
            onEmpty()
          ) : (
            <DefaultEmptyState dark={dark} />
          )}
        </div>
        {swipedCards.length > 0 && !onComplete && (
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={undoLastSwipe}
              className={`w-14 h-14 ${btnBase} border-amber-500/50 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20`}
              title="Deshacer"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7v6h6" />
                <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6.69 3L3 13" />
              </svg>
            </button>
          </div>
        )}
      </div>
    );
  }

  const getCardContent = (card: T, index: number) => {
    const result = renderCard(card, currentIndex + index);
    if (
      result !== null &&
      typeof result === 'object' &&
      !React.isValidElement(result) &&
      'card' in result
    ) {
      return (result as { card: ReactNode }).card;
    }
    return result as ReactNode;
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="flex flex-col w-full max-w-xs">
        <div className="relative w-full aspect-[3/4]">
          <AnimatePresence>
            {visibleCards
              .map((card, index) => (
                <SwipeCard
                  key={card.id}
                  onSwipe={handleSwipe}
                  isTop={index === 0}
                  index={index}
                >
                  {getCardContent(card, index)}
                </SwipeCard>
              ))
              .reverse()}
          </AnimatePresence>
        </div>
        {labelsForCurrent && (
          <div className="shrink-0 flex justify-center pt-2 w-full">{labelsForCurrent}</div>
        )}
      </div>

      <div className="text-sm text-gray-400 font-medium">
        {currentIndex + 1} / {cards.length}
      </div>

      <div className="flex justify-center items-center gap-4">
        {swipedCards.length > 0 && (
          <button
            type="button"
            onClick={undoLastSwipe}
            className={`w-12 h-12 ${btnBase} border-amber-500/50 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20`}
            title="Deshacer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7v6h6" />
              <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6.69 3L3 13" />
            </svg>
          </button>
        )}

        <button
          type="button"
          onClick={() => handleSwipe('left')}
          className={`w-14 h-14 ${btnBase} border-red-500/50 text-red-400 bg-red-500/10 hover:bg-red-500/20`}
          title="Descartar"
        >
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => handleSwipe('up')}
          className={`w-14 h-14 ${btnBase} border-amber-500/50 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20`}
          title="SuperMatch"
        >
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={1}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => handleSwipe('right')}
          className={`w-14 h-14 ${btnBase} border-emerald-500/50 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20`}
          title="Match"
        >
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={0.5}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function DefaultEmptyState({ dark }: { dark?: boolean }) {
  const textCls = dark ? 'text-gray-400' : 'text-gray-700';
  const subCls = dark ? 'text-gray-500' : 'text-gray-400';
  return (
    <div className={`text-center space-y-4 p-8 ${textCls}`}>
      <div className="text-6xl">🎉</div>
      <h3 className={`text-xl font-semibold ${textCls}`}>¡No hay más tarjetas!</h3>
      <p className={subCls}>Has revisado todas las tarjetas disponibles.</p>
    </div>
  );
}
