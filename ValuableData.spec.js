import ValuableData from '@/components/edit-form/ValuableData'
import i18n from '@/translations'
import { mount } from '@vue/test-utils'

const changeFile = jest.fn()
const parseFile = jest.fn()

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
    wrapper = mount(ValuableData, {
      i18n,
      propsData: newProductPropsData,
      methods: {
        changeFile,
        parseFile
      }
    })
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

    const value = { ...wrapper.vm.value, array: [] }
    wrapper = mount(ValuableData, { i18n, propsData: { ...newProductPropsData, value } })
    expect(wrapper.vm.quantity).toBe(1)
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

  it('render valuable data textarea for each item in manualList', () => {
    expect(wrapper.findAll('.valuable-data textarea').length).toBe(wrapper.vm.manualList.length)
    wrapper = mount(ValuableData, { i18n, propsData: existingProductPropsData })
    expect(wrapper.findAll('.valuable-data textarea').length).toBe(wrapper.vm.manualList.length)
  })

  it('check possibility to edit valuable data textarea', () => {
    expect(wrapper.find('.valuable-data textarea').attributes().readonly).not.toBeTruthy()
    wrapper.setData({ readonly: true })
    expect(wrapper.find('.valuable-data textarea').attributes().readonly).toBeTruthy()
    wrapper.setData({ valDataMode: 'edit' })
    expect(wrapper.find('.valuable-data textarea').attributes().readonly).not.toBeTruthy()
  })

  it('check content of valuable data textarea', () => {
    wrapper = mount(ValuableData, { i18n, propsData: existingProductPropsData })
    const valuableDataTextarea = wrapper.findAll('.valuable-data textarea')
    wrapper.vm.manualList.forEach((item, index) => {
      expect(item.content === valuableDataTextarea.at(index).element.value)
    })
  })

  it('check existance of remove valuable data textarea button', () => {
    expect(wrapper.find('.remove-valuable-data').exists()).toBe(false)
    wrapper = mount(ValuableData, { i18n, propsData: existingProductPropsData })
    expect(wrapper.find('.remove-valuable-data').exists()).toBe(true)
    expect(wrapper.findAll('.remove-valuable-data').length).toBe(wrapper.vm.manualList.length)
    wrapper.setData({ readonly: true })
    expect(wrapper.find('.remove-valuable-data').exists()).toBe(false)
  })

  it('remove specific valuable data textarea on click', () => {
    wrapper = mount(ValuableData, { i18n, propsData: existingProductPropsData })
    const valuableDataTextareaLengthBefore = wrapper.findAll('.valuable-data textarea').length
    const contentOfSpecificTextarea = wrapper.findAll('.valuable-data textarea').at(1)

    wrapper.findAll('.remove-valuable-data').at(1).trigger('click')
    const valuableDataTextareaLengthAfter = wrapper.findAll('.valuable-data textarea').length
    expect(wrapper.findAll('.valuable-data textarea').at(1).element.value).not.toBe(contentOfSpecificTextarea)
    expect(valuableDataTextareaLengthAfter).toBe(valuableDataTextareaLengthBefore - 1)
  })

  it('handle spy change event', () => {
    wrapper.setData({ inputMode: 'fromFile' })
    wrapper.find('.fromFile-view input[type=file]').trigger('change')
    expect(changeFile).toBeCalled()
  })

  it('render correct input for linesPerItem', () => {
    wrapper.setData({ inputMode: 'fromFile' })
    expect(parseInt(wrapper.find('.lines-field').element.value)).toBe(wrapper.vm.linesPerItem)
    expect(wrapper.find('.lines-field').attributes().readonly).not.toBeTruthy()
    wrapper.setData({ readonly: true })
    expect(wrapper.find('.lines-field').attributes().readonly).toBeTruthy()
  })

  it('render correct button parse file', () => {
    wrapper.setData({ inputMode: 'fromFile' })
    expect(wrapper.find('.btn-parse-file').exists()).toBe(true)
    expect(wrapper.find('.btn-parse-file').attributes().disabled).toBeTruthy()
    const value = { ...wrapper.vm.value, file: [{ 'name': 'file_name', 'size': 12345 }] }
    wrapper.setData({ value })
    expect(wrapper.find('.btn-parse-file').attributes().disabled).not.toBeTruthy()
  })

  it('handle spy click on button parse file', () => {
    wrapper.setData({ inputMode: 'fromFile' })
    wrapper.find('.btn-parse-file').trigger('click')
    expect(parseFile).toBeCalled()
  })

  it('check watcher by changing dirty prop', () => {
    wrapper.setData({ dirty: true })
    expect(wrapper.vm.dirty).toBe(true)
    wrapper.setData({ dirty: false })
    expect(wrapper.vm.dirty).toBe(false)
  })

  it('check quantity watcher when we add quantity', (done) => {
    let number = 1
    const manualListLengthBefore = wrapper.vm.manualList.length
    wrapper.setData({ quantity: wrapper.vm.quantity + number, dirty: true })
    const manualListLengthAfter = wrapper.vm.manualList.length
    expect(manualListLengthAfter).toBe(manualListLengthBefore + number)

    number = 13
    wrapper.setData({ quantity: wrapper.vm.quantity + number })
    setTimeout(() => {
      expect(wrapper.vm.quantity).toBe(10)
      expect(wrapper.vm.manualList.length).toBe(10)
      done()
    }, 50)
  })

  it('check quantity watcher when we reduce quantity', () => {
    wrapper = mount(ValuableData, { i18n, propsData: existingProductPropsData })
    const number = 1
    const manualListLengthBefore = wrapper.vm.manualList.length
    wrapper.setData({ quantity: wrapper.vm.quantity - number })
    const manualListLengthAfter = wrapper.vm.manualList.length
    expect(manualListLengthAfter).toBe(manualListLengthBefore - number)
  })
})
