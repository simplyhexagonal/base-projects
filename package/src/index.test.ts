import Package from './';

describe('Package', () => {
  it('works', async () => {
    const pkg = new Package();

    const result = await pkg.sum(1, 2);

    expect(result).toBe(3);
  });
});
