import uuid
from typing import Dict, Any
from dotenv import load_dotenv
from openai import OpenAI
import os

print(os.getcwd())
print(os.getcwd())
print(os.getcwd())
print(os.getcwd())

load_dotenv(f"/home/esharon@flytrucks.com/shloimy-code/AI-chatbot-next-js/fastapi_backend/.env")



client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
)

def create_document_tool(session: Dict, data_stream) -> Dict[str, Any]:
    """
    Create document tool that can be passed as an LLM tool.
    This tool accepts parameters 'title' and 'kind', streams events, and returns a result.
    """
    def execute(args: Dict[str, Any]) -> Dict[str, Any]:
        title = args.get("title")
        kind = args.get("kind")
        document_id = str(uuid.uuid4())

        # Stream events to the client (simulate the dataStream.writeData calls)
        data_stream.write_data({"type": "kind", "content": kind})
        data_stream.write_data({"type": "id", "content": document_id})
        data_stream.write_data({"type": "title", "content": title})
        data_stream.write_data({"type": "clear", "content": ""})

        # Skipped: Call to a document handler (e.g., document_handler.on_create_document(...))
        # This is where you would integrate your business logic or additional processing

        data_stream.write_data({"type": "finish", "content": ""})

        return {
            "id": document_id,
            "title": title,
            "kind": kind,
            "content": "A document was created and is now visible to the user.",
        }

    # Return a tool definition that can be added to your list of tools for the LLM
    return {
        "type": "function",
        "function": {
            "name": "create_document",
            "description": "Create a document for writing or content creation activities. "
                           "This tool will generate the document contents based on the title and kind.",
            "parameters": {
                "type": "object",
                "properties": {
                    "title": {
                        "type": "string",
                        "description": "The title of the document"
                    },
                    "kind": {
                        "type": "string",
                        "description": "The kind of document (e.g. article, blog, report)"
                    },
                },
                "required": ["title", "kind"],
            },
            "execute": execute,
        },
    }


from typing import Generator

def create_doc_execute(title: str, kind: str) -> Generator[str, None, None]:
    # title = args.get("title")
    # kind = args.get("kind")
    document_id = str(uuid.uuid4())

    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": f"Create a document with the title {title} and kind {kind}"},
    ]

    stream = client.chat.completions.create(
        messages=messages,
        model="gpt-4o",
        stream=True,
    )
    for chunk in stream:
            for choice in chunk.choices:
                if choice.finish_reason == "stop":
                    break
                else:
                    yield "{text}".format(text=choice.delta.content)




    # Stream events to the client (simulate the dataStream.writeData calls)
    # data_stream.write_data({"type": "kind", "content": kind})
    # data_stream.write_data({"type": "id", "content": document_id})
    # data_stream.write_data({"type": "title", "content": title})
    # data_stream.write_data({"type": "clear", "content": ""})

    # Skipped: Call to a document handler (e.g., document_handler.on_create_document(...))
    # This is where you would integrate your business logic or additional processing

    # data_stream.write_data({"type": "finish", "content": ""})

    return {
        "id": document_id,
        "title": title,
        "kind": kind,
        "content": "A document was created and is now visible to the user.",
    }