import { BlockPos } from "bdsx/bds/blockpos";
import { ByteTag, IntTag } from "bdsx/bds/nbt";
import { BlockActorDataPacket, UpdateBlockPacket } from "bdsx/bds/packets";
import { ServerPlayer } from "bdsx/bds/player";
import { HSBlock } from "../hsblock";
import { HSChest } from "./chest";

export class HSDoubleChest extends HSChest {
    readonly size = HSBlock.Size.DoubleChest;
    readonly type = HSBlock.Type.DoubleChest;

    place(target: ServerPlayer): void {
        super.place(target);

        const region = target.getRegion();
        const firstBlockPos = this.blockPos.get(target)!;
        const secondBlockPos = this.initSecondPosition(target)!;
        const secondBlockId = region.getBlock(secondBlockPos).getRuntimeId()!;
        this.setSecondBlockId(target, secondBlockId);

        const pk = UpdateBlockPacket.allocate();
        HSBlock.initUpdateBlockPacket(pk, secondBlockPos, 0, this.block.getRuntimeId(), UpdateBlockPacket.Flags.NoGraphic);
        target.sendPacket(pk);
        pk.dispose();

        const blkDataPkt = BlockActorDataPacket.allocate();
        blkDataPkt.pos.set(secondBlockPos);
        {
            const pairlead = ByteTag.allocateWith(1);
            const pairx = IntTag.allocateWith(firstBlockPos.x);
            const pairz = IntTag.allocateWith(firstBlockPos.z);
            blkDataPkt.data.setAllocated("pairlead", pairlead);
            blkDataPkt.data.setAllocated("pairx", pairx);
            blkDataPkt.data.setAllocated("pairz", pairz);
        }
        target.sendPacket(blkDataPkt);
        blkDataPkt.dispose();
    }

    destroy(target: ServerPlayer) {
        super.destroy(target);

        const secondBlockPos = this.getSecondPosition(target);
        const pk = UpdateBlockPacket.allocate();
        pk.blockPos.set(secondBlockPos);
        pk.dataLayerId = 0;
        pk.flags = UpdateBlockPacket.Flags.NoGraphic;
        pk.blockRuntimeId = this.getSecondBlockId(target);
        target.sendPacket(pk);
        pk.dispose();

        const region = target.getRegion();
        const blockEntity = region.getBlockEntity(secondBlockPos);
        if (blockEntity) {
            blockEntity.setChanged();
            blockEntity.updateClientSide(target);
        }
    }

    private secondOriginalBlockId = new Map<ServerPlayer, number>();
    private secondBlockPos = new Map<ServerPlayer, BlockPos>();

    protected getSecondPosition(player: ServerPlayer): BlockPos {
        return this.secondBlockPos.get(player)!;
    }
    protected initSecondPosition(player: ServerPlayer): BlockPos {
        super.initPosition(player);
        const blockPos = BlockPos.create(0, 0, 0);

        blockPos.set(player.getFeetPos());
        blockPos.y += this.blockYOffset;
        blockPos.x += 1;
        if (blockPos.x < 0) blockPos.x--;
        if (blockPos.z < 0) blockPos.z--;

        this.secondBlockPos.set(player, blockPos);
        return blockPos;
    }
    protected getSecondBlockId(player: ServerPlayer): number {
        return this.secondOriginalBlockId.get(player)!;
    }
    protected setSecondBlockId(player: ServerPlayer, id: number): void {
        this.secondOriginalBlockId.set(player, id);
    }
}
