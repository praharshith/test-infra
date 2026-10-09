// Runs the Next server on an internal port and fronts it with a proxy that
// strips stray ANSI escape sequences Next 15.5.x emits into HTML responses.
const http = require("http");
const { spawn } = require("child_process");

const PUBLIC_PORT = parseInt(process.env.PORT, 10) || 3000;
const INTERNAL_PORT = PUBLIC_PORT + 1;

const child = spawn("node", ["server.js"], {
  // containers preset HOSTNAME to the container ID, which would stop server.js
  // listening on 127.0.0.1
  env: { ...process.env, PORT: String(INTERNAL_PORT), HOSTNAME: "0.0.0.0" },
  stdio: "inherit",
});
child.on("exit", (code) => process.exit(code ?? 1));

function stripAnsi(buf) {
  const str = buf.toString("utf8");
  const stripped = str.replace(/\x1b\[[0-9;]*m/g, "");
  return Buffer.from(stripped, "utf8");
}

const server = http.createServer((req, res) => {
  const headers = { ...req.headers };
  // uncompressed, so HTML bodies can be string-stripped
  delete headers["accept-encoding"];

  const proxyReq = http.request(
    {
      hostname: "127.0.0.1",
      port: INTERNAL_PORT,
      path: req.url,
      method: req.method,
      headers,
    },
    (proxyRes) => {
      const contentType = proxyRes.headers["content-type"] || "";
      if (!contentType.includes("text/html")) {
        res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
        proxyRes.pipe(res);
        return;
      }
      const chunks = [];
      proxyRes.on("data", (c) => chunks.push(c));
      proxyRes.on("end", () => {
        const body = stripAnsi(Buffer.concat(chunks));
        const respHeaders = { ...proxyRes.headers };
        respHeaders["content-length"] = Buffer.byteLength(body);
        res.writeHead(proxyRes.statusCode || 200, respHeaders);
        res.end(body);
      });
    }
  );
  proxyReq.on("error", (err) => {
    if (!res.headersSent) {
      res.writeHead(502, { "content-type": "text/plain" });
    }
    res.end("Bad gateway: " + err.message);
  });
  req.pipe(proxyReq);
});

server.listen(PUBLIC_PORT, () => {
  console.log(
    `[strip-ansi-proxy] listening on :${PUBLIC_PORT}, forwarding to internal Next server on :${INTERNAL_PORT}`
  );
});
