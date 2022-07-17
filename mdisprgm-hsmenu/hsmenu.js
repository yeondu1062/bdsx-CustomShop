"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HSMenu = void 0;
const blockpos_1 = require("bdsx/bds/blockpos");
const inventory_1 = require("bdsx/bds/inventory");
const nbt_1 = require("bdsx/bds/nbt");
const packetids_1 = require("bdsx/bds/packetids");
const packets_1 = require("bdsx/bds/packets");
const event_1 = require("bdsx/event");
const hacker_1 = require("./hacker");
const hsblock_1 = require("./hsblock");
class ResponseData {
}
class HSMenu {
    constructor(player, block, slots = {}, callback) {
        this.hasOpen = false;
        this.TriggerActionType = new Set([packets_1.ItemStackRequestActionType.Take, packets_1.ItemStackRequestActionType.Place]);
        this.blockPos = blockpos_1.BlockPos.create(0, 0, 0);
        this.disabled = false;
        this.entity = player;
        this.netId = player.getNetworkIdentifier();
        this.block = block;
        this.size = this.block.size;
        this.blockPos.set(player.getFeetPos());
        this.blockPos.y += this.block.blockYOffset;
        if (this.blockPos.x < 0)
            this.blockPos.x--;
        if (this.blockPos.z < 0)
            this.blockPos.z--;
        this.slots = slots;
        this.mContainerId = this.entity.nextContainerCounter();
        for (const [slot, item] of Object.entries(this.slots)) {
            this.setItem(+slot, item);
        }
        event_1.events.packetBefore(packetids_1.MinecraftPacketIds.ItemStackRequest).on((this.onItemStackRequest = (pk, ni) => {
            if (ni.equals(this.netId)) {
                const data = pk.getRequestBatch().data.get(0);
                const action = data === null || data === void 0 ? void 0 : data.actions.get(0);
                if (this.TriggerActionType.has(action === null || action === void 0 ? void 0 : action.type) && action instanceof packets_1.ItemStackRequestActionTransferBase) {
                    const slotInfo = action.getSrc();
                    const response = new ResponseData();
                    response.slotInfo = slotInfo;
                    response.itemStack = this.slots[slotInfo.slot];
                    if (callback)
                        callback.call(this, response);
                }
            }
        }));
        event_1.events.packetBefore(packetids_1.MinecraftPacketIds.ContainerClose).on((this.onContainerClose = (pk, ni) => {
            if (ni.equals(this.netId) && !this.isDisabled())
                this.close();
        }));
        event_1.events.playerLeft.on((this.onDisconnect = (event) => {
            if (event.player.getNetworkIdentifier().equals(this.netId))
                this.destruct();
        }));
    }
    static initInventorySlotPacket(packet, containerId, slot, ItemStack) {
        (0, hacker_1.InventorySlotPacket$InventorySlotPacket)(packet, containerId, slot, ItemStack);
    }
    assertValidSize(slot) {
        if (slot !== (slot | 0))
            throw new Error("slot number must be an integer.");
        if (slot > this.size)
            throw new Error("slot number must be less than or equal to the size of the menu.");
    }
    asserMenuNotOpen() {
        if (!this.hasOpen)
            throw new Error("Menu is not open for the player.");
    }
    assertDefault() {
        this.asserMenuNotOpen();
    }
    /**
     *
     * @param slot slot n umber
     */
    setItem(slot, item) {
        this.slots[slot] = item.clone();
    }
    /**
     *
     * @param slot slot n umber
     * @returns DO NOT DESTRUCT. THEY MUST BE DESTRUTCTED BY LIBRARY.
     */
    getItem(slot) {
        this.assertValidSize(slot);
        return this.slots[slot];
    }
    sendItem(slot, item) {
        this.assertDefault();
        this.setItem(slot, item);
        this.sendInventory();
    }
    openChest() {
        var _a;
        this.hasOpen = true;
        const pk = packets_1.ContainerOpenPacket.allocate();
        pk.containerId = this.mContainerId;
        pk.type = (_a = hsblock_1.HSBlock.TypeToContainerType[this.block.type]) !== null && _a !== void 0 ? _a : inventory_1.ContainerType.Container;
        pk.pos.set(this.blockPos);
        this.entity.sendPacket(pk);
        pk.dispose();
    }
    placeChest() {
        this.block.place(this.entity);
    }
    destroyChest() {
        this.assertDefault();
        this.block.destroy(this.entity);
    }
    destruct() {
        this.assertDefault();
        for (let [slot, item] of Object.entries(this.slots)) {
            item.destruct();
        }
        this.destroyChest();
        event_1.events.packetBefore(packetids_1.MinecraftPacketIds.ItemStackRequest).remove(this.onItemStackRequest);
        event_1.events.packetBefore(packetids_1.MinecraftPacketIds.ContainerClose).remove(this.onContainerClose);
        event_1.events.playerLeft.remove(this.onDisconnect);
    }
    open(delay = 50) {
        this.placeChest();
        setTimeout(() => {
            this.openChest();
            this.sendInventory();
        }, delay);
    }
    close() {
        this.assertDefault();
        this.destruct();
        this.disable();
    }
    sendInventory() {
        var _a;
        this.assertDefault();
        for (const [slot_, item] of Object.entries(this.slots)) {
            const slot = +slot_;
            if (!((_a = this.slots[slot]) === null || _a === void 0 ? void 0 : _a.sameItem(item)))
                this.slots[slot].destruct();
            const pk = new packets_1.InventorySlotPacket(true);
            HSMenu.initInventorySlotPacket(pk, this.mContainerId, slot, item);
            this.entity.sendPacket(pk);
            pk.destruct();
        }
    }
    setTitle(title) {
        const pkt = packets_1.BlockActorDataPacket.allocate();
        pkt.pos.set(this.blockPos);
        pkt.data.setAllocated("CustomName", nbt_1.StringTag.allocateWith(title));
        this.entity.sendPacket(pkt);
        pkt.dispose();
    }
    get containerId() {
        return this.mContainerId;
    }
    static Closed() {
        throw new Error("the menu is closed already");
    }
    /**
     *
     * @returns returns false if the instance is disabled already
     */
    disable() {
        if (!this.disabled)
            return false;
        const properties = {};
        for (const key of Object.getOwnPropertyNames(this)) {
            properties[key] = { get: HSMenu.Closed };
        }
        Object.defineProperties(this, properties);
        return (this.disabled = true);
    }
    isDisabled() {
        return this.disabled;
    }
}
exports.HSMenu = HSMenu;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHNtZW51LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaHNtZW51LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGdEQUE2QztBQUM3QyxrREFBOEQ7QUFDOUQsc0NBQXlDO0FBRXpDLGtEQUF3RDtBQUN4RCw4Q0FTMEI7QUFHMUIsc0NBQW9DO0FBRXBDLHFDQUFtRTtBQUNuRSx1Q0FBb0M7QUFJcEMsTUFBTSxZQUFZO0NBR2pCO0FBRUQsTUFBYSxNQUFNO0lBdUNmLFlBQVksTUFBb0IsRUFBRSxLQUFjLEVBQUUsUUFBd0IsRUFBRSxFQUFFLFFBQXlEO1FBbkMvSCxZQUFPLEdBQVksS0FBSyxDQUFDO1FBa0N6QixzQkFBaUIsR0FBRyxJQUFJLEdBQUcsQ0FBNkIsQ0FBQyxvQ0FBMEIsQ0FBQyxJQUFJLEVBQUUsb0NBQTBCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQTRHN0gsYUFBUSxHQUFhLG1CQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFpQjlDLGFBQVEsR0FBRyxLQUFLLENBQUM7UUEzSHJCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFDM0MsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztRQUU1QixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQztRQUMzQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUM7WUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENB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