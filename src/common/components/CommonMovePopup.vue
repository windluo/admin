<template>
  <div v-if="isShow">
    <section class="common-move-popup transform"
      @mousedown="mousedown"
      ref="movePop"
      :style="{left: left, top: top, width: width, height: height}" :class="selfClass">
      <button type="button" @click="deletePopup" class="delete-button">
        <slot name="delete-crross">
          <span class="delete-pic"></span>
        </slot>
      </button>
      <div class="popup-title">
        <slot name="title"></slot>
      </div>
      <div class="popup-cont">
        <slot name='content'></slot>
      </div>
    </section>
    <div class="mark-back" v-if="isShowMark">
    </div>
  </div>
</template>

<script>
  export default {
    name: 'common-move-popup',
    props: {
      value: '',
      // 自定义样式
      selfClass: {
        type: String,
        default: 'defaultClass',
      },
      // 是否展示背景蒙板
      isShowMark: {
        type: Boolean,
        default: true,
      },
      canHide: {
        // 是否可隐藏的弹框，用于ajax提交时控制显隐
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        isShow: false,
        isMouseDown: false,
        startX: '',
        endX: '',
        distanseX: '',
        startY: '',
        endY: '',
        distanseY: '',
        left: '50%',
        top: '50%',
        startLeft: '',
        startTop: '',
        width: '',
        height: ''
      };
    },
    methods: {
      mousedown (e) {
        if (['textarea', 'input'].some(item => item == e.target.tagName.toLowerCase())) {
          this.isMouseDown = false;
          return false;
        }
        this.isMouseDown = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.startLeft = this.$refs.movePop.offsetLeft;
        this.startTop = this.$refs.movePop.offsetTop;
      },
      mousemove (e) {
        if (!this.isMouseDown) return false;
        // 鼠标离开了当前窗口, 通过边界判断, 取消移动
        if (e.clientX - document.documentElement.clientWidth > -20 || e.clientX < 20 || e.clientY < 20 || e.clientY - document.documentElement.clientHeight > -20) {
          this.isMouseDown = false;
          return false;
        }
        // 弹出框移动时的方法
        this.$emit('popupMove');
        this.endX = e.clientX;
        this.endY = e.clientY;
        this.distanseX = this.endX - this.startX;
        this.distanseY = this.startY - this.endY;
        this.left = this.startLeft + this.distanseX + 'px';
        this.top = this.startTop - this.distanseY + 'px';
      },
      mouseup (e) {
        this.isMouseDown = false;
      },
      deletePopup () {
        if (this.canHide) {
          this.isShow = false;
          this.$emit('input', this.isShow);
          this.destroy();
        }
      },
      destroy () {
        document.body.removeEventListener('mouseup', this.mouseup);
        document.body.removeEventListener('mousemove', this.mousemove);
      },
      resetPopupWH () {
        // 重设宽高，防止抖动
        this.$nextTick(() => {
          this.left = '50%';
          this.top = '50%';
          let width = this.$refs.movePop.clientWidth;
          let height = this.$refs.movePop.clientHeight;
          width = (width % 2 === 0) ? width : (parseInt(width) + 1);
          height = (height % 2 === 0) ? height : (parseInt(height) + 1);
          // 宽度根据form内容，外面定宽整数，避免适应情况下过宽
          // this.width = `${width}px`;
          this.height = `${height}px`;
          // 绑定鼠标事件
          document.body.addEventListener('mouseup', this.mouseup, false);
          document.body.addEventListener('mousemove', this.mousemove, false);
        })
      }
    },
    watch: {
      value (val) {
        this.isShow = val;
        if (val) {
          this.resetPopupWH();
        } else {
          this.destroy();
        }
      },
    },
  };
</script>

<style lang="less" scoped>
  .common-move-popup {
    position: fixed;
    font-size: 16px;
    z-index: 1018;
    background-color: #fff;
    border-radius: 8px;
    .popup-title{
      background: #F0F0F0;
      color: #6F6C68;
      font-size: 16px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .popup-cont{
      max-height: 450px;
      overflow-y: auto;
    }
  }
  .transform {
    transform: translate(-50%, -50%);
  }
  // 默认样式
  .defaultClass {
    min-height: 200px;
    min-width: 300px;
  }
  .delete-button {
    cursor: pointer;
    background-color: transparent;
    width: 18px;
    height: 18px;
    padding: 0;
    margin: 0;
    outline: none;
    border: none;
    position: absolute;
    right: 8px;
    top: 12px;
  }
  .delete-pic {
    position: relative;
    width: 2px;
    height: 18px;
    background: #333;
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
    display: inline-block;
  }
  .delete-pic:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 2px;
    height: 18px;
    background: #333;
    -webkit-transform: rotate(270deg);
    -moz-transform: rotate(270deg);
    -o-transform: rotate(270deg);
    -ms-transform: rotate(270deg);
    transform: rotate(270deg);
  }
  // 背景蒙板
  .mark-back {
    z-index: 1010;
    position: fixed;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    background-color: rgba(0, 0, 0, .3);
  }
</style>
