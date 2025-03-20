
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!GROQ_API_KEY) {
      console.error("GROQ_API_KEY is not set in environment variables");
      return new Response(
        JSON.stringify({ error: "API key configuration error" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { nameType, keywords, niche, numberOfNames } = await req.json();
    
    console.log("Request received with parameters:", { nameType, keywords, niche, numberOfNames });
    
    // Construct the user prompt based on input
    const userPrompt = `Generate ${numberOfNames || 5} unique, brandable, and creative podcast name ideas for a ${niche || 'general'} podcast. The names should be:

Catchy, engaging, and easy to remember
Relevant to the theme or topics covered in the podcast
Suitable for branding and potential audience growth
Focus on the following keywords/concepts: ${keywords || 'general topics'}.

Response Format:
Return the podcast names in a JSON array exactly as specified in the system instructions.`;

    const systemPrompt = `You are an AI specializing in generating creative, unique, and brandable podcast names based on user input. You will receive a user prompt that describes the desired podcast name generation task. Your task is to generate a list of podcast names based on the user prompt.
You MUST respond with a valid JSON structure containing an array of name objects.

Your output MUST strictly follow this format without any additional text or explanation:
{
  "names": [
    {
      "name": "Name 1",
      "niche": "Specific niche",
      "target_demographic": "Target audience",
      "suggested_platforms": ["Platform1", "Platform2", "Platform3"],
      "how_to_grow_it_quickly": "Brief growth strategy",
      "why_it_would_work": "Brief explanation of effectiveness"
    },
    ...more names
  ]
}`;

    console.log("Making request to Groq API");
    
    // Make the request to Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: `Groq API returned an error: ${response.status}`, details: errorText }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log("Groq API response received:", JSON.stringify(data).substring(0, 200) + "...");
    
    if (!data.choices || data.choices.length === 0) {
      console.error("No choices returned from Groq API:", data);
      return new Response(
        JSON.stringify({ error: "No choices returned from Groq API", data }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const message = data.choices[0]?.message;
    if (!message || !message.content) {
      console.error("No message content in Groq API response:", data);
      return new Response(
        JSON.stringify({ error: "No message content in Groq API response", data }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const generatedContent = message.content.trim();
    console.log("Generated content (first 200 chars):", generatedContent.substring(0, 200) + "...");
    
    // Attempt to extract JSON from content (in case there's surrounding text)
    let jsonContent = generatedContent;
    const jsonMatch = generatedContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonContent = jsonMatch[0];
      console.log("Extracted JSON from content");
    }
    
    // Parse the JSON
    let parsedNames;
    try {
      parsedNames = JSON.parse(jsonContent);
      console.log("Successfully parsed JSON response");
      
      // Validate the structure
      if (!parsedNames.names || !Array.isArray(parsedNames.names)) {
        console.error("Invalid JSON structure, missing 'names' array:", parsedNames);
        
        // Attempt to fix common issues
        if (parsedNames.name && typeof parsedNames.name === 'string') {
          // Single name object without array
          parsedNames = { 
            names: [{ 
              name: parsedNames.name,
              niche: parsedNames.niche || niche || 'General',
              target_demographic: parsedNames.target_demographic || 'General audience',
              suggested_platforms: parsedNames.suggested_platforms || ["Spotify", "Apple Podcasts", "YouTube"],
              how_to_grow_it_quickly: parsedNames.how_to_grow_it_quickly || "Social media marketing",
              why_it_would_work: parsedNames.why_it_would_work || "Catchy and memorable name"
            }] 
          };
          console.log("Fixed single name object structure");
        } else {
          return new Response(
            JSON.stringify({ 
              error: "Invalid JSON structure: missing 'names' array", 
              content: generatedContent,
              parsed: parsedNames 
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
    } catch (e) {
      console.error("Failed to parse JSON:", e, "Content:", generatedContent);
      return new Response(
        JSON.stringify({ error: "Failed to parse generated content as JSON", content: generatedContent }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Returning successful response with names");
    return new Response(
      JSON.stringify(parsedNames),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in groq-name-generator:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
