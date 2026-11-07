import { authMiddleware } from "@clerk/nextjs";
import { NextResponse, type NextRequest } from "next/server";
import { publicRoutes } from "config";
import { clerkEnabled } from "@/lib/clerk-enabled";

// Short URL rewrites: /@user -> /user/user, /~team -> /team/team
function rewriteShortUrls(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/@")) {
    return NextResponse.rewrite(
      new URL(`/user/${req.nextUrl.pathname.replace("/@", "")}`, req.url),
    );
  }
  if (req.nextUrl.pathname.startsWith("/~")) {
    return NextResponse.rewrite(
      new URL(`/team/${req.nextUrl.pathname.replace("/~", "")}`, req.url),
    );
  }
  return NextResponse.next();
}

const clerkMiddleware = authMiddleware({
  // Combines the original configuration array with the direct string literal path override
  publicRoutes: [...publicRoutes, "/register"],

  beforeAuth: (req) => {
    console.log(`Incoming request: ${req.method} ${req.nextUrl.pathname}`);

    // Updated this array check as well so console strings evaluate accurately
    if ([...publicRoutes, "/register"].includes(req.nextUrl.pathname)) {
      console.log(`${req.nextUrl.pathname} is a Public route`);
    }

    return rewriteShortUrls(req);
  },
  afterAuth: (req) => {
    const user = req.userId;
    if (user) {
      console.log(`Authenticated user: ${user}`);
    } else {
      console.log(`Reject reason: Unauthorized - No user found`);
    }
    return NextResponse.next();
  },
});

// Without real Clerk keys (local dev), skip auth entirely and only do rewrites.
export default clerkEnabled ? clerkMiddleware : rewriteShortUrls;

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/"],
};
