# auto-cors
A proxy to automatically add CORS headers, supports:

- Simple requests with `Access-Control-Allow-Origin: "*"`
- OPTIONS preflight request for non-simple requests.
- CORS request with crendentials included.

There's an `auto-cors` service deployed at cors.harttle.com. Both HTTP and HTTPS are supported:

- <http://cors.harttle.com/https://example.com>
- <https://cors.harttle.com/https://example.com>

Additional headers:

- `Auto-Cors-Request-Header` to set additional request headers that are not allowed (like `cookie`, `referer`, `origin`, etc.) in headers. e.g.
    ```javascript
    // set a "Cookie: XXX" header when forwarding request
    fetch(
        "https://cors.harttle.com/https://example.com",
        {
            headers: {
                "Auto-Cors-Request-Header-Cookie": "XXX"
            }
        }
    )
    ```

## Install

```bash
npm i auto-cors
```

## Use in Node.js

```javascript
const cors = require("auto-cors")
const port = process.env.PORT || 8080;
cors.server.listen(port, () => {
    console.log(`server listening to ${port}`);
});
```

Visit <http://localhost:8080/https://example.com> in your browser.

## Use in command line

```bash
npx auto-cors
```

The default port is 8080, use `AUTO_CORS_PORT` to set a different port, for example:

```bash
AUTO_CORS_PORT=9001 npx auto-cors
```

Visit <http://localhost:9001/https://example.com> in your browser.

## Deploy your own service

Install

```bash
# install globally
npm i -g auto-cors
auto-cors
# or use npx auto-cors
```

Here's a systemd script for auto-cors:

<https://gist.github.com/harttle/a801084f42b9ee1a2aa6bf5c191b9ad9>
