#!/usr/bin/env python3
import hashlib
import os
import random
from subprocess import run

from compile import compile_data

files = [
    '/index.html',
    '/template/main.css',
    '/template/main.js',
    '/template/vendor.css',
    '/template/vendor.js',
    '/quran/index.html',
    '/quran/quran.css',
    '/quran/quran.js',
    '/about/index.html',
    '/almizaan.webmanifest',
    '/fonts/**',
    '/logo.png',
    '/logo.svg',
    '/robots.txt',
    '/sitemap.xml',
    '/sw.js',
]


def ensure_dir(path):
    os.makedirs(path, exist_ok=True)


def build():
    version = ''
    for _ in range(8):
        version += random.choice('0123456789abcdef')
    print('Building...\tversion={}'.format(version))
    # Sort files
    files.sort(key=lambda f: 1 if f.endswith('.html') else 0)
    # Prepare build directory
    base_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(base_dir, 'dist')
    run(['rm', '-rf', build_dir])
    ensure_dir(build_dir)
    renames = {}
    # Process files
    for filename in files:
        file_ext = os.path.splitext(filename)[1]
        src_path = os.path.join(base_dir, filename[1:])
        dst_path = os.path.join(build_dir, filename[1:])
        ensure_dir(os.path.dirname(dst_path))
        if filename.endswith('/**'):
            run(['cp', '-r', src_path[:-2], build_dir])
        elif file_ext == '.html' or filename == '/sw.js':
            with open(src_path) as src_file:
                source_content = src_file.read()
            source_content = source_content.replace('__VERSION__', version)
            for f1, f2 in renames.items():
                source_content = source_content.replace(f1, f2)
            with open(dst_path, 'w') as dst_file:
                dst_file.write(source_content)
        elif file_ext in ['.js', '.css']:
            h = hashlib.sha1()
            with open(src_path, 'rb') as src_file:
                while True:
                    data = src_file.read(65536)
                    if not data:
                        break
                    h.update(data)
            content_hash = h.hexdigest()[:8]
            new_filename = '{}-{}{}'.format(filename[:-len(file_ext)], content_hash, file_ext)
            renames[filename] = new_filename
            run(['cp', src_path, os.path.join(build_dir, new_filename[1:])])
        else:
            run(['cp', src_path, dst_path])
    print('Done.\t\tfiles={}'.format(len(files)))


if __name__ == '__main__':
    build()
    compile_data()
