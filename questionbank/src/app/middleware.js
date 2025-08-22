import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function middleware(req) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: req.headers.get("Authorization") } } }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  if (!session && pathname !== "/auth") {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  if (session && pathname === "/auth") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth"],
};
