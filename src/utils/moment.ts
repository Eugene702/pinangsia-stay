import moment from "moment-timezone"

export const TIMEZONE = "Asia/Jakarta"
export const getDate = (options?: { fromMidnight?: boolean }) => {
    const date = moment.tz(TIMEZONE)
    if(options && options.fromMidnight == true){
        date.startOf("day")
    }
    return date.toDate()
}