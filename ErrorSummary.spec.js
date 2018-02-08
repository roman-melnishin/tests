import ErrorSummary from '@/components/error-summary/ErrorSummary'
import i18n from '@/translations'
import { shallow } from '@vue/test-utils'

describe('ErrorSummary.spec.js', () => {
  let wrapper = shallow(ErrorSummary, { i18n })

  it('render error case 1', () => {
    const errorData = {
      serverError: {
        body: {
          errorText: 'Error text for case 1',
          errorName: 'Error name for case 1'
        }
      }
    }

    wrapper.setProps(errorData)
    expect(wrapper.text()).toContain('Error text for case 1')
  })

  it('render error case 2', () => {
    const errorData = {
      serverError: {
        statusText: 'Error text for case 2'
      }
    }

    wrapper.setProps(errorData)
    expect(wrapper.text()).toContain('Error text for case 2')
  })

  it('render error case 3', () => {
    const errorData = {
      serverError: {
        status: 'Error status for case 3',
        statusText: 'Error text for case 3'
      }
    }

    wrapper.setProps(errorData)
    expect(wrapper.text()).toContain('Error text for case 3')
  })

  it('render error case 4', () => {
    const errorData = {
      serverError: {
        body: ['Error text 1 for case 4', 'Error text 2 for case 4']
      }
    }

    wrapper.setProps(errorData)
    expect(wrapper.text()).toContain('Error text 1 for case 4')
  })
})
