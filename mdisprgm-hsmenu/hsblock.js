"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HSBlock = void 0;
const inventory_1 = require("bdsx/bds/inventory");
const hacker_1 = require("./hacker");
var HSBlock;
(function (HSBlock) {
    let Size;
    (function (Size) {
        Size[Size["Chest"] = 27] = "Chest";
        Size[Size["DoubleChest"] = 54] = "DoubleChest";
        Size[Size["Hopper"] = 5] = "Hopper";
        Size[Size["Dropper"] = 9] = "Dropper";
        Size[Size["Dispenser"] = 9] = "Dispenser";
    })(Size = HSBlock.Size || (HSBlock.Size = {}));
    let Type;
    (function (Type) {
        Type[Type["Chest"] = 0] = "Chest";
        Type[Type["DoubleChest"] = 1] = "DoubleChest";
        Type[Type["Hopper"] = 2] = "Hopper";
        Type[Type["Dropper"] = 3] = "Dropper";
        Type[Type["Dispenser"] = 4] = "Dispenser";
    })(Type = HSBlock.Type || (HSBlock.Type = {}));
    HSBlock.TypeToSize = {
        0: Size.Chest,
        1: Size.DoubleChest,
        2: Size.Hopper,
        3: Size.Dropper,
        4: Size.Dispenser,
    };
    HSBlock.TypeToContainerType = {
        0: inventory_1.ContainerType.Container,
        1: inventory_1.ContainerType.Container,
        2: inventory_1.ContainerType.Hopper,
        3: inventory_1.ContainerType.Dropper,
        4: inventory_1.ContainerType.Dispenser,
    };
    function initUpdateBlockPacket(packet, blockPos, layerId, runtimeId, flag) {
        (0, hacker_1.UpdateBlockPacket$UpdateBlockPacket)(packet, blockPos, layerId, runtimeId, flag);
    }
    HSBlock.initUpdateBlockPacket = initUpdateBlockPacket;
})(HSBlock = exports.HSBlock || (exports.HSBlock = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHNibG9jay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImhzYmxvY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsa0RBQW1EO0FBR25ELHFDQUErRDtBQVkvRCxJQUFpQixPQUFPLENBeUN2QjtBQXpDRCxXQUFpQixPQUFPO0lBR3BCLElBQVksSUFNWDtJQU5ELFdBQVksSUFBSTtRQUNaLGtDQUFVLENBQUE7UUFDViw4Q0FBZ0IsQ0FBQTtRQUNoQixtQ0FBVSxDQUFBO1FBQ1YscUNBQVcsQ0FBQTtRQUNYLHlDQUFhLENBQUE7SUFDakIsQ0FBQyxFQU5XLElBQUksR0FBSixZQUFJLEtBQUosWUFBSSxRQU1mO0lBQ0QsSUFBWSxJQU1YO0lBTkQsV0FBWSxJQUFJO1FBQ1osaUNBQUssQ0FBQTtRQUNMLDZDQUFXLENBQUE7UUFDWCxtQ0FBTSxDQUFBO1FBQ04scUNBQU8sQ0FBQTtRQUNQLHlDQUFTLENBQUE7SUFDYixDQUFDLEVBTlcsSUFBSSxHQUFKLFlBQUksS0FBSixZQUFJLFFBTWY7SUFDWSxrQkFBVSxHQUF5QjtRQUM1QyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUs7UUFDYixDQUFDLEVBQUUsSUFBSSxDQUFDLFdBQVc7UUFDbkIsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNO1FBQ2QsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPO1FBQ2YsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTO0tBQ1gsQ0FBQztJQUNFLDJCQUFtQixHQUF5QjtRQUNyRCxDQUFDLEVBQUUseUJBQWEsQ0FBQyxTQUFTO1FBQzFCLENBQUMsRUFBRSx5QkFBYSxDQUFDLFNBQVM7UUFDMUIsQ0FBQyxFQUFFLHlCQUFhLENBQUMsTUFBTTtRQUN2QixDQUFDLEVBQUUseUJBQWEsQ0FBQyxPQUFPO1FBQ3hCLENBQUMsRUFBRSx5QkFBYSxDQUFDLFNBQVM7S0FDcEIsQ0FBQztJQUVYLFNBQWdCLHFCQUFxQixDQUNqQyxNQUF5QixFQUN6QixRQUFrQixFQUNsQixPQUF1QyxFQUN2QyxTQUFpQixFQUNqQixJQUE2QjtRQUU3QixJQUFBLDRDQUFtQyxFQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNwRixDQUFDO0lBUmUsNkJBQXFCLHdCQVFwQyxDQUFBO0FBQ0wsQ0FBQyxFQXpDZ0IsT0FBTyxHQUFQLGVBQU8sS0FBUCxlQUFPLFFBeUN2QiJ9