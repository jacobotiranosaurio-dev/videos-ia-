import json, base64, sys, os, subprocess, urllib.request
sys.path.insert(0, os.path.dirname(__file__))
from scripts import SCRIPTS
VOICE="TX3LPaxmHKxFdv7VOQHJ"  # Liam (Dan no accesible con esta API key)
OUT="../public/audio"
for key in sys.argv[1:]:
    scenes=SCRIPTS[key]
    text=" ".join(scenes)
    body=json.dumps({"text":text,"model_id":"eleven_multilingual_v2",
        "voice_settings":{"stability":0.38,"similarity_boost":0.8,"style":0.4,"use_speaker_boost":True,"speed":1.06}}).encode()
    req=urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE}/with-timestamps?output_format=mp3_44100_128",
        data=body,headers={"xi-api-key":"dummy","Content-Type":"application/json"})
    d=json.load(urllib.request.urlopen(req))
    open(f"{OUT}/{key}.mp3","wb").write(base64.b64decode(d["audio_base64"]))
    al=d["alignment"]
    # words
    chars,st,en=al["characters"],al["character_start_times_seconds"],al["character_end_times_seconds"]
    words=[];cur=None
    for i,c in enumerate(chars):
        if c.isspace():
            if cur: words.append(cur);cur=None
            continue
        if cur is None: cur={"text":"","start":st[i],"end":en[i],"ci":i}
        cur["text"]+=c; cur["end"]=en[i]
    if cur: words.append(cur)
    # scene boundaries by char index
    bounds=[];pos=0
    for s in scenes:
        bounds.append(pos); pos+=len(s)+1
    for w in words:
        w["scene"]=max(j for j,b in enumerate(bounds) if w["ci"]>=b); del w["ci"]
    dur=float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",f"{OUT}/{key}.mp3"]))
    json.dump({"duration":dur,"words":words,"scenes":scenes},open(f"{key}.timing.json","w"),ensure_ascii=False,indent=1)
    print(key,round(dur,1),"s",len(words),"words")
