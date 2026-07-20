import { OpenAI } from "openai";
import type { Request, Response } from "express";
import crypto from "crypto";
import dotenv from "dotenv";
import { db } from "../../db/mongodb.js";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.AI_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const MODEL = process.env.AI_MODEL || "openai/gpt-oss-20b";
console.log("process.env.AI_MODEL value:", process.env.AI_MODEL);
console.log("MODEL constant value:", MODEL);
console.log("=================");

const SYSTEM_PROMPT = `You are SkillForge AI, an intelligent learning advisor on the SkillForge platform. You help users find courses, create learning paths, answer questions about skills and careers, and guide them through the platform's features. Be concise, encouraging, and practical. Keep responses under 200 words unless asked for detail.`;

interface ConversationEntry {
  messages: { role: "system" | "user" | "assistant"; content: string }[];
  createdAt: Date;
}

const conversations = new Map<string, ConversationEntry>();

export const chat = async (req: Request, res: Response) => {
  try {
    const { message, conversationId } = req.body;
    if (!message) {
      return res.status(400).json({ error: "message is required" });
    }

    const cid = conversationId || crypto.randomUUID();
    if (!conversations.has(cid)) {
      conversations.set(cid, {
        messages: [{ role: "system", content: SYSTEM_PROMPT }],
        createdAt: new Date(),
      });
    }

    const conv = conversations.get(cid)!;
    conv.messages.push({ role: "user", content: message });

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: conv.messages,
    });

    const reply =
      completion.choices[0]?.message?.content ||
      "I'm sorry, I couldn't generate a response.";

    conv.messages.push({ role: "assistant", content: reply });

    res.json({
      reply,
      conversationId: cid,
      followUps: [
        "Tell me more",
        "Recommend similar courses",
        "What's next in my learning path?",
      ],
    });
  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ error: "Failed to process chat message" });
  }
};

export const streamChat = async (req: Request, res: Response) => {
  try {
    const { message, conversationId } = req.body;
    if (!message) {
      return res.status(400).json({ error: "message is required" });
    }

    const cid = conversationId || crypto.randomUUID();
    if (!conversations.has(cid)) {
      conversations.set(cid, {
        messages: [{ role: "system", content: SYSTEM_PROMPT }],
        createdAt: new Date(),
      });
    }

    const conv = conversations.get(cid)!;
    conv.messages.push({ role: "user", content: message });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const stream = await openai.chat.completions.create({
      model: MODEL,
      messages: conv.messages,
      stream: true,
    });

    let fullReply = "";
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content || "";
      if (delta) {
        fullReply += delta;
        res.write(`data: ${JSON.stringify({ text: delta })}\n\n`);
      }
    }

    conv.messages.push({ role: "assistant", content: fullReply });

    res.write(
      `data: ${JSON.stringify({
        done: true,
        conversationId: cid,
        followUps: [
          "Tell me more",
          "Recommend similar courses",
          "What's next in my learning path?",
        ],
      })}\n\n`
    );
    res.end();
  } catch (error) {
    console.error("AI Stream Chat Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to process streaming chat" });
    } else {
      res.write(
        `data: ${JSON.stringify({ error: "Stream error occurred" })}\n\n`
      );
      res.end();
    }
  }
};

export const generate = async (req: Request, res: Response) => {
  try {
    const { topic, type, tone, length, keywords } = req.body;
    if (!topic) {
      return res.status(400).json({ error: "topic is required" });
    }

    const lengthMap: Record<string, string> = {
      short: "2-3 paragraphs",
      medium: "4-5 paragraphs",
      long: "6-8 paragraphs",
    };
    const lengthInstruction = lengthMap[length as string] || "4-5 paragraphs";

    const prompt = `Create a ${type} about "${topic}".
Tone: ${tone}.
Length: ${lengthInstruction}.
${keywords?.length ? `Include these keywords: ${keywords.join(", ")}.` : ""}
Format the content with clear paragraphs separated by blank lines. Use plain text only — no markdown or headings.`;

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
    });

    const content = completion.choices[0]?.message?.content || "";

    res.json({ content });
  } catch (error) {
    console.error("AI Generate Error:", error);
    res.status(500).json({ error: "Failed to generate content" });
  }
};

export const recommendations = async (req: Request, res: Response) => {
  try {
    const { interests, category, level, budget } = req.query;

    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;
    if (level) filter.level = level;
    if (budget) filter.price = { $lte: parseFloat(budget as string) };

    const userInterests = interests
      ? (interests as string).split(",").filter(Boolean)
      : [];

    if (userInterests.length > 0) {
      filter.$or = [
        { category: { $in: userInterests } },
        { tags: { $in: userInterests } },
      ];
    }

    let courses = await db
      .collection("courses")
      .find(filter)
      .sort({ rating: -1 })
      .limit(4)
      .toArray();

    let aiInsight = "";

    if (courses.length > 0) {
      const courseList = courses
        .map(
          (c: Record<string, unknown>) =>
            `- ${c.title} (${c.category}, ${c.level}, $${c.price})`
        )
        .join("\n");

      try {
        const completion = await openai.chat.completions.create({
          model: MODEL,
          messages: [
            {
              role: "user",
              content: `User interests: ${userInterests.join(", ") || "technology"}\nAvailable courses:\n${courseList}\n\nProvide a 2-3 sentence personalized learning recommendation explaining why these courses match their goals.`,
            },
          ],
          max_tokens: 200,
        });
        aiInsight =
          completion.choices[0]?.message?.content ||
          `Based on your ${userInterests.join(", ") || "selected"} preferences, here are the top courses that match your interests.`;
      } catch {
        aiInsight = `Based on your ${userInterests.join(", ") || "selected"} preferences, here are the top-rated courses that match your interests.`;
      }
    } else {
      aiInsight = "No courses match your current filters. Try adjusting your preferences above.";
    }

    res.json({ recommendations: courses, aiInsight });
  } catch (error) {
    console.error("AI Recommendations Error:", error);
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
};

export const classify = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({ error: "title is required" });
    }

    const prompt = `Analyze this course and classify it.

Title: "${title}"
Description: "${description || ""}"

Respond with valid JSON only, exactly matching this structure — no markdown, no explanation outside the JSON:
{
  "category": "one of: Web Development, Data Science, AI/ML, Cloud Computing, Cybersecurity, UI/UX Design, Mobile Development, DevOps, Business, Other",
  "level": "one of: Beginner, Intermediate, Advanced",
  "tags": ["3-5 relevant tags as strings"]
}`;

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(raw);

    res.json({
      category: parsed.category || "Other",
      level: parsed.level || "Beginner",
      tags: parsed.tags || [],
    });
  } catch (error) {
    console.error("AI Classify Error:", error);
    res.status(500).json({ error: "Failed to classify course" });
  }
};
