import requests
from sentence_transformers import SentenceTransformer, util

OPENROUTER_API_KEY = "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"

def gpt4_turbo_rewrite(text):
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "openai/gpt-3.5-turbo",
        "messages": [
            {
                "role": "system",
                "content": "You are an interior design assistant. Rewrite the user's kitchen preferences into a highly descriptive and elegant one-paragraph summary for prompt generation."
            },
            {
                "role": "user",
                "content": text
            }
        ]
    }

    res = requests.post(url, headers=headers, json=payload)
    res.raise_for_status()
    return res.json()["choices"][0]["message"]["content"].strip()

def detect_styles_and_rules(summary, window_positions):
    embedder = SentenceTransformer('all-MiniLM-L6-v2')

    design_styles = {
        "modern": "modern design with clean lines, minimal clutter, and contemporary aesthetics",
        "eco-friendly": "sustainable and eco-friendly materials",
        "rustic": "farmhouse elements like reclaimed wood and warm tones",
        "minimalist": "simplicity, decluttered spaces, and monochrome palettes",
        "industrial": "concrete, exposed beams, and metal accents",
        "luxury": "marble, gold, and high-end appliances",
        "scandinavian": "light colors, natural wood, cozy textures",
        "bohemian": "vibrant colors, layered textiles, eclectic patterns",
        "traditional": "classic furniture and symmetrical layouts",
        "coastal": "breezy tones, nautical elements",
        "mid-century modern": "retro furniture, geometric shapes",
        "transitional": "blend of traditional and modern",
        "art deco": "bold patterns, metallic finishes, glamorous vibes"
    }

    moods = {
        "airy": "open with breathing room",
        "cozy": "warm and inviting",
        "formal": "structured and upscale",
        "casual": "laid-back and informal"
    }

    personas = {
        "family": "kid-friendly functionality",
        "chef": "professional-grade appliances and workflow",
        "entertainer": "open areas and serving spaces"
    }

    summary_embedding = embedder.encode(summary, convert_to_tensor=True)
    style_embeddings = {k: embedder.encode(v, convert_to_tensor=True) for k, v in design_styles.items()}
    mood_embeddings = {k: embedder.encode(v, convert_to_tensor=True) for k, v in moods.items()}
    persona_embeddings = {k: embedder.encode(v, convert_to_tensor=True) for k, v in personas.items()}

    similarities = [(s, util.pytorch_cos_sim(summary_embedding, emb).item()) for s, emb in style_embeddings.items()]
    similarities = sorted(similarities, key=lambda x: x[1], reverse=True)
    top_style, top_score = similarities[0]
    second_style, second_score = similarities[1]
    styles = [(top_style, 0.7), (second_style, 0.3)] if top_score - second_score < 0.05 else [(top_style, 1.0)]

    mood = max(moods, key=lambda m: util.pytorch_cos_sim(summary_embedding, mood_embeddings[m]).item())
    persona = max(personas, key=lambda p: util.pytorch_cos_sim(summary_embedding, persona_embeddings[p]).item())

    rules = []
    for style, weight in styles:
        rules.append(f"({int(weight * 100)}%) Follow {style} style elements.")
    rules.append(f"Reflect a {mood} mood.")
    rules.append(f"Tailor the design for a {persona} user.")

    if window_positions:
        rules.insert(0, "Preserve the detected window positions exactly as they are; do not alter, move, or resize them.")
        rules.insert(1, "Do not add any new physical structures like windows or walls.")
    else:
        rules.insert(0, "No window positions detected. Avoid adding any new structural elements unless specified.")

    return rules
