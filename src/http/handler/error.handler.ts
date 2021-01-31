import { Context } from "../../deps.ts";


const errorHandler = async ( context : Context, next : () => void ) => {
	try {
		await next();
	} catch ( e ) {
		console.log( e );
		context.response.body = { message : e.name };
		context.response.status = 500;
	}
};

export {
	errorHandler
};
