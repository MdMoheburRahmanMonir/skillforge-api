"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chat = chat;
exports.chatStream = chatStream;
exports.getConversations = getConversations;
exports.generateContent = generateContent;
exports.getRecommendations = getRecommendations;
exports.classifyContent = classifyContent;
const ai_1 = require("../config/ai");
const Course_1 = require("../models/Course");
const Conversation_1 = require("../models/Conversation");
const SYSTEM_PROMPT = `You are SkillForge AI, an expert career and learning advisor for the SkillForge platform.
SkillForge is an AI-powered learning marketplace with courses in Web Development, Data Science, AI/ML, Cloud Computing, Cybersecurity, UI/UX Design, Mobile Development, and DevOps.
Help users choose courses, plan learning paths, answer career questions, and navigate the platform.
Be concise, actionable, and friendly. Reference specific skills and technologies when relevant.`;
function fallbackChat(message) {
    const lower = message.toLowerCase();
    if (lower.includes("recommend") || lower.includes("course")) {
        return "Based on current trends, I recommend starting with our Web Development Fundamentals or Python for Data Science courses. Visit the Explore page to filter by category and level. Would you like guidance on a specific career path?";
    }
    if (lower.includes("price") || lower.includes("cost")) {
        return "SkillForge courses range from free introductory modules to premium certifications under $200. Use the price filter on the Explore page to find courses within your budget.";
    }
    if (lower.includes("hello") || lower.includes("hi")) {
        return "Hello! I'm SkillForge AI, your learning advisor. I can help you find courses, plan career paths, or answer questions about our platform. What would you like to learn today?";
    }
    return "I'm here to help you navigate SkillForge and plan your learning journey. You can ask me about course recommendations, career paths, skill requirements, or how to use platform features like AI Content Generator and Smart Recommendations.";
}
async function chat(req, res) {
    const { message, conversationId } = req.body;
    if (!message?.trim())
        return res.status(400).json({ message: "Message is required" });
    let conversation = conversationId
        ? await Conversation_1.Conversation.findOne({ _id: conversationId, userId: req.user._id })
        : null;
    if (!conversation) {
        conversation = await Conversation_1.Conversation.create({
            userId: req.user._id,
            title: message.slice(0, 50),
            messages: [],
        });
    }
    conversation.messages.push({ role: "user", content: message, timestamp: new Date() });
    let reply;
    if ((0, ai_1.hasAIKey)()) {
        const history = conversation.messages.slice(-10).map((m) => ({
            role: m.role,
            content: m.content,
        }));
        const completion = await ai_1.aiClient.chat.completions.create({
            model: ai_1.AI_MODEL,
            messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
            max_tokens: 800,
        });
        reply = completion.choices[0]?.message?.content || fallbackChat(message);
    }
    else {
        reply = fallbackChat(message);
    }
    conversation.messages.push({ role: "assistant", content: reply, timestamp: new Date() });
    await conversation.save();
    const followUps = [
        "Recommend courses for my career goals",
        "What's the best learning path for AI?",
        "How do I filter courses by price?",
    ];
    res.json({ reply, conversationId: conversation._id, followUps });
}
async function chatStream(req, res) {
    const { message, conversationId } = req.body;
    if (!message?.trim())
        return res.status(400).json({ message: "Message is required" });
    let conversation = conversationId
        ? await Conversation_1.Conversation.findOne({ _id: conversationId, userId: req.user._id })
        : null;
    if (!conversation) {
        conversation = await Conversation_1.Conversation.create({
            userId: req.user._id,
            title: message.slice(0, 50),
            messages: [],
        });
    }
    conversation.messages.push({ role: "user", content: message, timestamp: new Date() });
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    let fullReply = "";
    if ((0, ai_1.hasAIKey)()) {
        const history = conversation.messages.slice(-10).map((m) => ({
            role: m.role,
            content: m.content,
        }));
        const stream = await ai_1.aiClient.chat.completions.create({
            model: ai_1.AI_MODEL,
            messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
            max_tokens: 800,
            stream: true,
        });
        for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || "";
            if (text) {
                fullReply += text;
                res.write(`data: ${JSON.stringify({ text })}\n\n`);
            }
        }
    }
    else {
        fullReply = fallbackChat(message);
        for (const word of fullReply.split(" ")) {
            res.write(`data: ${JSON.stringify({ text: word + " " })}\n\n`);
            await new Promise((r) => setTimeout(r, 30));
        }
    }
    conversation.messages.push({ role: "assistant", content: fullReply, timestamp: new Date() });
    await conversation.save();
    res.write(`data: ${JSON.stringify({ done: true, conversationId: conversation._id })}\n\n`);
    res.end();
}
async function getConversations(req, res) {
    const conversations = await Conversation_1.Conversation.find({ userId: req.user._id })
        .select("title updatedAt messages")
        .sort({ updatedAt: -1 })
        .limit(20);
    res.json({ conversations });
}
async function generateContent(req, res) {
    const { topic, type, tone, length, keywords } = req.body;
    if (!topic)
        return res.status(400).json({ message: "Topic is required" });
    const lengthGuide = length === "short" ? "150-250 words" : length === "long" ? "600-800 words" : "350-500 words";
    const prompt = `Generate a ${type || "blog article"} about "${topic}".
Tone: ${tone || "professional and engaging"}
Target length: ${lengthGuide}
${keywords?.length ? `Include these keywords: ${keywords.join(", ")}` : ""}
Format with a compelling title, introduction, structured sections with headings, and a conclusion.
Make it educational and actionable for learners on a skill development platform.`;
    let content;
    if ((0, ai_1.hasAIKey)()) {
        const completion = await ai_1.aiClient.chat.completions.create({
            model: ai_1.AI_MODEL,
            messages: [
                { role: "system", content: "You are an expert educational content writer for SkillForge AI learning platform." },
                { role: "user", content: prompt },
            ],
            max_tokens: length === "long" ? 1500 : length === "short" ? 500 : 1000,
        });
        content = completion.choices[0]?.message?.content || "";
    }
    else {
        content = `# ${topic}: A Complete Guide\n\n## Introduction\n${topic} is one of the most in-demand skills in today's technology landscape. Whether you're a beginner or looking to advance your career, mastering ${topic} opens doors to exciting opportunities.\n\n## Why Learn ${topic}?\n- High market demand with competitive salaries\n- Versatile applications across industries\n- Strong community support and learning resources\n- Foundation for advanced specializations\n\n## Getting Started\nBegin with fundamentals, practice through hands-on projects, and build a portfolio. SkillForge offers structured courses tailored to every skill level.\n\n## Key Takeaways\nConsistent practice, real-world projects, and community engagement are the keys to mastering ${topic}. Start your journey today on SkillForge.`;
    }
    res.json({ content, topic, type, tone, length });
}
async function getRecommendations(req, res) {
    const { interests, category, level, budget } = req.query;
    const userInterests = interests
        ? interests.split(",")
        : req.user?.interests || [];
    const filter = {};
    if (category && category !== "all")
        filter.category = category;
    if (level && level !== "all")
        filter.level = level;
    if (budget)
        filter.price = { $lte: parseFloat(budget) };
    let courses = await Course_1.Course.find(filter).sort({ rating: -1 }).limit(20);
    if (userInterests.length > 0) {
        const interestRegex = userInterests.map((i) => new RegExp(i, "i"));
        courses = await Course_1.Course.find({
            ...filter,
            $or: [
                { category: { $in: userInterests } },
                { tags: { $in: userInterests } },
                { title: { $in: interestRegex } },
            ],
        })
            .sort({ rating: -1 })
            .limit(12);
        if (courses.length < 4) {
            courses = await Course_1.Course.find(filter).sort({ rating: -1 }).limit(12);
        }
    }
    let aiInsight = "";
    if ((0, ai_1.hasAIKey)() && userInterests.length > 0) {
        const courseList = courses.slice(0, 6).map((c) => `- ${c.title} (${c.category}, ${c.level}, $${c.price})`).join("\n");
        const completion = await ai_1.aiClient.chat.completions.create({
            model: ai_1.AI_MODEL,
            messages: [
                {
                    role: "user",
                    content: `User interests: ${userInterests.join(", ")}\nAvailable courses:\n${courseList}\n\nProvide a 2-3 sentence personalized learning recommendation explaining why these courses match their goals.`,
                },
            ],
            max_tokens: 200,
        });
        aiInsight = completion.choices[0]?.message?.content || "";
    }
    else {
        aiInsight = `Based on your interests in ${userInterests.join(", ") || "technology"}, we've curated top-rated courses that align with industry demand and career growth potential.`;
    }
    res.json({
        recommendations: courses,
        aiInsight,
        filters: { interests: userInterests, category, level, budget },
    });
}
async function classifyContent(req, res) {
    const { title, description } = req.body;
    if (!title)
        return res.status(400).json({ message: "Title is required" });
    const categories = ["Web Development", "Data Science", "AI/ML", "Cloud Computing", "Cybersecurity", "UI/UX Design", "Mobile Development", "DevOps"];
    const levels = ["Beginner", "Intermediate", "Advanced"];
    let tags = [];
    let category = "Web Development";
    let level = "Beginner";
    if ((0, ai_1.hasAIKey)()) {
        const completion = await ai_1.aiClient.chat.completions.create({
            model: ai_1.AI_MODEL,
            messages: [
                {
                    role: "user",
                    content: `Classify this course:\nTitle: ${title}\nDescription: ${description || ""}\n\nRespond in JSON only: {"category":"one of ${categories.join("|")}","level":"one of ${levels.join("|")}","tags":["tag1","tag2","tag3"]}`,
                },
            ],
            max_tokens: 200,
        });
        try {
            const parsed = JSON.parse(completion.choices[0]?.message?.content || "{}");
            category = parsed.category || category;
            level = parsed.level || level;
            tags = parsed.tags || [];
        }
        catch {
            tags = title.toLowerCase().split(" ").slice(0, 4);
        }
    }
    else {
        const lower = `${title} ${description}`.toLowerCase();
        if (lower.includes("python") || lower.includes("data"))
            category = "Data Science";
        else if (lower.includes("ai") || lower.includes("machine"))
            category = "AI/ML";
        else if (lower.includes("cloud") || lower.includes("aws"))
            category = "Cloud Computing";
        tags = [category, level, "Online Learning"];
    }
    res.json({ category, level, tags });
}
