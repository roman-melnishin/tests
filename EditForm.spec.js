import config from '@/config'
import i18n from '@/translations'
import { mount } from '@vue/test-utils'
import Vue from 'vue'
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

  const photoChange = jest.fn()
  const selectGame = jest.fn()

  beforeEach(() => {
    store = new Vuex.Store({
      state: {},
      actions: {
        loadProductTypes: jest.fn(() => productTypesMock)
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
        photoChange,
        selectGame
      }
    })
  })

  it('render an uploaded image', () => {
    expect(wrapper.vm.good.photo).toBe(wrapper.props().preloaded.photo)
    expect(wrapper.find('.product-img').exists()).toBe(true)
  })

  it('render image by default', () => {
    wrapper.vm.good.photo = null

    Vue.nextTick(() => {
      const image = wrapper.find('.product-img')
      expect(image.exists()).toBe(true)
      expect(image.attributes().src).toBe(config.emptyImg)
    })
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
    expect(photoChange).toBeCalled()
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
  })

  it('Fill multiservices selects with existing product data', () => {
    const selects = wrapper.findAll('.added-service select')
    const serviceSelect = selects.at(0)
    const gameSelect = selects.at(1)
    const gameSeriesSelect = selects.at(2)
    const multiservice = propsData.preloaded.multiservice[0]
    const selectedServices = { ...wrapper.vm.selectedServices[0], selectedSeries: productGameSeriesMock }
    wrapper.setData({ selectedServices: [selectedServices] })
    expect(serviceSelect.find(':selected').element._value.name).toBe(multiservice.service.name)
    expect(gameSelect.find(':selected').element._value.name).toBe(multiservice.game.name)
    expect(gameSeriesSelect.find(':selected').element._value.name).toBe(multiservice.series.name)
  })

  it('Fill multiservices selects without existing product data', () => {
    wrapper.vm.selectedServices = [{ service: null, game: null, series: null, selectedSeries: [] }]

    Vue.nextTick(() => {
      const selects = wrapper.findAll('.added-service select')
      const serviceSelect = selects.at(0)
      const gameSelect = selects.at(1)
      const gameSeriesSelect = selects.at(2)

      expect(serviceSelect.element.options.length).toBe(store.getters.getServiceList.length + 1)
      expect(gameSelect.element.options.length).toBe(store.getters.getGameList.length + 1)
      expect(gameSeriesSelect.element.options.length).toBe(1)
    })
  })

  it('selectGame method occurs when game select change', () => {
    const gameSelect = wrapper.findAll('.added-service select').at(1)
    gameSelect.trigger('change')
    expect(selectGame).toBeCalled()
  })

  it('render multiservice selects with/without disabled attribute', () => {
    const selects = wrapper.findAll('.added-service select')
    const serviceSelect = selects.at(0)
    const gameSelect = selects.at(1)
    const gameSeriesSelect = selects.at(2)

    expect(wrapper.vm.selectedPlatforms.length).toBeTruthy()
    expect(serviceSelect.attributes().disabled).not.toBeTruthy()
    expect(gameSeriesSelect.attributes().disabled).not.toBeTruthy()
    expect(gameSelect.attributes().disabled).not.toBeTruthy()

    wrapper.setData({ selectedPlatforms: [] })
    expect(wrapper.vm.selectedPlatforms.length).not.toBeTruthy()
    expect(serviceSelect.attributes().disabled).toBeTruthy()
    expect(gameSeriesSelect.attributes().disabled).toBeTruthy()
    expect(gameSelect.attributes().disabled).toBeTruthy()
  })
})
