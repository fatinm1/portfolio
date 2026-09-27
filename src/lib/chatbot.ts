import OpenAI from 'openai';
import { getProjects } from './database';

// Any OpenAI-compatible chat API works; defaults to Groq's free tier.
const AI_BASE_URL = process.env.AI_BASE_URL || 'https://api.groq.com/openai/v1';
const AI_MODEL = process.env.AI_MODEL || 'openai/gpt-oss-120b';

// Only create the client if an API key is available; otherwise use keyword fallback replies.
const createAIClient = () => {
  if (!process.env.AI_API_KEY) {
    return null;
  }
  return new OpenAI({
    apiKey: process.env.AI_API_KEY,
    baseURL: AI_BASE_URL,
    timeout: 20_000,
    maxRetries: 1,
  });
};

const aiClient = createAIClient();

// gpt-oss models reason before answering; keep that short and out of the reply.
const isReasoningModel = AI_MODEL.includes('gpt-oss');

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class ChatbotService {
  private static async getSystemPrompt(): Promise<string> {
    try {
      const projects = await getProjects();
      
      const projectsContext = projects.length > 0 
        ? projects.map(p => `- ${p.name}: ${p.description} (Technologies: ${p.technologies.join(', ')})`).join('\n')
        : 'No projects available yet.';

      return `You are Fatin Mojumder's AI assistant. You help people learn about Fatin and his work.

FATIN'S PROFILE:
- Name: Fatin Mojumder
- Title: Senior CS Major at UMBC
- Tagline: "Building smart systems for real-world impact"
- Key Skills: 
  Programming: C++ (3 years), Python (4 years), Java (2 years), JavaScript (2 years), TypeScript (2 years), React (2 years), C (1 year), HTML (2 years), CSS (2 years), UI/UX Principles (2 years)
  Software and Tools: Git (3 years), Figma (2 years), Jira (1 year), Visual Studio Code (3 years), PyCharm (2 years), Fusion 360 (1 year), ArcGIS (1 year), ChatGPT (2 years), Claude (1 year)
  Frameworks & Libraries: Django (2 years), Flask (2 years), FastAPI (1 year), LangChain (2 years), LLaMA (1 year), OpenAI (2 years)
  Databases & DevOps: MySQL (2 years), Oracle Database (1 year), PostgreSQL (1 year), GitHub Actions (1 year), Docker (1 year), Jenkins (1 year)
- Interests: AI/ML, Software Engineering, Problem Solving
- Goals: Building smart systems that make real-world impact, particularly interested in AI/ML applications

FATIN'S PROJECTS:
${projectsContext}

INSTRUCTIONS:
1. Be helpful, friendly, and professional
2. Answer questions about Fatin's skills, experience, projects, and goals
3. If asked about specific projects, provide details from the project list
4. If asked about skills, provide the comprehensive skills list with experience levels
5. If asked about contact info, direct them to the Contact page
6. If asked about resume, mention he's a Senior CS Major at UMBC and direct them to contact him
7. Keep responses concise but informative (under about 120 words)
8. If you don't know something specific, say so and suggest they contact Fatin directly
9. Reply in plain text only: no Markdown, tables, headings, or asterisks

Remember: You're representing Fatin professionally, so be enthusiastic about his work and skills!`;
    } catch (error) {
      console.error('Error getting projects for context:', error);
      return `You are Fatin Mojumder's AI assistant. Fatin is a Senior CS Major at UMBC passionate about building smart systems for real-world impact.`;
    }
  }

  static async generateResponse(
    userMessage: string,
    conversationHistory: ChatMessage[] = []
  ): Promise<{ response: string; usingFallback: boolean }> {
    // If no AI client is available, use fallback immediately
    if (!aiClient) {
      return { response: await this.getFallbackResponse(userMessage), usingFallback: true };
    }

    try {
      const systemPrompt = await this.getSystemPrompt();
      
      const messages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: userMessage }
      ];

      const completion = await aiClient.chat.completions.create({
        model: AI_MODEL,
        messages,
        temperature: 0.7,
        ...(isReasoningModel
          ? {
              // Reasoning tokens count toward the cap, so leave room beyond the visible reply.
              max_completion_tokens: 1024,
              reasoning_effort: 'low' as const,
              // Groq-specific: omit the reasoning text from the response.
              include_reasoning: false,
            }
          : { max_tokens: 300 }),
      } as OpenAI.Chat.ChatCompletionCreateParamsNonStreaming);

      const content = completion.choices[0]?.message?.content?.trim();
      if (!content) {
        return { response: await this.getFallbackResponse(userMessage), usingFallback: true };
      }
      return { response: content, usingFallback: false };
    } catch (error) {
      console.error('AI API error:', error);
      
      // Fallback to keyword-based responses if the AI API fails (e.g. rate limited)
      return { response: await this.getFallbackResponse(userMessage), usingFallback: true };
    }
  }

  private static async getFallbackResponse(userMessage: string): Promise<string> {
    const lowerMessage = userMessage.toLowerCase();
    
    try {
      const projects = await getProjects();
      
      if (lowerMessage.includes('who') && lowerMessage.includes('fatin')) {
        return `Fatin Mojumder is a Senior CS Major at UMBC. He's passionate about building smart systems for real-world impact, with expertise in AI/ML, software engineering, and web development.`;
      }
      
      if (lowerMessage.includes('skill') || lowerMessage.includes('technology')) {
        return `Fatin has extensive skills across multiple areas:

Programming: C++ (3 years), Python (4 years), Java (2 years), JavaScript (2 years), TypeScript (2 years), React (2 years), C (1 year), HTML (2 years), CSS (2 years), UI/UX Principles (2 years)

Software and Tools: Git (3 years), Figma (2 years), Jira (1 year), Visual Studio Code (3 years), PyCharm (2 years), Fusion 360 (1 year), ArcGIS (1 year), ChatGPT (2 years), Claude (1 year)

Frameworks & Libraries: Django (2 years), Flask (2 years), FastAPI (1 year), LangChain (2 years), LLaMA (1 year), OpenAI (2 years)

Databases & DevOps: MySQL (2 years), Oracle Database (1 year), PostgreSQL (1 year), GitHub Actions (1 year), Docker (1 year), Jenkins (1 year)

He's particularly strong in AI/ML, software engineering, and web development. You can also visit the Skills page for a visual representation of his experience levels.`;
      }
      
      if (lowerMessage.includes('project')) {
        if (projects.length === 0) {
          return `Fatin is currently working on building his project portfolio. Check back soon for updates!`;
        }
        const projectNames = projects.map((p: any) => p.name).join(', ');
        return `Fatin has worked on several projects including: ${projectNames}. You can find more details about each project on the Projects page.`;
      }
      
      if (lowerMessage.includes('resume') || lowerMessage.includes('experience')) {
        return `Fatin is a Senior CS Major at UMBC with a strong foundation in computer science and practical experience in software development. You can contact him for his full resume.`;
      }
      
      if (lowerMessage.includes('contact') || lowerMessage.includes('email')) {
        return `You can reach Fatin through the Contact page on this website, or connect with him on LinkedIn and GitHub.`;
      }
      
      if (lowerMessage.includes('goal') || lowerMessage.includes('future')) {
        return `Fatin is focused on building smart systems that make a real-world impact. He's particularly interested in AI/ML applications and software engineering challenges.`;
      }

      return `Sorry I am not able to answer this question. Please ask me about Fatin's skills, projects, experience, or goals.`;
    } catch (error) {
      return `Sorry I am not able to answer this question. Please ask me about Fatin's skills, projects, experience, or goals.`;
    }
  }
} 