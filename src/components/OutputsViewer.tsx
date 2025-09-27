import { useState } from 'react';
import { Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore } from '@/lib/store';
import { toast } from '@/hooks/use-toast';

interface OutputsViewerProps {
  storyId: string;
  children: React.ReactNode;
}

export default function OutputsViewer({ storyId, children }: OutputsViewerProps) {
  const { outputsByStoryId } = useAppStore();
  const outputs = outputsByStoryId[storyId];
  
  const [open, setOpen] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard!",
        description: "Content ready to paste"
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const hasOutputs = outputs && (outputs.linkedin || outputs.instagram_carousel || outputs.tiktok_script);

  if (!hasOutputs) return null;

  const availableTabs = [];
  if (outputs.linkedin) availableTabs.push('linkedin');
  if (outputs.instagram_carousel) availableTabs.push('instagram');
  if (outputs.tiktok_script) availableTabs.push('tiktok');

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>Generated Content</SheetTitle>
          <SheetDescription>
            Your story has been adapted for different platforms
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6">
          <Tabs defaultValue={availableTabs[0]} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              {outputs.linkedin && (
                <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
              )}
              {outputs.instagram_carousel && (
                <TabsTrigger value="instagram">Instagram</TabsTrigger>
              )}
              {outputs.tiktok_script && (
                <TabsTrigger value="tiktok">TikTok</TabsTrigger>
              )}
            </TabsList>

            {outputs.linkedin && (
              <TabsContent value="linkedin" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">LinkedIn Post</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(outputs.linkedin!)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <Textarea
                  value={outputs.linkedin}
                  readOnly
                  className="min-h-[300px] resize-none"
                />
              </TabsContent>
            )}

            {outputs.instagram_carousel && (
              <TabsContent value="instagram" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Instagram Carousel (6 slides)</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(outputs.instagram_carousel!.join('\n\n---\n\n'))}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy All
                  </Button>
                </div>
                <div className="space-y-3">
                  {outputs.instagram_carousel.map((slide, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          Slide {index + 1}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(slide)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm">{slide}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            )}

            {outputs.tiktok_script && (
              <TabsContent value="tiktok" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    TikTok Script ({outputs.tiktok_script.duration_s}s)
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(
                      outputs.tiktok_script!.timestamps
                        .map(t => `${t.start}s: ${t.text}`)
                        .join('\n')
                    )}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Script
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">Timeline</h4>
                    <div className="space-y-2">
                      {outputs.tiktok_script.timestamps.map((timestamp, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <span className="text-xs font-mono bg-muted px-2 py-1 rounded min-w-[40px]">
                            {timestamp.start}s
                          </span>
                          <p className="text-sm flex-1">{timestamp.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {outputs.tiktok_script.shots && (
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-3">Shot List</h4>
                      <div className="space-y-1">
                        {outputs.tiktok_script.shots.map((shot, index) => (
                          <p key={index} className="text-sm text-muted-foreground">
                            {index + 1}. {shot}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}