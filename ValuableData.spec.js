import ValuableData from '@/components/edit-form/ValuableData'
import i18n from '@/translations'
import { mount } from '@vue/test-utils'

const newProductPropsData = {
  dirty: false,
  isNew: true,
  readonly: false,
  totalItems: undefined,
  valDataMode: undefined,
  value: {
    $invalid: true,
    array: [{ content: '' }],
    file: null
  }
}

const existingProductPropsData = {
  dirty: false,
  isNew: false,
  readonly: false,
  totalItems: 3,
  valDataMode: undefined,
  value: {
    $invalid: true,
    array: [
      {
        content: 'sdf',
        id: 5,
        product: 729395,
        status: 1
      },
      {
        content: 'dfsffff',
        id: 6,
        product: 729395,
        status: 1
      },
      {
        content: 'fffdsdf',
        id: 7,
        product: 729395,
        status: 1
      }
    ],
    file: null
  }
}

describe('ValuableData.spec.js', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(ValuableData, { i18n, propsData: newProductPropsData })
  })

  it('render according to isNew property', () => {
    expect(wrapper.find('.radio-field').exists()).toBe(true)
    wrapper.setData({ isNew: false })
    expect(wrapper.find('.radio-field').exists()).toBe(false)
  })

  it('toggle product creation radio buttons', () => {
    expect(wrapper.find('input[value=manual]').is(':checked')).toBe(true)
    expect(wrapper.find('input[value=manual]').element.value).toBe(wrapper.vm.inputMode)

    wrapper.find('input[value=fromFile]').trigger('click')
    expect(wrapper.find('input[value=fromFile]').is(':checked')).toBe(true)
    expect(wrapper.find('input[value=fromFile]').element.value).toBe(wrapper.vm.inputMode)
  })

  it('render specific markup according to inputMode param', () => {
    expect(wrapper.find('.manual-view').exists()).toBe(true)
    expect(wrapper.find('.fromFile-view').exists()).toBe(false)

    wrapper.setData({ inputMode: 'fromFile' })
    expect(wrapper.vm.inputMode).toBe('fromFile')
    expect(wrapper.find('.manual-view').exists()).toBe(false)
    expect(wrapper.find('.fromFile-view').exists()).toBe(true)
  })

  it('render specific markup according to valDataMode param', () => {
    expect(wrapper.find('.quantity-input').exists()).toBe(true)
    expect(wrapper.find('.quantity-view').exists()).toBe(false)

    wrapper.setData({ valDataMode: 'edit' })
    expect(wrapper.vm.valDataMode).toBeTruthy()
    expect(wrapper.find('.quantity-input').exists()).toBe(false)
    expect(wrapper.find('.quantity-view').exists()).toBe(true)
  })

  it('render quantity input field with correct initial value', () => {
    expect(wrapper.props().value.array.length).toBe(wrapper.vm.quantity)
    expect(wrapper.vm.quantity).toBe(parseInt(wrapper.find('.quantity-input').element.value))

    wrapper = mount(ValuableData, { i18n, propsData: existingProductPropsData })
    expect(wrapper.props().value.array.length).toBe(wrapper.vm.quantity)
    expect(wrapper.vm.quantity).toBe(parseInt(wrapper.find('.quantity-input').element.value))
  })

  it('render correct value of quantity and totalItems', () => {
    wrapper = mount(ValuableData, { i18n, propsData: { ...existingProductPropsData, valDataMode: 'edit' } })
    const numbers = wrapper
      .find('.quantity-view')
      .text()
      .split(' ')
      .filter(item => parseInt(item))
      .map(item => parseInt(item))

    expect(numbers[0]).toBe(wrapper.vm.quantity)
    expect(numbers[1]).toBe(wrapper.vm.totalItems)
  })
})
