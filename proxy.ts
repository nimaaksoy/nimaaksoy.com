import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.toLowerCase();

  if (host === "skills.nimaaksoy.com") {
    const url = request.nextUrl.clone();
    const pathname =
      url.pathname === "/" || url.pathname === "/skills"
        ? ""
        : url.pathname.replace(/^\/skills\//, "/");
    url.hostname = "nimaaksoy.com";
    url.pathname = `/skills${pathname}`;
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
