import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppStore } from "@/lib/store";
import { Download, Sparkles } from "lucide-react";
import { useState } from "react";

export default function TopBar() {
  const [model, setModel] = useState<'gemini-1.5-pro' | 'gemini-1.5-flash'>('gemini-1.5-pro');
  const { storyBank, outputsByStoryId, profile, transcript, reset } = useAppStore();

  const exportData = () => {
    const data = {
      profile,
      transcript, 
      storyBank,
      outputsByStoryId,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `onetake-export-${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="border-b bg-gradient-card shadow-elegant-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-foreground">OneTake</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Model:</span>
              <Select value={model} onValueChange={(value: 'gemini-1.5-pro' | 'gemini-1.5-flash') => setModel(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                  <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportData}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={reset}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}