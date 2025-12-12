import { NextResponse } from "next/server";
import Admin from "@/models/Admin";
import bcrypt from "bcrypt";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: "Token and new password are required" }, { status: 400 });
    }

    // Find admin with valid token
    const admins = await Admin.find();
    let admin = null;

    for (let a of admins) {
      if (
        a.resetPasswordToken &&
        a.resetPasswordExpires &&
        a.resetPasswordExpires.getTime() > Date.now() &&
        await bcrypt.compare(token, a.resetPasswordToken)
      ) {
        admin = a;
        break;
      }
    }

    if (!admin) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;
    await admin.save();

    return NextResponse.json({ message: "Password reset successful" });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
