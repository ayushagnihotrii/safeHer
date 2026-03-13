"""Hardcoded sample conversations for the Suspicious Conversation Analyzer."""

SAMPLE_CONVERSATIONS = [
    {
        "id": "romance-scam",
        "title": "Romance Scam",
        "description": "A classic romance scam involving love bombing, isolation, and financial requests.",
        "conversation": (
            'Stranger: "Hey beautiful, I couldn\'t stop thinking about you"\n'
            'User: "Who are you?"\n'
            'Stranger: "I\'m Michael, a US army doctor stationed overseas. '
            'I saw your profile and felt an instant connection. '
            'I think I\'m falling for you already."\n'
            'User: "We just met though..."\n'
            'Stranger: "When you know, you know. I\'ve never felt this way. '
            'Don\'t tell your family about us yet, they won\'t understand our love."\n'
            'Stranger: "I need $200 in gift cards to be able to call you from here. '
            'The military blocks regular calls. I\'ll pay you back double when I return."'
        ),
    },
    {
        "id": "financial-fraud",
        "title": "Financial Fraud",
        "description": "A fake grant/prize scam using urgency and secrecy tactics.",
        "conversation": (
            'Agent: "Congratulations! You\'ve been selected for a $50,000 government grant!"\n'
            'User: "Really? How?"\n'
            'Agent: "Yes, this is a special program. But you must act within the next 2 hours '
            'or you will lose this opportunity forever."\n'
            'Agent: "This is strictly confidential. Do not tell anyone about this, '
            'not even your family members."\n'
            'User: "What do I need to do?"\n'
            'Agent: "Simply send a $150 processing fee via Bitcoin to claim your grant. '
            'Here is the wallet address. Once we receive the fee, '
            'your $50,000 will be deposited within 24 hours."'
        ),
    },
    {
        "id": "normal-chat",
        "title": "Normal Chat",
        "description": "A completely normal, friendly conversation between classmates.",
        "conversation": (
            'Alice: "Hey, are you coming to the study group tomorrow?"\n'
            'Bob: "Yeah, I\'ll be there around 3pm."\n'
            'Alice: "Great! Can you bring your notes from yesterday\'s lecture?"\n'
            'Bob: "Sure, no problem. Should I bring snacks too?"\n'
            'Alice: "That would be awesome! See you tomorrow then."\n'
            'Bob: "See you! 👋"'
        ),
    },
]


def get_sample_conversations():
    """Return all sample conversations."""
    return SAMPLE_CONVERSATIONS
