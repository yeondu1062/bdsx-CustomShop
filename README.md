# Custom-shop
Custom shop plugins available in BDSX.
  
## Command | 커맨드 🔮
서버에 추가되는 명령어 목록
> - 상점 명령어  
> /상점 추가 <상점이름> <스코어> <사이즈> - 새로운 상점을 추가합니다.  
> /상점 삭제 <상점이름> - 추가한 상점을 삭제합니다.  
> /상점 열기 <상점이름> <대상> - 상점을 플레이어에게 전송합니다.  
>  
> - 아이템 명령어  
> /상점 업로드 <상점이름> <슬롯> - 현재 들고있는 아이템을 상점에 추가합니다.  
> /상점 가격설정 <상점이름> <슬롯> <설정> <가격> - 추가된 아이템의 가격을 설정합니다.  

## Example | 사용예시 📜
- 상점 추가 `/상점 추가 example_shop money "큰상자"` "money" 스코어를 사용하는 "example_shop" 상점을 새로 생성
- 상점 업로드 `/상점 업로드 example_shop 10` "example_shop" 상점의 10번째 슬롯의 아이템을 현재 들고있는 아이템으로 설정
- 상점 가격설정 `/상점 가격설정 example_shop 10 "구매가" 1000` "example_shop" 상점의 10번째 슬롯의 아이템의 구매가격을 1000으로 설정


## Custom | 커스텀 ✨
[Setting]() 파일을 수정하여 플러그인을 커스텀 할 수 있습니다.
```javascript
{
    "message": {
        "inputInvalidNumber": "§l§6[상점] §r§7개수를 자연수로 입력해주세요.", // 자연수가 아닐 경우
        "economyLack": "§l§6[상점] §r§7소유 금액이 부족합니다.", // 사용자의 재화 부족 메시지
        "success": "§l§6[상점] §r§7아이템 §f{name} §7을(를) §f{amount} §7개 {option}하였습니다." // 구매 성공 메시지
    }
}
```

## License | 라이센스 ⚖️
해당 플러그인은 [MIT]() 라이센스를 사용중입니다.

## Lib | 오픈소스 📚
해당 플러그인은 [Hsmenu](https://github.com/mdisprgm/bdsx-hsmenu) 를 포함하고 있습니다.
