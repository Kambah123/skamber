import base64, re, pathlib
root = pathlib.Path(".")

def datauri(p, mime):
    return f"data:{mime};base64," + base64.b64encode((root/p).read_bytes()).decode()

html = (root/"index.html").read_text()
css  = (root/"styles.css").read_text()
app  = (root/"app.js").read_text()
prof = (root/"content/owner-profile.js").read_text()

# merge module: strip exports from profile, drop the import in app
prof_inline = prof.replace("export const", "const").replace("export function", "function")
app_inline  = re.sub(r'^import .*?;\s*$', '', app, count=1, flags=re.M|re.S)
# app.js imports `ownerProfile as O`; recreate that alias for the inlined bundle
bundle = prof_inline + "\nconst O = ownerProfile;\n" + app_inline

assets = {
  "assets/portraits/avatar-mark.png": "image/png",
  "assets/portraits/avatar-hero.webp": "image/webp",
  "assets/companion/companion-idle.png": "image/png",
  "assets/companion/companion-happy.png": "image/png",
  "assets/companion/companion-sad.png": "image/png",
  "assets/companion/companion-excited.png": "image/png",
  "assets/cases/zipa.webp": "image/webp",
  "assets/cases/onedev.webp": "image/webp",
}
for path, mime in assets.items():
    html = html.replace(path, datauri(path, mime))
    bundle = bundle.replace(path, datauri(path, mime))

html = html.replace('<link rel="stylesheet" href="styles.css" />', f"<style>{css}</style>")
html = html.replace('<script type="module" src="app.js"></script>', f'<script type="module">{bundle}</script>')
(root/"dist-preview.html").write_text(html)
print("bundle bytes:", len(html))
