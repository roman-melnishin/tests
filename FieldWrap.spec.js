import FieldWrap from '@/components/field-wrap/FieldWrap'
import i18n from '@/translations'
import { shallow } from '@vue/test-utils'

const { messages } = i18n
const emailFieldWrapData = {
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

describe('FieldWrap.spec.js', () => {
  let wrapper = shallow(FieldWrap, {
    i18n,
    propsData: emailFieldWrapData
  })

  it('render correct label', () => {
    expect(wrapper.text()).toContain(messages.en.global.email)
    wrapper.setProps({ label: messages.en.global.password })
    expect(wrapper.text()).toContain(messages.en.global.password)
  })

  it('render appropriate fields when we have an error', () => {
    const validator = { ...wrapper.props().validator, $error: true }
    wrapper.setProps({ validator })
    expect(wrapper.classes()).toContain('form-group-invalid')
    expect(wrapper.find('.form-group-error').exists()).toBe(true)
  })

  it('render appropriate fields when we don\'t have an error', () => {
    const validator = { ...wrapper.props().validator, $error: false }
    wrapper.setProps({ validator })
    expect(wrapper.classes()).not.toContain('form-group-invalid')
    expect(wrapper.find('.form-group-error').exists()).toBe(false)
  })

  it('render appropriate fields when we have "required" option as params', () => {
    const $params = {
      ...wrapper.props().validator.$params,
      'required': {
        'type': 'required'
      }
    }

    const validator = {
      ...wrapper.props().validator,
      $params
    }

    console.log(validator)
    // console.log($params)
    // console.log(validator)
    // wrapper.setProps({ validator })
    // console.log(wrapper.html())
    // expect(wrapper.classes()).not.toContain('form-group-invalid')
    // expect(wrapper.find('.form-group-error').exists()).toBe(false)

  })

})
