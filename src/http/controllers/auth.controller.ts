import { IContext } from "../../deps.ts";
import { InstagramConnector } from "../../shared/connector/instagram.connector.ts";

const authController = async ( context : IContext ) => {
	const params = context.request.url.searchParams;
	const code = params.get( "code" );

	if ( !code ) {
		context.response.body = { message : "Missing Code" };
		context.response.status = 400;
		return;
	}

	const payload = await InstagramConnector.exchangeTokenByCode( code );

	if ( payload.user_id ) {
		const redirect = `/api/ig/user/${ payload.user_id }?force=true`;
		console.log( "Redirect", redirect );
		context.response.redirect( redirect );
		context.response.status = 302;
		return;
	}

	context.response.body = payload;
};

export {
	authController
};
