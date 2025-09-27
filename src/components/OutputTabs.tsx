import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { Copy, Download, ArrowLeft, Clock, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function OutputTabs() {
  const { 
    storyBank, 
    outputsByStoryId, 
    selectedStoryId, 
    selectedOutputFormat,
    setActiveTab,
    setSelectedOutputFormat
  } = useAppStore();
  
  const { toast } = useToast();

  const selectedStory = storyBank.find(s => s.id === selectedStoryId);
  const outputs = selectedStoryId ? outputsByStoryId[selectedStoryId] : undefined;

  const copyToClipboard = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${format} content copied successfully`,
      className: "bg-gradient-success"
    });
  };

  const exportContent = () => {
    if (!outputs || !selectedStory) return;
    
    const exportData = {
      story: selectedStory,
      outputs,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedStory.title.toLowerCase().replace(/\s+/g, '-')}-content.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!selectedStory || !outputs) {
    return (
      <div className="max-w-4xl mx-auto text-center space-y-4 py-16">
        <h3 className="text-xl font-semibold">No Content Generated Yet</h3>
        <p className="text-muted-foreground">
          Select a story from your Story Bank and generate content to view outputs here
        </p>
        <Button onClick={() => setActiveTab('story-bank')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Story Bank
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setActiveTab('story-bank')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Stories
            </Button>
          </div>
          <h2 className="text-2xl font-bold text-foreground">{selectedStory.title}</h2>
          <p className="text-accent font-medium">"{selectedStory.hook}"</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportContent}>
            <Download className="w-4 h-4 mr-2" />
            Export JSON
          </Button>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs 
        value={selectedOutputFormat || 'linkedin'} 
        onValueChange={(value) => setSelectedOutputFormat(value as any)}
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="linkedin" className="gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            LinkedIn
          </TabsTrigger>
          <TabsTrigger value="instagram" className="gap-2">
            <div className="w-2 h-2 bg-pink-500 rounded-full" />
            Instagram
          </TabsTrigger>
          <TabsTrigger value="tiktok" className="gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full" />
            TikTok
          </TabsTrigger>
          <TabsTrigger value="brief" className="gap-2">
            <div className="w-2 h-2 bg-gray-500 rounded-full" />
            Brief
          </TabsTrigger>
        </TabsList>

        {/* LinkedIn Content */}
        <TabsContent value="linkedin">
          <Card className="shadow-elegant-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full" />
                  LinkedIn Post
                </CardTitle>
                <Button
                  size="sm"
                  onClick={() => outputs.linkedin && copyToClipboard(outputs.linkedin, 'LinkedIn')}
                  disabled={!outputs.linkedin}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Post
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {outputs.linkedin ? (
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                      {outputs.linkedin}
                    </pre>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>~{outputs.linkedin.split(' ').length} words</span>
                    <span>~{Math.ceil(outputs.linkedin.length / 280)} tweets</span>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">LinkedIn content not generated yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Instagram Content */}
        <TabsContent value="instagram">
          <Card className="shadow-elegant-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-pink-500 rounded-full" />
                  Instagram Carousel
                </CardTitle>
                <Button
                  size="sm"
                  onClick={() => 
                    outputs.instagram_carousel && 
                    copyToClipboard(outputs.instagram_carousel.join('\n\n---\n\n'), 'Instagram Carousel')
                  }
                  disabled={!outputs.instagram_carousel}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy All Slides
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {outputs.instagram_carousel ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {outputs.instagram_carousel.map((slide, index) => (
                      <Card key={index} className="border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              Slide {index + 1}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(slide, `Slide ${index + 1}`)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-sm font-medium leading-relaxed">{slide}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {slide.split(' ').length} words
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Instagram carousel not generated yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TikTok Content */}
        <TabsContent value="tiktok">
          <Card className="shadow-elegant-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-500 rounded-full" />
                  TikTok Script
                </CardTitle>
                <Button
                  size="sm"
                  onClick={() => 
                    outputs.tiktok_script && 
                    copyToClipboard(
                      outputs.tiktok_script.timestamps.map(t => `${t.start}s: ${t.text}`).join('\n'),
                      'TikTok Script'
                    )
                  }
                  disabled={!outputs.tiktok_script}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Script
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {outputs.tiktok_script ? (
                <div className="space-y-6">
                  {/* Duration Info */}
                  <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <span className="font-medium">Duration: {outputs.tiktok_script.duration_s}s</span>
                    <Badge variant="outline">
                      {outputs.tiktok_script.timestamps.length} segments
                    </Badge>
                  </div>

                  {/* Timeline */}
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Script Timeline
                    </h4>
                    {outputs.tiktok_script.timestamps.map((timestamp, index) => (
                      <div key={index} className="flex gap-3 p-3 border rounded-lg hover:bg-muted/50">
                        <Badge variant="outline" className="shrink-0 font-mono">
                          {timestamp.start}s
                        </Badge>
                        <p className="text-sm">{timestamp.text}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(timestamp.text, `Segment ${index + 1}`)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Shot List */}
                  {outputs.tiktok_script.shots && (
                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Camera className="w-4 h-4" />
                        Suggested Shots
                      </h4>
                      <div className="grid gap-2">
                        {outputs.tiktok_script.shots.map((shot, index) => (
                          <div key={index} className="p-3 border rounded-lg bg-muted/30">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                Shot {index + 1}
                              </Badge>
                              <p className="text-sm">{shot}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">TikTok script not generated yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Brief Editor */}
        <TabsContent value="brief">
          <Card className="shadow-elegant-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-500 rounded-full" />
                  Content Brief
                </CardTitle>
                <Button
                  size="sm"
                  onClick={() => outputs.brief_editor && copyToClipboard(outputs.brief_editor, 'Content Brief')}
                  disabled={!outputs.brief_editor}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Brief
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {outputs.brief_editor ? (
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {outputs.brief_editor}
                  </pre>
                </div>
              ) : (
                <p className="text-muted-foreground">Content brief not generated yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}