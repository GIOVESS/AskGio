import { type NextRequest, NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"

const execPromise = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Execute the Python script with the user's message
    const { stdout, stderr } = await execPromise(`python app.py "${message.replace(/"/g, '\\"')}"`)

    if (stderr) {
      console.error("Python script error:", stderr)
      return NextResponse.json({ error: "Error processing your request" }, { status: 500 })
    }

    return NextResponse.json({ response: stdout.trim() })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
