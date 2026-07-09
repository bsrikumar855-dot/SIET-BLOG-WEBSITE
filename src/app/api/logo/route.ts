import { NextResponse } from "next/server";
import fs from "fs";

export async function GET() {
  const filePath = `C:\\Users\\babus\\.gemini\\antigravity\\brain\\03035789-d2ae-4e2e-bfaa-85832134fa3b\\media__1783610114581.png`;
  try {
    const fileBuffer = fs.readFileSync(filePath);
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    return new NextResponse("Error: " + (err as Error).message, { status: 500 });
  }
}
