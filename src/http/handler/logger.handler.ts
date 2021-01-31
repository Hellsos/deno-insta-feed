import { Context } from "../../deps.ts";


const startRequestLogger = async ( context : Context, next : () => void ) => {
	await next();
	const rt = context.response.headers.get( "X-Response-Time" );
	console.log( `${ context.request.method } ${ context.request.url } - ${ rt }` );
};

const endRequestLogger = async ( ctx : Context, next : () => void ) => {
	const start = Date.now();
	await next();
	const ms = Date.now() - start;
	ctx.response.headers.set( "X-Response-Time", `${ ms }ms` );
};

export {
	startRequestLogger,
	endRequestLogger
};
