import { env } from "./env.provider.ts";
import { Client } from "../../deps.ts";
import { DateHelper } from "../helpers/date.helper.ts";
import { IMediaDataItem } from "../connector/instagram.connector.ts";


interface ICredentials {
	hostname : string;
	password : string;
	port : number;
	username : string;
	db : string;
}

const databaseProvider = async ( { hostname, password, port, username, db } : ICredentials ) => {
	const client = await new Client().connect( {
		hostname,
		username,
		db,
		poolSize : 3,
		password,
		port
	} );

	const insert = async ( sql : string, ...args : Array<any> ) => {
		return await client.execute( sql, ...args );
	};

	const update = async ( sql : string, ...args : Array<any> ) => {
		return await client.execute( sql, ...args );
	};

	const query = async ( sql : string, ...args : Array<any> ) : Promise<Array<any>> => {
		return await client.query( sql, args );
	};


	return {
		insert,
		update,
		query,
		close : () => client.close()
	};
};

const instaFeedDatabase = async () => {
	const DatabaseProvider = await databaseProvider( env.Mysql );

	const addToken = async ( credentialsId : number, accessToken : string, tokenType : string, expiresIn : number ) => {
		const issuedAt = DateHelper.getTimestamp();
		const expiresAt = DateHelper.getInSeconds( expiresIn );

		const { lastInsertId } = await DatabaseProvider.insert(
			"INSERT INTO access_token (credentials_id,access_token, token_type, issued_at, expires_in, expires_at) VALUES (?, ?, ?, ?, ?, ?)", [
				credentialsId,
				accessToken,
				tokenType,
				issuedAt,
				expiresIn,
				expiresAt
			] );

		const row = await DatabaseProvider.query(
			"SELECT * FROM access_token WHERE id = ?", [
				lastInsertId
			] );
		return row[ 0 ];
	};

	const getActiveTokenByCredentialsId = async ( credentialsId : number ) => {
		let row = await DatabaseProvider.query(
			"SELECT * FROM access_token WHERE credentials_id = ? ORDER BY id DESC LIMIT 1", [
				credentialsId
			] );

		return row[ 0 ];
	};

	const getUserCredentials = async ( userId : string ) => {
		let row = await DatabaseProvider.query(
			"SELECT * FROM credentials WHERE user_id = ? AND deleted_at IS NULL", [
				userId
			] );
		return row[ 0 ];
	};

	const getAvailableCredentials = async () => {
		let row = await DatabaseProvider.query(
			"SELECT * FROM credentials WHERE deleted_at IS NULL" );
		return row;
	};

	const getUserMedia = async ( credentialsId : number ) => {
		let row = await DatabaseProvider.query(
			"SELECT * FROM media WHERE credentials_id = ? AND deleted_at IS NULL", [
				credentialsId
			] );

		return row.map( ( item ) => getUserMediaFiltered( item ) );
	};

	const getUserMediaFiltered = ( mediaRow : any ) => {
		mediaRow.id = mediaRow.ig_id;
		delete mediaRow.ig_id;
		delete mediaRow.credentials_id;
		delete mediaRow.created_at;
		delete mediaRow.updated_at;
		delete mediaRow.deleted_at;
		return mediaRow;
	};

	const upsertUserCredentials = async ( userId : string ) => {
		let row = await getUserCredentials( userId );

		if ( row == null ) {
			await DatabaseProvider.insert(
				"INSERT INTO credentials (user_id, created_at, updated_at) VALUES (?, ?, ?)", [
					userId,
					DateHelper.getTimestamp(),
					DateHelper.getTimestamp()
				] );
		} else {
			await DatabaseProvider.update(
				"UPDATE credentials SET updated_at = ? WHERE user_id = ? AND deleted_at IS NULL", [
					DateHelper.getTimestamp(),
					userId,
				] );
		}

		return await getUserCredentials( userId );
	};

	const upsertUserMedia = async ( credentialsId : number, data : Array<IMediaDataItem> ) => {
		return await Promise.all( data.map( async ( item ) => {
			let row = await DatabaseProvider.query(
				"SELECT * FROM media WHERE ig_id = ? AND deleted_at IS NULL", [
					item.id
				] );
			if ( row[ 0 ] ) {
				await DatabaseProvider.update(
					"UPDATE media SET media_type = ?, media_url = ?, permalink = ?, timestamp = ?, updated_at = ? WHERE ig_id = ? AND deleted_at IS NULL", [
						item.media_type,
						item.media_url,
						item.permalink,
						item.timestamp,
						DateHelper.getTimestamp(),
						item.id
					] );
			} else {
				await DatabaseProvider.insert(
					"INSERT INTO media (credentials_id, ig_id, media_type, media_url, permalink, timestamp, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [
						credentialsId,
						item.id,
						item.media_type,
						item.media_url,
						item.permalink,
						item.timestamp,
						DateHelper.getTimestamp(),
						DateHelper.getTimestamp()
					] );
			}
			row = await DatabaseProvider.query(
				"SELECT * FROM media WHERE ig_id = ? AND deleted_at IS NULL", [
					item.id
				] );
			return getUserMediaFiltered( row[ 0 ] );
		} ) );
	};

	return {
		upsertUserCredentials,
		addToken,
		getActiveTokenByCredentialsId,
		getUserCredentials,
		getAvailableCredentials,
		getUserMedia,
		upsertUserMedia,
		close : () => DatabaseProvider.close()
	};
};

const InstaFeedDatabase = await instaFeedDatabase();

export {
	InstaFeedDatabase
};
