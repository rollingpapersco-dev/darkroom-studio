# Usage: python3 -I app/scripts/gen-decks.py design_handoff_pitches_calendar/pitches app/src/pitches
# Builds app/src/pitches/{standard-deck.html, decks.json, redbull-deck.html} from the handoff decks,
# then verifies that filling the template reproduces every original deck byte for byte.
import sys, re, json
D, OUT = sys.argv[1], sys.argv[2]
FILES = ["Apple Music","Spotify","Audiomack","Boomplay","YouTube Music","Audio Gear","Telcos","Drinks","Streetwear","Fintech"]
def body(f):
    s = open(f"{D}/Pitch - {f}.dc.html", encoding="utf-8").read()
    inner = re.search(r'<x-import[^>]*>\n?(.*?)</x-import>', s, re.S).group(1)
    return inner.replace('../assets/', '{{ASSETS}}')
EM = "<span style=\"font-family:'Playfair Display',Georgia,serif;font-style:italic;font-weight:400;color:#86868b\">"
def parts(s):
    brand = re.search(r"Darkroom ×<br><span[^>]*>(.*?)\.</span>", s).group(1)
    why = re.search(r"<!--WHY-->(.*?)<!--/WHY-->", s, re.S).group(1)
    asks = re.search(r"<!--ASKS-->(.*?)<!--/ASKS-->", s, re.S).group(1)
    h = re.search(r'margin-top:20px">(.*?) ' + re.escape(EM) + r'(.*?)</span>', why)
    reasons = re.findall(r'line-height:1.1;color:#fff">(.*?)</div><p[^>]*>(.*?)</p>', why)
    leads = re.findall(r'letter-spacing:0.1em;color:#[0-9A-Fa-f]+">(?:RECOMMENDED|ALSO STRONG)</div><div[^>]*>(.*?)</div><p[^>]*>(.*?)</p>', asks)
    others = re.findall(r'font-size:30px;font-weight:700;color:#fff">(.*?)</div><p[^>]*>(.*?)</p>', asks)
    assert len(reasons) == 3 and len(leads) == 2 and len(others) == 4, (len(reasons), len(leads), len(others))
    return brand, why, asks, h, reasons, leads, others

def sub_in(block, pairs):
    # replace each (old -> marker) in order, each exactly once, scanning forward
    out, pos = [], 0
    for old, new in pairs:
        i = block.index(old, pos); out.append(block[pos:i]); out.append(new); pos = i + len(old)
    out.append(block[pos:]); return ''.join(out)

base = body("Apple Music")
brand, why, asks, h, reasons, leads, others = parts(base)
why_t = sub_in(why, [('margin-top:20px">' + h.group(1), 'margin-top:20px">{{WHY_TITLE}}'), (EM + h.group(2) + '</span>', EM + '{{WHY_EM}}</span>')]
  + sum([[('color:#fff">' + t + '</div>', 'color:#fff">{{R%dT}}</div>' % (i+1)), ('>' + b + '</p>', '>{{R%dB}}</p>' % (i+1))] for i, (t, b) in enumerate(reasons)], []))
asks_t = sub_in(asks, sum([[('color:#fff">' + t + '</div>', 'color:#fff">{{L%dT}}</div>' % (i+1)), ('>' + b + '</p>', '>{{L%dB}}</p>' % (i+1))] for i, (t, b) in enumerate(leads)], [])
  + sum([[('color:#fff">' + t + '</div>', 'color:#fff">{{O%dT}}</div>' % (i+1)), ('>' + b + '</p>', '>{{O%dB}}</p>' % (i+1))] for i, (t, b) in enumerate(others)], []))
tpl = base.replace(why, why_t).replace(asks, asks_t).replace(brand, '{{BRAND}}')
assert 'Apple Music' not in tpl

decks = {}
for f in FILES:
    s = body(f); b, why, asks, h, reasons, leads, others = parts(s)
    k = lambda x: x.replace(b, '{{BRAND}}')
    m = {'WHY_TITLE': k(h.group(1)), 'WHY_EM': k(h.group(2))}
    for i, (t, x) in enumerate(reasons): m['R%dT' % (i+1)], m['R%dB' % (i+1)] = k(t), k(x)
    for i, (t, x) in enumerate(leads): m['L%dT' % (i+1)], m['L%dB' % (i+1)] = k(t), k(x)
    for i, (t, x) in enumerate(others): m['O%dT' % (i+1)], m['O%dB' % (i+1)] = k(t), k(x)
    decks[f] = {'brand': b, 'slots': m}

def fill(tpl, d, brand):
    out = re.sub(r'{{([A-Z0-9_]+)}}', lambda mm: d['slots'][mm.group(1)] if mm.group(1) in d['slots'] else mm.group(0), tpl)
    return out.replace('{{BRAND}}', brand)
for f in FILES:
    assert fill(tpl, decks[f], decks[f]['brand']) == body(f), f
print('standard decks: template reproduces all', len(FILES), 'originals exactly')

rb = open(f"{D}/Pitch - Red Bull.dc.html", encoding="utf-8").read()
rb = re.search(r'<x-import[^>]*>\n?(.*?)</x-import>', rb, re.S).group(1).replace('../assets/', '{{ASSETS}}')
open(f"{OUT}/standard-deck.html", 'w', encoding='utf-8').write(tpl)
open(f"{OUT}/redbull-deck.html", 'w', encoding='utf-8').write(rb)
json.dump(decks, open(f"{OUT}/decks.json", 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
print('red bull sections:', rb.count('<section'), '| standard sections:', tpl.count('<section'))
