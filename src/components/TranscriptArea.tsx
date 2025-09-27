import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/lib/store";
import { useState } from "react";
import { FileText, Mic, Upload, Zap, ExternalLink } from "lucide-react";
import type { TranscriptChunk } from "@/lib/schemas";

// Demo transcript for quick testing
const DEMO_TRANSCRIPT = `I remember when I first started my business, I had absolutely no idea what I was doing. I was fresh out of college with a computer science degree, thinking I knew everything.

My first client meeting was a disaster. I showed up in jeans and a t-shirt to a corporate office. The client looked at me like I was a kid who got lost. I tried to explain my app development process, but I was using all this technical jargon that meant nothing to them.

They asked me about my previous work, and I had to admit this was my first real client. The silence in that room was deafening. I thought I had blown it completely.

But then something unexpected happened. The client started laughing. Not at me, but because he said he appreciated my honesty. He told me about his first business meeting 20 years ago where he made similar mistakes.

That meeting taught me that authenticity beats perfection every time. The client ended up hiring me, not because I was the most polished, but because I was genuine. That project launched my career and taught me the most valuable lesson in business.

Now whenever I meet with clients, I remember that moment. I show up as myself, not as who I think they want me to be. It's made all the difference.`;

export default function TranscriptArea() {
  const { transcript, setTranscript, setActiveTab, loading } = useAppStore();
  const [transcriptText, setTranscriptText] = useState('');

  const segmentTranscript = (text: string): TranscriptChunk[] => {
    if (!text.trim()) return [];
    
    // Simple segmentation by paragraphs for demo
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => ({
      id: `chunk-${index + 1}`,
      text: paragraph.trim(),
      start: index * 30, // Mock timestamps
      end: (index + 1) * 30
    }));
  };

  const handleSegment = () => {
    const chunks = segmentTranscript(transcriptText);
    setTranscript(chunks);
  };

  const loadDemo = () => {
    setTranscriptText(DEMO_TRANSCRIPT);
    const chunks = segmentTranscript(DEMO_TRANSCRIPT);
    setTranscript(chunks);
  };

  const canGenerate = transcript.length > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Import Your Interview</h2>
        <p className="text-lg text-muted-foreground">
          Add your interview transcript to extract compelling stories
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Methods */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="shadow-elegant-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Paste Transcript
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={transcriptText}
                onChange={(e) => setTranscriptText(e.target.value)}
                placeholder="Paste your interview transcript here..."
                className="min-h-[300px] font-mono text-sm"
              />
              
              <div className="flex gap-2">
                <Button onClick={handleSegment} disabled={!transcriptText.trim()}>
                  Segment Transcript
                </Button>
                <Button variant="outline" onClick={loadDemo}>
                  Load Demo Transcript
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-muted-foreground" />
                Upload Audio (Coming Soon)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                <Mic className="w-4 h-4 mr-2" />
                Upload Audio File
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                Automatic transcription will be available soon
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-elegant-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-accent" />
                External Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Voiceflow Integration
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                Use Voiceflow for interactive interviews
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Segmented Preview */}
        <div className="space-y-4">
          <Card className="shadow-elegant-md">
            <CardHeader>
              <CardTitle>Segmented Transcript</CardTitle>
            </CardHeader>
            <CardContent>
              {transcript.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Segments will appear here after processing</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {transcript.map((chunk, index) => (
                    <div key={chunk.id} className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          Segment {index + 1}
                        </span>
                        {chunk.start !== undefined && (
                          <span className="text-xs text-muted-foreground">
                            {Math.floor(chunk.start / 60)}:{(chunk.start % 60).toString().padStart(2, '0')}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-foreground">{chunk.text.slice(0, 100)}...</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {canGenerate && (
            <Button 
              className="w-full shadow-elegant-md bg-gradient-hero" 
              size="lg"
              onClick={() => setActiveTab('story-bank')}
              disabled={loading}
            >
              <Zap className="w-4 h-4 mr-2" />
              Generate Story Bank
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}