import { IContext } from "../../deps.ts";
import { InstaFeedDatabase } from "../../shared/providers/database.provider.ts";
import { InstagramConnector } from "../../shared/connector/instagram.connector.ts";


const detailController = async ( context : IContext ) => {
	const searchParams = context.request.url.searchParams;
	const userId = context.params.userId;
	const force = searchParams.get( "force" );
	if ( userId === null ) {
		context.response.body = { message : "Missing required userId param" };
		context.response.status = 400;
		return;
	}

	const credentialsRow = await InstaFeedDatabase.getUserCredentials( userId );

	if ( credentialsRow == null ) {
		context.response.body = { message : "User not found" };
		context.response.status = 404;
		return;
	}

	if ( force ) {
		let token = await InstaFeedDatabase.getActiveTokenByCredentialsId( credentialsRow.id );
		context.response.body = await InstagramConnector.getUserMedia( credentialsRow.id, token.access_token );
		return;
	}

	context.response.body = await InstaFeedDatabase.getUserMedia( credentialsRow.id );
};

export {
	detailController
};
