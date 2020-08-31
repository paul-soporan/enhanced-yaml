import { safeLoad, safeDump } from 'enhanced-yaml';
import { joinYaml } from 'enhanced-yaml/tests/utils';

test('example', () => {
  const data = `
    # Above: foo
    foo: # Aside: foo
      bar: # Aside: bar
        - 42 # Aside: 42

        # A map
        - a: # Aside: a
            b # Aside: a's value

        # A flow-style sequence
        - [
            # Above: a
            a,
            b,
            c # Aside: c
          ]
  `;

  expect(safeLoad(data)).toStrictEqual({
    foo: {
      bar: ['42', { a: 'b' }, ['a', 'b', 'c']],
    },
  });

  expect(
    safeDump(
      {
        foo: {
          bar: ['42', ['c', 'd', 'a'], { a: 'c' }],
        },
      },
      {},
      data,
    ),
  ).toStrictEqual(
    // prettier-ignore
    joinYaml([
      '# Above: foo',
      'foo: # Aside: foo',
      '  bar: # Aside: bar',
      '    - 42 # Aside: 42',
      '',
      '    # A flow-style sequence',
      '    - [',
      '        c, # Aside: c',
      '        d,',
      '        # Above: a',
      '        a',
      '      ]',
      '',
      '    # A map',
      '    - a: # Aside: a',
      "        c # Aside: a's value",
    ]),
  );
});
