import { config } from "./config";

import App from './app';


async function startServer() {
    const app = await App();

    // Start server listening for requests
    app.listen(config.node.port, () => {
            console.log(`Server started. Listening on http://localhost:${config.node.port}`);
        }
    );
}
startServer();
