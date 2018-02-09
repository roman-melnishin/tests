import FieldAsync from '@/components/field-wrap/FieldAsync'
import i18n from '@/translations'
import { shallow } from '@vue/test-utils'

const userNameData = {
  delayedValidator: {
    $dirty: true,
    $error: true,
    $invalid: false,
    $params: {
      uniqueName: {
        type: 'uniqueName'
      }
    },
    $pending: false,
    uniqueName: true
  },
  isDelayed: false,
  label: 'Username',
  showSuccessIcon: true,
  validator: {
    required: true,
    username: true,
    $dirty: true,
    $error: false,
    $invalid: false,
    $params: {
      'username': {
        'type': 'username'
      }
    },
    $pending: false
  }
}

describe('FieldAsync.spec.js', () => {
  let wrapper = shallow(FieldAsync, { i18n, propsData: userNameData })

  it('render a view depending on showSuccessIcon param', () => {
    expect(wrapper.find('svg').exists()).toBe(true)

    wrapper.setProps({ showSuccessIcon: false })
    expect(wrapper.find('svg').exists()).toBe(false)
  })

  it('render a view depending on label param', () => {
    expect(wrapper.find('.form-group-label').exists()).toBe(true)
    expect(wrapper.text()).toContain(userNameData.label)

    wrapper.setProps({ label: '' })
    expect(wrapper.find('.form-group-label').exists()).toBe(false)
  })

  it('render a view depending on validator.$params required param', () => {
    wrapper.setProps({ label: 'Username' })
    expect(wrapper.html()).not.toContain('<span class="required">*</span>')

    const $params = { ...wrapper.props().validator.$params, 'required': { 'type': 'required' } }
    const validator = { ...wrapper.props().validator, $params }
    wrapper.setProps({ validator })
    expect(wrapper.html()).toContain('<span class="required">*</span>')
  })

  it('render a view depending on validator and delayedValidator $error param', () => {
    let validator, delayedValidator

    delayedValidator = { ...wrapper.props().delayedValidator, $error: false }
    wrapper.setProps({ delayedValidator })
    expect(wrapper.classes()).not.toContain('form-group-invalid')
    expect(wrapper.find('.form-group-error').exists()).toBe(false)

    validator = { ...wrapper.props().validator, $error: true }
    wrapper.setProps({ validator })
    expect(wrapper.classes()).toContain('form-group-invalid')
    expect(wrapper.find('.form-group-error').exists()).toBe(true)

    validator = { ...wrapper.props().validator, $error: false }
    wrapper.setProps({ validator })
    expect(wrapper.classes()).not.toContain('form-group-invalid')
    expect(wrapper.find('.form-group-error').exists()).toBe(false)

    delayedValidator = { ...wrapper.props().delayedValidator, $error: true }
    wrapper.setProps({ delayedValidator })
    expect(wrapper.classes()).toContain('form-group-invalid')
    expect(wrapper.find('.form-group-error').exists()).toBe(true)
  })
})
