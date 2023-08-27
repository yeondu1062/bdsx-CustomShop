import { command } from "bdsx/command";
import { CustomShop } from "./shop";
import { CxxString, int32_t } from "bdsx/nativetype";
import { CommandPermissionLevel, PlayerCommandSelector } from "bdsx/bds/command";
import { getScoreList } from "../index";

const CustomShopCommand = command.register('상점', "상점 관련 명령어입니다. §8made by yeondu1062", CommandPermissionLevel.Operator);

CustomShopCommand.overload((param, origin, output) => {
    try {
        const size = {"작은상자": 0, "큰상자": 1}[param.사이즈];
        if(size == undefined) throw ('잘못된 사이즈입니다.');

        CustomShop.produceShop(param.상점이름, param.스코어, size);
        output.success(`상점 ${param.상점이름}이(가) 추가되었습니다.`);
    } catch(err) {
        output.error(err);
    }
}, {
    option: command.enum("option.추가", "추가"),
    상점이름: CxxString,
    스코어: command.softEnum('scoreList', ...getScoreList()),
    사이즈: command.softEnum("size", "작은상자", "큰상자")
})

CustomShopCommand.overload((param, origin, output) => {
    try {
        const menu = new CustomShop(param.상점이름);
        menu.remove();
        output.success(`상점 ${param.상점이름}이(가) 삭제되었습니다.`);
    } catch(err) { 
        output.error(err);
    }
}, {
    option: command.enum("option.삭제", "삭제"),
    상점이름: CustomShop.shopListEnum,
})

CustomShopCommand.overload((param, origin, output) => {
    try {
        param.대상.newResults(origin).forEach(player => {
            new CustomShop(param.상점이름).openContainerUi(player);
        })
    } catch(err) {
        output.error(err);
    }
}, {
    option: command.enum("option.열기", "열기"),
    상점이름: CustomShop.shopListEnum,
    대상: PlayerCommandSelector
})

CustomShopCommand.overload((param, origin, output) => {
    try {
        const entity = origin.getEntity();
        if(entity == null) throw ('해당 명령어는 플레이어를 통해서만 실행할 수 있습니다.');

        const itemStack = entity.getCarriedItem();
        const menu = new CustomShop(param.상점이름);
        menu.uploadItem(itemStack, param.슬롯);
        menu.save();
        output.success(`상점 ${param.상점이름}의 ${param.슬롯}번째 슬롯의 아이템을 ${itemStack.getCustomName()}으로 저장하였습니다.`);
    } catch(err) { 
        output.error(err);
    }
}, {
    option: command.enum("option.업로드", "업로드"),
    상점이름: CustomShop.shopListEnum,
    슬롯: int32_t
})

CustomShopCommand.overload((param, origin, output) => {
    try {
        const option = {"구매가": 0, "판매가": 1}[param.설정];
        if(option == undefined) throw ('잘못된 옵션입니다.');

        const menu = new CustomShop(param.상점이름);
        menu.setItemPrice(param.슬롯, option, param.가격);
        menu.save();
        output.success(`상점 ${param.상점이름}의 ${param.슬롯}번째 슬롯의 아이템의 ${param.설정}를 ${param.가격}으로 저장하였습니다.`);
    } catch(err) { 
        output.error(err);
    }
}, {
    option: command.enum("option.가격설정", "가격설정"),
    상점이름: CustomShop.shopListEnum,
    슬롯: int32_t,
    설정: command.softEnum("setting", "판매가", "구매가"),
    가격: int32_t
})
