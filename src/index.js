import 'dotenv/config';
import { createServer } from "node:http";
import { fileURLToPath } from "url";
import { hostname } from "node:os";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";
import fastifyFormbody from "@fastify/formbody";
import proxy from '@fastify/http-proxy';

import { scramjetPath } from "@mercuryworkshop/scramjet/path";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";

const publicPath = fileURLToPath(new URL("../public/", import.meta.url));

const fastify = Fastify({
    serverFactory: (handler) => {
        return createServer((req, res) => {
            res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
            res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
            handler(req, res);
        });
    },
});

const SECRET = process.env.SECRET

fastify.register(fastifyFormbody);
fastify.register(fastifyCookie);
fastify.register(fastifyJwt, { secret: SECRET });

const SITE_PASSWORD = process.env.SITE_PASSWORD

fastify.get("/login", async (req, reply) => {
    return reply.type("text/html").sendFile("login.html");
});

fastify.post("/login", async (req, reply) => {
    if (req.body.password === SITE_PASSWORD) {
        const token = fastify.jwt.sign({ authenticated: true });
        reply.setCookie("token", token, {
            path: "/",
            httpOnly: true,
            maxAge: 86400
        });
        return reply.redirect("/");
    }
    return reply.redirect("/login?error=1");
});

fastify.addHook("onRequest", async (req, reply) => {
    if (req.url.startsWith("/login") || req.url.startsWith("/404") || req.url.startsWith("/favicon.ico")) return;

    try {
        const token = req.cookies.token;
        if (!token) throw new Error("No token");
        await fastify.jwt.verify(token);
    } catch (err) {
        return reply.redirect("/login");
    }
});

fastify.register(proxy, {
    upstream: `http://127.0.0.1:8081`,
    prefix: '/wisp',
    websocket: true,
    rewritePrefix: '/wisp',
	replyOptions: {
        rewriteRequestHeaders: (request, headers) => {
            return {
                ...headers,
                connection: 'upgrade',
                upgrade: 'websocket',
                host: '127.0.0.1:8081'
            };
        }
    }
});

fastify.register(fastifyStatic, {
	root: publicPath,
	decorateReply: true,
});

fastify.register(fastifyStatic, {
	root: scramjetPath,
	prefix: "/scram/",
	decorateReply: false,
});

fastify.register(fastifyStatic, {
	root: libcurlPath,
	prefix: "/libcurl/",
	decorateReply: false,
});

fastify.register(fastifyStatic, {
	root: baremuxPath,
	prefix: "/baremux/",
	decorateReply: false,
});

fastify.setNotFoundHandler((res, reply) => {
	return reply.code(404).type("text/html").sendFile("404.html");
});

fastify.server.on("listening", () => {
	const address = fastify.server.address();

	// by default we are listening on 0.0.0.0 (every interface)
	// we just need to list a few
	console.log("Listening on:");
	console.log(`\thttp://localhost:${address.port}`);
	console.log(`\thttp://${hostname()}:${address.port}`);
	console.log(
		`\thttp://${
			address.family === "IPv6" ? `[${address.address}]` : address.address
		}:${address.port}`
	);
});

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
	console.log("SIGTERM signal received: closing HTTP server");
	fastify.close();
	process.exit(0);
}

let port = parseInt(process.env.PORT || "");

if (isNaN(port)) port = 8080;

fastify.listen({
	port: port,
	host: "0.0.0.0",
});
