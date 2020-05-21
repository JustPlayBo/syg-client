export class SwellObject {
    private obj: any;
    constructor(object: any){
        this.obj = object;
    }

    public id() {
        return this.obj.id;
    }

    public node(key: string): SwellObject {
        return new SwellObject(this.obj.node(key));
    }

    public get(key): any {
        return this.obj.get(key);
    }

    public set(key: string, value: any): SwellObject {
        this.obj.set(key, value);
        return this;
    }

    public setPublic(val: boolean) {
        this.obj.setPublic(val);
    }

    public addListener(callback: (ev: any) => {}): SwellObject {
        this.obj.addListener(callback);
        return this;
    }

    public getState() {
        return this.obj.getState();
    }
}