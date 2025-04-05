import moment from "moment-timezone"

const TIMEZONE = "Asia/Jakarta"
export const getDate = () => moment.utc().tz(TIMEZONE).toDate()