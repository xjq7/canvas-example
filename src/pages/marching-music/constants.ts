interface IKeyboard {
  width: number;
  height: number;
  fill: string;
  x?: number;
  y?: number;
  type: string;
  text?:
    | string
    | {
        label: string | string[];
        fontSize: number;
        lineHeight?: number;
      };
}

function genKeyboardData() {
  const keyboards: IKeyboard[] = [
    [
      {
        width: 80,
        height: 50,
        fill: '#ccccd6',
        type: 'esc',
        text: { label: 'ESC', fontSize: 14 },
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: 'f1',
        text: { label: 'F1', fontSize: 14 },
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: 'f2',
        text: { label: 'F2', fontSize: 14 },
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: 'f3',
        text: { label: 'F3', fontSize: 14 },
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: 'f4',
        text: { label: 'F4', fontSize: 14 },
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: 'f5',
        text: { label: 'F5', fontSize: 14 },
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: 'f6',
        text: { label: 'F6', fontSize: 14 },
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: 'f7',
        text: { label: 'F7', fontSize: 14 },
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: 'f8',
        text: { label: 'F8', fontSize: 14 },
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: 'f9',
        text: { label: 'F9', fontSize: 14 },
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: 'f10',
        text: { label: 'F10', fontSize: 14 },
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: 'f11',
        text: { label: 'F11', fontSize: 14 },
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: 'f12',
        text: { label: 'F12', fontSize: 14 },
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: 'figure',
      },
    ],
    // 第二排
    [
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: '~·',
        text: {
          label: ['~', '·'],
          fontSize: 14,
        },
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: '!1',
        text: {
          label: ['!', '1'],
          fontSize: 14,
        },
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: '@2',
        text: {
          label: ['@', '2'],
          fontSize: 14,
        },
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: '#3',
        text: {
          label: ['#', '3'],
          fontSize: 14,
        },
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: '¥$4',
        text: {
          label: ['¥', '$', '4'],
          fontSize: 14,
        },
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: '%5',
        text: {
          label: ['%', '5'],
          fontSize: 14,
        },
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: '^6',
        text: {
          label: ['^', '6'],
          fontSize: 14,
        },
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: '&7',
        text: {
          label: ['&', '7'],
          fontSize: 14,
        },
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: '*8',
        text: {
          label: ['*', '8'],
          fontSize: 14,
        },
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: '(9',
        text: {
          label: ['(', '9'],
          fontSize: 14,
        },
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: ')0',
        text: {
          label: [')', '0'],
          fontSize: 14,
        },
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: '——-',
        text: {
          label: ['—', '_'],
          fontSize: 14,
          lineHeight: 4,
        },
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: '+=',
        text: {
          label: ['+', '='],
          fontSize: 14,
        },
      },
      {
        width: 80,
        height: 50,
        fill: '#ccccd6',
        type: 'back',
        text: {
          label: '←',
          fontSize: 16,
        },
      },
    ],
    // 第三排
    [
      {
        width: 80,
        height: 50,
        fill: '#ccccd6',
        type: 'tab',
        text: {
          label: 'Tab',
          fontSize: 14,
        },
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: 'q',
        text: 'Q',
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: 'w',
        text: 'W',
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: 'e',
        text: 'E',
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: 'r',
        text: 'R',
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: 't',
        text: 'T',
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: 'y',
        text: 'Y',
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: 'u',
        text: 'U',
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: 'i',
        text: 'I',
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: 'o',
        text: 'O',
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: 'p',
        text: 'P',
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: '{[',
        text: {
          label: ['{', '['],
          fontSize: 14,
        },
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: ']}',
        text: {
          label: ['}', ']'],
          fontSize: 14,
        },
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: '、|',
        text: {
          label: ['|', '\\'],
          fontSize: 14,
        },
      },
    ],
    [
      {
        width: 95,
        height: 50,
        fill: '#ccccd6',
        type: 'caps lock',
        text: {
          label: 'Caps Lock',
          fontSize: 14,
        },
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: 'a',
        text: 'A',
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: 's',
        text: 'S',
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: 'd',
        text: 'D',
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: 'f',
        text: 'F',
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: 'g',
        text: 'G',
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: 'h',
        text: 'H',
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: 'j',
        text: 'J',
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: 'k',
        text: 'K',
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: 'l',
        text: 'L',
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: ':;',
        text: {
          label: [':', ';'],
          fontSize: 14,
        },
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: '"',
        text: {
          label: ['"', "'"],
          fontSize: 14,
        },
      },
      {
        width: 95,
        height: 50,
        fill: '#ccccd6',
        type: 'enter',
        text: {
          label: 'ENTER',
          fontSize: 12,
        },
      },
    ],
    [
      {
        width: 125,
        height: 50,
        fill: '#ccccd6',
        type: 'left shift',
        text: {
          label: 'Shift',
          fontSize: 14,
        },
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: 'z',
        text: 'Z',
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: 'x',
        text: 'X',
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: 'c',
        text: 'C',
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: 'v',
        text: 'V',
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: 'b',
        text: 'B',
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: 'n',
        text: 'N',
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: 'm',
        text: 'M',
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: '<',
        text: {
          label: ['<'],
          fontSize: 16,
        },
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: '>',
        text: {
          label: ['>'],
          fontSize: 16,
        },
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: '?/',
        text: {
          label: ['?', '/'],
          fontSize: 14,
        },
      },
      {
        width: 125,
        height: 50,
        fill: '#ccccd6',
        type: 'right shift',
        text: {
          label: 'Shift',
          fontSize: 14,
        },
      },
    ],
    [
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: 'fn',
        text: {
          label: 'fn',
          fontSize: 14,
        },
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: 'control',
        text: {
          label: 'control',
          fontSize: 11,
        },
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: 'left option',
        text: {
          label: 'option',
          fontSize: 11,
        },
      },
      {
        width: 65,
        height: 50,
        fill: '#ccccd6',
        type: 'left command',
        text: {
          label: 'command',
          fontSize: 11,
        },
      },
      {
        width: 290,
        height: 50,
        fill: '#ccccd6',
        type: 'space',
      },
      {
        width: 65,
        height: 50,
        fill: '#ccccd6',
        type: 'right command',
        text: {
          label: 'command',
          fontSize: 10,
        },
      },
      {
        width: 50,
        height: 50,
        fill: '#ccccd6',
        type: 'right option',
        text: {
          label: 'option',
          fontSize: 11,
        },
      },
    ],
  ].reduce<IKeyboard[]>((acc, cur, idx) => {
    const y = idx * (50 + 10);
    let curX = 0;
    cur.forEach((key) => {
      acc.push({ ...key, x: curX, y });
      curX += 10 + key.width;
    });
    return acc;
  }, []);

  const last = keyboards[keyboards.length - 1];

  const left: IKeyboard = {
    x: last.x + last.width + 10,
    y: last.y + 27,
    width: 50,
    height: 23,
    fill: '#ccccd6',
    type: 'left arrow',
    text: { label: '←', fontSize: 12 },
  };

  const bottom: IKeyboard = {
    x: last.x + last.width + 70,
    y: last.y + 27,
    width: 50,
    height: 23,
    fill: '#ccccd6',
    type: 'bottom arrow',
    text: { label: '↓', fontSize: 12 },
  };

  const right: IKeyboard = {
    x: last.x + last.width + 130,
    y: last.y + 27,
    width: 50,
    height: 23,
    fill: '#ccccd6',
    type: 'right arrow',
    text: { label: '→', fontSize: 12 },
  };

  const top: IKeyboard = {
    x: last.x + last.width + 70,
    y: last.y,
    width: 50,
    height: 23,
    fill: '#ccccd6',
    type: 'top arrow',
    text: { label: '↑', fontSize: 12 },
  };

  keyboards.push(left, bottom, top, right);
  return keyboards;
}

export const keyboards = genKeyboardData();
