#!/usr/bin/env python3
import os

file_list = os.listdir('raw')
file_list.sort()
for filename in file_list:
    with open(os.path.join('raw', filename)) as source_file:
        surah = int(filename[:-3])
        ayah = 0
        last_section = ''
        output = None
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
                    if output is not None:
                        output.write('</section>\n')
                        output.close()
                    ayah += 1
                    os.makedirs(os.path.join('data', str(surah)), exist_ok=True)
                    output = open(os.path.join('data', str(surah), '{}.html'.format(ayah)), 'w')
                    output.write('<section>\n    <ayah number="{}" surah="{}">{}</ayah>\n'.format(ayah, surah, text))
                elif command == 'ترجمه':
                    output.write('    <translation>{}</translation>\n'.format(text))
                elif command == 'بخش':
                    last_section = text
                    output.write('\n    <h2>{}</h2>\n'.format(text))
                elif command == 'حاشیه':
                    output.write('    <tag>{}</tag>\n'.format(text or last_section))
                else:
                    print('Warning: Invalid Command: "{}"'.format(command))
            else:
                output.write('    <p>{}</p>\n'.format(l))
        if output is not None:
            output.write('\n</section>\n')
            output.close()
