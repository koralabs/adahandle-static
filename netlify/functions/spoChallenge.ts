import {
    Handler,
    HandlerEvent,
    HandlerContext,
    HandlerResponse,
} from "@netlify/functions";


import { unauthorizedResponse } from "../helpers/response";
import { fetchNodeApp, getAccessTokenCookieName } from "../helpers/util";

interface ChallengeResult {
    status: string;
    domain: string;
    nonce: string;
}

export interface SpoChallengeResultBody {
    error: boolean,
    message: string;
    handle?: string;
    challengeResult?: ChallengeResult;
}

export interface SpoChallengeResponseBody {
    error: boolean,
    message: string;
    domain?: string;
    nonce?: string;
    handle?: string;
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

        const res: SpoChallengeResultBody = await fetchNodeApp('spo/challenge', {
            headers: {
                [getAccessTokenCookieName(true)]: headerAccess,
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body
        }).then(res => res.json());

        const { error, message, handle, challengeResult } = res;

        const result: SpoChallengeResponseBody = { error, message, handle, domain: challengeResult?.domain, nonce: challengeResult?.nonce };

        return {
            statusCode: 200,
            body: JSON.stringify(result),
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
