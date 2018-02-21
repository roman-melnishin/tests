import { shallow } from '@vue/test-utils'
import i18n from '@/translations'
import DepartmentsMobile from '@/components/header/DepartmentsMobile'
import Vuex from 'vuex'
import departmentsMock from '../../fixtures/departmentsMock.json'
import departmentsParentItemMock from '../../fixtures/departmentsParentItemMock.json'

const propsData = {
  model: departmentsMock,
  level: 1
}

describe('DepartmentsMobile.spec.js', () => {
  let wrapper
  let getters = { getSearched: () => ({ q: '' }) }
  let store = new Vuex.Store({ getters })

  beforeEach(() => {
    wrapper = shallow(DepartmentsMobile, { i18n, propsData, store })
  })

  it('check default setted properties', () => {
    expect(wrapper.vm.parentItems).toEqual([])
  })

  it('check currentList setted correctly', () => {
    expect(wrapper.vm.currentList).toEqual(wrapper.vm.model)
  })

  it('render html according to curentList property', () => {
    const departments = wrapper.findAll('.department-list')
    expect(wrapper.vm.currentList.length).toBeTruthy()
    expect(departments.exists()).toBe(true)
    expect(departments.length).toBe(wrapper.vm.currentList.length)
  })

  it('render html according to parentItem property', () => {
    expect(wrapper.vm.parentItem).toBeFalsy()
    expect(wrapper.findAll('.department-parent').exists()).toBe(false)

    wrapper = shallow(DepartmentsMobile, { i18n, propsData, store, computed: { parentItem: () => departmentsParentItemMock[0] } })
    expect(wrapper.vm.parentItem).toBeTruthy()
    expect(wrapper.findAll('.department-parent').exists()).toBe(true)
  })

  it('render correct department name for department list ', () => {
    const firstDepartmentTextFromProperty = wrapper.vm.currentList[0].category_name
    const firstDepartmentTextFromHtml = wrapper.findAll('.department-list').at(0).find('.department-name').text()
    expect(firstDepartmentTextFromHtml).toBe(firstDepartmentTextFromProperty)
  })

  it('render correct department name for department parent ', () => {
    wrapper = shallow(DepartmentsMobile, { i18n, propsData, store, computed: { parentItem: () => departmentsParentItemMock[0] } })
    const categoryParentTextFromProperty = wrapper.vm.parentItem.category_name
    const categoryParentTextFromHtml = wrapper.find('.department-parent .department-name').text()
    expect(categoryParentTextFromProperty).toBe(categoryParentTextFromHtml)
  })

  it('check getAllType method', () => {
    wrapper = shallow(DepartmentsMobile, { i18n, propsData, store, computed: { parentItem: () => departmentsParentItemMock[0] } })
    expect(wrapper.vm.getAllType).toBe('All')
    expect(wrapper.vm.getAllType).toBe(wrapper.find('.department-parent .department-link').text())

    wrapper.vm.currentList[0].serviceId = '7'
    wrapper.update()
    expect(wrapper.vm.getAllType).toBe('All Services')
    expect(wrapper.vm.getAllType).toBe(wrapper.find('.department-parent .department-link').text())

    wrapper.vm.currentList[0].gameId = '24'
    wrapper.update()
    expect(wrapper.vm.getAllType).toBe('All Games')
    expect(wrapper.vm.getAllType).toBe(wrapper.find('.department-parent .department-link').text())

    wrapper.vm.currentList[0].seriesId = '2'
    wrapper.update()
    expect(wrapper.vm.getAllType).toBe('All Series')
    expect(wrapper.vm.getAllType).toBe(wrapper.find('.department-parent .department-link').text())
  })

  it('render next list only if hasChild true', () => {
    const nested = wrapper.vm.currentList.filter(item => item.children && item.children.length)
    const nextBtns = wrapper.findAll('.department-next')
    expect(nested.length).toBe(nextBtns.length)
  })

  it('handle nextList click event', () => {
    const clickedItemChildren = wrapper.vm.currentList[0].children
    const parentItemsLengthBefore = wrapper.vm.parentItems.length
    wrapper.find('.department-next').trigger('click')
    const parentItemsLengthAfter = wrapper.vm.parentItems.length
    expect(parentItemsLengthAfter).toBe(parentItemsLengthBefore + 1)
    expect(wrapper.vm.currentList).toEqual(clickedItemChildren)
  })

  it('handle prevList click event', () => {
    wrapper = shallow(DepartmentsMobile, { i18n, propsData, store, computed: { parentItem: () => departmentsParentItemMock[0] } })
    wrapper.setData({ parentItems: departmentsParentItemMock })
    const parentItemsLengthBefore = wrapper.vm.parentItems.length
    wrapper.find('.department-prev').trigger('click')
    const parentItemsLengthAfter = wrapper.vm.parentItems.length
    expect(parentItemsLengthAfter).toBe(parentItemsLengthBefore - 1)
    expect(wrapper.vm.currentList).toEqual(wrapper.vm.parentItems[0].children)

    wrapper.find('.department-prev').trigger('click')
    expect(wrapper.vm.currentList).toEqual(wrapper.vm.model)
    expect(wrapper.vm.parentItems.length).toBe(0)
  })

  it('handle emitting close event', () => {
    expect(wrapper.emitted()['close']).toBeFalsy()
    wrapper.vm.close()
    expect(wrapper.emitted()['close']).toBeTruthy()
  })

  it('check setting correct value to parentItem if parentItems is empty', () => {
    wrapper.setData({ parentItems: null })
    expect(wrapper.vm.parentItems).toBeFalsy()
    expect(wrapper.vm.parentItem).toBeFalsy()
  })
})
