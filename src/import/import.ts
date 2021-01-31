import { InstaFeedDatabase } from "../shared/providers/database.provider.ts";
import { InstagramConnector } from "../shared/connector/instagram.connector.ts";
import { DateHelper } from "../shared/helpers/date.helper.ts";

const credentials = await InstaFeedDatabase.getAvailableCredentials();

await Promise.all( credentials.map( async ( credential ) => {

	let token = await InstaFeedDatabase.getActiveTokenByCredentialsId( credential.id );
	if ( token == null ) {
		console.log( `Skipping import for user_id ${ credential.user_id } because of missing token.` );
		return;
	}

	const expiresIn = DateHelper.getDiff( token.expires_at );
	if ( expiresIn < 7 ) {
		console.log( `Renewing Access token for user_id ${ credential.user_id } because of expiration in ${ expiresIn } days.` );
		token = await InstagramConnector.refreshLongLivedTokenByLongLivedToken( credential.id, token.access_token );
	}

	console.log( `Download import for user_id ${ credential.user_id }.`, token );
	return await InstagramConnector.getUserMedia( credential.id, token.access_token );
} ) );

Deno.exit();

