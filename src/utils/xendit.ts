import { Xendit } from "xendit-node";

const apiKey = process.env.NEXT_PUBLIC_XENDIT_API_KEY!
const xenditClient = new Xendit({ secretKey: apiKey })
export default xenditClient