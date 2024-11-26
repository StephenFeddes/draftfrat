export class DraftUser {
    public readonly draftId: number;

    public readonly userId: number;

    public readonly teamName: string;

    public teamNumber: number;

    public isAutoDrafting: boolean;

    public readonly isAdmin: boolean;

    constructor(
        draftId: number,
        userId: number,
        teamName: string,
        teamNumber: number,
        isAutoDrafting: boolean,
        isAdmin: boolean,
    ) {
        this.draftId = draftId;
        this.userId = userId;
        this.teamName = teamName;
        this.teamNumber = teamNumber;
        this.isAutoDrafting = isAutoDrafting;
        this.isAdmin = isAdmin;
    }

    public setTeamNumber(teamNumber: number): void {
        this.teamNumber = teamNumber;
    }

    public setIsAutoDrafting(isAutoDrafting: boolean): void {
        this.isAutoDrafting = isAutoDrafting;
    }

    public toJSON(): object {
        return {
            draftId: this.draftId,
            userId: this.userId,
            teamName: this.teamName,
            teamNumber: this.teamNumber,
            isAutoDrafting: this.isAutoDrafting,
            isAdmin: this.isAdmin,
        };
    }
}
