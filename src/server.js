const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");
const basic = require("./basic");
const advanced = require("./advanced");

const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 3000;
const APP_DIR = path.join(__dirname, "..", "app");
const SRC_DIR = __dirname;

const mimeTypes = {
	".css": "text/css",
	".html": "text/html",
	".js": "text/javascript",
	".json": "application/json",
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".svg": "image/svg+xml",
};

function sendJson(response, status, data) {
	response.writeHead(status, { "Content-Type": "application/json" });
	response.end(JSON.stringify(data));
}

function toNumber(searchParams, name) {
	const value = Number(searchParams.get(name));
	if (!Number.isFinite(value)) {
		throw new Error(`${name} must be a valid number`);
	}
	return value;
}

function calculateCompoundInterest(principal, ratePercent, years, compounds) {
	const annualRate = basic.divide(ratePercent, 100);
	const periodRate = basic.divide(annualRate, compounds);
	const growthBase = basic.add(1, periodRate);
	const totalPeriods = basic.multiply(compounds, years);
	const growthFactor = advanced.pow(growthBase, totalPeriods);
	const futureValue = basic.multiply(principal, growthFactor);
	const interest = basic.subtract(futureValue, principal);

	return {
		futureValue,
		interest,
		totalPeriods,
		periodRatePercent: basic.multiply(periodRate, 100),
	};
}

function handleApi(requestUrl, response) {
	try {
		const params = requestUrl.searchParams;

		if (requestUrl.pathname === "/api/basic") {
			const operation = params.get("operation");
			if (!basic[operation]) {
				return sendJson(response, 400, { error: "Unsupported basic operation" });
			}

			return sendJson(response, 200, {
				result: basic[operation](toNumber(params, "a"), toNumber(params, "b")),
			});
		}

		if (requestUrl.pathname === "/api/advanced") {
			const operation = params.get("operation");
			if (!advanced[operation]) {
				return sendJson(response, 400, { error: "Unsupported advanced operation" });
			}

			return sendJson(response, 200, {
				result: advanced[operation](toNumber(params, "a"), toNumber(params, "b")),
			});
		}

		if (requestUrl.pathname === "/api/custom/compound") {
			return sendJson(
				response,
				200,
				calculateCompoundInterest(
					toNumber(params, "principal"),
					toNumber(params, "annualRate"),
					toNumber(params, "years"),
					toNumber(params, "compounds")
				)
			);
		}

		return sendJson(response, 404, { error: "API route not found" });
	} catch (error) {
		return sendJson(response, 400, { error: error.message });
	}
}

function sendFile(filePath, response) {
	fs.readFile(filePath, (error, content) => {
		if (error) {
			response.writeHead(404, { "Content-Type": "text/plain" });
			response.end("Not found");
			return;
		}

		const extension = path.extname(filePath);
		response.writeHead(200, { "Content-Type": mimeTypes[extension] || "text/plain" });
		response.end(content);
	});
}

function resolveStaticPath(pathname) {
	if (pathname === "/") {
		return path.join(APP_DIR, "index.html");
	}

	if (pathname.startsWith("/src/")) {
		const sourcePath = path.resolve(SRC_DIR, pathname.replace("/src/", ""));
		return sourcePath.startsWith(SRC_DIR) ? sourcePath : null;
	}

	const normalizedPathname = pathname.endsWith("/") ? `${pathname}index.html` : pathname;
	const fileName = path.extname(normalizedPathname) ? normalizedPathname : `${normalizedPathname}.html`;
	const appPath = path.resolve(APP_DIR, `.${fileName}`);
	return appPath.startsWith(APP_DIR) ? appPath : null;
}

const server = http.createServer((request, response) => {
	const requestUrl = new URL(request.url, `http://${request.headers.host}`);

	if (requestUrl.pathname.startsWith("/api/")) {
		handleApi(requestUrl, response);
		return;
	}

	const filePath = resolveStaticPath(requestUrl.pathname);
	if (!filePath) {
		response.writeHead(403, { "Content-Type": "text/plain" });
		response.end("Forbidden");
		return;
	}

	sendFile(filePath, response);
});

server.listen(PORT, HOST, () => {
	console.log(`Alloy Lab running at http://${HOST}:${PORT}`);
});
