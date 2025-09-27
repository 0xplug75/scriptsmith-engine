import { useAppStore } from "@/lib/store";
import TopBar from "@/components/TopBar";
import ProfileForm from "@/components/ProfileForm";
import TranscriptArea from "@/components/TranscriptArea";
import StoryBankList from "@/components/StoryBankList";
import OutputTabs from "@/components/OutputTabs";
import CalendarView from "@/components/CalendarView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, FileText, BookOpen, Calendar, Zap } from "lucide-react";

const Index = () => {
  const { activeTab, setActiveTab } = useAppStore();

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      
      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-5 mb-8">
            <TabsTrigger value="onboarding" className="flex items-center gap-2 text-xs">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="interview" className="flex items-center gap-2 text-xs">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Interview</span>
            </TabsTrigger>
            <TabsTrigger value="story-bank" className="flex items-center gap-2 text-xs">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Stories</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2 text-xs">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Planning</span>
            </TabsTrigger>
            <TabsTrigger value="output" className="flex items-center gap-2 text-xs">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Output</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="onboarding">
            <ProfileForm />
          </TabsContent>

          <TabsContent value="interview">
            <TranscriptArea />
          </TabsContent>

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
      </div>
    </div>
  );
};

export default Index;
