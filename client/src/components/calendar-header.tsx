import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { googleCalendarApi } from '@/lib/google-calendar';
import { useToast } from '@/hooks/use-toast';
import { usePWA } from '@/hooks/use-pwa';

interface CalendarHeaderProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onGoToToday: () => void;
}

export function CalendarHeader({
  currentDate,
  onPreviousMonth,
  onNextMonth,
  onGoToToday,
}: CalendarHeaderProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isInstallable, isInstalled, installApp } = usePWA();

  const { data: authStatus, isLoading: authLoading } = useQuery({
    queryKey: ['/api/auth/status'],
    queryFn: () => googleCalendarApi.getAuthStatus(),
  });

  const connectMutation = useMutation({
    mutationFn: googleCalendarApi.getAuthUrl,
    onSuccess: (data) => {
      window.location.href = data.authUrl;
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to connect to Google Calendar",
        variant: "destructive",
      });
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: googleCalendarApi.disconnect,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/status'] });
      queryClient.invalidateQueries({ queryKey: ['/api/calendar/events'] });
      toast({
        title: "Success",
        description: "Disconnected from Google Calendar",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to disconnect from Google Calendar",
        variant: "destructive",
      });
    },
  });

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentMonthYear = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  const handleAuthAction = () => {
    if (authStatus?.isAuthenticated) {
      disconnectMutation.mutate();
    } else {
      connectMutation.mutate();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm mb-4 p-4 md:p-6 md:mb-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-4">
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-4">
          <h1 className="text-xl md:text-2xl font-semibold text-primary-calendar">Calendar</h1>
          {!authLoading && (
            <div className="flex items-center space-x-2">
              <div 
                className={`w-2 h-2 rounded-full ${
                  authStatus?.isAuthenticated ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span className="text-xs md:text-sm text-secondary-calendar truncate">
                {authStatus?.isAuthenticated 
                  ? `Connected as ${authStatus.user?.email}`
                  : 'Not connected'
                }
              </span>
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          {isInstallable && !isInstalled && (
            <Button
              variant="outline"
              onClick={installApp}
              className="flex items-center space-x-2 text-xs md:text-sm"
              size="sm"
            >
              <Download className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Install App</span>
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={handleAuthAction}
            disabled={connectMutation.isPending || disconnectMutation.isPending}
            className="flex items-center space-x-2 text-xs md:text-sm"
            size="sm"
          >
            <svg className="w-3 h-3 md:w-4 md:h-4" viewBox="0 0 24 24">
              <path
                fill="#4285f4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34a853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#fbbc05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#ea4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="hidden sm:inline">
              {authStatus?.isAuthenticated ? 'Disconnect' : 'Connect'}
            </span>
            <span className="sm:hidden">
              {authStatus?.isAuthenticated ? 'Disconnect' : 'Connect'}
            </span>
          </Button>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={onPreviousMonth}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 md:w-4 md:h-4 text-secondary-calendar" />
        </Button>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          <h2 className="text-lg md:text-xl font-medium text-primary-calendar">
            {currentMonthYear}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onGoToToday}
            className="text-xs md:text-sm text-secondary-calendar hover:text-primary-calendar transition-colors px-2 py-1"
          >
            Today
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onNextMonth}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="w-5 h-5 md:w-4 md:h-4 text-secondary-calendar" />
        </Button>
      </div>
    </div>
  );
}
