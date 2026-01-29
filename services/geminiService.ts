import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PlatformId, VideoInputContext } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "The optimized title for the video.",
    },
    description: {
      type: Type.STRING,
      description: "The optimized description for the video.",
    },
    tags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of relevant tags or hashtags.",
    },
  },
  required: ["title", "description", "tags"],
};

export const analyzeVideoContext = async (videoBase64: string, mimeType: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              data: videoBase64,
              mimeType: mimeType,
            },
          },
          {
            text: "Analyze this video and provide a detailed summary of its visual content, topic, key events, and the overall mood. This summary will be used to generate social media metadata.",
          },
        ],
      },
      config: {
        systemInstruction: "You are an expert video content analyst.",
        generationConfig: {
          temperature: 0.2,
        }
      }
    });

    return response.text || "Could not analyze video content.";
  } catch (error) {
    console.error("Video analysis error:", error);
    throw new Error("Failed to analyze video.");
  }
};

export const generatePlatformMetadata = async (
  platform: PlatformId,
  context: string
): Promise<{ title: string; description: string; tags: string[] }> => {
  let systemInstruction = "";

  switch (platform) {
    case PlatformId.BILIBILI:
      systemInstruction = `
        You are a Bilibili content optimization expert.
        Style: Professional yet engaging, meme-literate (ACG culture if applicable), detailed.
        Title: Clickbaity but honest, use brackets like 【】for emphasis. Max 80 chars.
        Description: Comprehensive, use timestamps if implied by content, invite comments/coins.
        Tags: Mix of broad category tags and specific niche tags. Max 10 tags.
      `;
      break;
    case PlatformId.XIAOHONGSHU:
      systemInstruction = `
        You are a Xiaohongshu (Little Red Book) operation specialist.
        Style: Emotional, personal, aesthetic, emoji-heavy.
        Title: Eye-catching, emotional trigger, uses emojis. Short and punchy.
        Description: Structured with emojis as bullet points. conversational tone. Add many hashtags at the bottom.
        Tags: Highly specific, trending keywords.
      `;
      break;
    case PlatformId.DOUYIN:
      systemInstruction = `
        You are a Douyin (TikTok China) viral expert.
        Style: Fast-paced, trendy, music-oriented context.
        Title: Very short, intriguing question or strong statement.
        Description: Short, encourage interaction (likes/follows), uses trending hashtags.
        Tags: High traffic hashtags.
      `;
      break;
    case PlatformId.KUAISHOU:
      systemInstruction = `
        You are a Kuaishou content expert.
        Style: Down-to-earth, community-focused, direct ("Lao Tie").
        Title: Direct, descriptive, possibly localized language or slang.
        Description: Simple, relatable, engaging directly with the viewer.
        Tags: Broad categories, community tags.
      `;
      break;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate video metadata based on this context: "${context}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        generationConfig: {
          temperature: 0.7,
        }
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini");

    return JSON.parse(text);
  } catch (error) {
    console.error(`Error generating for ${platform}:`, error);
    throw error;
  }
};
