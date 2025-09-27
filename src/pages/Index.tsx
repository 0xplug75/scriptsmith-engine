import { useAppStore } from "@/lib/store";
import TopBar from "@/components/TopBar";
import StoryBankList from "@/components/StoryBankList";
import OutputTabs from "@/components/OutputTabs";
import CalendarView from "@/components/CalendarView";
import ProfileFormSimple from "@/components/ProfileFormSimple";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Calendar, Zap } from "lucide-react";

const Index = () => {
  const { activeTab, setActiveTab, isOnboardingComplete } = useAppStore();

  if (!isOnboardingComplete) {
    return <OnboardingWizard />;
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      
      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 mb-8">
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

          <TabsContent value="story-bank">
            <StoryBankList />
          </TabsContent>

          <TabsContent value="calendar">
            <CalendarView />
          </TabsContent>

          <TabsContent value="output">
            <OutputTabs />
          </TabsContent>
        </Tabs>
        
        {/* Profile Settings */}
        <div className="fixed bottom-6 right-6 z-50">
          <ProfileFormSimple />
        </div>
      </div>
    </div>
  );
};

export default Index;
