# Mubis

Single page application that simulates being a platform where you can watch different movies using microservices-based architecture, Backend for frontend(BFF) pattern.

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install all their dependencies.

```bash
npm install
```

## Description

A BFF architecture can be used to create backends for client-facing mobile or web apps. BFF’s can help support an application with multiple clients while at the same time moving the system into a less-coupled state than a monolith system. This code pattern helps teams iterate features faster and have control over the backends for mobile apps without affecting the experience for a corresponding mobile or web app.

Building of 2 applications, the first is a server-side rendering (SSR) is a popular technique for rendering a normally client-side only single page app (SPA) on the server and then sending a fully rendered page to the client.

The second application is an API server with a movie CRUD and 2 additional endpoints, login and user registration.

## How it works?

API Token
2 types of Access token will be created:
Admin client: administrative permissions (CRUD movies)
Render Server: read-only permissions (R movies)

When doing an authentication, an access token will be generated, with the JWT standard (JSON Web Token), which will maintain the permissions.

The authentication system was developed using Passportjs.

In this way, in the following requests, the client administrator or the SSR with the generated JWT will be able to consume the API token resources.

## Rules:

The application (SPA, single page application) will communicate through the Render Server (read-only), which will communicate with the API Server.
The server that we will create will be a proxy between the SPA and the API server.
The SPA will communicate with the API server through a cookie with the access token(JWT) from the render server.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
