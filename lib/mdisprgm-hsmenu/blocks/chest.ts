import { Block } from "bdsx/bds/block";
import { BlockPos } from "bdsx/bds/blockpos";
import { UpdateBlockPacket } from "bdsx/bds/packets";
import { Player, ServerPlayer } from "bdsx/bds/player";
import { HSBlock } from "../hsblock";
export class HSChest implements HSBlock {
    block: Block;
    type: HSBlock.Type = HSBlock.Type.Chest;
    size: HSBlock.size = HSBlock.TypeToSize[this.type];
    get blockYOffset() {
        return 3;
    }

    getContainerId(target: ServerPlayer): number {
        return target.nextContainerCounter();
    }

    protected blockPos = new Map<Player, BlockPos>();
    protected originalBlockId = new Map<Player, number>();

    constructor() {
        const block = Block.create("minecraft:chest");
        if (block == null) throw new Error("Block is invalid.");
        this.block = block;
    }

    place(target: ServerPlayer): void {
        const blockPos = this.initPosition(target);
        const blockId = this.block.getRuntimeId();
        const orgBlkId = target.getRegion().getBlock(blockPos).getRuntimeId();
        this.setBlockId(target, orgBlkId);

        const pk = UpdateBlockPacket.allocate();
        pk.destruct();
        HSBlock.initUpdateBlockPacket(pk, blockPos, 0, blockId, UpdateBlockPacket.Flags.NoGraphic);
        target.sendPacket(pk);
        pk.dispose();
    }

    destroy(target: ServerPlayer) {
        const blockPos = this.getPosition(target)!;

        const blockPkt = UpdateBlockPacket.allocate();
        blockPkt.destruct();
        HSBlock.initUpdateBlockPacket(blockPkt, blockPos, 0, this.getBlockId(target), UpdateBlockPacket.Flags.NoGraphic);
        target.sendPacket(blockPkt);
        blockPkt.dispose();

        const region = target.getRegion();
        const blockEntity = region.getBlockEntity(blockPos);
        if (blockEntity) {
            blockEntity.setChanged();
            blockEntity.updateClientSide(target);
        }
    }
    protected getPosition(player: ServerPlayer): BlockPos | null {
        return this.blockPos.get(player)!;
    }
    protected initPosition(player: ServerPlayer): BlockPos {
        const blockPos = BlockPos.create(0, 0, 0);

        blockPos.set(player.getFeetPos());
        blockPos.y += this.blockYOffset;
        if (blockPos.x < 0) blockPos.x--;
        if (blockPos.z < 0) blockPos.z--;

        this.blockPos.set(player, blockPos);
        return blockPos;
    }
    protected getBlockId(player: ServerPlayer): number {
        return this.originalBlockId.get(player)!;
    }
    protected setBlockId(player: ServerPlayer, id: number): void {
        this.originalBlockId.set(player, id);
    }
}
