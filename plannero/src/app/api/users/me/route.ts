import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: req.headers
    });

    if (!session?.user) {
        return NextResponse.json({
            error: {
                code: "UNAUTHORIZED",
                message: "Missing or invalid session key"
            }
        }, { status: 401 })
    }

    return NextResponse.json(
        {
            id: session.user.id,
            email: session.user.email,
            fullName: session.user.name,
            createdAt: session.user.createdAt,
            updatedAt: session.user.updatedAt
        },
        { status: 200 }
    );
}