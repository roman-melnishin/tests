import { shallow } from '@vue/test-utils'
import i18n from '@/translations'
import Language from '@/components/header/Language'

const propsData = {
  extraClass: 'toggler',
  type: 'drop'
}

describe('Language.spec.js', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(Language, { i18n, propsData })
    localStorage.clear()
  })

  it('render view based on type prop', () => {
    expect(wrapper.vm.type).toBe('drop')
    expect(wrapper.find('.lang-dropdown').exists()).toBe(true)
    expect(wrapper.find('.lang-mobile').exists()).toBe(false)

    wrapper = shallow(Language, { i18n, propsData: { ...propsData, type: 'li' } })
    expect(wrapper.vm.type).toBe('li')
    expect(wrapper.find('.lang-dropdown').exists()).toBe(false)
    expect(wrapper.find('.lang-mobile').exists()).toBe(true)
  })

  it('add extraClasses to language selects', () => {
    const extraClass = wrapper.vm.extraClass
    expect(extraClass.length).toBeTruthy()
    expect(wrapper.find('.lang-dropdown').classes().indexOf(extraClass) > -1).toBe(true)

    wrapper = shallow(Language, { i18n, propsData: { ...propsData, type: 'li' } })
    expect(wrapper.find('.lang-mobile').classes().indexOf(extraClass) > -1).toBe(true)
  })

  it('render lang-dropdown button with correct default language text', () => {
    expect(wrapper.find('.lang-dropdown').exists()).toBe(true)
    expect(wrapper.vm.language).toBe('en')
    expect(wrapper.find('.lang-dropdown button').text()).toBe(wrapper.vm.language.toUpperCase())

    wrapper = shallow(Language, { i18n, propsData, computed: { language: () => 'de' } })
    expect(wrapper.vm.language).toBe('de')
    expect(wrapper.find('.lang-dropdown button').text()).toBe(wrapper.vm.language.toUpperCase())
  })

  it('render correct styling css classes for lang-mobile buttons', () => {
    wrapper = shallow(Language, { i18n, propsData: { ...propsData, type: 'li' } })
    expect(wrapper.find('.lang-mobile').exists()).toBe(true)
    expect(wrapper.vm.language).toBe('en')
    expect(wrapper.find('.btn-en').classes().indexOf('btn-dark') > -1).toBe(true)
    expect(wrapper.find('.btn-de').classes().indexOf('btn-link') > -1).toBe(true)

    wrapper = shallow(Language, { i18n, propsData: { ...propsData, type: 'li' }, computed: { language: () => 'de' } })
    expect(wrapper.vm.language).toBe('de')
    expect(wrapper.find('.btn-en').classes().indexOf('btn-link') > -1).toBe(true)
    expect(wrapper.find('.btn-de').classes().indexOf('btn-dark') > -1).toBe(true)
  })

  it('handle event on click on lang-mobile buttons', () => {
    wrapper = shallow(Language, { i18n, propsData: { ...propsData, type: 'li' } })
    expect(wrapper.find('.lang-mobile').exists()).toBe(true)
    expect(wrapper.vm.language).toBe('en')
    expect(localStorage.getItem('language')).toBe(null)

    wrapper.find('.lang-mobile .btn-de').trigger('click')
    expect(localStorage.getItem('language')).toBe('de')

    wrapper.find('.lang-mobile .btn-en').trigger('click')
    expect(localStorage.getItem('language')).toBe('en')
  })

  it('handle event on click on lang-dropdown buttons', () => {
    expect(wrapper.find('.lang-dropdown').exists()).toBe(true)
    expect(wrapper.vm.language).toBe('en')
    expect(localStorage.getItem('language')).toBe(null)

    wrapper.find('.lang-dropdown .btn-en').trigger('click')
    expect(localStorage.getItem('language')).toBe('en')

    wrapper.find('.lang-dropdown .btn-de').trigger('click')
    expect(localStorage.getItem('language')).toBe('de')
  })
})
