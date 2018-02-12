import EditForm from '@/components/edit-form/EditForm'
import config from '@/config'
import i18n from '@/translations'
import { shallow } from '@vue/test-utils'
import Vuex from 'vuex'

const propsData = {
  readonly: false,
  back: function () {
    console.log('back')
  },
  preloaded: {
    'id': 729394,
    'name': 'asdasda',
    'description': 'asdsad',
    'created': '2018-02-07T08:23:53.468477Z',
    'number_of_views': 0,
    'price': '212.00',
    'product_type': {
      'id': 1,
      'name': 'Instant'
    },
    'status': 'Unapproved',
    'seller': 'Roman',
    'photo': 'https://cloud.google.com/images/products/machine-learning/ml-lead.png',
    'platforms': [
      {
        'id': 2,
        'name': 'Android',
        'department_type': 'platform'
      }
    ],
    'multiservice': [
      {
        'id': 77,
        'service': {
          'id': 2,
          'name': 'Gameaccount/Unlock All',
          'department_type': 'service'
        },
        'game': {
          'id': 3,
          'name': 'COD',
          'department_type': 'game'
        },
        'series': {
          'id': 15,
          'name': 'Advanced Warfare',
          'department_type': 'game series'
        }
      }
    ],
    'delivery_time': null,
    'total_items': 1,
    'bought_items': 0,
    'rate': 0,
    'comment': null,
    'reviews': null
  }
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
        loadProductTypes: jest.fn()
      },
      getters: {
        getProductTypes: jest.fn(() => []),
        getUser: jest.fn(),
        getPlatformList: jest.fn(),
        getServiceList: jest.fn(),
        getGameList: jest.fn()
      }
    })

    wrapper = shallow(EditForm, {
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
})
