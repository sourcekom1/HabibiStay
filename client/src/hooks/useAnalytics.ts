import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface AnalyticsEvent {
  eventType: string;
  eventData?: any;
  sessionId?: string;
  userId?: string;
}

export function useAnalytics() {
  const trackEventMutation = useMutation({
    mutationFn: async (event: AnalyticsEvent) => {
      const sessionId = event.sessionId || getSessionId();
      const response = await apiRequest("POST", "/api/analytics/track", {
        ...event,
        sessionId,
      });
      return response.json();
    },
  });

  const trackPageView = (page: string, userId?: string) => {
    trackEventMutation.mutate({
      eventType: 'page_view',
      eventData: { page },
      userId,
    });
  };

  const trackPropertyView = (propertyId: number, userId?: string) => {
    trackEventMutation.mutate({
      eventType: 'property_view',
      eventData: { propertyId },
      userId,
    });
  };

  const trackBookingAttempt = (propertyId: number, userId?: string) => {
    trackEventMutation.mutate({
      eventType: 'booking_attempt',
      eventData: { propertyId },
      userId,
    });
  };

  const trackSearchPerformed = (searchQuery: any, resultCount: number, userId?: string) => {
    trackEventMutation.mutate({
      eventType: 'search',
      eventData: { searchQuery, resultCount },
      userId,
    });
  };

  const trackFavoriteAction = (propertyId: number, action: 'add' | 'remove', userId?: string) => {
    trackEventMutation.mutate({
      eventType: 'favorite_action',
      eventData: { propertyId, action },
      userId,
    });
  };

  return {
    trackPageView,
    trackPropertyView,
    trackBookingAttempt,
    trackSearchPerformed,
    trackFavoriteAction,
    trackEvent: trackEventMutation.mutate,
  };
}

function getSessionId(): string {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}