"""Genera voz con ElevenLabs (con timestamps por carácter) -> mp3 + alignment.json"""
import json, sys, base64, urllib.request
txt_path, out_mp3, out_json = sys.argv[1:4]
voice = sys.argv[4] if len(sys.argv) > 4 else "TX3LPaxmHKxFdv7VOQHJ"  # Liam
text = open(txt_path, encoding="utf-8").read().strip().replace("\n", " ")
body = {"text": text, "model_id": "eleven_multilingual_v2",
        "voice_settings": {"stability": 0.38, "similarity_boost": 0.8, "style": 0.45,
                           "use_speaker_boost": True, "speed": 1.1}}
req = urllib.request.Request(
    f"https://api.elevenlabs.io/v1/text-to-speech/{voice}/with-timestamps?output_format=mp3_44100_128",
    data=json.dumps(body).encode(), headers={"Content-Type": "application/json", "xi-api-key": "dummy"})
d = json.load(urllib.request.urlopen(req))
open(out_mp3, "wb").write(base64.b64decode(d["audio_base64"]))
json.dump(d["alignment"], open(out_json, "w"), ensure_ascii=False)
print("ok", d["alignment"]["character_end_times_seconds"][-1])
