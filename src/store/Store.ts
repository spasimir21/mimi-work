// prettier-ignore
type ReadonlyDeep<T> = 
    T extends (infer R)[] ? readonly ReadonlyDeep<R>[]
  : T extends { [key: string]: any; } ? { readonly [K in keyof T]: ReadonlyDeep<T[K]>; }
  : T;

class Store<T> {
  public readonly data: ReadonlyDeep<T>;

  constructor(public readonly key: string, defaultData: T) {
    const savedString = localStorage.getItem(key);
    this.data = savedString ? JSON.parse(savedString) : defaultData;
  }

  update(callback: (data: T) => void) {
    callback(this.data as T);
    this.save();
  }

  save() {
    localStorage.setItem(this.key, JSON.stringify(this.data));
  }
}

export { Store };
