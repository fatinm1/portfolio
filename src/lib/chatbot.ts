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

// Keep in sync with the homepage (src/components/home/*).
const PROFILE = `FATIN'S PROFILE:
- Name: Fatin Mojumder, software engineer based in Elkridge, MD
- Education: B.S. Computer Science, University of Maryland, Baltimore County (UMBC). He is a senior in his final year, graduating December 2026
- Availability: open to new grad software engineering roles starting January 2027
- Focus: AI agents, LLM inference engines, and full stack apps
- Currently: writing an LLM inference engine in C++ and measuring exactly why it is slower than llama.cpp. It runs Llama 3.2 at 12.6 tokens per second on an Apple M4. The writeup is on the Writing page (/writing/llm-engine-benchmark).

EXPERIENCE:
- Undergraduate Research Assistant, UMBC Computer Science (2026): Built a Python tool that checked 60+ quantum simulation runs against reference solutions, cutting manual review from 4 hours to 5 minutes.
- Part Time Software Engineer (Contract), JMC Family Office (2025): Built the API and data model for an AI contract review prototype with the firm's VP. Review time went from 40 to 5 minutes per document in testing.
- Information Technology Assistant, UMBC Graduate Admissions (2023 to 2025): Processed records for 5,000+ applicants a cycle and wrote Python scripts to automate parts of data entry.

SKILLS:
- Languages: Python, C++, TypeScript, JavaScript, Java, C, HTML, CSS
- Frameworks and libraries: Next.js, React, FastAPI, Django, Flask, LangChain
- AI: LLM inference, multi-agent systems, MCP, OpenAI and Llama models
- Data and infrastructure: PostgreSQL, MySQL, Oracle Database, Docker, GitHub Actions, Jenkins
- Tools: Git, Figma, Jira

CONTACT:
- Email: fatinm1@umbc.edu
- GitHub: github.com/fatinm1
- LinkedIn: linkedin.com/in/fatin-mojumder
- Or the contact form at the bottom of the homepage`;

export class ChatbotService {
  private static async getSystemPrompt(): Promise<string> {
    let projectsContext = 'Project details are unavailable right now; suggest the Projects section of the homepage.';
    try {
      const projects = await getProjects();
      projectsContext = projects.length > 0
        ? projects.map(p => `- ${p.name}${p.status ? ` [${p.status}]` : ''}: ${p.description} (Technologies: ${p.technologies.join(', ')})`).join('\n')
        : 'No projects listed yet.';
    } catch (error) {
      console.error('Error getting projects for context:', error);
    }

    return `You are Fatin Mojumder's AI assistant on his portfolio site. You help visitors, often recruiters, learn about Fatin and his work.

${PROFILE}

FATIN'S PROJECTS:
${projectsContext}

INSTRUCTIONS:
1. Be helpful, friendly, and professional
2. Answer questions about Fatin's skills, experience, projects, availability and goals using only the facts above
3. If asked about specific projects, provide details from the project list
4. If asked about hiring or availability, say he is open to new grad roles starting January 2027 and share his email
5. If asked about contact info, give his email and mention the contact form on the homepage
6. If asked about his resume, point to the Resume button at the top of the homepage
7. Keep responses concise but informative (under about 120 words)
8. If you don't know something specific, say so and suggest emailing Fatin directly
9. Reply in plain text only: no Markdown, tables, headings, or asterisks
10. Do not use em dashes; use commas or separate sentences instead
11. Write the email address exactly as fatinm1@umbc.edu

Remember: You're representing Fatin professionally, so be enthusiastic about his work!`;
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

      // Strip zero-width characters the model sometimes inserts (they break copied email addresses).
      const content = completion.choices[0]?.message?.content?.replace(/[\u200B-\u200D\u2060\uFEFF]/g, '').trim();
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
        return `Fatin Mojumder is a software engineer finishing a B.S. in Computer Science at UMBC (December 2026). He builds AI agents, LLM inference engines and full stack apps, and is open to new grad roles starting January 2027.`;
      }

      if (['hire', 'hiring', 'role', 'job', 'available', 'availability', 'grad', 'intern'].some((w) => lowerMessage.includes(w))) {
        return `Fatin is open to new grad software engineering roles starting January 2027. You can reach him at fatinm1@umbc.edu or through the contact form at the bottom of the homepage.`;
      }

      if (lowerMessage.includes('skill') || lowerMessage.includes('technology') || lowerMessage.includes('stack')) {
        return `Fatin works mostly in Python, C++ and TypeScript. He builds with Next.js, React, FastAPI, Django and LangChain, uses PostgreSQL, MySQL and Docker, and focuses on LLM inference and multi-agent systems.`;
      }

      if (lowerMessage.includes('project')) {
        if (projects.length === 0) {
          return `Fatin's projects are listed in the Projects section of the homepage.`;
        }
        const projectNames = projects.map((p: any) => p.name).join(', ');
        return `Fatin has worked on several projects including: ${projectNames}. You can find more details about each one in the Projects section of the homepage.`;
      }

      if (lowerMessage.includes('resume') || lowerMessage.includes('experience') || lowerMessage.includes('work')) {
        return `Fatin has been an Undergraduate Research Assistant in UMBC Computer Science, a part time software engineer at JMC Family Office building an AI contract review prototype, and an IT Assistant at UMBC Graduate Admissions. His resume is linked from the Resume button at the top of the homepage.`;
      }

      if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('reach')) {
        return `You can email Fatin at fatinm1@umbc.edu, use the contact form at the bottom of the homepage, or find him on GitHub (fatinm1) and LinkedIn (fatin-mojumder).`;
      }

      if (lowerMessage.includes('goal') || lowerMessage.includes('future')) {
        return `Fatin wants to build AI systems that hold up in the real world, especially agents and fast LLM inference. He is looking for a new grad role starting January 2027.`;
      }

      return `Sorry I am not able to answer this question. Please ask me about Fatin's skills, projects, experience, or goals.`;
    } catch (error) {
      return `Sorry I am not able to answer this question. Please ask me about Fatin's skills, projects, experience, or goals.`;
    }
  }
} 