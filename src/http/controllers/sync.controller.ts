import { IContext } from "../../deps.ts";
import { InstagramConnector } from "../../shared/connector/instagram.connector.ts";

const syncController = async ( context : IContext ) => {
	const redirect = InstagramConnector.getCodeByAuthorization();
	console.log( "Redirect", redirect );
	context.response.redirect( redirect );
	context.response.status = 302;
};

export {
	syncController
};
