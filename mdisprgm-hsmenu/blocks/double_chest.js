"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HSDoubleChest = void 0;
const blockpos_1 = require("bdsx/bds/blockpos");
const nbt_1 = require("bdsx/bds/nbt");
const packets_1 = require("bdsx/bds/packets");
const hsblock_1 = require("../hsblock");
const chest_1 = require("./chest");
class HSDoubleChest extends chest_1.HSChest {
    constructor() {
        super(...arguments);
        this.size = hsblock_1.HSBlock.Size.DoubleChest;
        this.type = hsblock_1.HSBlock.Type.DoubleChest;
        this.secondOriginalBlockId = new Map();
        this.secondBlockPos = new Map();
    }
    place(target) {
        super.place(target);
        const region = target.getRegion();
        const firstBlockPos = this.blockPos.get(target);
        const secondBlockPos = this.initSecondPosition(target);
        const secondBlockId = region.getBlock(secondBlockPos).getRuntimeId();
        this.setSecondBlockId(target, secondBlockId);
        const pk = packets_1.UpdateBlockPacket.allocate();
        hsblock_1.HSBlock.initUpdateBlockPacket(pk, secondBlockPos, 0, this.block.getRuntimeId(), packets_1.UpdateBlockPacket.Flags.NoGraphic);
        target.sendPacket(pk);
        pk.dispose();
        const blkDataPkt = packets_1.BlockActorDataPacket.allocate();
        blkDataPkt.pos.set(secondBlockPos);
        {
            const pairlead = nbt_1.ByteTag.allocateWith(1);
            const pairx = nbt_1.IntTag.allocateWith(firstBlockPos.x);
            const pairz = nbt_1.IntTag.allocateWith(firstBlockPos.z);
            blkDataPkt.data.setAllocated("pairlead", pairlead);
            blkDataPkt.data.setAllocated("pairx", pairx);
            blkDataPkt.data.setAllocated("pairz", pairz);
        }
        target.sendPacket(blkDataPkt);
        blkDataPkt.dispose();
    }
    destroy(target) {
        super.destroy(target);
        const secondBlockPos = this.getSecondPosition(target);
        const pk = packets_1.UpdateBlockPacket.allocate();
        pk.blockPos.set(secondBlockPos);
        pk.dataLayerId = 0;
        pk.flags = packets_1.UpdateBlockPacket.Flags.NoGraphic;
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
    getSecondPosition(player) {
        return this.secondBlockPos.get(player);
    }
    initSecondPosition(player) {
        super.initPosition(player);
        const blockPos = blockpos_1.BlockPos.create(0, 0, 0);
        blockPos.set(player.getFeetPos());
        blockPos.y += this.blockYOffset;
        blockPos.x += 1;
        if (blockPos.x < 0)
            blockPos.x--;
        if (blockPos.z < 0)
            blockPos.z--;
        this.secondBlockPos.set(player, blockPos);
        return blockPos;
    }
    getSecondBlockId(player) {
        return this.secondOriginalBlockId.get(player);
    }
    setSecondBlockId(player, id) {
        this.secondOriginalBlockId.set(player, id);
    }
}
exports.HSDoubleChest = HSDoubleChest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG91YmxlX2NoZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZG91YmxlX2NoZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGdEQUE2QztBQUM3QyxzQ0FBK0M7QUFDL0MsOENBQTJFO0FBRTNFLHdDQUFxQztBQUNyQyxtQ0FBa0M7QUFFbEMsTUFBYSxhQUFjLFNBQVEsZUFBTztJQUExQzs7UUFDYSxTQUFJLEdBQUcsaUJBQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQ2hDLFNBQUksR0FBRyxpQkFBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7UUFrRGpDLDBCQUFxQixHQUFHLElBQUksR0FBRyxFQUF3QixDQUFDO1FBQ3hELG1CQUFjLEdBQUcsSUFBSSxHQUFHLEVBQTBCLENBQUM7SUF3Qi9ELENBQUM7SUF6RUcsS0FBSyxDQUFDLE1BQW9CO1FBQ3RCLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFcEIsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2xDLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBRSxDQUFDO1FBQ2pELE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUUsQ0FBQztRQUN4RCxNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDLFlBQVksRUFBRyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFFN0MsTUFBTSxFQUFFLEdBQUcsMkJBQWlCLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDeEMsaUJBQU8sQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFLEVBQUUsY0FBYyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxFQUFFLDJCQUFpQixDQUFD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