from dotenv import load_dotenv
from whatsapp_service import send_whatsapp_message

load_dotenv()


phone_number = "919483621171"

message = """DIAIRIS TEST MESSAGE

Hello!

This is a test WhatsApp message from the DIAIRIS system.

WhatsApp integration is working successfully.
"""


try:
    result = send_whatsapp_message(
        phone_number,
        message
    )

    print("SUCCESS!")
    print(result)

except Exception as e:
    print("FAILED!")
    print(e)