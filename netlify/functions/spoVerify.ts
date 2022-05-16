import {
    Handler,
    HandlerEvent,
    HandlerContext,
    HandlerResponse,
} from "@netlify/functions";

import jwt, { decode, JwtPayload } from "jsonwebtoken";
import { MAX_SESSION_LENGTH_SPO } from "../../src/lib/constants";
import { getSecret } from "../helpers/jwt";

import { unauthorizedResponse } from "../helpers/response";
import { fetchNodeApp, getAccessTokenCookieName } from "../helpers/util";

interface SpoVerifyResultBody {
    error: boolean;
    message: string;
    handle?: string;
    cost?: number;
    address?: string;
}

export interface SpoVerifyResponseBody {
    error: boolean;
    message?: string;
    token?: string;
    address?: string;
    handle?: string;
    cost?: number;
    data?: JwtPayload;
}

const handler: Handler = async (
    event: HandlerEvent,
    context: HandlerContext
): Promise<HandlerResponse> => {
    try {
        const { headers, body } = event;

        if (!body) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: true,
                    message: 'Invalid request'
                })
            }
        }

        const headerAccess = headers[getAccessTokenCookieName(true)];
        if (!headerAccess) {
            return unauthorizedResponse;
        }

        const res: SpoVerifyResultBody = await fetchNodeApp('spo/verify', {
            headers: {
                [getAccessTokenCookieName(true)]: headerAccess,
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body
        }).then(res => res.json());

        const { error, message, handle, cost, address } = res;

        if (error) {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    error,
                    message,
                }),
            };
        }

        const sessionSecret = await getSecret('session');
        const sessionToken = jwt.sign(
            {
                iat: Date.now(),
                handle,
                cost,
                emailAddress: 'spo@adahandle.com',
                isSPO: true
            },
            sessionSecret,
            {
                expiresIn: (MAX_SESSION_LENGTH_SPO * 1000).toString()
            }
        );

        const response: SpoVerifyResponseBody = {
            error: false,
            message,
            address,
            handle,
            cost,
            token: sessionToken,
            data: decode(sessionToken) as JwtPayload,
        }

        return {
            statusCode: 200,
            body: JSON.stringify(response),
        };
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: true,
                message: 'Unexpected error.',
            }),
        };

    }
};

export { handler };
