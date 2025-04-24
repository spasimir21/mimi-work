// prettier-ignore
type ReadonlyDeep<T> = 
    T extends (infer R)[] ? readonly ReadonlyDeep<R>[]
  : T extends { [key: string]: any; } ? { readonly [K in keyof T]: ReadonlyDeep<T[K]>; }
  : T;

class Store<T> {
  public password: string = '';
  public data: ReadonlyDeep<T>;

  constructor(public readonly key: string, defaultData: T) {
    this.data = defaultData as any;
  }

  async load() {
    try {
      const req = await fetch(`/${this.key}`, {
        headers: { 'x-password': this.password }
      });

      if (req.status === 404) return true;
      if (!req.ok) return false;

      this.data = await req.json();

      return true;
    } catch {
      return false;
    }
  }

  update(callback: (data: T) => void) {
    callback(this.data as T);
    this.save();
  }

  async save() {
    try {
      await fetch(`/${this.key}`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-password': this.password
        },
        body: JSON.stringify(this.data)
      });
    } catch {
      localStorage.clear();
      window.location.reload();
    }
  }
}

export { Store };
