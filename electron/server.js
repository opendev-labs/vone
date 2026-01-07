const express = require('express');
const path = require('path');
const fs = require('fs').promises;

let server;

async function startLocalServer(port) {
    const app = express();

    // Middleware to handle *.void.app routing
    app.use((req, res, next) => {
        const host = req.headers.host || '';
        const subdomain = host.split('.')[0];

        // Log incoming requests for debugging
        console.log(`Request: ${host}${req.url}`);

        // If it's a *.void.app request, handle routing
        if (host.includes('.void.app')) {
            req.voidSubdomain = subdomain;
        }

        next();
    });

    // Serve static files for projects
    app.get('*', async (req, res) => {
        if (req.voidSubdomain) {
            // Route to specific project based on subdomain
            const projectPath = path.join(
                require('electron').app.getPath('home'),
                'void-projects',
                req.voidSubdomain
            );

            try {
                await fs.access(projectPath);
                res.sendFile(path.join(projectPath, 'index.html'));
            } catch (error) {
                res.status(404).send(`
          <html>
            <head><title>Project Not Found</title></head>
            <body style="background: #050507; color: #7DF9FF; font-family: monospace; padding: 40px;">
              <h1>Project "${req.voidSubdomain}" not found</h1>
              <p>Create this project in VOID Desktop to deploy it.</p>
            </body>
          </html>
        `);
            }
        } else {
            res.status(404).send('Not a VOID project URL');
        }
    });

    return new Promise((resolve, reject) => {
        server = app.listen(port, '127.0.0.1', () => {
            console.log(`VOID local server running on port ${port}`);
            resolve(server);
        }).on('error', reject);
    });
}

function stopLocalServer() {
    if (server) {
        server.close();
    }
}

module.exports = { startLocalServer, stopLocalServer };
