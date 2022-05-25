const { server } = require('../index');
const port = process.env.AUTO_CORS_PORT || 8080;
const host = process.env.AUTO_CORS_HOST || "0.0.0.0"

server.listen(port, host, () => {
    console.log(`server listening to ${host}:${port}`);
});
