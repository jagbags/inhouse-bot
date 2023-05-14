import nacl from 'tweetnacl';
import { SQSClient , SendMessageCommand } from "@aws-sdk/client-sqs";

export async function handler(event) {
  console.log(event)

  const verifyPromise = verifyEvent(event)

  // Replying to ping (requirement 2.)
  const body = JSON.parse(event.body)
  if (body.type == 1) {
    if (await verifyPromise) {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type: 1
        })
      };
    }
  }

  // Handle /foo Command
  if (body.type == 2) {
    const client = new SQSClient({ region: "us-east-1" });
    const input = { // InvocationRequest
      QueueUrl: "https://sqs.us-east-1.amazonaws.com/280264141826/inhouse-bot-queue", // required
      MessageBody: event.body
    };
    const command = new SendMessageCommand(input);
    const sqsSent = client.send(command)
    if (await Promise.all([verifyPromise, sqsSent])) {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({  // Note the absence of statusCode
          "type": 5,  // This type stands for answer with invocation shown
        })
      };
    }
  }

  return {
    statusCode: 404  // If no handler implemented for Discord's request
  }
}

async function verifyEvent(event) {
  try {
    const PUBLIC_KEY = process.env.DISCORD_PUBLIC_KEY;
    const signature = event.headers['x-signature-ed25519']
    const timestamp = event.headers['x-signature-timestamp'];
    const strBody = event.body; // should be string, for successful sign
  
    const isVerified = nacl.sign.detached.verify(
      Buffer.from(timestamp + strBody),
      Buffer.from(signature, 'hex'),
      Buffer.from(PUBLIC_KEY, 'hex')
    );

    return isVerified
  } catch (exception) {
    console.log(exception)
    return false
  }
}