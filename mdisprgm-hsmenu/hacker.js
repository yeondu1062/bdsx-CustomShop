"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBlockPacket$UpdateBlockPacket = exports.InventorySlotPacket$InventorySlotPacket = void 0;
const blockpos_1 = require("bdsx/bds/blockpos");
const inventory_1 = require("bdsx/bds/inventory");
const packets_1 = require("bdsx/bds/packets");
const nativetype_1 = require("bdsx/nativetype");
const prochacker_1 = require("bdsx/prochacker");
exports.InventorySlotPacket$InventorySlotPacket = prochacker_1.procHacker.js("??0InventorySlotPacket@@QEAA@W4ContainerID@@IAEBVItemStack@@@Z", packets_1.InventorySlotPacket, null, packets_1.InventorySlotPacket, nativetype_1.uint8_t, nativetype_1.uint32_t, inventory_1.ItemStack);
exports.UpdateBlockPacket$UpdateBlockPacket = prochacker_1.procHacker.js("??0UpdateBlockPacket@@QEAA@AEBVBlockPos@@IIE@Z", packets_1.UpdateBlockPacket, null, packets_1.UpdateBlockPacket, blockpos_1.BlockPos, nativetype_1.uint32_t, nativetype_1.uint32_t, nativetype_1.uint8_t);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFja2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaGFja2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGdEQUE2QztBQUM3QyxrREFBK0M7QUFDL0MsOENBQTBFO0FBQzFFLGdEQUFvRDtBQUNwRCxnREFBNkM7QUFFaEMsUUFBQSx1Q0FBdUMsR0FBRyx1QkFBVSxDQUFDLEVBQUUsQ0FDaEUsZ0VBQWdFLEVBQ2hFLDZCQUFtQixFQUNuQixJQUFJLEVBQ0osNkJBQW1CLEVBQ25CLG9CQUFPLEVBQ1AscUJBQVEsRUFDUixxQkFBUyxDQUNaLENBQUM7QUFFVyxRQUFBLG1DQUFtQyxHQUFHLHVCQUFVLENBQUMsRUFBRSxDQUM1RCxnREFBZ0QsRUFDaEQsMkJBQWlCLEVBQ2pCLElBQUksRUFDSiwyQkFBaUIsRUFDakIsbUJBQVEsRUFDUixxQkFBUSxFQUNSLHFCQUFRLEVBQ1Isb0JBQU8sQ0FDVixDQUFDIn0=