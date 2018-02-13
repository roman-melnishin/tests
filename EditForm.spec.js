import config from '@/config'
import i18n from '@/translations'
import { shallow, mount } from '@vue/test-utils'
import Vuex from 'vuex'
import EditForm from '@/components/edit-form/EditForm'
import userMock from '../../fixtures/userMock.json'
import productItemMock from '../../fixtures/productItemMock.json'
import productTypesMock from '../../fixtures/productTypesMock.json'
import productPlatformsMock from '../../fixtures/productPlatformsMock.json'
import productServicesMock from '../../fixtures/productServicesMock.json'
import productGamesMock from '../../fixtures/productGamesMock.json'
import productGameSeriesMock from '../../fixtures/productGameSeriesMock.json'

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
        loadProductTypes: jest.fn(() => productTypesMock),
        loadGameSeries: jest.fn(() => productGameSeriesMock)
      },
      getters: {
        getProductTypes: jest.fn(() => []),
        getUser: jest.fn(() => userMock),
        getPlatformList: jest.fn(() => productPlatformsMock),
        getServiceList: jest.fn(() => productServicesMock),
        getGameList: jest.fn(() => productGamesMock)
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
    expect(multiselectOptions.length).toBe(store.getters.getPlatformList.length)
    expect(multiselectOptions.at(0).text()).toBe(store.getters.getPlatformList[0].name)
  })

  it('Render multiservices selects', () => {
    const servicesContainer = wrapper.find('.added-service')
    const selects = servicesContainer.findAll('select')
    expect(servicesContainer.exists()).toBe(true)
    expect(selects.length).toBe(3)

    const serviceSelect = selects.at(0)
    const gameSelect = selects.at(1)
    const gameSeriesSelect = selects.at(2)
    const { multiservice } = propsData.preloaded

    // console.log(multiservice[0].service.name)
    expect(serviceSelect.find(':selected').element._value.name).toBe(multiservice[0].service.name)
    expect(gameSelect.find(':selected').element._value.name).toBe(multiservice[0].game.name)
    // console.log(wrapper.vm.selectedServices.selectedSeries)
    // console.log(wrapper.html())

    // expect(wrapper.vm.selectedServices.selectedSeries).toEqual(productGameSeriesMock)
    // wrapper.update()
    // wrapper.vm.selectedServices.selectedSeries = productGameSeriesMock
    console.log('---')
    console.log(wrapper.vm.selectedServices)
    const selectedServices = { ...wrapper.vm.selectedServices[0], selectedSeries: productGameSeriesMock }
    wrapper.setData({ selectedServices: [selectedServices] })
    console.log(wrapper.vm.selectedServices)
    console.log(wrapper.html())
    // console.log(wrapper.html())
    // console.log(multiservice[0].series.name)
    // expect(gameSeriesSelect.find(':selected').element._value.name).toBe(multiservice[0].series.name)

    // expect(serviceSelect.findAll('option').length).toBe(multiservice[0].service.name)
    // expect(gameSelect.findAll('option').length).toBe(store.getters.getGameList.length + 1)
    // expect(gameSeriesSelect.findAll('option').length).toBe(store.getters.getGameList.length + 1)

    // expect(serviceSelect.findAll('option').length).toBe(store.getters.getServiceList.length + 1)
    // expect(gameSelect.findAll('option').length).toBe(store.getters.getGameList.length + 1)
    // expect(gameSeriesSelect.findAll('option').length).toBe(store.getters.getGameList.length + 1)
  })
})
