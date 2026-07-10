import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const isBg = searchParams.get("bg") === "true";

  const publicLogoPath = path.join(process.cwd(), "public", "logo.png");
  const uploadedLogoPath = `C:\\Users\\babus\\.gemini\\antigravity\\brain\\3911313d-3de2-4484-bea7-bfc5ce7399c5\\media__1783657802748.png`;

  // Copy new logo to public/logo.png if it exists
  if (fs.existsSync(uploadedLogoPath)) {
    try {
      fs.copyFileSync(uploadedLogoPath, publicLogoPath);
    } catch (copyErr) {
      console.error("Error copying logo to public directory:", copyErr);
    }
  }

  if (!isBg) {
    let filePath = publicLogoPath;
    if (!fs.existsSync(filePath)) {
      filePath = `C:\\Users\\babus\\.gemini\\antigravity\\brain\\03035789-d2ae-4e2e-bfaa-85832134fa3b\\media__1783610114581.png`;
    }

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
