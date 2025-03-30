import json
import random
from typing import Literal
import uuid

from httpx import request
from geopy.geocoders import Nominatim
from openai import OpenAI

blockKinds = Literal['text', 'code', 'image', 'sheet']


def get_current_weather(location, unit="fahrenheit"):
    if unit == "celsius":
        temperature = random.randint(-34, 43)
    else:
        temperature = random.randint(-30, 110)

    latitude = None
    longitude = None

    geolocator = Nominatim(user_agent="geo_locator")
    location_data = geolocator.geocode(location)
    if location_data:
        longitude = location_data.longitude
        latitude = location_data.latitude
        # return location_data.latitude, location_data.longitude
    response = request(
        verify=False,
        method="GET",
        url=f"https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto",
    )
    res = response.json()

    # print(f"res: {res}")

    return res
    # const weatherData = await response.json();
    # return {
    #     "temperature": temperature,
    #     "unit": unit,
    #     "location": location,
    # }

async def createDocument(title: str, kind: blockKinds, client: OpenAI):
    id = uuid.uuid4()

    yield f'2:{json.dumps({"type": "kind", "content": kind})}'
    yield f'2:{json.dumps({"type": "id", "content": str(id)})}'
    yield f'2:{json.dumps({"type": "title", "content": title})}'

    # Correct way to handle an async generator
    async for item in on_create_document(title, client):
        yield item  # Pass through the yielded content

    yield f'2:{json.dumps({"type": "clear", "content": ""})}'
    yield f'2:{json.dumps({"type": "finish", "content": ""})}'

    # Instead of return, use a final yield
    yield f'2:{json.dumps({"type": "result", "content": {"id": str(id), "title": title, "kind": kind}})}'


async def on_create_document(title, client: OpenAI):
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "system", "content": "Write about the given topic. Markdown is supported. Use headings wherever appropriate."},
                  {"role": "user", "content": title}]
    )

    res = response.choices[0].message.content  # Corrected way to access response content

    yield "0:{json}".format(json=json.dumps(res))

    

    


#   onCreateDocument: async ({ title, dataStream }) => {
#     let draftContent = '';

#     const { fullStream } = streamText({
#       model: myProvider.languageModel('block-model'),
#       system:
#         'Write about the given topic. Markdown is supported. Use headings wherever appropriate.',
#       experimental_transform: smoothStream({ chunking: 'word' }),
#       prompt: title,
#     });

#     for await (const delta of fullStream) {
#       const { type } = delta;

#       if (type === 'text-delta') {
#         const { textDelta } = delta;

#         draftContent += textDelta;

#         dataStream.writeData({
#           type: 'text-delta',
#           content: textDelta,
#         });
#       }
#     }

#     return draftContent;
#   },


# export const createDocument = ({ session, dataStream }: CreateDocumentProps) =>
#   tool({
#     description:
#       'Create a document for a writing or content creation activities. This tool will call other functions that will generate the contents of the document based on the title and kind.',
#     parameters: z.object({
#       title: z.string(),
#       kind: z.enum(blockKinds),
#     }),
#     execute: async ({ title, kind }) => {
#       const id = generateUUID();

#       dataStream.writeData({
#         type: 'kind',
#         content: kind,
#       });

#       dataStream.writeData({
#         type: 'id',
#         content: id,
#       });

#       dataStream.writeData({
#         type: 'title',
#         content: title,
#       });

#       dataStream.writeData({
#         type: 'clear',
#         content: '',
#       });

#       const documentHandler = documentHandlersByBlockKind.find(
#         (documentHandlerByBlockKind) =>
#           documentHandlerByBlockKind.kind === kind,
#       );

#       if (!documentHandler) {
#         throw new Error(`No document handler found for kind: ${kind}`);
#       }

#       await documentHandler.onCreateDocument({
#         id,
#         title,
#         dataStream,
#         session,
#       });

#       dataStream.writeData({ type: 'finish', content: '' });

#       return {
#         id,
#         title,
#         kind,
#         content: 'A document was created and is now visible to the user.',
#       };
#     },
#   });