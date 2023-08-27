import { Player } from "bdsx/bds/player";
import { events } from "bdsx/event";
import { bedrockServer } from "bdsx/launcher";
import { readFileSync } from "fs";

declare global {
    interface StringConstructor {
        format: (text: string, fill: {[key: string]: string}) => string
    }
}

String.format = (text, fill) => {
    Object.entries(fill).forEach(v => text = text.replace(new RegExp('{' + v[0] + '}', 'g'), v[1]));
    return text;
}

events.serverOpen.on(() => {
    import ('./src/command');
    console.log('[CustomShop] - 로드 성공');
})

export const Setting = JSON.parse(readFileSync('../plugins/bdsx-CustomShop-main/setting.json', 'utf8'));

export function isInvalidFileName(fileName: string) {
    const invalidCharacters = /[<>:"\/\\|?*\x00-\x1F]/;
    const reservedWords = [
        "CON", "PRN", "AUX", "NUL",
        "COM1", "COM2", "COM3", "COM4", "COM5",
        "COM6", "COM7", "COM8", "COM9",
        "LPT1", "LPT2", "LPT3", "LPT4", "LPT5",
        "LPT6", "LPT7", "LPT8", "LPT9"
    ];

    return fileName.length > 20 || invalidCharacters.test(fileName) || reservedWords.includes(fileName.toUpperCase());
}

export function getScore(player: Player, scoreName: string) {
    const scoreboard = bedrockServer.level.getScoreboard();
    return scoreboard.getObjective(scoreName)?.getPlayerScore(scoreboard.getActorScoreboardId(player)).value ?? 0;
}

export function getScoreList() {
    return bedrockServer.level.getScoreboard().getObjectives().map(v => v.name);
}

export function getItemAmount(player: Player, itemId: string, aux: number = 0) {
    const container = player.getInventory().container.getSlots();
    let result = 0;

    for(let i = 0; i < container.size(); i++) {
        const itemStack = container.get(i);
        if(itemStack.getName() == itemId && itemStack.getAuxValue() == aux) result += itemStack.amount;
    }

    container.destruct();
    return result;
}
