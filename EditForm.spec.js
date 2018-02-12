import config from '@/config'
import i18n from '@/translations'
import { shallow, mount } from '@vue/test-utils'
import Vuex from 'vuex'
import EditForm from '@/components/edit-form/EditForm'
import productItemMock from '../../fixtures/productItemMock.json'
import productPlatformsMock from '../../fixtures/productPlatformsMock.json'

const { messages } = i18n
const propsData = {
  readonly: false,
  back: jest.fn(),
  preloaded: productItemMock.data
}

describe('EditForm.spec.js', () => {
  let wrapper
  let store

  const photoChangeSpy = jest.fn(() => {
    console.log('changing the photo')
  })

  beforeEach(() => {
    store = new Vuex.Store({
      state: {},
      actions: {
        loadProductTypes: jest.fn(),
        loadGameSeries: jest.fn()
      },
      getters: {
        getProductTypes: jest.fn(() => []),
        getUser: jest.fn(),
        getPlatformList: jest.fn(() => productPlatformsMock),
        getServiceList: jest.fn(),
        getGameList: jest.fn()
      }
    })

    wrapper = mount(EditForm, {
      i18n,
      store,
      propsData,
      methods: {
        photoChange: photoChangeSpy
      }
    })
  })

  it('render an uploaded image', () => {
    expect(wrapper.vm.good.photo).toBe(wrapper.props().preloaded.photo)
    expect(wrapper.find('.product-img').exists()).toBe(true)
  })

  it('render image by default', () => {
    const preloaded = { ...wrapper.props().preloaded, photo: null }
    wrapper = shallow(EditForm, {
      i18n,
      store,
      propsData: {
        ...propsData,
        preloaded
      }
    })

    const image = wrapper.find('.product-img')
    expect(image.exists()).toBe(true)
    expect(image.attributes().src).toBe(config.emptyImg)
  })

  it('render remove photo button', () => {
    expect(wrapper.find('.remove-photo').exists()).toBe(true)
  })

  it('don\'t render specific markup if readonly equals true', () => {
    wrapper.setProps({ readonly: true })
    expect(wrapper.find('.remove-photo').exists()).toBe(false)
    expect(wrapper.find('.product-file').exists()).toBe(false)
  })

  it('remove photo on click', () => {
    wrapper.setProps({ readonly: false })
    const button = wrapper.find('.remove-photo')
    button.trigger('click')
    expect(wrapper.vm.good.photo.length).toBe(0)
    expect(wrapper.vm.file).toBe(null)
    expect(wrapper.find('.product-img').attributes().src).toBe(config.emptyImg)
  })

  it('photo on change', () => {
    wrapper.find('input[type=file]').trigger('change')
    expect(photoChangeSpy).toBeCalled()
  })

  it('render product id input field with correct value', () => {
    const productIdInput = wrapper.find(`input[name="${messages.en.product.id}"]`)
    expect(productIdInput.exists()).toBe(true)
    expect(parseInt(productIdInput.element.value)).toBe(wrapper.vm.good.id)
  })

  it('render product date input field with correct value', () => {
    const productDateInput = wrapper.find(`input[name="${messages.en.product.date}"]`)
    expect(productDateInput.exists()).toBe(true)
    expect(productDateInput.element.value).toBe(wrapper.vm.createdFormatted)
  })

  it('render product title input field with correct value', () => {
    const productTitleInput = wrapper.find(`input[name="${messages.en.product.title}"]`)
    expect(productTitleInput.exists()).toBe(true)
    expect(productTitleInput.element.value).toBe(wrapper.vm.good.name)
  })

  it('Render multiselect with correct options', () => {
    const multiselectOptions = wrapper.findAll('.multiselect__element')
    expect(multiselectOptions.length).toBe(productPlatformsMock.length)
    expect(multiselectOptions.wrappers[0].text()).toBe(productPlatformsMock[0].name)
  })
})
