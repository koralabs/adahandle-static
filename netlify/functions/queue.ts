import {
  Handler,
  HandlerEvent,
  HandlerContext,
  HandlerResponse,
} from "@netlify/functions";

import { HEADER_RECAPTCHA } from "../../src/lib/constants";
import { passesRecaptcha } from "../helpers/recaptcha";
import { botResponse, unauthorizedResponse } from "../helpers/response";
import { fetchNodeApp } from "../helpers/util";
import { HEADER_CLIENT_IP, HEADER_EMAIL } from "../../src/lib/constants";

interface AppendAccessResponse {
  updated: boolean;
  alreadyExists: boolean;
}

export interface QueueResponseBody extends AppendAccessResponse {
  error: boolean;
  message?: string;
}

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
): Promise<HandlerResponse> => {
  const { headers, body } = event;
  const headerRecaptcha = headers[HEADER_RECAPTCHA];

  if (!headers[HEADER_EMAIL]) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: true,
        message: 'Missing email address.'
      } as QueueResponseBody)
    }
  }

  if (!headerRecaptcha) {
    return unauthorizedResponse;
  }

  // Anti-bot.
  const reCaptchaValidated = await passesRecaptcha(headerRecaptcha);
  if (!reCaptchaValidated) {
    return botResponse;
  }

  if (!body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: true,
        message: 'Invalid request'
      } as QueueResponseBody)
    }
  }

  const parsedBody = JSON.parse(body);
  const clientIp = headers[Object.keys(headers).find(key => key.toLowerCase() === HEADER_CLIENT_IP.toLowerCase())];
  const requestBody = { ...parsedBody, clientIp: clientIp ?? 'unknown' }

  try {
    const data: QueueResponseBody = await fetchNodeApp(`queue`, {
      method: 'POST',
      headers: {
        [HEADER_EMAIL]: headers[HEADER_EMAIL],
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    }).then(res => res.json())
      .catch(e => console.log(e));

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: true,
        message: e.toString()
      } as QueueResponseBody)
    };
  }
};

export { handler };
