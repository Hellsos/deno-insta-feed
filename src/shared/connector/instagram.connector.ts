import { env } from "../providers/env.provider.ts";
import { GET, POST } from "../providers/http.provider.ts";
import { InstaFeedDatabase } from "../providers/database.provider.ts";

interface IAccessTokenResponse {
	access_token : string;
	user_id : string;
}

interface ILongLivedAccessTokenResponse {
	access_token : string;
	token_type : string;
	expires_in : number;
}

export interface IMediaDataItem {
	id : string;
	media_type : string;
	media_url : string;
	thumbnail_url: string;
	permalink : string;
	timestamp : string;
}

export interface IMediaResponse {
	data : Array<IMediaDataItem>;
	paging : {
		cursors : {
			after : string;
			before : string;
		}
	}
}

interface ICredentials {
	appId : string;
	appSecret : string;
	redirectUri : string;
}

const instagramConnector = ( { appId, appSecret, redirectUri } : ICredentials ) => {
	const API_INSTAGRAM = "https://api.instagram.com";
	const GRAPH_API_INSTAGRAM = "https://graph.instagram.com";
	const REDIRECT_URI = redirectUri;

	const getCodeByAuthorization = () => {
		return `${ API_INSTAGRAM }/oauth/authorize?client_id=${ appId }&redirect_uri=${ REDIRECT_URI }&scope=user_profile,user_media&response_type=code`;
	};

	const refreshLongLivedTokenByLongLivedToken = async ( credentialsId : number, token : string ) => {
		const {
			payload,
			error
		} = await GET<ILongLivedAccessTokenResponse>( `${ GRAPH_API_INSTAGRAM }/refresh_access_token?grant_type=ig_refresh_token&access_token=${ token }` );

		if ( error ) {
			console.log( error );
			return error;
		}

		return await InstaFeedDatabase.addToken( credentialsId, payload!.access_token, payload!.token_type, payload!.expires_in );
	};

	const exchangeLongLivedTokenByToken = async ( credentialsId : number, token : string ) => {
		const {
			payload,
			error
		} = await GET<ILongLivedAccessTokenResponse>( `${ GRAPH_API_INSTAGRAM }/access_token?grant_type=ig_exchange_token&client_secret=${ appSecret }&access_token=${ token }` );

		if ( error ) {
			console.log( error );
			return error;
		}

		await InstaFeedDatabase.addToken( credentialsId, payload!.access_token, payload!.token_type, payload!.expires_in );
	};

	const exchangeTokenByCode = async ( code : string ) : Promise<any> => {

		const form = new FormData();

		form.set( "client_id", appId );
		form.set( "client_secret", appSecret );
		form.set( "grant_type", "authorization_code" );
		form.set( "redirect_uri", REDIRECT_URI );
		form.set( "code", code );

		const { payload, error } = await POST<IAccessTokenResponse>( `${ API_INSTAGRAM }/oauth/access_token`, form );

		if ( error ) {
			console.log( error );
			return error;
		}

		const credentialsRow = await InstaFeedDatabase.upsertUserCredentials( payload!.user_id );

		await InstaFeedDatabase.addToken( credentialsRow.id, code, "authorization_code", 3600 );

		const token = await InstaFeedDatabase.addToken( credentialsRow.id, payload!.access_token, "bearer", 86400 );

		await exchangeLongLivedTokenByToken( credentialsRow.id, token.access_token );

		return payload;
	};

	const getProfile = async ( userId : string, accessToken : string ) : Promise<any> => {
		const {
			payload,
			error
		} = await GET<IAccessTokenResponse>( `${ GRAPH_API_INSTAGRAM }/${ userId }?fields=id,username,account_type,media_count&access_token=${ accessToken }` );
		if ( error ) {
			console.log( error );
			return error;
		}
		return payload;
	};

	const getUserMedia = async ( credentialsId : number, accessToken : string ) => {
		const {
			payload,
			error
		} = await GET<IMediaResponse>( `${ GRAPH_API_INSTAGRAM }/me/media?fields=id,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${ accessToken }` );
		if ( error ) {
			console.log( error );
			return error;
		}

		const data = ( payload as IMediaResponse ).data;

		return await InstaFeedDatabase.upsertUserMedia( credentialsId, data );
	};

	return {
		getCodeByAuthorization,
		exchangeTokenByCode,
		refreshLongLivedTokenByLongLivedToken,
		getProfile,
		getUserMedia
	};

};

const InstagramConnector = instagramConnector( env.Instagram );

export {
	InstagramConnector
};
