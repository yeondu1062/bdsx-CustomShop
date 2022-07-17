import { Form } from "bdsx/bds/form";
import { ItemStack } from "bdsx/bds/inventory";
import { ServerPlayer } from "bdsx/bds/player";
import { CANCEL } from "bdsx/common";
import { events } from "bdsx/event";
import { bedrockServer } from "bdsx/launcher";
import { HSDoubleChest, HSMenu } from "./mdisprgm-hsmenu";

events.entityHurt.on((event_data) => {
    if(event_data.entity.getTags().join().includes('shop[') && event_data.damageSource.getDamagingEntity()?.isPlayer) {
        const player = event_data.damageSource.getDamagingEntity();
        const tags = event_data.entity.getTags().join().split('shop[')[1].split(']')[0].split('|');
        const sale = tags[0].split(','); const amount = tags[1].split(',');
        const score_name = tags[2];
        const shop_menu = new HSMenu(
            player as ServerPlayer, new HSDoubleChest(), {},
            function(this, data) {
                if(data.slotInfo.openContainerNetId !== 7) return;
                shop_menu.close();
                const player = this.entity;
                const slot = data.slotInfo.slot;
                const g_scoreboard = bedrockServer.level.getScoreboard();
                const score = g_scoreboard.getObjective(score_name)?.getPlayerScore(g_scoreboard.getActorScoreboardId(player)).value;
                setTimeout(async function () {
                    const shop_ui = await Form.sendTo(player.getNetworkIdentifier(), {
                        type: 'custom_form',
                        title: '§l《 구매 》',
                        content: [
                            {
                                type: 'input',
                                text: `§l§6● §r아이템 §l${sale[slot]} §r을(를) 구매합니다.\n \n§l§6● §r아래에 구매할 수량을 입력하여 주세요.\n \n§l§7┏ 당신이 소유한 금액 : §e${score}\n§l§7┗ 개당 금액 : §e${amount[slot]}\n `,
                                placeholder: '여기를 눌러 수량을 입력해주세요.'
                            },
                        ]
                    });
                    if(shop_ui && score != undefined) {
                        if(Number.isInteger(Number(shop[0])) && Number(shop_ui[0]) > 0) {
                            if(Number(shop_ui[0]) * Number(amount[slot]) <= score) {
                                player.runCommand(`scoreboard players remove @s ${score_name} ${Number(shop_ui[0]) * Number(amount[slot])}`);
                                player.runCommand(`tellraw @s {"rawtext":[{"text":"§l§6[상점] §r§7아이템 §f${sale[slot]} §7을(를) §f${shop_ui[0]} §7개 구매하였습니다."}]}`);
                                player.runCommand(`give @s ${sale[slot]} ${shop_ui[0]}`);   
                            } else player.runCommand(`tellraw @s {"rawtext":[{"text":"§l§6[상점] §r§7소유 금액이 부족합니다."}]}`);
                        } else player.runCommand(`tellraw @s {"rawtext":[{"text":"§l§6[상점] §r§f${shop_ui[0]} §7입력 불가능한 값입니다."}]}`);
                    };
                }, 500);
            }
        );
        for(let i = 0; i < sale.length; i++) {
            let item = ItemStack.constructWith(sale[i]);
            item.setCustomLore(['',`§r§l§6▶ §f구매 가격: §r§e${amount[i]}`]);
            shop_menu.setItem(i, item);
        }
        shop_menu.open();
        shop_menu.setTitle('§l[구매] §r§8구매하실 아이템을 가져가세요.');
        return CANCEL;
    };
});
