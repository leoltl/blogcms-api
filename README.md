# blogcms-api

Cms-api is an app built with Express which serves content for blogcms-admin and blogcms-client and accept user data (ie new blog post/comments) and persist in database. It implements REST API for external application (CORS white listed domain) to interact with it.


It is part of the headless cms system.

View **CMS-client** [here](https://github.com/leoltl/blogcms-client)

View **CMS-admin** [here](https://github.com/leoltl/blogcms-admin)

## The stack
- **Server side**: Node with Express (ES2017 async/await) MVC
- **Database**: Mongoose, MongoDB
- **Authentication**: PassportJS, passport-jwt, JSON Web Token

## Live App
**Consumed by cms admin [here](https://leoltl-blogcms-admin.herokuapp.com/)**

**Consumed by cms client [here](https://leoltl-blogcms-client.herokuapp.com/)**

#### TODO
- add support for dynamic schema
- add support for multiuser blog
