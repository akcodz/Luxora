import { Request } from "types/express.js";

declare global {
    namespace Express {
        interface Request {
            user?: any;
            auth?: any;
        }
    }
}
