import { auth } from "@/lib/auth/server";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

const handler = toNextJsHandler(auth.handler);

const addCORSHeaders = (response: Response) => {
	const newResponse = new NextResponse(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers: response.headers,
	});
	
	newResponse.headers.set("Access-Control-Allow-Origin", "*");
	newResponse.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
	newResponse.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
	
	return newResponse;
};

export const GET = async (req: NextRequest) => {
	console.log("Auth GET request from:", req.headers.get("origin"));
	const response = await handler.GET(req);
	return addCORSHeaders(response);
};

export const POST = async (req: NextRequest) => {
	console.log("Auth POST request from:", req.headers.get("origin"));
	const response = await handler.POST(req);
	return addCORSHeaders(response);
};

export const OPTIONS = async () => {
	return new NextResponse(null, {
		status: 200,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type, Authorization",
		},
	});
};


