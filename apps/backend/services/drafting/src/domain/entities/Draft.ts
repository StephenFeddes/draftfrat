import { DraftSettings } from "../value-objects/DraftSettings";

export class Draft {
    public readonly id: number;

    public settings: DraftSettings;

    constructor(id: number, settings: DraftSettings) {
        this.id = id;
        this.settings = settings;
    }

    public setSettings(settings: DraftSettings): void {
        this.settings = settings;
    }

    public toJSON(): object {
        return {
            id: this.id,
            settings: this.settings.toJSON(),
        };
    }
}
