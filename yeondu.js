"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const form_1 = require("bdsx/bds/form");
const inventory_1 = require("bdsx/bds/inventory");
const common_1 = require("bdsx/common");
const event_1 = require("bdsx/event");
const launcher_1 = require("bdsx/launcher");
const mdisprgm_hsmenu_1 = require("./mdisprgm-hsmenu");
event_1.events.entityHurt.on((event_data) => {
    var _a;
    if (event_data.entity.getTags().join().includes('shop[') && ((_a = event_data.damageSource.getDamagingEntity()) === null || _a === void 0 ? void 0 : _a.isPlayer)) {
        const player = event_data.damageSource.getDamagingEntity();
        const tags = event_data.entity.getTags().join().split('shop[')[1].split(']')[0].split('|');
        const sale = tags[0].split(',');
        const amount = tags[1].split(',');
        const score_name = tags[2];
        const shop_menu = new mdisprgm_hsmenu_1.HSMenu(player, new mdisprgm_hsmenu_1.HSDoubleChest(), {}, function (data) {
            var _a;
            if (data.slotInfo.openContainerNetId !== 7)
                return;
            shop_menu.close();
            const player = this.entity;
            const slot = data.slotInfo.slot;
            const g_scoreboard = launcher_1.bedrockServer.level.getScoreboard();
            const score = (_a = g_scoreboard.getObjective(score_name)) === null || _a === void 0 ? void 0 : _a.getPlayerScore(g_scoreboard.getActorScoreboardId(player)).value;
            setTimeout(async function () {
                const shop_ui = await form_1.Form.sendTo(player.getNetworkIdentifier(), {
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
                if (shop_ui && score != undefined) {
                    if (isNaN(shop_ui[0]) == false) {
                        if (Number(shop_ui[0]) * Number(amount[slot]) <= score) {
                            player.runCommand(`scoreboard players remove @s ${score_name} ${Number(shop_ui[0]) * Number(amount[slot])}`);
                            player.runCommand(`tellraw @s {"rawtext":[{"text":"§l§6[상점] §r§7아이템 §f${sale[slot]} §7을(를) §f${shop_ui[0]} §7개 구매하였습니다."}]}`);
                            player.runCommand(`give @s ${sale[slot]} ${shop_ui[0]}`);
                        }
                        else
                            player.runCommand(`tellraw @s {"rawtext":[{"text":"§l§6[상점] §r§7소유 금액이 부족합니다."}]}`);
                    }
                    else
                        player.runCommand(`tellraw @s {"rawtext":[{"text":"§l§6[상점] §r§f${shop_ui[0]} §7입력 불가능한 값입니다."}]}`);
                }
                ;
            }, 500);
        });
        for (let i = 0; i < sale.length; i++) {
            let item = inventory_1.ItemStack.constructWith(sale[i]);
            item.setCustomLore(['', `§r§l§6▶ §f구매 가격: §r§e${amount[i]}`]);
            shop_menu.setItem(i, item);
        }
        shop_menu.open();
        shop_menu.setTitle('§l[구매] §r§8구매하실 아이템을 가져가세요.');
        return common_1.CANCEL;
    }
    ;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieWVvbmR1LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsieWVvbmR1LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsd0NBQXFDO0FBQ3JDLGtEQUErQztBQUUvQyx3Q0FBcUM7QUFDckMsc0NBQW9DO0FBQ3BDLDRDQUE4QztBQUM5Qyx1REFBMEQ7QUFFMUQsY0FBTSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxVQUFVLEVBQUUsRUFBRTs7SUFDaEMsSUFBRyxVQUFVLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSSxNQUFBLFVBQVUsQ0FBQyxZQUFZLENBQUMsaUJBQWlCLEVBQUUsMENBQUUsUUFBUSxDQUFBLEVBQUU7UUFDOUcsTUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBQzNELE1BQU0sSUFBSSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDM0YsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbkUsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNCLE1BQU0sU0FBUyxHQUFHLElBQUksd0JBQU0sQ0FDeEIsTUFBc0IsRUFBRSxJQUFJLCtCQUFhLEVBQUUsRUFBRSxFQUFFLEVBQy9DLFVBQWUsSUFBSTs7WUFDZixJQUFHLElB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