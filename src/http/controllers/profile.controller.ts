import { IContext } from "../../deps.ts";
import { InstaFeedDatabase } from "../../shared/providers/database.provider.ts";
import { InstagramConnector } from "../../shared/connector/instagram.connector.ts";


const profileController = async ( context : IContext ) => {
	const userId = context.params.userId;
	if ( userId === null ) {
		context.response.body = { message : "Missing required userId param" };
		return;
	}

	const credentialsRow = await InstaFeedDatabase.getUserCredentials( userId );
	if ( credentialsRow == null ) {
		context.response.body = { message : "User not found" };
		context.response.status = 404;
		return;
	}

	const tokenRow = await InstaFeedDatabase.getActiveTokenByCredentialsId( credentialsRow.id );

	context.response.body = await InstagramConnector.getProfile( credentialsRow.user_id, tokenRow.access_token );
};

export {
	profileController
};
