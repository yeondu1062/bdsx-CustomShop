/* ____          _                  ____  _                 
  / ___|   _ ___| |_ ___  _ __ ___ / ___|| |__   ___  _ __  
 | |  | | | / __| __/ _ \| '_ ` _ \\___ \| '_ \ / _ \| '_ \ 
 | |__| |_| \__ \ || (_) | | | | | |___) | | | | (_) | |_) |
  \____\__,_|___/\__\___/|_| |_| |_|____/|_| |_|\___/| .__/ 
                                                     |_|  
    written by @yeondu1062.
*/

import { readFileSync, readdirSync, unlinkSync, writeFileSync } from "fs";
import { Setting, getItemAmount, getScore, getScoreList, isInvalidFileName } from "../index";
import { HSDoubleChest } from "../lib/mdisprgm-hsmenu/blocks/double_chest";
import { ItemStack } from "bdsx/bds/inventory";
import { HSMenu } from "../lib/mdisprgm-hsmenu/hsmenu";
import { HSChest } from "../lib/mdisprgm-hsmenu/blocks/chest";
import { Player } from "bdsx/bds/player";
import { Form } from "bdsx/bds/form";
import { command } from "bdsx/command";

interface ShopItem {
    id: string
    name?: string
    lore: string
    aux?: number
    salePrice?: number
    buyPrice?: number
    dummy?: boolean
}

type Container = Record<number, ShopItem>

interface ShopData {
    title: string,
    size: number,
    economy: string
    container: Container
}

export class CustomShop {
    data: ShopData
    container: Container

    protected path: string
    protected maxSlot: number
    protected shopName: string

    protected optionToString = (option: number): string => ['구매', '판매'][option];
    protected priceToString = (slot: number, option: number): string => String(this.getItemPrice(slot, option) ?? (this.optionToString(option) + '불가'));

    protected static addItem(player: Player, itemData: ShopItem, amount: number) {
        const itemStack = ItemStack.constructWith(itemData.id, undefined, itemData.aux);
        const maxKeep = itemStack.getMaxStackSize();
        itemStack.setAmount(amount % maxKeep);

        if(itemData.name != undefined) itemStack.setCustomName(itemData.name);
        if(itemData.lore != '') itemStack.setCustomLore(itemData.lore);        
        player.addItem(itemStack.clone());

        const maxItemStack = itemStack.clone();
        maxItemStack.setAmount(maxKeep);

        for(let i = 1; i < Math.ceil(amount / maxKeep); i++) player.addItem(maxItemStack.clone());
        player.sendInventory();
    }

    /**
     * @param size 0 is chest, 1 is bigChest.
     */
    static produceShop(shopName: string, scoreName: string, size: number) {
        if(CustomShop.getShopList().includes(shopName)) throw ("이미 사용중인 상점이름입니다.");
        if(!getScoreList().includes(scoreName)) throw ("스코어를 찾을 수 없습니다.");
        if(isInvalidFileName(shopName)) throw ("사용 불가능한 상점이름입니다.");
        
        CustomShop.shopListEnum.addValues(shopName);
        writeFileSync(Setting.dbPath + '/' + shopName + '.json', JSON.stringify({title: shopName, size: size, economy: scoreName, container: {}}, null, 2));
    }
    
    static getShopList = (): string[] => readdirSync(Setting.dbPath).map(name => name.split('.')[0]);
    static shopListEnum = command.softEnum('shopList', ...CustomShop.getShopList());

    constructor(shopName: string) {
        if(!CustomShop.getShopList().includes(shopName)) throw (shopName + "은 존재하지 않는 상점입니다.");
        
        this.path = Setting.dbPath + '/' + shopName + '.json';
        this.data = JSON.parse(readFileSync(this.path, 'utf8'));
        this.maxSlot = [26, 53][this.data.size];
        this.container = this.data.container;
        this.shopName = shopName;
    }

    save() {
        writeFileSync(this.path, JSON.stringify(this.data, null, 2));
    }

    remove() {
        CustomShop.shopListEnum.removeValues(this.shopName);
        unlinkSync(this.path);
    }

    /**
     * @param option 0 is sale, 1 is buy. 
     */
    getItemPrice(slot: number, option: number): number | undefined {
        return this.container[slot][option ? 'buyPrice' : 'salePrice'];
    }

    /**
     * @param option 0 is sale, 1 is buy. 
     */
    setItemPrice(slot: number, option: number, price: number) {
        const itemData = this.container[slot];
        if(itemData == undefined) throw ("해당 슬롯의 아이템을 찾지 못했습니다.");
        itemData[option ? 'buyPrice' : 'salePrice'] = price;
    }

    uploadItem(itemStack: ItemStack, slot: number) {
        if(slot < 0 || slot > this.maxSlot) throw ("슬롯의 제한 범위는 0 ~ " + this.maxSlot + "입니다.");
        this.container[slot] = {id: itemStack.getName(), name: itemStack.hasCustomName() ? itemStack.getCustomName() : undefined, lore: itemStack.getCustomLore().join('\n'), aux: itemStack.getAuxValue() || undefined};
    } 

    openContainerUi(player: Player) {
        const container: Record<number, ItemStack> = {};

        Object.entries(this.container).forEach(([slot, itemData]) => {
            const itemStack = ItemStack.constructWith(itemData.id, 1, itemData.aux);
            const itemLore = (itemData.lore ? itemData.lore + '\n' : '') + '\n' + String.format(Setting.containerUi.itemMenuLore, {'salePrice': this.priceToString(Number(slot), 0), 'buyPrice': this.priceToString(Number(slot), 1)});

            if(itemData.name) itemStack.setCustomName(itemData.name);
            if(itemData.dummy) itemStack.setCustomName('');
            else itemStack.setCustomLore(itemLore.split('\n'));

            container[Number(slot)] = itemStack;
        })

        const shopUi = new HSMenu(player, this.data.size ? new HSDoubleChest() : new HSChest(), container, (menu, res) => {            
            const player = menu.entity, selectSlot = res.slotInfo.slot;
            if(!(res.isFromMenu() && !this.container[selectSlot].dummy)) return;

            setTimeout(() => this.openSelectUi(player, selectSlot), 500);
            menu.close();
        })

        shopUi.open();
        shopUi.setTitle(String.format(Setting.containerUi.title, {'shopName': this.data.title}));
    }

    openSelectUi(player: Player, slot: number) {
        const itemData = this.container[slot];
        const selectUi = Form.sendTo(player.getNetworkIdentifier(), {
            type: 'form',
            title: String.format(Setting.selectUi.title, {'shopName': this.data.title}),
            content: String.format(Setting.selectUi.content, {'name': itemData.name ?? itemData.id, 'salePrice': this.priceToString(slot, 0), 'buyPrice': this.priceToString(slot, 1)}),
            buttons: [{'text': Setting.selectUi.button[0]}, {'text': Setting.selectUi.button[1]}]
        })

        selectUi.then(option => {
            if(option == null) return;
            if(this.getItemPrice(slot, option) != undefined) this.openAmountUi(player, slot, option);
            else player.sendMessage(Setting.message.saleOrBuyImpossible);
        })
    }

    openAmountUi(player: Player, slot: number, option: number) {
        const itemData = this.container[slot];
        const amountUi = Form.sendTo(player.getNetworkIdentifier(), {
            type: 'custom_form',
            title: String.format(Setting.amountUi.title, {'shopName': this.data.title}),
            content: [
                {
                    type: 'input',
                    text: option ? String.format(Setting.amountUi.buyContent, {'name': itemData.name ?? itemData.id, 'amount': String(getItemAmount(player, itemData.id, itemData.aux)), 'price': this.priceToString(slot, option)}) : String.format(Setting.amountUi.saleContent, {'name': itemData.name ?? itemData.id, 'funds': String(getScore(player, this.data.economy)), 'price': this.priceToString(slot, option)}),
                    placeholder: Setting.amountUi.placeholder
                }
            ]
        })

        amountUi.then(res => {
            if(!(res && res[0])) return;
            const amount = Number(res[0]);

            if(Number.isInteger(amount) && amount > 0) option ? this.itemBuy(player, slot, amount) : this.itemSale(player, slot, amount);
            else player.sendMessage(Setting.message.inputInvalidNumber);
        })
    }

    itemSale(player: Player, slot: number, amount: number) {
        const itemData = this.container[slot];
        const price = itemData.salePrice! * amount;

        if(getScore(player, this.data.economy) >= price) {
            CustomShop.addItem(player, itemData, amount);
            player.runCommand("scoreboard players remove @s " + this.data.economy + ' ' + price);
            player.sendMessage(String.format(Setting.message.saleSuccess, {'name': itemData.name ?? itemData.id, 'amount': String(amount)}));
        }else player.sendMessage(Setting.message.economyLack);
    }

    itemBuy(player: Player, slot: number, amount: number) {
        const itemData = this.container[slot];
        const price = itemData.buyPrice! * amount;

        if(getItemAmount(player, itemData.id, itemData.aux) >= amount) {
            player.runCommand("clear @s " + itemData.id + ' ' + (itemData.aux ?? 0) + ' ' + amount);
            player.runCommand("scoreboard players add @s " + this.data.economy + ' ' + price);
            player.sendMessage(String.format(Setting.message.buySuccess, {'name': itemData.name ?? itemData.id, 'amount': String(amount)}));
        }else player.sendMessage(Setting.message.itemLack);
    }
}
