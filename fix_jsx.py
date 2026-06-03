import re
import glob

files = glob.glob('/Users/thtesche/VibeCoding/ashtanga_yoga_zentral_astro/src/pages/*.mdx')

for f in files:
    with open(f, 'r') as file:
        content = file.read()
    
    # Fix <style>
    if '<style>' in content and '<style>{`' not in content:
        content = re.sub(r'<style>', '<style>{`', content)
        content = re.sub(r'</style>', '`}</style>', content)
        
    # Fix <script>
    if '<script>' in content and '<script>{`' not in content:
        content = re.sub(r'<script>', '<script>{`', content)
        content = re.sub(r'</script>', '`}</script>', content)

    with open(f, 'w') as file:
        file.write(content)

print("Fixed JSX tags")
