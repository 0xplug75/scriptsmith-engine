import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { useState } from "react";
import { X, Plus, Upload, User, Target, Palette } from "lucide-react";

const TONE_OPTIONS = [
  { value: "serious", label: "Serious & Professional", description: "Authoritative, formal tone" },
  { value: "punchy", label: "Punchy & Direct", description: "Sharp, concise messaging" }, 
  { value: "friendly", label: "Friendly & Approachable", description: "Warm, conversational style" },
  { value: "bold", label: "Bold & Provocative", description: "Attention-grabbing, edgy" }
];

const OBJECTIVE_SUGGESTIONS = [
  "Build personal brand", "Generate leads", "Share expertise", "Network professionally",
  "Drive traffic", "Increase engagement", "Establish thought leadership", "Grow followers"
];

const PLATFORM_OPTIONS = [
  { value: "LinkedIn", label: "LinkedIn", description: "Professional networking" },
  { value: "Instagram", label: "Instagram", description: "Visual storytelling" },
  { value: "TikTok", label: "TikTok", description: "Short-form video" }
];

export default function ProfileForm() {
  const { profile, setProfile, setActiveTab } = useAppStore();
  const [newObjective, setNewObjective] = useState('');

  const addObjective = (objective: string) => {
    if (!profile.objectives.includes(objective)) {
      setProfile({ objectives: [...profile.objectives, objective] });
    }
    setNewObjective('');
  };

  const removeObjective = (objective: string) => {
    setProfile({ 
      objectives: profile.objectives.filter(obj => obj !== objective) 
    });
  };

  const togglePlatform = (platform: "LinkedIn" | "Instagram" | "TikTok") => {
    const platforms = profile.platforms.includes(platform)
      ? profile.platforms.filter(p => p !== platform)
      : [...profile.platforms, platform];
    setProfile({ platforms });
  };

  const isComplete = profile.name && profile.short_bio && profile.tone && 
                    profile.objectives.length > 0 && profile.platforms.length > 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Create Your Content Profile</h2>
        <p className="text-lg text-muted-foreground">
          Tell us about yourself to generate personalized content
        </p>
      </div>

      <Card className="shadow-elegant-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={profile.name}
              onChange={(e) => setProfile({ name: e.target.value })}
              placeholder="Your full name"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="bio">Short Bio</Label>
            <Textarea
              id="bio"
              value={profile.short_bio}
              onChange={(e) => setProfile({ short_bio: e.target.value })}
              placeholder="Brief description of your background and expertise..."
              className="mt-1"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-elegant-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-accent" />
            Content Style & Tone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label>Preferred Tone</Label>
            <Select value={profile.tone} onValueChange={(value: any) => setProfile({ tone: value })}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select your content tone" />
              </SelectTrigger>
              <SelectContent>
                {TONE_OPTIONS.map(tone => (
                  <SelectItem key={tone.value} value={tone.value}>
                    <div>
                      <div className="font-medium">{tone.label}</div>
                      <div className="text-sm text-muted-foreground">{tone.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-elegant-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-success" />
            Content Objectives
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newObjective}
              onChange={(e) => setNewObjective(e.target.value)}
              placeholder="Add custom objective..."
              onKeyDown={(e) => e.key === 'Enter' && newObjective && addObjective(newObjective)}
            />
            <Button
              onClick={() => newObjective && addObjective(newObjective)}
              disabled={!newObjective}
              variant="outline"
              size="sm"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div>
            <Label className="text-sm text-muted-foreground">Suggested objectives:</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {OBJECTIVE_SUGGESTIONS.filter(obj => !profile.objectives.includes(obj)).map(objective => (
                <Button
                  key={objective}
                  variant="ghost"
                  size="sm"
                  onClick={() => addObjective(objective)}
                  className="h-7 text-xs"
                >
                  + {objective}
                </Button>
              ))}
            </div>
          </div>

          {profile.objectives.length > 0 && (
            <div>
              <Label className="text-sm text-muted-foreground">Selected objectives:</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.objectives.map(objective => (
                  <Badge key={objective} variant="secondary" className="gap-1">
                    {objective}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-destructive"
                      onClick={() => removeObjective(objective)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-elegant-md">
        <CardHeader>
          <CardTitle>Target Platforms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PLATFORM_OPTIONS.map(platform => (
              <div
                key={platform.value}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  profile.platforms.includes(platform.value as any)
                    ? 'border-primary bg-primary/5 shadow-elegant-sm'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => togglePlatform(platform.value as any)}
              >
                <div className="font-medium">{platform.label}</div>
                <div className="text-sm text-muted-foreground">{platform.description}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-elegant-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-muted-foreground" />
            Additional Assets (Optional)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full" disabled>
            <Upload className="w-4 h-4 mr-2" />
            Upload CV/Resume (Coming Soon)
          </Button>
          <Button variant="outline" className="w-full" disabled>
            <Upload className="w-4 h-4 mr-2" />
            Upload Brand Assets (Coming Soon)
          </Button>
        </CardContent>
      </Card>

      <Button 
        className="w-full shadow-elegant-md"
        onClick={() => setActiveTab('interview')}
        disabled={!isComplete}
        size="lg"
      >
        Save Profile & Continue
      </Button>
    </div>
  );
}