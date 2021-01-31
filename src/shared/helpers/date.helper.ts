import { moment } from "../../deps.ts";

const DateHelper = {
	getInSeconds : ( seconds : number ) => moment().add( seconds, "seconds" ).unix(),
	getDiff : ( diff : number ) => moment( diff * 1000 ).diff( moment(), "days" ),
	getTimestamp : () => moment().unix()
};

export {
	DateHelper
};
