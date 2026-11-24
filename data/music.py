# Música de fondo original generada por síntesis (sin derechos de terceros).
import numpy as np, scipy.signal as sg, scipy.io.wavfile as wf, subprocess, sys
SR=44100
def mtof(m): return 440*2**((m-69)/12)
def env(n,a,r):
    e=np.ones(n); a=int(a*SR); r=int(r*SR)
    if a: e[:a]=np.linspace(0,1,a)
    if r: e[-r:]*=np.linspace(1,0,r)
    return e
def pad(freqs,dur,bright=1200):
    n=int(dur*SR); t=np.arange(n)/SR; x=np.zeros(n)
    for f in freqs:
        for d in (-0.12,0.0,0.12):
            ff=f*2**(d/12); x+=sg.sawtooth(2*np.pi*ff*t+np.random.rand()*6)*0.5+np.sin(2*np.pi*ff*t)
    b,a=sg.butter(2,bright/(SR/2)); x=sg.lfilter(b,a,x)
    return x*env(n,dur*0.35,dur*0.35)/len(freqs)
def pluck(f,dur=0.8,bright=3000):
    n=int(dur*SR); t=np.arange(n)/SR
    x=(sg.square(2*np.pi*f*t)*0.3+np.sin(2*np.pi*f*t))*np.exp(-t*6)
    b,a=sg.butter(2,bright/(SR/2)); return sg.lfilter(b,a,x)
def kick(dur=0.4):
    t=np.arange(int(dur*SR))/SR; f=50+80*np.exp(-t*30)
    return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*9)
def tom(dur=0.6):
    t=np.arange(int(dur*SR))/SR; f=70+60*np.exp(-t*12)
    return (np.sin(2*np.pi*np.cumsum(f)/SR)+0.3*np.random.randn(len(t))*np.exp(-t*30))*np.exp(-t*6)
def hat():
    t=np.arange(int(0.06*SR))/SR; x=np.random.randn(len(t))*np.exp(-t*80)
    b,a=sg.butter(2,7000/(SR/2),'high'); return sg.lfilter(b,a,x)*0.3
def add(buf,x,at):
    i=int(at*SR); j=min(len(buf),i+len(x))
    if j>i: buf[i:j]+=x[:j-i]
def reverb(x,sec=2.5,mix=0.35):
    t=np.arange(int(sec*SR))/SR; ir=np.random.randn(len(t))*np.exp(-t*3)
    w=sg.fftconvolve(x,ir)[:len(x)]; w/=np.abs(w).max()+1e-9
    return x/(np.abs(x).max()+1e-9)*(1-mix)+w*mix
STYLES={
 # name: (bpm, chords (midi), arp?, drum)
 "planetas":(84,[[57,60,64,69],[53,57,60,65],[48,52,55,60],[55,59,62,67]],True,"soft"),
 "prohibidos":(96,[[50,53,57,62],[50,53,57,62],[46,50,53,58],[48,52,55,60]],True,"tick"),
 "envidia":(88,[[52,55,59,62,66],[48,52,55,59],[45,48,52,55,59],[47,50,54,57]],True,"lofi"),
 "roma":(80,[[38,45,50,53],[34,41,46,50],[36,43,48,52],[33,40,45,49]],False,"war"),
 "miel":(92,[[53,57,60,64],[50,53,57,60],[46,50,53,57],[48,52,55,60]],True,"lofi"),
 "carteles":(100,[[50,53,57,62],[46,50,53,58],[43,46,50,55],[45,49,52,57]],True,"tick"),
 "votoobligatorio":(96,[[48,52,55,60],[45,48,52,57],[41,45,48,53],[43,47,50,55]],True,"soft"),
 "blanconulo":(98,[[52,55,59,64],[48,52,55,60],[45,48,52,57],[47,50,54,59]],True,"soft"),
 "copa":(112,[[50,54,57,62],[47,50,54,59],[43,47,50,55],[45,49,52,57]],True,"war"),
 "gta6":(104,[[45,52,57,60],[41,48,53,57],[43,50,55,59],[40,47,52,55]],True,"lofi"),
 "sinhumanos":(72,[[48,52,55,59],[45,48,52,55],[41,45,48,52],[43,47,50,55]],True,"none"),
}
for name in sys.argv[1:]:
    bpm,chords,arp,drum=STYLES[name]; np.random.seed(len(name))
    beat=60/bpm; bar=beat*4; total=72.0
    L=int(total*SR); mus=np.zeros(L); drums=np.zeros(L)
    i=0; tpos=0.0
    while tpos<total:
        ch=chords[i%len(chords)]
        add(mus,pad([mtof(m) for m in ch],bar*1.3,1400 if name!="roma" else 900)*0.5,tpos)
        add(mus,pad([mtof(ch[0]-12)],bar*1.2,300)*0.5,tpos)
        if arp:
            pattern=[0,2,1,3,2,1,3,2]
            for k in range(8):
                m=ch[pattern[k]%len(ch)]+12
                add(mus,pluck(mtof(m))*0.18,tpos+k*beat/2)
        for b in range(4):
            bt=tpos+b*beat
            if drum=="soft" and b in(0,2): add(drums,kick()*0.35,bt)
            if drum=="lofi":
                if b in (0,2): add(drums,kick()*0.45,bt)
                add(drums,hat(),bt+beat/2)
            if drum=="tick":
                add(drums,hat()*1.2,bt); add(drums,hat()*0.6,bt+beat/2)
                if b==0: add(drums,kick()*0.4,bt)
            if drum=="war":
                add(drums,tom()*0.6,bt)
                if b==3: add(drums,tom()*0.4,bt+beat/2)
        tpos+=bar; i+=1
    out=reverb(mus,3.0,0.4)*0.8+drums/(np.abs(drums).max()+1e-9)*0.35
    out*=env(L,1.5,3.0); out=out/np.abs(out).max()*0.8
    wf.write(f"/tmp/{name}.wav",SR,(out*32767).astype(np.int16))
    subprocess.run(["ffmpeg","-y","-loglevel","error","-i",f"/tmp/{name}.wav","-b:a","160k",f"../public/music/{name}.mp3"],check=True)
    print("ok",name)
