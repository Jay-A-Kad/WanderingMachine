export const Puzzle1 = [
    {
        title: 'Module 1',
        hint : 'connect the gates',
        switches: [
            {id:'sw0', x:220, y:250, startOn: false},
        ],
        gates: [],
        bulbs: [{id: 'b0',x:980,y:250}],
    },
    {
    title: 'Module 02 : Learn AND Gate',
    hint: 'Both switches must be ON. Wire them through the AND gate',
    switches: [
      { id: 'sw0', x: 220, y: 250, startOn: false },
      { id: 'sw1', x: 220, y: 470, startOn: false },
    ],
    gates: [{ id: 'g0', type: 'AND', x: 620, y: 360 }],
    bulbs: [{ id: 'b0', x: 980, y: 360 }],
  },
  {
    title: 'Module 03 : Learn OR Gate',
    hint: 'Either switch is enough. Wire them through the OR gate',
    switches: [
      { id: 'sw0', x: 220, y: 250, startOn: false },
      { id: 'sw1', x: 220, y: 470, startOn: false },
    ],
    gates: [{ id: 'g0', type: 'OR', x: 620, y: 360 }],
    bulbs: [{ id: 'b0', x: 980, y: 360 }],
  },
  {
    title: 'Module 04 : Learn NOT Gate',
    hint: 'Invert the signal. Connect the switch (OFF) through the NOT gate',
    switches: [{ id: 'sw0', x: 220, y: 360, startOn: false }],
    gates: [{ id: 'g0', type: 'NOT', x: 620, y: 360 }],
    bulbs: [{ id: 'b0', x: 980, y: 360 }],
  },
];