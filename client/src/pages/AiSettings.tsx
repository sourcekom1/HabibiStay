import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Brain, Settings, Bot, MessageSquare } from "lucide-react";

interface AiSettings {
  id?: number;
  modelProvider: string;
  modelName: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  enableVoiceRecognition: boolean;
  enableAutoResponses: boolean;
  responseDelay: number;
  isActive: boolean;
}

export default function AiSettings() {
  const { toast } = useToast();
  const [testMessage, setTestMessage] = useState("");
  const [testResponse, setTestResponse] = useState("");
  const [isTesting, setIsTesting] = useState(false);

  const { data: settings, isLoading } = useQuery<AiSettings>({
    queryKey: ['/api/admin/ai-settings'],
    retry: false,
  });

  const saveSettingsMutation = useMutation({
    mutationFn: async (settingsData: AiSettings) => {
      const response = await apiRequest("POST", "/api/admin/ai-settings", settingsData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/ai-settings'] });
      toast({
        title: "Settings saved",
        description: "AI configuration has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Save failed",
        description: "Failed to save AI settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const testAiMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/admin/test-ai", { message });
      return response.json();
    },
    onSuccess: (data) => {
      setTestResponse(data.response);
      setIsTesting(false);
    },
    onError: () => {
      toast({
        title: "Test failed",
        description: "Failed to test AI response. Check your configuration.",
        variant: "destructive",
      });
      setIsTesting(false);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const settingsData: AiSettings = {
      modelProvider: formData.get("modelProvider") as string,
      modelName: formData.get("modelName") as string,
      temperature: parseFloat(formData.get("temperature") as string),
      maxTokens: parseInt(formData.get("maxTokens") as string),
      systemPrompt: formData.get("systemPrompt") as string,
      enableVoiceRecognition: formData.get("enableVoiceRecognition") === "on",
      enableAutoResponses: formData.get("enableAutoResponses") === "on",
      responseDelay: parseInt(formData.get("responseDelay") as string),
      isActive: formData.get("isActive") === "on",
    };

    saveSettingsMutation.mutate(settingsData);
  };

  const handleTestAi = () => {
    if (!testMessage.trim()) return;
    setIsTesting(true);
    setTestResponse("");
    testAiMutation.mutate(testMessage);
  };

  const defaultSettings: AiSettings = {
    modelProvider: "openai",
    modelName: "gpt-4o",
    temperature: 0.7,
    maxTokens: 800,
    systemPrompt: "You are Sara, a helpful travel assistant for an Airbnb-like platform. Help users find properties, make bookings, and answer travel-related questions. Be friendly, concise, and professional.",
    enableVoiceRecognition: true,
    enableAutoResponses: true,
    responseDelay: 1000,
    isActive: true,
  };

  const currentSettings = settings || defaultSettings;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Brain className="mr-3 h-8 w-8 text-blue-600" />
            AI Assistant Configuration
          </h1>
          <p className="text-gray-600">Configure Sara, your AI travel assistant</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Settings */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="mr-2 h-5 w-5" />
                    Model Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure the AI model and behavior settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="modelProvider">AI Provider</Label>
                      <Select name="modelProvider" defaultValue={currentSettings.modelProvider}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="openai">OpenAI</SelectItem>
                          <SelectItem value="anthropic">Anthropic</SelectItem>
                          <SelectItem value="google">Google AI</SelectItem>
                          <SelectItem value="azure">Azure OpenAI</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="modelName">Model Name</Label>
                      <Input
                        id="modelName"
                        name="modelName"
                        defaultValue={currentSettings.modelName}
                        placeholder="gpt-4o"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="temperature">Temperature: {currentSettings.temperature}</Label>
                      <Input
                        id="temperature"
                        name="temperature"
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        defaultValue={currentSettings.temperature}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500">Lower = more focused, Higher = more creative</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxTokens">Max Tokens</Label>
                      <Input
                        id="maxTokens"
                        name="maxTokens"
                        type="number"
                        min="100"
                        max="4000"
                        defaultValue={currentSettings.maxTokens}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="systemPrompt">System Prompt</Label>
                    <Textarea
                      id="systemPrompt"
                      name="systemPrompt"
                      rows={4}
                      defaultValue={currentSettings.systemPrompt}
                      placeholder="Define Sara's personality and behavior..."
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bot className="mr-2 h-5 w-5" />
                    Behavior Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Voice Recognition</Label>
                      <p className="text-sm text-gray-500">Allow users to speak to Sara</p>
                    </div>
                    <Switch
                      name="enableVoiceRecognition"
                      defaultChecked={currentSettings.enableVoiceRecognition}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto Responses</Label>
                      <p className="text-sm text-gray-500">Automatically respond to common questions</p>
                    </div>
                    <Switch
                      name="enableAutoResponses"
                      defaultChecked={currentSettings.enableAutoResponses}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="responseDelay">Response Delay (ms)</Label>
                    <Input
                      id="responseDelay"
                      name="responseDelay"
                      type="number"
                      min="0"
                      max="5000"
                      defaultValue={currentSettings.responseDelay}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>AI Assistant Active</Label>
                      <p className="text-sm text-gray-500">Enable or disable Sara globally</p>
                    </div>
                    <Switch
                      name="isActive"
                      defaultChecked={currentSettings.isActive}
                    />
                  </div>
                </CardContent>
              </Card>

              <Button
                type="submit"
                className="w-full"
                disabled={saveSettingsMutation.isPending}
              >
                {saveSettingsMutation.isPending ? "Saving..." : "Save Configuration"}
              </Button>
            </form>
          </div>

          {/* Test Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Test AI Response
                </CardTitle>
                <CardDescription>
                  Test your AI configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="testMessage">Test Message</Label>
                  <Textarea
                    id="testMessage"
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    placeholder="Hi Sara, can you help me find a beachfront property?"
                    rows={3}
                  />
                </div>
                <Button
                  onClick={handleTestAi}
                  disabled={!testMessage.trim() || isTesting}
                  className="w-full"
                >
                  {isTesting ? "Testing..." : "Test AI Response"}
                </Button>
                
                {testResponse && (
                  <div className="space-y-2">
                    <Label>AI Response</Label>
                    <div className="bg-gray-50 p-3 rounded-lg text-sm">
                      <p>{testResponse}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}