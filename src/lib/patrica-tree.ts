type RootNode = INode;

type INode = {
  [key in string]: INode | ILeaf;
};

type ILeaf = null;

export function createTree(): RootNode {
  console.log('🌱 createTree executed');
  return {};
}

/**
 * @example
 * input = 'hero'
 * node = {
 *   hello: {}
 * }
 *
 * result = {
 *   matchedKeyPart: 'he',
 *   originalKey: 'hello',
 *   matchedNode: {}
 * }
 */

type KeyCharsInfo = {
  matchedKeyPart: string;
  originalKey: string;
};

type KeyPart = KeyCharsInfo & {
  matchedNode: INode | ILeaf;
};

export function findKey(node: INode, inputKey: string): KeyPart | null {
  const keys = Object.keys(node);
  const [...inputKeyChars] = inputKey;

  let keyCharsInfo: KeyCharsInfo | null = null;

  for (const key of keys) {
    const res: string[] = [];
    const [...keyChars] = key;

    for (const [i, keyChar] of keyChars.entries()) {
      if (keyChar !== inputKeyChars[i]) {
        break;
      }
      res.push(inputKeyChars[i]);
    }

    if (res.length > 0) {
      keyCharsInfo = {
        matchedKeyPart: res.join(''),
        originalKey: keyChars.join(''),
      };
      break;
    }
  }

  if (keyCharsInfo === null) {
    return null;
  }

  return {
    ...keyCharsInfo,
    matchedNode: node[keyCharsInfo.matchedKeyPart],
  };
}

export function insertVal(root: RootNode, val: string) {
  const [first, ...rest] = val;
  const key = rest.join('');
  root[first] = { [key]: null };
}

if (import.meta.vitest) {
  const { test, describe, expect, expectTypeOf } = import.meta.vitest;
  test('createTree', () => {
    const result = createTree();
    expect(result).toMatchObject({});
    expectTypeOf(result).toBeObject();
  });

  test('insertVal', () => {
    const rootTree = {};
    insertVal(rootTree, 'hello');
    expect(rootTree).toMatchObject({
      h: {
        ello: null,
      },
    });
  });

  describe('findKey', () => {
    test('with all matched key', () => {
      const rootTree = {
        he: {
          llo: null,
          ro: null,
        },
      };
      expect(findKey(rootTree, 'head')).toMatchObject({
        matchedKeyPart: 'he',
        originalKey: 'he',
        matchedNode: {
          llo: null,
          ro: null,
        },
      });
    });

    test('with not matched key', () => {
      const rootTree = {
        he: {
          llo: null,
          ro: null,
        },
      };
      expect(findKey(rootTree, 'meow')).toMatchObject(null);
    });
  });
}
