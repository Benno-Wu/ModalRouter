import Single from "./Single.jsx"
import Multi from "./Multi.jsx"
export { AllModals } from "./context.jsx";

const ModalRouter = Single
ModalRouter.Multi = Multi
export default ModalRouter

// 返回工具
export { ScrollLocker } from './ScrollLocker.jsx'
// todo 返回数据队列，modals等，可能有用