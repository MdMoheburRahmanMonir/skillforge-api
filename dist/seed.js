"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("./config/db");
const User_1 = require("./models/User");
const Course_1 = require("./models/Course");
const Review_1 = require("./models/Review");
const BlogPost_1 = require("./models/BlogPost");
dotenv_1.default.config();
const courses = [
    {
        title: "Full Stack Web Development Bootcamp",
        shortDescription: "Master React, Node.js, and MongoDB to build production-ready web applications from scratch.",
        fullDescription: "This comprehensive bootcamp covers HTML, CSS, JavaScript, React, Node.js, Express, and MongoDB. You'll build 5 real-world projects including an e-commerce platform and a social media app. Learn modern development workflows with Git, CI/CD, and deployment strategies. Perfect for aspiring full-stack developers who want job-ready skills in 12 weeks.",
        price: 149.99,
        category: "Web Development",
        level: "Beginner",
        duration: "12 weeks",
        rating: 4.9,
        reviewCount: 342,
        instructor: "Sarah Mitchell",
        imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=500&fit=crop",
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
            "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop",
        ],
        location: "Online",
        tags: ["React", "Node.js", "MongoDB", "JavaScript"],
    },
    {
        title: "Python for Data Science & Machine Learning",
        shortDescription: "Learn Python, Pandas, NumPy, Scikit-learn, and TensorFlow for data analysis and ML models.",
        fullDescription: "Dive deep into data science with Python. Cover data wrangling with Pandas, statistical analysis, visualization with Matplotlib and Seaborn, and machine learning with Scikit-learn and TensorFlow. Work on real datasets from finance, healthcare, and e-commerce. Build predictive models and deploy them as APIs.",
        price: 129.99,
        category: "Data Science",
        level: "Intermediate",
        duration: "10 weeks",
        rating: 4.8,
        reviewCount: 256,
        instructor: "Dr. James Chen",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop",
            "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=500&fit=crop",
        ],
        location: "Online",
        tags: ["Python", "Pandas", "Machine Learning", "TensorFlow"],
    },
    {
        title: "Generative AI & LLM Engineering",
        shortDescription: "Build AI agents, RAG systems, and production LLM applications with OpenAI and LangChain.",
        fullDescription: "Master the art of building with Large Language Models. Learn prompt engineering, fine-tuning, RAG architectures, agent workflows with LangChain, and deploying AI applications at scale. Build a customer support bot, document analyzer, and AI content generator as portfolio projects.",
        price: 179.99,
        category: "AI/ML",
        level: "Advanced",
        duration: "8 weeks",
        rating: 4.95,
        reviewCount: 189,
        instructor: "Alex Rivera",
        imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop",
            "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=500&fit=crop",
        ],
        location: "Online",
        tags: ["LLM", "LangChain", "OpenAI", "RAG"],
    },
    {
        title: "AWS Cloud Solutions Architect",
        shortDescription: "Design and deploy scalable cloud infrastructure on Amazon Web Services with hands-on labs.",
        fullDescription: "Prepare for AWS Solutions Architect certification while building real cloud infrastructure. Cover EC2, S3, RDS, Lambda, VPC, CloudFront, and more. Learn cost optimization, security best practices, and multi-region deployment strategies used by top tech companies.",
        price: 159.99,
        category: "Cloud Computing",
        level: "Intermediate",
        duration: "10 weeks",
        rating: 4.7,
        reviewCount: 198,
        instructor: "Michael Torres",
        imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop",
        ],
        location: "Online",
        tags: ["AWS", "Cloud", "DevOps", "Infrastructure"],
    },
    {
        title: "Cybersecurity Fundamentals & Ethical Hacking",
        shortDescription: "Learn network security, penetration testing, and security best practices for modern applications.",
        fullDescription: "Build a strong foundation in cybersecurity. Cover network protocols, encryption, vulnerability assessment, penetration testing methodologies, and security compliance (SOC 2, GDPR). Practice in controlled lab environments with Kali Linux and industry-standard tools.",
        price: 139.99,
        category: "Cybersecurity",
        level: "Beginner",
        duration: "9 weeks",
        rating: 4.6,
        reviewCount: 167,
        instructor: "Lisa Park",
        imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=400&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=500&fit=crop",
        ],
        location: "Online",
        tags: ["Security", "Ethical Hacking", "Network", "Compliance"],
    },
    {
        title: "UI/UX Design Masterclass with Figma",
        shortDescription: "Create stunning user interfaces and seamless experiences using Figma and design systems.",
        fullDescription: "From user research to high-fidelity prototypes, master the complete UX design process. Learn wireframing, user flows, design systems, accessibility standards, and usability testing. Build a portfolio with 3 case studies that showcase your design thinking and visual craft.",
        price: 99.99,
        category: "UI/UX Design",
        level: "Beginner",
        duration: "7 weeks",
        rating: 4.85,
        reviewCount: 278,
        instructor: "Emma Watson",
        imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=500&fit=crop",
        ],
        location: "Online",
        tags: ["Figma", "UI Design", "UX Research", "Prototyping"],
    },
    {
        title: "React Native Mobile App Development",
        shortDescription: "Build cross-platform iOS and Android apps with React Native, Expo, and native modules.",
        fullDescription: "Create production-quality mobile applications with React Native. Learn navigation, state management, API integration, push notifications, and app store deployment. Build a fitness tracker and food delivery app as capstone projects with real device testing.",
        price: 119.99,
        category: "Mobile Development",
        level: "Intermediate",
        duration: "8 weeks",
        rating: 4.75,
        reviewCount: 145,
        instructor: "David Kim",
        imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=500&fit=crop",
        ],
        location: "Online",
        tags: ["React Native", "Expo", "iOS", "Android"],
    },
    {
        title: "DevOps Engineering with Docker & Kubernetes",
        shortDescription: "Automate deployments with Docker containers, Kubernetes orchestration, and CI/CD pipelines.",
        fullDescription: "Master modern DevOps practices used at scale. Learn containerization with Docker, orchestration with Kubernetes, infrastructure as code with Terraform, and CI/CD with GitHub Actions. Set up monitoring with Prometheus and Grafana for production-grade systems.",
        price: 169.99,
        category: "DevOps",
        level: "Advanced",
        duration: "11 weeks",
        rating: 4.8,
        reviewCount: 134,
        instructor: "Robert Singh",
        imageUrl: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600&h=400&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=500&fit=crop",
        ],
        location: "Online",
        tags: ["Docker", "Kubernetes", "CI/CD", "Terraform"],
    },
    {
        title: "JavaScript Advanced Patterns & Performance",
        shortDescription: "Deep dive into closures, prototypes, async patterns, and performance optimization in JavaScript.",
        fullDescription: "Elevate your JavaScript skills to senior level. Master advanced patterns including closures, currying, memoization, event loop mechanics, Web Workers, and memory management. Learn to write performant code that scales in large applications.",
        price: 89.99,
        category: "Web Development",
        level: "Advanced",
        duration: "6 weeks",
        rating: 4.7,
        reviewCount: 112,
        instructor: "Sarah Mitchell",
        imageUrl: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=600&h=400&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=800&h=500&fit=crop",
        ],
        location: "Online",
        tags: ["JavaScript", "Performance", "Patterns", "Advanced"],
    },
    {
        title: "SQL & Database Design for Developers",
        shortDescription: "Master relational databases, complex queries, indexing, and database design principles.",
        fullDescription: "Build a solid foundation in database engineering. Learn SQL from basics to advanced queries, database normalization, indexing strategies, query optimization, and working with PostgreSQL and MongoDB. Design schemas for real-world applications.",
        price: 79.99,
        category: "Data Science",
        level: "Beginner",
        duration: "5 weeks",
        rating: 4.65,
        reviewCount: 203,
        instructor: "Dr. James Chen",
        imageUrl: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&h=400&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=500&fit=crop",
        ],
        location: "Online",
        tags: ["SQL", "PostgreSQL", "Database", "MongoDB"],
    },
    {
        title: "Blockchain Development with Solidity",
        shortDescription: "Build decentralized applications on Ethereum using Solidity smart contracts and Web3.js.",
        fullDescription: "Enter the world of blockchain development. Learn Solidity, smart contract security, DeFi protocols, NFT standards (ERC-721/1155), and Web3 integration. Deploy contracts to testnets and build a decentralized voting application.",
        price: 189.99,
        category: "Web Development",
        level: "Advanced",
        duration: "9 weeks",
        rating: 4.5,
        reviewCount: 87,
        instructor: "Alex Rivera",
        imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=500&fit=crop",
        ],
        location: "Online",
        tags: ["Blockchain", "Solidity", "Web3", "Ethereum"],
    },
    {
        title: "Digital Marketing Analytics with Google Tools",
        shortDescription: "Track, analyze, and optimize marketing campaigns using Google Analytics and Data Studio.",
        fullDescription: "Learn data-driven marketing with Google Analytics 4, Tag Manager, Search Console, and Looker Studio. Set up conversion tracking, build dashboards, run A/B tests, and derive actionable insights to improve ROI on marketing spend.",
        price: 69.99,
        category: "Data Science",
        level: "Beginner",
        duration: "4 weeks",
        rating: 4.55,
        reviewCount: 156,
        instructor: "Emma Watson",
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
        ],
        location: "Online",
        tags: ["Analytics", "Marketing", "Google", "Data"],
    },
];
const blogs = [
    {
        title: "How AI is Transforming Online Learning in 2026",
        slug: "ai-transforming-online-learning-2026",
        excerpt: "Discover how artificial intelligence is personalizing education and making learning more accessible than ever.",
        content: "Artificial intelligence is revolutionizing the way we learn online. From personalized learning paths to intelligent tutoring systems, AI is making education more adaptive and effective...\n\nAdaptive learning platforms now analyze student performance in real-time, adjusting content difficulty and pacing to match individual needs. AI-powered chatbots provide 24/7 support, answering questions and guiding learners through complex topics.\n\nAt SkillForge, we integrate AI at every level — from smart course recommendations to AI-generated study materials. The future of learning is here, and it's intelligent.",
        author: "Alex Rivera",
        imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=500&fit=crop",
        category: "AI & Education",
        readTime: "5 min read",
    },
    {
        title: "Top 10 In-Demand Tech Skills for Career Growth",
        slug: "top-tech-skills-career-growth",
        excerpt: "The tech skills employers are actively seeking in 2026 and how to acquire them efficiently.",
        content: "The technology job market continues to evolve rapidly. Here are the top skills that will define successful careers in 2026:\n\n1. Generative AI & LLM Engineering\n2. Cloud Architecture (AWS/Azure/GCP)\n3. Full Stack Development\n4. Cybersecurity\n5. Data Engineering\n6. DevOps & Platform Engineering\n7. UI/UX Design\n8. Mobile Development\n9. Blockchain Development\n10. Product Management\n\nSkillForge offers curated learning paths for each of these skills, with AI-powered recommendations to help you prioritize based on your career goals.",
        author: "Sarah Mitchell",
        imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=500&fit=crop",
        category: "Career",
        readTime: "7 min read",
    },
    {
        title: "Building Your First AI Agent: A Step-by-Step Guide",
        slug: "building-first-ai-agent-guide",
        excerpt: "Learn the fundamentals of agentic AI and build your first intelligent agent from scratch.",
        content: "Agentic AI represents the next frontier in artificial intelligence. Unlike simple chatbots, AI agents can reason, plan, and take actions to accomplish complex goals.\n\nIn this guide, we walk through building a learning advisor agent that can recommend courses, answer questions, and track user progress. We'll cover prompt engineering, tool usage, memory management, and deployment strategies.\n\nBy the end, you'll have a working agent and the knowledge to build more sophisticated AI systems.",
        author: "Dr. James Chen",
        imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=500&fit=crop",
        category: "Tutorial",
        readTime: "10 min read",
    },
];
async function seed() {
    const uri = process.env.MONGODB_URI;
    await (0, db_1.connectDB)(uri);
    await Promise.all([User_1.User.deleteMany({}), Course_1.Course.deleteMany({}), Review_1.Review.deleteMany({}), BlogPost_1.BlogPost.deleteMany({})]);
    const hashed = await bcryptjs_1.default.hash(process.env.DEMO_PASSWORD || "Demo@12345", 12);
    const demoUser = await User_1.User.create({
        name: "Demo User",
        email: process.env.DEMO_EMAIL || "demo@skillforge.ai",
        password: hashed,
        interests: ["Web Development", "AI/ML", "Data Science"],
    });
    const createdCourses = await Course_1.Course.insertMany(courses.map((c) => ({ ...c, createdBy: demoUser._id })));
    const reviewData = [
        { courseIdx: 0, userName: "John D.", rating: 5, comment: "Best web dev course I've taken. Projects are incredibly practical." },
        { courseIdx: 0, userName: "Maria S.", rating: 5, comment: "Sarah is an amazing instructor. Clear explanations and great support." },
        { courseIdx: 1, userName: "Ahmed K.", rating: 5, comment: "The ML sections are top-notch. Real datasets make all the difference." },
        { courseIdx: 2, userName: "Priya R.", rating: 5, comment: "Finally a course that teaches LLM engineering properly. Highly recommended!" },
        { courseIdx: 3, userName: "Tom W.", rating: 4, comment: "Great AWS content. Passed my certification on the first try." },
        { courseIdx: 5, userName: "Anna L.", rating: 5, comment: "Transformed my design skills. Portfolio projects got me hired!" },
    ];
    await Review_1.Review.insertMany(reviewData.map((r) => ({
        courseId: createdCourses[r.courseIdx]._id,
        userId: demoUser._id,
        userName: r.userName,
        rating: r.rating,
        comment: r.comment,
    })));
    await BlogPost_1.BlogPost.insertMany(blogs);
    console.log(`Seeded: ${createdCourses.length} courses, ${blogs.length} blogs, 1 demo user`);
    console.log(`Demo login: ${demoUser.email} / ${process.env.DEMO_PASSWORD || "Demo@12345"}`);
    process.exit(0);
}
seed().catch(console.error);
