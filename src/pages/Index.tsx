import { useState } from "react";
import { useAppStore } from "@/lib/store";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";
import TopBar from "@/components/TopBar";
import EnhancedStoryBankList from "@/components/EnhancedStoryBankList";
import CalendarView from "@/components/CalendarView";
import OutputTabs from "@/components/OutputTabs";
import SettingsSidebar from "@/components/SettingsSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Settings, BookOpen, Calendar, Zap } from "lucide-react";

export default function Index() {
  const { activeTab, setActiveTab, isOnboardingComplete } = useAppStore();
  const [settingsOpen, setSettingsOpen] = useState(false);

  if (!isOnboardingComplete) {
    return <OnboardingWizard />;
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      
      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid grid-cols-3 w-[400px]">
              <TabsTrigger value="story-bank" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Stories
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Planning
              </TabsTrigger>
              <TabsTrigger value="output" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Contenu
              </TabsTrigger>
            </TabsList>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setSettingsOpen(true)}
              className="ml-4"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
          
          <TabsContent value="story-bank" className="space-y-0">
            <EnhancedStoryBankList />
          </TabsContent>
          
          <TabsContent value="calendar" className="space-y-0">
            <CalendarView />
          </TabsContent>
          
          <TabsContent value="output" className="space-y-0">
            <OutputTabs />
          </TabsContent>
        </Tabs>
      </main>

      <SettingsSidebar 
        isOpen={settingsOpen} 
        onClose={() => setSettingsOpen(false)} 
      />
    </div>
  );
}
