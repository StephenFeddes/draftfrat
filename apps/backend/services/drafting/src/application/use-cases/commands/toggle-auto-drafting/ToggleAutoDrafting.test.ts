import { DraftEvent, DraftEventEnum, DraftUser } from "../../../../domain";
import { EventBus } from "../../../interfaces/event-bus/EventBus";
import { DraftUserRepository } from "../../../interfaces/repositories/DraftUserRepository";
import { ToggleAutoDrafting } from "./ToggleAutoDrafting";

describe("ToggleAutoDrafting", () => {
    let eventBus: jest.Mocked<EventBus>;
    let draftUserRepository: jest.Mocked<DraftUserRepository>;
    let toggleAutoDrafting: ToggleAutoDrafting;

    beforeEach(() => {
        draftUserRepository = {
            getDraftUsers: jest.fn(),
            claimTeam: jest.fn(),
            getDraftUserByTeamNumber: jest.fn(),
            setAutoDraftStatus: jest.fn(),
        };

        eventBus = {
            publish: jest.fn(),
            publishAll: jest.fn(),
            subscribe: jest.fn(),
            unsubscribe: jest.fn(),
        };

        toggleAutoDrafting = new ToggleAutoDrafting(eventBus, draftUserRepository);
    });

    it("should set auto-draft status and publish an event", async () => {
        // Arrange
        const draftId = 1;
        const userId = 42;
        const isAutoDrafting = true;
        const draftUsers: DraftUser[] = [
            { draftId, userId, teamNumber: 1, teamName: "Team A", isAdmin: false, isAutoDrafting: true },
        ];
        draftUserRepository.getDraftUsers.mockResolvedValue(draftUsers);

        // Act
        await toggleAutoDrafting.execute(draftId, userId, isAutoDrafting);

        expect(draftUserRepository.setAutoDraftStatus).toHaveBeenCalledWith(draftId, userId, isAutoDrafting);
        expect(eventBus.publish).toHaveBeenCalledWith(
            new DraftEvent(draftId, DraftEventEnum.AUTO_DRAFTING_CHANGED, {
                draftId,
                users: draftUsers,
            }),
        );
    });

    it("should handle an empty draft user list gracefully", async () => {
        // Arrange
        const draftId = 2;
        const userId = 99;
        const isAutoDrafting = false;
        draftUserRepository.getDraftUsers.mockResolvedValue([]);

        // Act
        await toggleAutoDrafting.execute(draftId, userId, isAutoDrafting);

        // Assert
        expect(draftUserRepository.setAutoDraftStatus).toHaveBeenCalledWith(draftId, userId, isAutoDrafting);
        expect(eventBus.publish).toHaveBeenCalledWith(
            new DraftEvent(draftId, DraftEventEnum.AUTO_DRAFTING_CHANGED, {
                draftId,
                users: [],
            }),
        );
    });

    it("should throw an error if setAutoDraftStatus fails", async () => {
        // Arrange
        const draftId = 3;
        const userId = 101;
        const isAutoDrafting = true;
        draftUserRepository.setAutoDraftStatus.mockImplementation(() => {
            throw new Error("Failed to set auto-draft status");
        });

        // Act & Assert
        await expect(toggleAutoDrafting.execute(draftId, userId, isAutoDrafting)).rejects.toThrow(
            "Failed to set auto-draft status",
        );
        expect(draftUserRepository.setAutoDraftStatus).toHaveBeenCalledWith(draftId, userId, isAutoDrafting);
        expect(eventBus.publish).not.toHaveBeenCalled();
    });
});
