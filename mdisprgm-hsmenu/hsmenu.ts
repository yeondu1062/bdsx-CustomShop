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

type ContainerItems = Record<number, ItemStack>;

class ResponseData {
    slotInfo: ItemStackRequestSlotInfo;
    itemStack: ItemStack;
}

export class HSMenu {
    private static initInventorySlotPacket(packet: InventorySlotPacket, containerId: number, slot: number, ItemStack: ItemStack): void {
        InventorySlotPacket$InventorySlotPacket(packet, containerId, slot, ItemStack);
    }
    private hasOpen: boolean = false;
    private assertValidSize(slot: number): void {
        if (slot !== (slot | 0)) throw new Error("slot number must be an integer.");
        if (slot > this.size) throw new Error("slot number must be less than or equal to the size of the menu.");
    }
    private asserMenuNotOpen(): void {
        if (!this.hasOpen) throw new Error("Menu is not open for the player.");
    }
    private assertDefault(): void {
        this.asserMenuNotOpen();
    }
    /**
     *
     * @param slot slot n umber
     */
    setItem(slot: number, item: ItemStack): void {
        this.slots[slot] = item.clone();
    }
    /**
     *
     * @param slot slot n umber
     * @returns DO NOT DESTRUCT. THEY MUST BE DESTRUTCTED BY LIBRARY.
     */
    getItem(slot: number): ItemStack {
        this.assertValidSize(slot);

        return this.slots[slot];
    }
    sendItem(slot: number, item: ItemStack): void {
        this.assertDefault();
        this.setItem(slot, item);
        this.sendInventory();
    }

    private TriggerActionType = new Set<ItemStackRequestActionType>([ItemStackRequestActionType.Take, ItemStackRequestActionType.Place]);
    constructor(player: ServerPlayer, block: HSBlock, slots: ContainerItems = {}, callback?: (this: HSMenu, response: ResponseData) => void) {
        this.entity = player;
        this.netId = player.getNetworkIdentifier();
        this.block = block;
        this.size = this.block.size;

        this.blockPos.set(player.getFeetPos());
        this.blockPos.y += this.block.blockYOffset;
        if (this.blockPos.x < 0) this.blockPos.x--;
        if (this.blockPos.z < 0) this.blockPos.z--;

        this.slots = slots;

        this.mContainerId = this.entity.nextContainerCounter();

        for (const [slot, item] of Object.entries(this.slots)) {
            this.setItem(+slot, item);
        }

        events.packetBefore(MinecraftPacketIds.ItemStackRequest).on(
            (this.onItemStackRequest = (pk, ni) => {
                if (ni.equals(this.netId)) {
                    const data = pk.getRequestBatch().data.get(0);
                    const action = data?.actions.get(0);
                    if (this.TriggerActionType.has(action?.type) && action instanceof ItemStackRequestActionTransferBase) {
                        const slotInfo = action.getSrc();

                        const response = new ResponseData();
                        response.slotInfo = slotInfo;
                        response.itemStack = this.slots[slotInfo.slot];
                        if (callback) callback.call(this, response);
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
                if (event.player.getNetworkIdentifier().equals(this.netId)) this.destruct();
            }),
        );
    }

    private openChest(): void {
        this.hasOpen = true;

        const pk = ContainerOpenPacket.allocate();
        pk.containerId = this.mContainerId;
        pk.type = HSBlock.TypeToContainerType[this.block.type] ?? ContainerType.Container;
        pk.pos.set(this.blockPos);
        this.entity.sendPacket(pk);
        pk.dispose();
    }
    private placeChest(): void {
        this.block.place(this.entity);
    }
    private destroyChest(): void {
        this.assertDefault();
        this.block.destroy(this.entity);
    }
    private destruct(): void {
        this.assertDefault();
        for (let [slot, item] of Object.entries(this.slots)) {
            item.destruct();
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

        this.destruct();
        this.disable();
    }
    sendInventory(): void {
        this.assertDefault();
        for (const [slot_, item] of Object.entries(this.slots)) {
            const slot = +slot_;
            if (!this.slots[slot]?.sameItem(item)) this.slots[slot].destruct();
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

    private block: HSBlock;
    private blockPos: BlockPos = BlockPos.create(0, 0, 0);
    private mContainerId: number;
    get containerId(): number {
        return this.mContainerId;
    }
    entity: ServerPlayer;
    private slots: Record<number, ItemStack>;
    private netId: NetworkIdentifier;
    private size: HSBlock.size;

    protected onItemStackRequest: (pk: ItemStackRequestPacket, ni: NetworkIdentifier) => CANCEL | void;
    protected onContainerClose: (pk: ContainerClosePacket, ni: NetworkIdentifier) => CANCEL | void;
    protected onDisconnect: (event: PlayerLeftEvent) => void;

    private static Closed() {
        throw new Error("the menu is closed already");
    }
    private disabled = false;
    /**
     *
     * @returns returns false if the instance is disabled already
     */
    private disable(): boolean {
        if (!this.disabled) return false;
        const properties: PropertyDescriptorMap = {};
        for (const key of Object.getOwnPropertyNames(this)) {
            properties[key] = { get: HSMenu.Closed };
        }
        Object.defineProperties(this, properties);
        return (this.disabled = true);
    }
    isDisabled(): boolean {
        return this.disabled;
    }
}
