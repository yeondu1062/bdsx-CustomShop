# 수정중입니다.
# Custom shop Plugin

Custom shop plugins available in BDSX.   
  
BDSX 커스텀 상점 플러그인 
     
## 사용법    
엔티티한테 태그를 추가하여 상점을 제작할 수 있습니다.<br>
 
상점은 엔티티를 공격하여 열 수 있습니다.     
     
태그: `shop[아이템1_ID,아이템2_ID,아이템3_ID|아이템1_가격,아이템2_가격,아이템3_가격|스코어 이름]`
  

   
## 예시) 

`tag @e[type=villager] add "shop[minecraft:apple,minecraft:lime_dye,minecraft:egg|1,3,2|s]"`  

첫번째 슬롯에 가격이 1인 사과<br>
두번째 슬롯에 가격이 3인 연두색 염료<br>
세번째 슬롯에 가격이 2인 달걀<br>
를 추가하는 내용 (돈 스코어는 s)     

![p](test.png)


     

         
     
### 오픈소스 출처 
본 플러그인은 mdisprgm님의 [`hsmenu`](https://github.com/mdisprgm/bdsx-hsmenu)를 사용했습니다. 


### 라이센스     
본 플러그인은 MIT 라이센스를 사용하고 있습니다.<br> 
MIT 라이센스에 따라 이 플러그인과, 이와 연관된 모든 문서의 복제본을 보유하게 되는 모든 사용자는 이 플러그인을 사용한 2차 창작물의 중요한 부분에 이 플러그인의 사용을 알리는 안내 문구가 포함시킬 의무가 있습니다. <br> 
```
MIT License 
  
 Copyright (c) 2022 yeondu1062
  
 Permission is hereby granted, free of charge, to any person obtaining a copy 
 of this software and associated documentation files (the "Software"), to deal 
 in the Software without restriction, including without limitation the rights 
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
 copies of the Software, and to permit persons to whom the Software is 
 furnished to do so, subject to the following conditions: 
  
 The above copyright notice and this permission notice shall be included in all 
 copies or substantial portions of the Software. 
  
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
 SOFTWARE.
```
