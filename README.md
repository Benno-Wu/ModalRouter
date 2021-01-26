# Modal-Router

## Install

`npm i modal-router`

## Usage

- ModalRouter: 始终只显示一个modal
- ModalRouter.Multi: 展示多个modal

#### 内置toggle方法

- openModal(key,data)
>map内key对应的组件会接收到modalData属性,如果data是个普通对象会自动展开
- closeModal(key?)
- closeAllModal()

## 配置属性

### map: { key: modal }
>key: 用于标识一个modal组件
>
>modal: 自由发挥

### contextMode: boolean
>使用需引入context:{AllModals},使得在更深层次的组件中调用toggle方法
>
>默认ModalRouter所有儿子组件的props会接收到所有toogle方法

### container:
>可传入自定义容器组件，记得处理props.children，以及接收并使用内置toggle方法

__默认container css:__
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
