import Single from "./Single.jsx"
import Multi from "./Multi.jsx"
export { AllModals } from "./context.jsx";

const ModalRouter = Single
ModalRouter.Multi = Multi
export default ModalRouter

// 返回工具
export { ScrollLocker } from './ScrollLocker.jsx'
// todo 返回数据队列，modals等，可能有用
// really? maybe just length is useful
// todo: multi type
/*
multi type means so many different features. Maybe too hard to manage all in one.
So, try combine them separately into one big component repository.
But the goal is that manage the 'toggle' stuff.
*/
// todo：lifetime\callback

// todo: update to ts
// reason: modalStack should hold object:{nameStr,data,key}
// push\pop return the key generated\owned

// todo: 整合简易路由，纯hash
// name: app-router?


// next: toggle 全局开关
// 动态方法名，各种open
// 全局引入？hooks导出调用
// 第一个不好做，不符合react的套路。第二个让组件的原理变成动态render至body
