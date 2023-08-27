import { BlockPos } from "bdsx/bds/blockpos";
import { ContainerType, ItemStack } from "bdsx/bds/inventory";
import { StringTag } from "bdsx/bds/nbt";
import { NetworkIdentifier } from "bdsx/bds/networkidentifier";
import { MinecraftPacketIds } from "bdsx/bds/packetids";
import {
    BlockActorDataPacket,
    ContainerClosePacket,
    ContainerOpenPacket,
    InventorySlotPacket,
    ItemStackRequestActionTransferBase,
    ItemStackRequestActionType,
    ItemStackRequestPacket,
    ItemStackRequestSlotInfo,
} from "bdsx/bds/packets";
import { ServerPlayer } from "bdsx/bds/player";
import { CANCEL } from "bdsx/common";
import { events } from "bdsx/event";
import { PlayerLeftEvent } from "bdsx/event_impl/entityevent";
import { InventorySlotPacket$InventorySlotPacket } from "./hacker";
import { HSBlock } from "./hsblock";

interface Option {
    destruct: boolean;
}
type ContainerItem = ItemStack | [ItemStack, Option];
type ContainerItems = Record<number, ContainerItem>;

class ResponseData {
    slotInfo: ItemStackRequestSlotInfo;
    itemStack: ItemStack;

    isFromMenu(): this is { slotInfo: { openContainerNetId: 7 } } {
        return this.slotInfo.openContainerNetId === 7;
    }
}
function createResponseData(slotInfo: ItemStackRequestSlotInfo, itemStack: ItemStack): ResponseData {
    const data = new ResponseData();
    data.slotInfo = slotInfo;
    data.itemStack = itemStack;
    return data;
}

export class HSMenu {
    protected static initInventorySlotPacket(packet: InventorySlotPacket, containerId: number, slot: number, ItemStack: ItemStack): void {
        InventorySlotPacket$InventorySlotPacket(packet, containerId, slot, ItemStack);
    }
    protected hasOpen: boolean = false;
    protected assertValidSize(slot: number): void {
        if (slot !== (slot | 0)) throw Error("slot number must be an integer.");
        if (slot > this.size) throw Error("slot number must be less than or equal to the size of the menu.");
    }
    protected assertMenuNotOpen(): asserts this is { hasOpen: true } {
        if (!this.hasOpen) throw Error("Menu is not open for the player.");
    }
    protected assertDefault(): void {
        this.assertMenuNotOpen();
    }
    /**
     *
     * @param slot slot n umber
     */
    setItem(slot: number, item: ItemStack): void {
        this.assertValidSize(slot);

        this.slots[slot] = item.clone();
    }
    /**
     *
     * @param slot slot n umber
     * @returns DO NOT DESTRUCT. THEY MUST BE DESTRUCTED BY LIBRARY.
     */
    getItem(slot: number): ItemStack {
        this.assertDefault();
        this.assertValidSize(slot);
        return this._extractItem(this.slots[slot]);
    }
    sendItem(slot: number, item: ItemStack): void {
        this.assertDefault();
        this.assertValidSize(slot);
        this.setItem(slot, item);
        this.sendInventory();
    }

    protected TriggerActionType = new Set<ItemStackRequestActionType>([
        ItemStackRequestActionType.Take,
        ItemStackRequestActionType.Place,
        ItemStackRequestActionType.Drop,
    ]);
    constructor(player: ServerPlayer, block: HSBlock, slots: ContainerItems = {}, callback?: (menu: HSMenu, response: ResponseData) => void) {
        this.entity = player;
        this.netId = player.getNetworkIdentifier();
        this.block = block;
        this.size = this.block.size;

        this.blockPos.set(player.getFeetPos());
        this.blockPos.y += this.block.blockYOffset;
        if (this.blockPos.x < 0) this.blockPos.x--;
        if (this.blockPos.z < 0) this.blockPos.z--;

        this.slots = slots;

        if (this.block.getContainerId) this.mContainerId = this.block.getContainerId(this.entity);
        else this.mContainerId = this.entity.nextContainerCounter();

        for (const [slot, item] of Object.entries(this.slots)) {
            this.setItem(+slot, this._extractItem(item));
        }

        events.packetBefore(MinecraftPacketIds.ItemStackRequest).on(
            (this.onItemStackRequest = (pk, ni) => {
                if (ni.equals(this.netId)) {
                    const data = pk.getRequestBatch().data.get(0);
                    const action = data?.getActions().get(0);
                    if (this.TriggerActionType.has(action?.type) && action instanceof ItemStackRequestActionTransferBase) {
                        const slotInfo = action.getSrc();
                        const response = createResponseData(slotInfo, this.getItem(slotInfo.slot));
                        if (callback) callback(this, response);
                    }
                }
            }),
        );
        events.packetBefore(MinecraftPacketIds.ContainerClose).on(
            (this.onContainerClose = (pk, ni) => {
                if (ni.equals(this.netId) && !this.isDisabled()) this.close();
            }),
        );
        events.playerLeft.on(
            (this.onDisconnect = (event) => {
                if (event.player.getNetworkIdentifier().equals(this.netId)) this.destructUI();
            }),
        );
    }

    protected openChest(): void {
        if (this.hasOpen) {
            throw Error("Already Opened");
        }
        this.hasOpen = true;

        const pk = ContainerOpenPacket.allocate();
        pk.containerId = this.mContainerId;
        pk.type = HSBlock.TypeToContainerType[this.block.type] ?? ContainerType.Container;
        pk.pos.set(this.blockPos);
        this.entity.sendPacket(pk);
        pk.dispose();
    }
    protected placeChest(): void {
        this.block.place(this.entity);
    }
    protected destroyChest(): void {
        this.assertDefault();
        this.block.destroy(this.entity);
    }
    protected destructUI(): void {
        this.assertDefault();
        for (const [slot, item] of Object.entries(this.slots)) {
            this._destructItem(item);
        }
        this.destroyChest();
        events.packetBefore(MinecraftPacketIds.ItemStackRequest).remove(this.onItemStackRequest);
        events.packetBefore(MinecraftPacketIds.ContainerClose).remove(this.onContainerClose);
        events.playerLeft.remove(this.onDisconnect);
    }
    open(delay = 50): void {
        this.placeChest();
        setTimeout(() => {
            this.openChest();
            this.sendInventory();
        }, delay);
    }
    close(): void {
        this.assertDefault();

        this.destructUI();
        this.disable();
    }
    sendInventory(): void {
        this.assertDefault();
        for (const [_slot, _item] of Object.entries(this.slots)) {
            const slot = +_slot;
            const item = this._extractItem(_item);
            const fromSlot = this._extractItem(this.slots[slot]);

            if (!fromSlot.sameItem(item)) fromSlot.destruct();
            const pk = new InventorySlotPacket(true);
            HSMenu.initInventorySlotPacket(pk, this.mContainerId, slot, item);
            this.entity.sendPacket(pk);
            pk.destruct();
        }
    }
    setTitle(title: string): void {
        const pkt = BlockActorDataPacket.allocate();
        pkt.pos.set(this.blockPos);
        pkt.data.setAllocated("CustomName", StringTag.allocateWith(title));
        this.entity.sendPacket(pkt);
        pkt.dispose();
    }

    protected block: HSBlock;
    protected blockPos: BlockPos = BlockPos.create(0, 0, 0);
    protected mContainerId: number;
    get containerId(): number {
        return this.mContainerId;
    }
    entity: ServerPlayer;
    protected slots: ContainerItems;
    protected netId: NetworkIdentifier;
    protected size: HSBlock.size;

    protected onItemStackRequest: (pk: ItemStackRequestPacket, ni: NetworkIdentifier) => CANCEL | void;
    protected onContainerClose: (pk: ContainerClosePacket, ni: NetworkIdentifier) => CANCEL | void;
    protected onDisconnect: (event: PlayerLeftEvent) => void;

    protected static Closed() {
        throw Error("the menu is closed already");
    }
    protected disabled = false;
    /**
     *
     * @returns returns false if the instance is disabled already
     */
    protected disable() {
        if (this.disabled) {
            return false;
        }
        const properties: PropertyDescriptorMap = {};
        for (const key of Object.getOwnPropertyNames(this)) {
            properties[key] = { get: HSMenu.Closed };
        }
        Object.defineProperties(this, properties);
        try{return (this.disabled = true);}catch{}
    }
    protected _extractItem(instance: ContainerItem): ItemStack {
        instance = instance ?? {}
        return instance instanceof ItemStack ? instance : instance[0];
    }
    protected _destructItem(instance: ContainerItem): void {
        if (!this._shouldDestruct(instance)) {
            return;
        }
        if (instance instanceof ItemStack) {
            instance.destruct();
        } else {
            instance[0].destruct();
        }
    }
    protected _shouldDestruct(instance: ContainerItem): boolean {
        return instance instanceof ItemStack ? true : instance[1].destruct;
    }
    isDisabled(): boolean {
        return this.disabled;
    }
}
