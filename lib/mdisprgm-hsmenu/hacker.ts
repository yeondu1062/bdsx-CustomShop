import { BlockPos } from "bdsx/bds/blockpos";
import { ItemStack } from "bdsx/bds/inventory";
import { InventorySlotPacket, UpdateBlockPacket } from "bdsx/bds/packets";
import { uint32_t, uint8_t } from "bdsx/nativetype";
import { procHacker } from "bdsx/prochacker";

export const InventorySlotPacket$InventorySlotPacket = procHacker.js(
    "??0InventorySlotPacket@@QEAA@W4ContainerID@@IAEBVItemStack@@@Z",
    InventorySlotPacket,
    null,
    InventorySlotPacket,
    uint8_t,
    uint32_t,
    ItemStack,
);

export const UpdateBlockPacket$UpdateBlockPacket = procHacker.js(
    "??0UpdateBlockPacket@@QEAA@AEBVBlockPos@@IIE@Z",
    UpdateBlockPacket,
    null,
    UpdateBlockPacket,
    BlockPos,
    uint32_t,
    uint32_t,
    uint8_t,
);
