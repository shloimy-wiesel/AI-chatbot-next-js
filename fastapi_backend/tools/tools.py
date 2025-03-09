from tools.create_doc import create_doc_execute, create_document_tool


TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "getWeather",
            "description": "Get the current weather in a given location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The city and state, e.g. San Francisco, CA",
                    },
                    "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},
                },
                "required": ["location", "unit"],
            },
        },
    },
    # {
    #     "type": "function",
    #     "function": {
    #         "name": "create_document",
    #         "description": "Create a document for writing or content creation activities. "
    #         "This tool will generate the document contents based on the title and kind.",
    #         "parameters": {
    #             "type": "object",
    #             "properties": {
    #                 "title": {
    #                     "type": "string",
    #                     "description": "The title of the document",
    #                 },
    #                 "kind": {
    #                     "type": "string",
    #                     "description": "The kind of document (e.g. article, blog, report)",
    #                 },
    #             },
    #             "required": ["title", "kind"],
    #         },
    #         # "execute": create_doc_execute.__annotations__,
    #     },
    # },
]


#   createDocument: createDocument({ session, dataStream }),
#   updateDocument: updateDocument({ session, dataStream }),
#   requestSuggestions: requestSuggestions({
#     session,
#     dataStream,
#   }),
