export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: Request) {
  try {
    const { prompt, genre } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: "A composition prompt is required" }, { status: 400 });
    }

    const tailoredPrompt = `${prompt}. Beautiful studio arrangement, high fidelity, polished mix master, ${genre} genre style, 320kbps audio quality.`;

    console.log("Sending prompt pipeline request to Replicate MusicGen...");

    const response = await replicate.run(
      "meta/musicgen:671ac645ce5e552cc63a54a2bbff63fcf798043055d2dac5fc9e36a837eedcfb",
      {
        input: {
          prompt: tailoredPrompt,
          duration: 30,
          model_version: "melody-large",
          output_format: "mp3"
        }
      }
    );

    const rawOutput = Array.isArray(response) ? response[0] : response;
const realAudioOutputUrl = typeof rawOutput === "string" ? rawOutput : rawOutput.url().toString();
    if (!realAudioOutputUrl) {
      throw new Error("The AI music generation pipeline failed to return an audio output file.");
    }

    return NextResponse.json({ 
      success: true, 
      audioUrl: realAudioOutputUrl 
    });

  } catch (error: any) {
    console.error("Backend AI Music Engine Error:", error);
    return NextResponse.json({ error: error.message || "Internal Engine Error" }, { status: 500 });
  }
} 