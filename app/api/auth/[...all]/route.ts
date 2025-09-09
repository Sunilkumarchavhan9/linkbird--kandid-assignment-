import { auth } from "@/lib/auth/server";
import { toNextJsHandler } from "better-auth/next-js";

const handler = toNextJsHandler(auth.handler);

export const GET = async (req: Request) => {
	console.log("Auth GET request from:", req.headers.get("origin"));
	return handler.GET(req);
};

export const POST = async (req: Request) => {
	console.log("Auth POST request from:", req.headers.get("origin"));
	return handler.POST(req);
};


