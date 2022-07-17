import { Block } from "bdsx/bds/block";
import { BlockPos } from "bdsx/bds/blockpos";
import { ContainerType } from "bdsx/bds/inventory";
import { UpdateBlockPacket } from "bdsx/bds/packets";
import { ServerPlayer } from "bdsx/bds/player";
import { UpdateBlockPacket$UpdateBlockPacket } from "./hacker";

export interface HSBlock {
    place(target: ServerPlayer): void;
    destroy(target: ServerPlayer): void;
    get blockYOffset(): number;

    block: Block;
    size: HSBlock.size;
    type: HSBlock.type;
}

export namespace HSBlock {
    export type size = Size | number;
    export type type = Type | number;
    export enum Size {
        Chest = 27,
        DoubleChest = 54,
        Hopper = 5,
        Dropper = 9,
        Dispenser = 9,
    }
    export enum Type {
        Chest,
        DoubleChest,
        Hopper,
        Dropper,
        Dispenser,
    }
    export const TypeToSize: Record<type, number> = {
        0: Size.Chest,
        1: Size.DoubleChest,
        2: Size.Hopper,
        3: Size.Dropper,
        4: Size.Dispenser,
    } as const;
    export const TypeToContainerType: Record<type, number> = {
        0: ContainerType.Container,
        1: ContainerType.Container,
        2: ContainerType.Hopper,
        3: ContainerType.Dropper,
        4: ContainerType.Dispenser,
    } as const;

    export function initUpdateBlockPacket(
        packet: UpdateBlockPacket,
        blockPos: BlockPos,
        layerId: UpdateBlockPacket.DataLayerIds,
        runtimeId: number,
        flag: UpdateBlockPacket.Flags,
    ): void {
        UpdateBlockPacket$UpdateBlockPacket(packet, blockPos, layerId, runtimeId, flag);
    }
}
