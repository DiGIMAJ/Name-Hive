
import { useState, useCallback } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Copy, RefreshCw, Info, Headphones, Mic, Radio } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  Badge
} from "@/components/ui/badge";
import FavoriteButton from '@/components/podcast/FavoriteButton';
import { useAuth } from '@/context/AuthContext';

interface GeneratedName {
  name: string;
  niche: string;
  target_demographic: string;
  suggested_platforms: string[];
  how_to_grow_it_quickly: string;
  why_it_would_work: string;
}

interface GeneratorResponse {
  names: GeneratedName[];
}

const PodcastNameGenerator = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [description, setDescription] = useState<string>('');
  const [niche, setNiche] = useState<string>('');
  const [numberOfNames, setNumberOfNames] = useState<string>('7');
  const [generatedNames, setGeneratedNames] = useState<GeneratedName[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const generateNames = useCallback(async () => {
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('groq-name-generator', {
        body: {
          nameType: 'podcast',
          keywords: description,
          niche,
          numberOfNames
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      // Check if data has the expected structure
      if (data && data.names && Array.isArray(data.names)) {
        setGeneratedNames(data.names);
      } else {
        console.error('Unexpected response format:', data);
        toast({
          title: "Error",
          description: "Received an unexpected response format",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error generating names:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate names",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  }, [description, niche, numberOfNames, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateNames();
  };

  const handleCopy = (text: string, description: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${description} copied to clipboard`,
    });
  };

  const toggleCardExpansion = (index: number) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-to-b from-purple-100 to-purple-50 relative">
          <div className="page-container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="size-20 bg-purple-200 text-purple-600 mx-auto rounded-2xl flex items-center justify-center mb-6 animate-float shadow-md">
                <Headphones className="size-10" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-purple-800">
                Podcast Name Generator
              </h1>
              <p className="text-xl text-purple-700 mb-8">
                Generate engaging, catchy podcast names that will help your show stand out
              </p>
            </div>
          </div>
        </section>
        
        {/* Generator Section */}
        <section className="py-16">
          <div className="page-container">
            <div className="max-w-4xl mx-auto">
              {/* Generator Form */}
              <div className="glass-purple p-8 mb-12 shadow-lg rounded-xl bg-white/40 backdrop-blur-sm border border-purple-100">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="niche" className="block text-sm font-medium text-purple-800 mb-2">
                        Podcast Niche
                      </label>
                      <Input 
                        id="niche"
                        type="text"
                        placeholder="Enter a niche (e.g., true crime, business, comedy)"
                        value={niche}
                        onChange={(e) => setNiche(e.target.value)}
                        className="bg-white/70 border-purple-200 focus-visible:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="numberOfNames" className="block text-sm font-medium text-purple-800 mb-2">
                        Number of Names
                      </label>
                      <Select 
                        value={numberOfNames} 
                        onValueChange={setNumberOfNames}
                      >
                        <SelectTrigger className="bg-white/70 border-purple-200 focus-visible:ring-purple-500">
                          <SelectValue placeholder="Number of names" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 names</SelectItem>
                          <SelectItem value="7">7 names</SelectItem>
                          <SelectItem value="15">15 names</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="description" className="block text-sm font-medium text-purple-800 mb-2">
                        Description
                      </label>
                      <Textarea 
                        id="description"
                        placeholder="Describe your podcast (e.g., topic, tone, style, audience)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="min-h-[100px] bg-white/70 border-purple-200 focus-visible:ring-purple-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-center pt-4">
                    <Button 
                      type="submit" 
                      className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-6 button-glow"
                      disabled={isGenerating}
                      size="lg"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Mic className="mr-2 h-5 w-5" />
                          Generate Podcast Names
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
              
              {/* Results Section */}
              {generatedNames.length > 0 && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold text-purple-800 text-center">Generated Podcast Names</h2>
                  <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                    {generatedNames.map((nameObj, index) => (
                      <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow card-gradient border border-purple-200/50">
                        <CardHeader className="pb-4 bg-gradient-to-r from-purple-100/50 to-transparent">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-xl text-purple-800">{nameObj.name}</CardTitle>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopy(nameObj.name, "Name")}
                                className="text-purple-600 hover:text-purple-800 hover:bg-purple-100 -mt-2 -mr-2"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <CardDescription className="flex flex-wrap gap-1 items-center">
                            <span className="font-medium mr-1">Niche:</span> 
                            <span className="mr-2">{nameObj.niche}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopy(nameObj.niche, "Niche")}
                              className="h-5 w-5 p-0 text-purple-600 hover:text-purple-800 hover:bg-purple-100"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <span className="font-medium mr-1 ml-1">Audience:</span> 
                            <span>{nameObj.target_demographic}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopy(nameObj.target_demographic, "Target audience")}
                              className="h-5 w-5 p-0 text-purple-600 hover:text-purple-800 hover:bg-purple-100"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </CardDescription>
                        </CardHeader>
                        
                        {expandedCard === index && (
                          <CardContent className="text-sm space-y-4 pt-0 bg-white/70">
                            <div>
                              <div className="flex items-center mb-1">
                                <h4 className="font-semibold text-purple-800">Suggested Platforms</h4>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCopy(nameObj.suggested_platforms.join(", "), "Platforms")}
                                  className="h-6 w-6 p-0 text-purple-600 hover:text-purple-800 hover:bg-purple-100"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {nameObj.suggested_platforms.map((platform, i) => (
                                  <Badge key={i} className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                                    {platform}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex items-center mb-1">
                                <h4 className="font-semibold text-purple-800">Growth Strategy</h4>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCopy(nameObj.how_to_grow_it_quickly, "Growth strategy")}
                                  className="h-6 w-6 p-0 text-purple-600 hover:text-purple-800 hover:bg-purple-100"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                              <p className="text-gray-700">{nameObj.how_to_grow_it_quickly}</p>
                            </div>
                            
                            <div>
                              <div className="flex items-center mb-1">
                                <h4 className="font-semibold text-purple-800">Why It Works</h4>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCopy(nameObj.why_it_would_work, "Why it works")}
                                  className="h-6 w-6 p-0 text-purple-600 hover:text-purple-800 hover:bg-purple-100"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                              <p className="text-gray-700">{nameObj.why_it_would_work}</p>
                            </div>
                          </CardContent>
                        )}
                        
                        <CardFooter className="pt-2 pb-4 bg-white/70 flex justify-between">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => toggleCardExpansion(index)}
                            className="text-sm text-purple-600 hover:text-purple-800 hover:bg-purple-100 border-purple-200 flex items-center"
                          >
                            <Info className="h-4 w-4 mr-1" />
                            {expandedCard === index ? "Show less" : "Show details"}
                          </Button>
                          
                          {user && (
                            <FavoriteButton 
                              podcastName={nameObj.name} 
                              description={nameObj.niche} 
                              niche={nameObj.niche} 
                            />
                          )}
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              
              {generatedNames.length === 0 && !isGenerating && (
                <div className="glass-purple p-12 text-center rounded-xl bg-white/40 backdrop-blur-sm border border-purple-100">
                  <div className="flex justify-center mb-6">
                    <div className="flex flex-col items-center">
                      <Radio className="size-12 text-purple-600 mb-2" />
                      <Mic className="size-8 text-purple-700" />
                    </div>
                  </div>
                  <p className="text-purple-700 mb-4">
                    Fill in the form and generate AI-powered podcast name suggestions
                  </p>
                  <Button 
                    onClick={handleSubmit}
                    variant="outline"
                    className="border-purple-400 text-purple-700 hover:bg-purple-200"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Names
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PodcastNameGenerator;
