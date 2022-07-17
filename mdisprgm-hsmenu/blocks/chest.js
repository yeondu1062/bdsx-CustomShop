"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HSChest = void 0;
const block_1 = require("bdsx/bds/block");
const blockpos_1 = require("bdsx/bds/blockpos");
const packets_1 = require("bdsx/bds/packets");
const hsblock_1 = require("../hsblock");
class HSChest {
    constructor() {
        this.type = hsblock_1.HSBlock.Type.Chest;
        this.size = hsblock_1.HSBlock.TypeToSize[this.type];
        this.blockPos = new Map();
        this.originalBlockId = new Map();
        const block = block_1.Block.create("minecraft:chest");
        if (block == null)
            throw new Error("Block is invalid.");
        this.block = block;
    }
    get blockYOffset() {
        return 3;
    }
    place(target) {
        const blockPos = this.initPosition(target);
        const blockId = this.block.getRuntimeId();
        const orgBlkId = target.getRegion().getBlock(blockPos).getRuntimeId();
        this.setBlockId(target, orgBlkId);
        const pk = packets_1.UpdateBlockPacket.allocate();
        pk.destruct();
        hsblock_1.HSBlock.initUpdateBlockPacket(pk, blockPos, 0, blockId, packets_1.UpdateBlockPacket.Flags.NoGraphic);
        target.sendPacket(pk);
        pk.dispose();
    }
    destroy(target) {
        const blockPos = this.getPosition(target);
        const blockPkt = packets_1.UpdateBlockPacket.allocate();
        blockPkt.destruct();
        hsblock_1.HSBlock.initUpdateBlockPacket(blockPkt, blockPos, 0, this.getBlockId(target), packets_1.UpdateBlockPacket.Flags.NoGraphic);
        target.sendPacket(blockPkt);
        blockPkt.dispose();
        const region = target.getRegion();
        const blockEntity = region.getBlockEntity(blockPos);
        if (blockEntity) {
            blockEntity.setChanged();
            blockEntity.updateClientSide(target);
        }
    }
    getPosition(player) {
        return this.blockPos.get(player);
    }
    initPosition(player) {
        const blockPos = blockpos_1.BlockPos.create(0, 0, 0);
        blockPos.set(player.getFeetPos());
        blockPos.y += this.blockYOffset;
        if (blockPos.x < 0)
            blockPos.x--;
        if (blockPos.z < 0)
            blockPos.z--;
        this.blockPos.set(player, blockPos);
        return blockPos;
    }
    getBlockId(player) {
        return this.originalBlockId.get(player);
    }
    setBlockId(player, id) {
        this.originalBlockId.set(player, id);
    }
}
exports.HSChest = HSChest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjaGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwwQ0FBdUM7QUFDdkMsZ0RBQTZDO0FBQzdDLDhDQUFxRDtBQUVyRCx3Q0FBcUM7QUFDckMsTUFBYSxPQUFPO0lBV2hCO1FBVEEsU0FBSSxHQUFpQixpQkFBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDeEMsU0FBSSxHQUFpQixpQkFBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFLekMsYUFBUSxHQUFHLElBQUksR0FBRyxFQUFvQixDQUFDO1FBQ3ZDLG9CQUFlLEdBQUcsSUFBSSxHQUFHLEVBQWtCLENBQUM7UUFHbEQsTUFBTSxLQUFLLEdBQUcsYUFBSyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQzlDLElBQUksS0FBSyxJQUFJLElBQUk7WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDdkIsQ0FBQztJQVhELElBQUksWUFBWTtRQUNaLE9BQU8sQ0FBQyxDQUFDO0lBQ2IsQ0FBQztJQVdELEtBQUssQ0FBQyxNQUFvQjtRQUN0QixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzNDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDMUMsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN0RSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztRQUVsQyxNQUFNLEVBQUUsR0FBRywyQkFBaUIsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN4QyxFQUFF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