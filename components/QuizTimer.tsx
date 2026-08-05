'use client';

import { useEffect, useRef, useState } from 'react';
import { Timer } from 'lucide-react';

/**
 * QuizTimer — Cosmetic countdown timer for the quiz attempt page.
 *
 * ⚠️  IMPORTANT — THIS TIMER IS COSMETIC ONLY (Phase 6):
 * This component counts down from `durationMinutes` in the browser.
 * It does NOT enforce any exam window. If the browser tab is closed,
 * refreshed, or the countdown reaches zero, the student's attempt is
 * NOT automatically submitted or invalidated by the server.
 *
 * Server-authoritative timing will be added in Phase 12:
 * - The server will record `startedAt` when the attempt begins.
 * - On submission, the server will check `startedAt + durationMinutes`
 *   against the current server time and reject late submissions.
 * - The server will also force-submit attempts that exceed the window.
 *
 * For now, when the timer reaches zero this component calls `onExpired()`
 * which prompts the student to submit, but does not prevent further input.
 */

interface QuizTimerProps {
  quizId: string;
  durationMinutes: number;
  onExpired: () => void;
}

export default function QuizTimer({ quizId, durationMinutes, onExpired }: QuizTimerProps) {
  const totalSeconds = durationMinutes * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const expiredRef = useRef(false);

  useEffect(() => {
    // 1. Check or set the start time in sessionStorage
    const storageKey = `quiz_start_${quizId}`;
    let startTimeStr = sessionStorage.getItem(storageKey);
    let startTime: number;

    if (!startTimeStr) {
      startTime = Date.now();
      sessionStorage.setItem(storageKey, startTime.toString());
    } else {
      startTime = parseInt(startTimeStr, 10);
    }

    // 2. Calculate remaining time based on start time
    const updateTimer = () => {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - startTime) / 1000);
      const remaining = Math.max(0, totalSeconds - elapsedSeconds);

      setSecondsLeft(remaining);

      if (remaining <= 0) {
        if (!expiredRef.current) {
          expiredRef.current = true;
          onExpired();
        }
        return false; // return false to signal stop
      }
      return true; // continue
    };

    // Initial check
    if (updateTimer()) {
      const interval = setInterval(() => {
        if (!updateTimer()) {
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [quizId, totalSeconds, onExpired]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Show warning colour in final 5 minutes
  const isWarning = secondsLeft <= 300;
  const isUrgent = secondsLeft <= 60;

  return (
    <div
      id="quiz-timer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        borderRadius: 'var(--radius-sm)',
        border: `1px solid ${isUrgent ? 'var(--color-error)' : isWarning ? 'var(--color-warning)' : 'var(--color-border)'}`,
        backgroundColor: isUrgent
          ? 'rgba(220, 38, 38, 0.06)'
          : isWarning
          ? 'rgba(217, 119, 6, 0.06)'
          : 'var(--color-bg)',
        transition: 'border-color 0.5s ease, background-color 0.5s ease',
      }}
      aria-label={`Time remaining: ${display}`}
      aria-live="off"
    >
      <Timer
        size={16}
        style={{
          color: isUrgent
            ? 'var(--color-error)'
            : isWarning
            ? 'var(--color-warning)'
            : 'var(--color-text-muted)',
          flexShrink: 0,
        }}
        aria-hidden
      />
      <span
        style={{
          fontFamily: 'monospace',
          fontSize: '15px',
          fontWeight: 600,
          color: isUrgent
            ? 'var(--color-error)'
            : isWarning
            ? 'var(--color-warning)'
            : 'var(--color-text)',
          letterSpacing: '0.05em',
        }}
      >
        {display}
      </span>
    </div>
  );
}
