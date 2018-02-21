import { shallow } from '@vue/test-utils'
import i18n from '@/translations'
import Departments from '@/components/header/Departments'
import Vuex from 'vuex'
import departmentsMock from '../../fixtures/departmentsMock.json'

const propsData = {
  model: departmentsMock,
  level: 1
}

describe('Departments.spec.js', () => {
  let wrapper
  let getters = { getSearched: () => ({ q: '' }) }
  let store = new Vuex.Store({ getters })

  beforeEach(() => {
    wrapper = shallow(Departments, { i18n, propsData, store })
  })

  it('handle emit close departments event', () => {
    expect(wrapper.emitted()['close']).toBeFalsy()
    wrapper.vm.close()
    expect(wrapper.emitted()['close']).toBeTruthy()
  })

  it('render correct department name', () => {
    const firstDepartmentNameInProperty = wrapper.vm.model[0].category_name
    const firstDepartmentNameInText = wrapper.findAll('.departments-list').at(0).findAll('.department-name').at(0).text()
    expect(firstDepartmentNameInProperty).toBe(firstDepartmentNameInText)
  })

  it('render correct inner department sub list', () => {
    const firstDepartmentInnerListLengthInProperty = wrapper.vm.model[0].children.length
    const firstDepartmentInnerListLengthInHtml = wrapper.findAll('.departments-list').at(0).findAll('.sub-list-1').at(0).element.children.length
    expect(firstDepartmentInnerListLengthInProperty).toBe(firstDepartmentInnerListLengthInHtml)
  })

  it('render correct inner department sub list class', () => {
    const recursiveDropdownsSearch = (acumStart = 1, array) => {
      return array.reduce((acum, item) => {
        if (item.children && item.children.length) {
          acum++
          return recursiveDropdownsSearch(acum, item.children)
        }
        return acum
      }, acumStart)
    }

    const nestedDropdownsQuantityFromJSON = recursiveDropdownsSearch(1, wrapper.vm.model[0].children)
    expect(wrapper.findAll('.departments-list').at(0).find(`.sub-list-${nestedDropdownsQuantityFromJSON}`).exists()).toBe(true)
    expect(wrapper.findAll('.departments-list').at(0).find(`.sub-list-${nestedDropdownsQuantityFromJSON + 1}`).exists()).toBe(false)
  })
})
