#!/usr/bin/env python3
import os


def write_data(surah, ayah, data):
    os.makedirs(os.path.join('data', str(surah)), exist_ok=True)
    with open(os.path.join('data', str(surah), '{}.html'.format(ayah)), 'w') as output_file:
        output_file.write(data)
    with open(os.path.join('quran', 'index.html')) as template_file:
        template = template_file.read()
    os.makedirs(os.path.join('quran', str(surah), str(ayah)), exist_ok=True)
    with open(os.path.join('quran', str(surah), str(ayah), 'index.html'), 'w') as output_file:
        output_file.write(template.replace('<!--DATA-->', data))


file_list = os.listdir('raw')
file_list.sort()
for filename in file_list:
    with open(os.path.join('raw', filename)) as source_file:
        surah = int(filename[:-3])
        ayah = 0
        last_section = ''
        output_str = ''
        for l in source_file:
            l = l.strip()
            if not l:
                continue
            default_command = None
            # Markdown commands
            if l.startswith('# '):
                l = l[2:]
                default_command = 'آیه'
            if l.startswith('## '):
                l = l[3:]
                default_command = 'بخش'
            # Commands starting with ::
            text = l
            command = None
            cmd_ind = l.find('::')
            if cmd_ind > -1:
                command = l[:cmd_ind]
                text = l[cmd_ind + 2:].strip()
            if not command and default_command:
                command = default_command
            # Command processing
            if command:
                if command == 'پایان':
                    break
                elif command == 'آیه':
                    if output_str:
                        output_str += '\n</section>\n'
                        write_data(surah, ayah, output_str)
                    ayah += 1
                    output_str = ''
                    output_str += '<section>\n    <ayah number="{}" surah="{}">{}</ayah>\n'.format(ayah, surah, text)
                elif command == 'ترجمه':
                    output_str += '    <translation>{}</translation>\n'.format(text)
                elif command == 'بخش':
                    last_section = text
                    output_str += '\n    <h2>{}</h2>\n'.format(text)
                elif command == 'حاشیه':
                    output_str += '    <tag>{}</tag>\n'.format(text or last_section)
                else:
                    print('Warning: Invalid Command: "{}"'.format(command))
            else:
                output_str += '    <p>{}</p>\n'.format(l)
        if output_str:
            output_str += '\n</section>\n'
            write_data(surah, ayah, output_str)
