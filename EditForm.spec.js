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
import productSelectedServicesMock from '../../fixtures/productSelectedServicesMock.json'

const { messages } = i18n
const propsData = {
  readonly: false,
  back: jest.fn(),
  preloaded: productItemMock.data
}

describe('EditForm.spec.js', () => {
  let wrapper
  let store
  let actions
  let getters

  const photoChange = jest.fn()
  const selectGame = jest.fn()
  const returnBack = jest.fn()
  const saveGood = jest.fn()

  beforeEach(() => {
    actions = {
      loadProductTypes: jest.fn(() => productTypesMock),
      setProductType: jest.fn(),
      loadCategoryForProduct: jest.fn()
    }

    getters = {
      getProductTypes: () => [],
      getUser: () => userMock,
      getPlatformList: () => productPlatformsMock,
      getServiceList: () => productServicesMock,
      getGameList: () => productGamesMock
    }

    store = new Vuex.Store({
      state: {},
      actions,
      getters
    })

    wrapper = mount(EditForm, {
      stubs: {
        ValuableData: '<div>ValuableData component stub</div>'
      },
      i18n,
      store,
      propsData,
      methods: {
        photoChange,
        selectGame,
        returnBack,
        saveGood
      }
    })
  })

  it('calls store action "loadProductTypes" when component creates', () => {
    expect(actions.loadProductTypes).toHaveBeenCalled()
  })

  it('calls store action "setProductType" and "loadCategoryForProduct" when type changes', () => {
    wrapper.setData({
      type: {
        'id': 1,
        'name': 'Instant'
      }
    })
    expect(actions.setProductType).toHaveBeenCalled()
    expect(actions.loadCategoryForProduct).toHaveBeenCalled()
  })

  it('set correct data to selectedPlatforms', () => {
    expect(wrapper.props().preloaded.platforms).toEqual(wrapper.vm.selectedPlatforms)
  })

  it('set correct data to selectedServices', () => {
    expect(wrapper.props().preloaded.multiservice).toEqual(wrapper.vm.selectedServices)
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

  it('Fill multiservices selects without data', () => {
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

  it('render/don\'t render remove service button', () => {
    expect(wrapper.find('.remove-icon').exists()).toBe(false)

    wrapper.setData({
      selectedServices: productSelectedServicesMock.few,
      type: {
        'id': 1,
        'name': 'Instant'
      },
      readonly: true
    })
    expect(wrapper.find('.remove-icon').exists()).toBe(false)

    wrapper.setData({ readonly: false })
    expect(wrapper.find('.remove-icon').exists()).toBe(true)
  })

  it('handle remove service action on click', () => {
    wrapper.setData({
      selectedServices: productSelectedServicesMock.few,
      type: {
        'id': 1,
        'name': 'Instant'
      }
    })
    expect(wrapper.findAll('.remove-icon').length).toBe(productSelectedServicesMock.few.length)

    wrapper.findAll('.remove-icon').at(0).trigger('click')
    expect(wrapper.findAll('.remove-icon').length).toBe(productSelectedServicesMock.few.length - 1)

    wrapper.findAll('.remove-icon').at(0).trigger('click')
    expect(wrapper.find('.remove-icon').exists()).toBe(false)
  })

  it('render/don\'t render add service block', () => {
    expect(wrapper.find('.add-service').exists()).toBe(true)

    wrapper.setData({ selectedPlatforms: [] })
    expect(wrapper.find('.add-service').exists()).toBe(false)
  })

  it('render/don\'t render add service button', () => {
    wrapper.setData({
      selectedServices: productSelectedServicesMock.many,
      type: {
        'id': 1,
        'name': 'Instant'
      }
    })
    expect(wrapper.find('.add-service a').exists()).toBe(false)

    wrapper.setData({ selectedServices: productSelectedServicesMock.few })
    expect(wrapper.find('.add-service a').exists()).toBe(true)

    wrapper.setData({ readonly: true })
    expect(wrapper.find('.add-service a').exists()).toBe(false)

    wrapper.setData({ readonly: false })
    expect(wrapper.find('.add-service a').exists()).toBe(true)
  })

  it('handle add service action on click', () => {
    wrapper.setData({
      selectedServices: productSelectedServicesMock.few,
      type: {
        'id': 1,
        'name': 'Instant'
      }
    })
    const selectedServicesBefore = wrapper.vm.selectedServices.length
    const addedServicesBlockBefore = wrapper.findAll('.added-service').length
    wrapper.find('.add-service a').trigger('click')
    expect(wrapper.vm.selectedServices.length).toBe(selectedServicesBefore + 1)
    expect(wrapper.findAll('.added-service').length).toBe(addedServicesBlockBefore + 1)
  })

  it('on click back button', () => {
    wrapper.find('.btn-back').trigger('click')
    expect(returnBack).toBeCalled()
  })

  it('render correct back button text', () => {
    expect(wrapper.find('.btn-back').text()).toBe(messages.en.global.cancel)

    wrapper.setData({ readonly: true })
    expect(wrapper.find('.btn-back').text()).toBe(messages.en.global.close)
  })

  it('show or hide save button', () => {
    wrapper.setData({ readonly: false, valDataMode: '' })
    expect(wrapper.find('.btn-save').element.style._values.display).not.toBe('none')

    wrapper.setData({ readonly: true, valDataMode: 'edit' })
    expect(wrapper.find('.btn-save').element.style._values.display).not.toBe('none')

    wrapper.setData({ valDataMode: '' })
    expect(wrapper.find('.btn-save').element.style._values.display).toBe('none')
  })

  it('on click save button', () => {
    wrapper.find('.btn-save').trigger('click')
    expect(returnBack).toBeCalled()
  })
})
