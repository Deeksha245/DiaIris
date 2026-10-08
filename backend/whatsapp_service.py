import os
import requests
from dotenv import load_dotenv

load_dotenv()

GREEN_API_URL = os.getenv("GREEN_API_URL")
GREEN_API_INSTANCE_ID = os.getenv("GREEN_API_INSTANCE_ID")
GREEN_API_TOKEN = os.getenv("GREEN_API_TOKEN")


def send_whatsapp_message(phone_number, message):

    phone_number = (
        str(phone_number)
        .replace("+", "")
        .replace(" ", "")
        .replace("-", "")
        .replace("(", "")
        .replace(")", "")
    )

    # Convert Indian 10-digit number to international format
    if len(phone_number) == 10:
        phone_number = "91" + phone_number

    chat_id = f"{phone_number}@c.us"

    print("WhatsApp chat ID:", chat_id)

    url = (
        f"{GREEN_API_URL}/waInstance"
        f"{GREEN_API_INSTANCE_ID}/sendMessage/"
        f"{GREEN_API_TOKEN}"
    )

    payload = {
        "chatId": chat_id,
        "message": message
    }

    response = requests.post(
        url,
        json=payload,
        headers={
            "Content-Type": "application/json"
        },
        timeout=15
    )

    print("GREEN-API response:", response.text)

    response.raise_for_status()

    return response.json()