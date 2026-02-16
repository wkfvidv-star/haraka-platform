import { useEffect, useRef } from 'react';
import { useAIAnalytics } from '@/contexts/AIAnalyticsContext';
import { useAuth } from '@/contexts/AuthContext';

interface UseActivityTrackerOptions {
  component: string;
  trackClicks?: boolean;
  trackViews?: boolean;
  trackInteractions?: boolean;
  trackTime?: boolean;
}

export const useActivityTracker = (options: UseActivityTrackerOptions) => {
  const { trackActivity, isTracking } = useAIAnalytics();
  const { user } = useAuth();
  const startTime = useRef<Date>(new Date());
  const interactionCount = useRef<number>(0);

  // Track component view
  useEffect(() => {
    if (!isTracking || !user || !options.trackViews) return;

    trackActivity({
      userId: user.id,
      activityType: 'view',
      component: options.component,
      metadata: {
        userRole: user.role,
        environment: user.environment
      }
    });

    startTime.current = new Date();
  }, [isTracking, user, options.component, options.trackViews, trackActivity]);

  // Track component unmount (duration)
  useEffect(() => {
    return () => {
      if (!isTracking || !user || !options.trackTime) return;

      const duration = new Date().getTime() - startTime.current.getTime();
      
      if (duration > 1000) { // Only track if viewed for more than 1 second
        trackActivity({
          userId: user.id,
          activityType: 'view',
          component: options.component,
          duration,
          metadata: {
            userRole: user.role,
            environment: user.environment,
            interactions: interactionCount.current
          }
        });
      }
    };
  }, [isTracking, user, options.component, options.trackTime, trackActivity]);

  // Track click events
  const trackClick = (elementId?: string, metadata?: Record<string, unknown>) => {
    if (!isTracking || !user || !options.trackClicks) return;

    interactionCount.current += 1;

    trackActivity({
      userId: user.id,
      activityType: 'click',
      component: options.component,
      metadata: {
        elementId,
        userRole: user.role,
        environment: user.environment,
        interactionCount: interactionCount.current,
        ...metadata
      }
    });
  };

  // Track interaction events
  const trackInteraction = (interactionType: string, metadata?: Record<string, unknown>) => {
    if (!isTracking || !user || !options.trackInteractions) return;

    interactionCount.current += 1;

    trackActivity({
      userId: user.id,
      activityType: 'interaction',
      component: options.component,
      metadata: {
        interactionType,
        userRole: user.role,
        environment: user.environment,
        interactionCount: interactionCount.current,
        ...metadata
      }
    });
  };

  // Track exercise completion
  const trackExercise = (exerciseId: string, completed: boolean, score?: number, metadata?: Record<string, unknown>) => {
    if (!isTracking || !user) return;

    trackActivity({
      userId: user.id,
      activityType: completed ? 'completion' : 'exercise',
      component: options.component,
      metadata: {
        exerciseId,
        completed,
        score,
        userRole: user.role,
        environment: user.environment,
        ...metadata
      }
    });
  };

  // Track navigation
  const trackNavigation = (from: string, to: string, metadata?: Record<string, unknown>) => {
    if (!isTracking || !user) return;

    trackActivity({
      userId: user.id,
      activityType: 'navigation',
      component: options.component,
      metadata: {
        from,
        to,
        userRole: user.role,
        environment: user.environment,
        ...metadata
      }
    });
  };

  return {
    trackClick,
    trackInteraction,
    trackExercise,
    trackNavigation,
    isTracking: isTracking && !!user
  };
};

export default useActivityTracker;