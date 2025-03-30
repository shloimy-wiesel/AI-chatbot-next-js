import os
import json
from typing import List
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi import FastAPI, Query
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from httpx import Client
# from tools.create_doc import create_doc_execute
from tools.tools import TOOLS
from utils.prompt import ClientMessage, convert_to_openai_messages
from utils.tools import createDocument, get_current_weather
print(os.getcwd())
print(os.getcwd())
print(os.getcwd())
print(os.getcwd())

load_dotenv(f"/home/shloimy/Documents/code/AI-chatbot-next-js/fastapi_backend/.env")


app = FastAPI()

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to restrict allowed origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)


client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    http_client=Client(verify=False)
)


class Request(BaseModel):
    messages: List[ClientMessage]


available_tools = {
    "getWeather": get_current_weather,
    "createDocument": createDocument
    # "create_document": create_doc_execute
}


async def stream_text(messages: List[ClientMessage], protocol: str = 'data'):
    print("messages", messages)

    stream = client.chat.completions.create(
        messages=messages,
        model="gpt-4o",
        stream=True,
        tools=TOOLS

    )

    # When protocol is set to "text", you will send a stream of plain text chunks
    # https://sdk.vercel.ai/docs/ai-sdk-ui/stream-protocol#text-stream-protocol

    if (protocol == 'text'):
        for chunk in stream:
            for choice in chunk.choices:
                if choice.finish_reason == "stop":
                    break
                else:
                    yield "{text}".format(text=choice.delta.content)

    # When protocol is set to "data", you will send a stream data part chunks
    # https://sdk.vercel.ai/docs/ai-sdk-ui/stream-protocol#data-stream-protocol

    elif (protocol == 'data'):
        draft_tool_calls = []
        draft_tool_calls_index = -1

        for chunk in stream:
            for choice in chunk.choices:
                if choice.finish_reason == "stop":
                    continue

                elif choice.finish_reason == "tool_calls":
                    for tool_call in draft_tool_calls:
                        yield '9:{{"toolCallId":"{id}","toolName":"{name}","args":{args}}}\n'.format(
                            id=tool_call["id"],
                            name=tool_call["name"],
                            args=tool_call["arguments"])

                    for tool_call in draft_tool_calls:
                        

                        if tool_call["name"] == "createDocument":
                            async for item in createDocument(**json.loads(tool_call["arguments"]), client=client):
                                tool_result = item  # Process each yielded item
                                yield f'c:{{"toolCallId":"{tool_call["id"]}", "argsTextDelta":{json.dumps(item)}}}\n'

                        else:
                            tool_result = available_tools[tool_call["name"]](
                            **json.loads(tool_call["arguments"]))

                        yield 'a:{{"toolCallId":"{id}","toolName":"{name}","args":{args},"result":{result}}}\n'.format(
                            id=tool_call["id"],
                            name=tool_call["name"],
                            args=tool_call["arguments"],
                            result=json.dumps(tool_result))

                elif choice.delta.tool_calls:
                    for tool_call in choice.delta.tool_calls:
                        id = tool_call.id
                        name = tool_call.function.name
                        arguments = tool_call.function.arguments

                        if (id is not None):
                            draft_tool_calls_index += 1
                            draft_tool_calls.append(
                                {"id": id, "name": name, "arguments": ""})

                        else:
                            draft_tool_calls[draft_tool_calls_index]["arguments"] += arguments

                else:
                    yield '0:{text}\n'.format(text=json.dumps(choice.delta.content))

            if chunk.choices == []:
                usage = chunk.usage
                prompt_tokens = usage.prompt_tokens
                completion_tokens = usage.completion_tokens

                yield 'd:{{"finishReason":"{reason}","usage":{{"promptTokens":{prompt},"completionTokens":{completion}}}}}\n'.format(
                    reason="tool-calls" if len(
                        draft_tool_calls) > 0 else "stop",
                    prompt=prompt_tokens,
                    completion=completion_tokens
                )


@app.post("/api/chat")
async def handle_chat_data(request: Request, protocol: str = Query('data')):

    messages = request.messages


    print(f"messages: {messages}")

    openai_messages = convert_to_openai_messages(messages)

    response = StreamingResponse(stream_text(openai_messages, protocol))
    response.headers['x-vercel-ai-data-stream'] = 'v1'
    return response


# @app.options("/api/chat")
# async def handle_chat_data(request: Request, protocol: str = Query('data')):
#     messages = request.messages
#     openai_messages = convert_to_openai_messages(messages)

#     response = StreamingResponse(stream_text(openai_messages, protocol))
#     response.headers['x-vercel-ai-data-stream'] = 'v1'
#     return response


if __name__ == "__main__":
    import uvicorn
    uvicorn.run('index:app', host="0.0.0.0", port=3600, reload=True)