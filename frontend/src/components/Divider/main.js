export default {
  functional: true,

  name: 'ElDivider1',

  props: {
    direction: {
      type: String,
      default: 'horizontal',
      validator(val) {
        return ['horizontal', 'vertical'].indexOf(val) !== -1
      }
    },

    contentPosition: {
      type: String,
      default: 'center',
      validator(val) {
        return ['left', 'center', 'right'].indexOf(val) !== -1
      }
    },

    content: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: ''
    },
    click: {
      type: Function,
      default: null
    }
  },

  render(h, context) {
    const $slots = context.slots()
    const { direction, contentPosition, content, color, click } = context.props
    return (
      <div class={['el-divider', `el-divider--${direction}`]} >
        {
          <div on-click={() => { click && click() }} style={{ 'color': color, 'cursor': click && 'pointer' }} class={['el-divider__text', `is-${contentPosition}`]}>{$slots.default || content}</div>
        }
      </div>
    )
  }
}
