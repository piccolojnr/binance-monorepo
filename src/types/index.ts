import { SecuritySession } from "../../generated/prisma";

export type ISecuritySession = (SecuritySession & {
    batch: {
        name: string;
        id: string;
    } | null;
    caller: {
        id: string;
        name: string;
        email: string;
    } | null;
})