import { DijkstraStep } from "./types";

class StepPlayer{ // plays the steps for animation in UI

    private steps:DijkstraStep[];
    private index: number;

    constructor(steps:DijkstraStep[], index:number = 0){
        this.steps = steps;
        this.index = index;
    }

    public next(): DijkstraStep | null{
        if(this.steps.length === 0)return null;
        return this.index < this.steps.length - 1 ? this.steps[++this.index] : null;
    }
    public prev(): DijkstraStep | null{
        if(this.steps.length === 0)return null;
        return this.index > 0 ? this.steps[--this.index] : null;
    }
    public current(): DijkstraStep | null{
        return this.steps[this.index] || null;
    }
    public reset(): void{
        this.index = 0;
    }
    public jumpTo(index: number): DijkstraStep | null{
        if (index >= 0 && index < this.steps.length) {
            this.index = index;
            return this.steps[this.index];
        }
        return null;
    }
    public hasNext(): boolean{
        return this.index < this.steps.length - 1;
    }
    public hasPrev(): boolean{
        return this.index > 0;
    }
    public length():number{
        return this.steps.length;
    }
}

export {
    StepPlayer
}