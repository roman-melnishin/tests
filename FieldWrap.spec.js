import FieldWrap from '@/components/field-wrap/FieldWrap'
import i18n from '@/translations'
import { shallow } from '@vue/test-utils'

const emailData = {
  label: 'Email',
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
  let wrapper = shallow(FieldWrap, { i18n, propsData: emailData })

  it('render a view depending on label param', () => {
    expect(wrapper.find('.form-group-label').exists()).toBe(true)
    expect(wrapper.text()).toContain(emailData.label)

    wrapper.setProps({ label: '' })
    expect(wrapper.find('.form-group-label').exists()).toBe(false)
  })

  it('render a view depending on validator $error param', () => {
    expect(wrapper.classes()).not.toContain('form-group-invalid')
    expect(wrapper.find('.form-group-error').exists()).toBe(false)

    const validator = { ...wrapper.props().validator, $error: true }
    wrapper.setProps({ validator })
    expect(wrapper.classes()).toContain('form-group-invalid')
    expect(wrapper.find('.form-group-error').exists()).toBe(true)
  })

  it('render a view depending on validator.$params required param', () => {
    wrapper.setProps({ label: 'Email' })
    expect(wrapper.html()).not.toContain('<span class="required">*</span>')

    const $params = { ...wrapper.props().validator.$params, 'required': { 'type': 'required' } }
    const validator = { ...wrapper.props().validator, $params }
    wrapper.setProps({ validator })
    expect(wrapper.html()).toContain('<span class="required">*</span>')
  })
})
