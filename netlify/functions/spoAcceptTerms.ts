import {
    Handler,
    HandlerEvent,
    HandlerContext,
    HandlerResponse,
} from "@netlify/functions";

import jwt, { JwtPayload } from "jsonwebtoken";

import { passesRecaptcha } from "../helpers/recaptcha";
import { botResponse, unauthorizedResponse } from "../helpers/response";
import { HEADER_RECAPTCHA, HEADER_RECAPTCHA_FALLBACK, MAX_ACCESS_LENGTH, MAX_ACCESS_LENGTH_SPO } from "../../src/lib/constants";
import { getSecret } from "../helpers";

export interface SpoAcceptTermsResponseBody {
    error: boolean;
    token?: string;
    data?: JwtPayload;
    verified?: boolean;
    message?: string;
}

const handler: Handler = async (
    event: HandlerEvent,
    context: HandlerContext
): Promise<HandlerResponse> => {
    const { headers } = event;
    const headerRecaptcha = headers[HEADER_RECAPTCHA];
    const headerRecaptchaFallback = headers[HEADER_RECAPTCHA_FALLBACK];

    if (!headerRecaptcha) {
        return unauthorizedResponse;
    }

    // Anti-bot.
    const useFallback = null !== headerRecaptchaFallback;
    const token = headerRecaptchaFallback || headerRecaptcha;
    const reCaptchaValidated = await passesRecaptcha(token, useFallback);
    if (!reCaptchaValidated) {
        return botResponse;
    }

    const secretKey = await getSecret('access');
    const jwtToken = secretKey && jwt.sign(
        {
            emailAddress: 'spos@adahandle.com',
            isSPO: true,
        },
        secretKey,
        {
            expiresIn: Math.floor(MAX_ACCESS_LENGTH_SPO / 1000)
        }
    );

    const result = {
        error: false,
        verified: true,
        token: jwtToken,
        data: jwt.decode(jwtToken)
    }

    return {
        statusCode: 200,
        body: JSON.stringify(result),
    };
};

export { handler };
