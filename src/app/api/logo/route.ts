import { NextResponse } from "next/server";
import fs from "fs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const isBg = searchParams.get("bg") === "true";

  if (!isBg) {
    // Normal logo resolution
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
      return new NextResponse("Error loading logo: " + (err as Error).message, { status: 500 });
    }
  }

  // Paths to try for the uploaded campus poster image
  const pathsToTry = [
    `C:\\Users\\babus\\.gemini\\antigravity\\brain\\03035789-d2ae-4e2e-bfaa-85832134fa3b\\media__1783612047678.png`,
    `C:\\Users\\babus\\.gemini\\antigravity\\brain\\03035789-d2ae-4e2e-bfaa-85832134fa3b\\media__1783612030758.png`
  ];

  for (const filePath of pathsToTry) {
    if (fs.existsSync(filePath)) {
      try {
        const fileBuffer = fs.readFileSync(filePath);
        return new NextResponse(fileBuffer, {
          headers: {
            "Content-Type": "image/png",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      } catch (err) {
        console.error("Error reading background file: " + filePath, err);
      }
    }
  }

  return new NextResponse("Error: Background image file not found", { status: 404 });
}
