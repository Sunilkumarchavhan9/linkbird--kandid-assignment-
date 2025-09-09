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
	newResponse.headers.set("Access-Control-Allow-Credentials", "true");
	
	return newResponse;
};

export const GET = async (req: NextRequest) => {
	console.log("Auth GET request from:", req.headers.get("origin"));
	console.log("Auth GET request headers:", Object.fromEntries(req.headers.entries()));
	
	try {
		const response = await handler.GET(req);
		console.log("Auth GET response status:", response.status);
		return addCORSHeaders(response);
	} catch (error) {
		console.error("Auth GET error:", error);
		return new NextResponse(JSON.stringify({ error: "Internal server error" }), {
			status: 500,
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
			},
		});
	}
};

export const POST = async (req: NextRequest) => {
	console.log("Auth POST request from:", req.headers.get("origin"));
	console.log("Auth POST request headers:", Object.fromEntries(req.headers.entries()));
	
	try {
		const response = await handler.POST(req);
		console.log("Auth POST response status:", response.status);
		console.log("Auth POST response headers:", Object.fromEntries(response.headers.entries()));
		return addCORSHeaders(response);
	} catch (error) {
		console.error("Auth POST error:", error);
		console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
		return new NextResponse(JSON.stringify({ 
			error: "Internal server error",
			message: error instanceof Error ? error.message : "Unknown error"
		}), {
			status: 500,
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
			},
		});
	}
};

export const OPTIONS = async () => {
	return new NextResponse(null, {
		status: 200,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type, Authorization",
			"Access-Control-Allow-Credentials": "true",
		},
	});
};


