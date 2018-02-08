import FieldWrap from '@/components/field-wrap/FieldWrap'
import i18n from '@/translations'
import { shallow } from '@vue/test-utils'

const { messages } = i18n
const emailData = {
  label: messages.en.global.email,
  validator: {
    'required': true,
    'email': false,
    '$invalid': false,
    '$dirty': false,
    '$error': false,
    '$pending': false,
    '$params': {
      'email': {
        'type': 'email'
      }
    }
  }
}

const bicData = {
  label: messages.en.global.last_name,
  validator: {
    'required': true,
    'lastName': false,
    '$invalid': false,
    '$dirty': false,
    '$error': true,
    '$pending': false,
    '$params': {
      'lastName': {
        'type': 'lastName'
      },
      'required': {
        'type': 'required'
      }
    }
  }
}

describe('FieldWrap.spec.js', () => {
  let wrapper = shallow(FieldWrap, { i18n, propsData: emailData })

  it('render correct label', () => {
    expect(wrapper.find('.form-group-label').exists()).toBe(true)
    expect(wrapper.text()).toContain(messages.en.global.email)
  })

  it('don\'t render label content if label property is empty', () => {
    expect(wrapper.find('.form-group-label').exists()).toBe(true)
    wrapper.setProps({ label: '' })
    expect(wrapper.find('.form-group-label').exists()).toBe(false)
  })

  it('render appropriate fields when we have an error', () => {
    const validator = { ...wrapper.props().validator, $error: true }
    wrapper.setProps({ validator })
    expect(wrapper.classes()).toContain('form-group-invalid')
    expect(wrapper.find('.form-group-error').exists()).toBe(true)
  })

  it('don\'t render error fields when we don\'t have an error', () => {
    const validator = { ...wrapper.props().validator, $error: false }
    wrapper.setProps({ validator })
    expect(wrapper.classes()).not.toContain('form-group-invalid')
    expect(wrapper.find('.form-group-error').exists()).toBe(false)
  })

  it('render appropriate fields when we have "required" option as params', () => {
    const $params = { ...wrapper.props().validator.$params, 'required': { 'type': 'required' } }
    const validator = { ...wrapper.props().validator, $params }
    wrapper.setProps({ label: messages.en.global.email, validator })
    expect(wrapper.html()).toContain('<span class="required">*</span>')
  })

  it('render specific error fields for different type of fields', () => {
    let validator = { ...wrapper.props().validator, $error: true }
    wrapper.setProps({ validator })
    expect(wrapper.find('.form-group-error').exists()).toBe(true)
    expect(wrapper.text()).toContain(messages.en.validation.email)

    wrapper = shallow(FieldWrap, { i18n, propsData: bicData })
    expect(wrapper.text()).toContain(messages.en.validation.letters_and_spaces)

    validator = { ...wrapper.props().validator, lastName: true }
    wrapper.setProps({ validator })
    expect(wrapper.text()).not.toContain(messages.en.validation.letters_and_spaces)
  })
})
