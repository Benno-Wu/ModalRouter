# Modal-Router

## Install

`npm i modal-router`

## Usage

- ModalRouter: 始终只显示一个modal
- ModalRouter.Multi: 展示多个modal
- ScrollLocker: 用于锁定某滚动对象，全局公用一个存储池，由于dom元素即锁定对象唯一，在完全解锁前皆不可滚动

## Example

```javascript
import xx from './xx.jsx'

const map={x:xx}

<ModalRouter(.Multi) map={map} contextMode>
    <div/>
    <YourComponent/>
</ModalRouter(.Multi)>

//YourComponent
props.(...toggle)

const FuncTest = ({ children, ...rest }) => {
    const { openModal, closeModal, closeAllModal } = useContext(AllModals)

    //try to fire a timer to destroy this FC, make it looks like a Toast
    useEffect(() => {
        openModal('x')
        return () => closeModal('x')
    }, [])

    return <span>FC Test</span>
}
```

## 内置toggle方法

- openModal(key,data)
>map内key对应的组件会接收到modalData属性,如果data是个普通对象会自动展开
- closeModal(key?)
>如果key不提供或者未匹配，默认pop
- closeAllModal()

### 配置属性

### map: { key: modal }
>key: 用于标识一个modal组件
>
>modal: 自由发挥

### contextMode: boolean
>使用需引入context:{AllModals},使得在更深层次的组件中调用toggle方法
>
>默认ModalRouter所有儿子组件的props会接收到所有toogle方法

### container: function/class or object of React.ReactElement
>可传入自定义容器组件，记得处理props.children，以及接收并使用内置toggle方法
>
>考虑配合内置导出对象 ScrollLocker，作用如下

### locker: HTMLElement
>暂且支持一个，用于解决scroll chain现象，阻止非Modal元素滚动
>
>默认为document.body

默认 __container css:__
```css
.HOC_modal {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 2;
}
```
