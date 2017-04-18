export class GameCenter {
    private num: number = 234;

    add(param: number) {
        console.log('param', param);
        this.num += param;
    }
}