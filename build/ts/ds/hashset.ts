module EDsLib{
    interface itf_KeyVal{(key:string, val:any) :void};

    export class HashSet<T> {
        private items: { [key: string]: T; };
    
        constructor() {
            this.items = {};
        }
    
        set(key: string, value: T): void {
            this.items[key] = value;
        }

        delete(key: string): boolean {
            return delete this.items[key];
        }
    
        has(key: string): boolean {
            return key in this.items;
        }
    
        get(key: string): T {
            return this.items[key];
        }
    
        len(): number {
            return Object.keys(this.items).length;
        }
    
        forEach(f:itf_KeyVal) {
            for (let k in this.items) {
                f(k, this.items[k]);
            }
        }
    }
}