import { Application, IContext, Router } from "../deps.ts";
import { env } from "../shared/providers/env.provider.ts";
import { syncController } from "./controllers/sync.controller.ts";
import { authController } from "./controllers/auth.controller.ts";
import { detailController } from "./controllers/detail.controller.ts";
import { endRequestLogger, startRequestLogger } from "./handler/logger.handler.ts";
import { errorHandler } from "./handler/error.handler.ts";
import { profileController } from "./controllers/profile.controller.ts";


const app = new Application();

app.use( startRequestLogger );

app.use( endRequestLogger );

app.use( errorHandler );

const router = new Router();

router.get( "/", ( context : IContext ) => {
	context.response.body = { message : "pong" };
} );

router.get( "/api/ig/sync", syncController );

router.get( "/api/ig/auth", authController );

router.get( "/api/ig/user/:userId", detailController );

router.get( "/api/ig/user/:userId/profile", profileController );

app.use( router.routes() );
app.use( router.allowedMethods() );

await app.listen( {
	port : env.Http.port
} );
