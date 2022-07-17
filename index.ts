import { events } from "bdsx/event";

events.serverOpen.on(() => {
    import ('./yeondu');
    console.log('커스텀 상점 플러그인 로드성공');
});