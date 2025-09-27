import { useState, useMemo } from "react";
import { useAppStore } from "@/lib/store";
import MonthNavigator from "./MonthNavigator";
import DayCell from "./DayCell";
import type { Story } from "@/lib/schemas";

const WEEKDAYS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

export default function CalendarView() {
  const { storyBank, assignments, setAssignments, updateStory } = useAppStore();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Generate calendar grid
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    const endDate = new Date(lastDay);
    
    // Start from the beginning of the week containing the first day
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    // End at the end of the week containing the last day
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
    
    const days = [];
    const currentDay = new Date(startDate);
    
    while (currentDay <= endDate) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  }, [currentDate]);

  const handleDropToDay = (storyId: string, targetISO: string, fromISO?: string) => {
    setAssignments(prev => {
      const next = { ...prev };
      
      // Remove from source day if moving between days
      if (fromISO && next[fromISO]) {
        next[fromISO] = next[fromISO].filter(id => id !== storyId);
        if (next[fromISO].length === 0) {
          delete next[fromISO];
        }
      }
      
      // Add to target day (avoid duplicates)
      const targetStories = new Set(next[targetISO] || []);
      targetStories.add(storyId);
      next[targetISO] = Array.from(targetStories);
      
      return next;
    });
  };

  const handleReorder = (fromIndex: number, toIndex: number, dateISO: string) => {
    setAssignments(prev => {
      const next = { ...prev };
      const dayStories = [...(next[dateISO] || [])];
      
      if (fromIndex >= 0 && fromIndex < dayStories.length && 
          toIndex >= 0 && toIndex < dayStories.length &&
          fromIndex !== toIndex) {
        const [movedStory] = dayStories.splice(fromIndex, 1);
        dayStories.splice(toIndex, 0, movedStory);
        next[dateISO] = dayStories;
      }
      
      return next;
    });
  };

  const handlePreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const getStoriesForDate = (date: Date): Story[] => {
    const iso = date.toISOString().split('T')[0];
    const storyIds = assignments[iso] || [];
    return storyIds.map(id => storyBank.find(s => s.id === id)).filter(Boolean) as Story[];
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentDate.getMonth();
  };

  return (
    <div className="space-y-6">
      <MonthNavigator
        currentDate={currentDate}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
      />

      {/* Calendar Grid */}
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 border-b bg-muted/30">
          {WEEKDAYS.map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-px bg-border">
          {calendarDays.map(date => {
            const iso = date.toISOString().split('T')[0];
            const stories = getStoriesForDate(date);
            
            return (
              <DayCell
                key={iso}
                date={date}
                iso={iso}
                stories={stories}
                isToday={isToday(date)}
                isCurrentMonth={isCurrentMonth(date)}
                onDropStory={handleDropToDay}
                onReorder={handleReorder}
                onEditStory={updateStory}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}