interface HttpErrorResponse {
	payload : undefined,
	error : {
		error_type : string;
		code : number;
		error_message : string;
	}
}

interface HttpSuccessResponse<T> {
	payload : T,
	error : undefined
}

async function POST<T>( url : string, data : FormData ) : Promise<HttpSuccessResponse<T> | HttpErrorResponse> {
	const response = await fetch( url, {
		method : "POST",
		body : data
	} );

	const json = await response.json();

	console.log( "EXTERNAL POST", url, { data } );

	if ( response.ok ) {
		return {
			error : undefined,
			payload : json
		};
	}

	return {
		error : json,
		payload : undefined
	};

}


async function GET<T>( url : string ) : Promise<HttpSuccessResponse<T> | HttpErrorResponse> {
	const response = await fetch( url );

	console.log( "EXTERNAL GET", url );
	const json = await response.json();

	if ( response.ok ) {
		return {
			error : undefined,
			payload : json
		};
	}

	return {
		error : json,
		payload : undefined
	};

}


export {
	POST,
	GET
};
