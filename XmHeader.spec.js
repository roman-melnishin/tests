import { shallow } from '@vue/test-utils'
import i18n from '@/translations'
import XmHeader from '@/components/header/XmHeader'
import Vue from 'vue'
import Vuex from 'vuex'
import userMock from '../../fixtures/userMock.json'
import departmentsMock from '../../fixtures/departmentsMock.json'

const showLogin = jest.fn()
const logout = jest.fn()
const search = jest.fn()
const beforeDestroy = jest.fn()

describe('XmHeader.spec.js', () => {
  let wrapper
  let store
  let actions
  let getters
  let stubs

  beforeEach(() => {
    actions = {
      loadDepartments: jest.fn(() => departmentsMock)
    }

    getters = {
      getCartListLength: () => 0,
      getUser: () => userMock,
      getDepartmentsTree: () => departmentsMock,
      getOnlySubtotal: () => 0,
      getSearched: () => {}
    }

    store = new Vuex.Store({
      state: {},
      actions,
      getters
    })

    stubs = {
      Departments: '<div class="departments-test">departments component stub</div>',
      DepartmentsTablet: '<div class="departments-tablet-test">departments tablet component stub</div>',
      DepartmentsMobile: '<div class="departments-mobile-test">departments mobile component stub</div>',
      RouterLink: '<div>router link stub</div>'
    }

    wrapper = shallow(XmHeader, {
      stubs,
      i18n,
      store,
      methods: { showLogin, logout, search },
      beforeDestroy
    })
  })

  it('render/don\'t render cart indication with correct number', () => {
    expect(wrapper.vm.cartItems).toBe(0)
    expect(wrapper.findAll('.cart-indication').wrappers).toEqual([])

    store.hotUpdate({
      getters: {
        ...getters,
        getCartListLength: () => 3
      }
    })
    wrapper.update()
    expect(wrapper.vm.cartItems).toBe(3)
    const cartIndicators = wrapper.findAll('.cart-indication')
    expect(cartIndicators.exists()).toBe(true)
    cartIndicators.wrappers.forEach(cart => expect(cart.text()).toContain(3))
  })

  it('render relevant dropdown menus based on user logged or not', (done) => {
    expect(wrapper.vm.user).toBeTruthy()
    let userMenus = wrapper.findAll('.user-menu')
    userMenus.wrappers.forEach(menu => expect(menu.findAll('.user-item').length).toBeTruthy())
    const loggedUserMenuItemsQuantityArray = userMenus.wrappers.map(menu => menu.findAll('.user-item').length)
    expect(new Set(loggedUserMenuItemsQuantityArray).size).toBe(1)

    store.hotUpdate({
      getters: {
        ...getters,
        getUser: () => { }
      }
    })
    expect(wrapper.vm.user).not.toBeTruthy()
    Vue.nextTick(() => {
      userMenus = wrapper.findAll('.user-menu')
      userMenus.wrappers.forEach(menu => expect(menu.findAll('.guest-item').length).toBeTruthy())
      const guestUserMenuItemsQuantityArray = userMenus.wrappers.map(menu => menu.findAll('.guest-item').length)
      expect(new Set(guestUserMenuItemsQuantityArray).size).toBe(1)
      done()
    })
  })

  it('check /dashboard link availability in user menus if user logged', () => {
    const mainMenu = wrapper.find('.main-menu')
    const userMenus = mainMenu.findAll('.user-menu')
    expect(mainMenu.findAll('[href="/dashboard"]').length).toBe(userMenus.length)
  })

  it('check another core links availability', () => {
    const navbar = wrapper.find('.top-navbar')
    expect(navbar.find('[href="/privacypolicy"]').exists()).toBe(true)
    expect(navbar.find('[href="/imprint"]').exists()).toBe(true)
    expect(navbar.find('[href="/help"]').exists()).toBe(true)
    expect(navbar.find('[href="/conditions"]').exists()).toBe(true)
    expect(wrapper.find('[href="/cart"]').exists()).toBe(true)
  })

  it('show user name if logged', () => {
    const firstName = wrapper.vm.user.first_name
    const lastName = wrapper.vm.user.last_name
    let userMenuText = wrapper.find('.user-menu-text').text()
    expect(userMenuText.indexOf(firstName) > -1).toBe(true)
    expect(userMenuText.indexOf(lastName) > -1).toBe(true)
  })

  it('check default values for searchText, showDepartments and showDepartmentsMobile', () => {
    expect(wrapper.vm.searchText).toBe('')
    expect(wrapper.vm.showDepartments).toBe(false)
    expect(wrapper.vm.showDepartmentsMobile).toBe(false)
  })

  it('handle spy click on showLogin button', () => {
    const showLoginButtons = wrapper.findAll('.show-login-btn')
    showLoginButtons.wrappers.forEach(button => {
      button.trigger('click')
      expect(showLogin).toBeCalled()
    })
  })

  it('handle emitted event on registration button', () => {
    expect(wrapper.emitted()['registration::start']).toBeFalsy()
    wrapper.vm.startRegistration()
    expect(wrapper.emitted()['registration::start']).toBeTruthy()
  })

  it('handle spy click on logout button', () => {
    const logoutButtons = wrapper.findAll('.show-login-btn')
    logoutButtons.wrappers.forEach(button => {
      button.trigger('click')
      expect(logout).toBeCalled()
    })
  })

  it('render/don\'t render departments block according to tree length', () => {
    expect(wrapper.vm.tree.length).toBeTruthy()
    expect(wrapper.find('#departmentsMobile').exists()).toBe(true)
    expect(wrapper.find('.departments-main-list').exists()).toBe(true)

    store.hotUpdate({
      getters: {
        ...getters,
        getDepartmentsTree: () => []
      }
    })
    expect(wrapper.vm.tree.length).toBeFalsy()
    wrapper.update()
    expect(wrapper.find('#departmentsMobile').exists()).toBe(false)
    expect(wrapper.find('.departments-main-list').exists()).toBe(false)
  })

  it('render departments list according to isTouchDevice param', () => {
    expect(wrapper.vm.isTouchDevice).toBe(false)
    expect(wrapper.find('.departments-test').exists()).toBe(true)
    expect(wrapper.find('.departments-tablet-test').exists()).toBe(false)

    wrapper = shallow(XmHeader, {
      stubs,
      i18n,
      store,
      computed: {
        isTouchDevice: () => true
      }
    })
    expect(wrapper.vm.isTouchDevice).toBe(true)
    expect(wrapper.find('.departments-test').exists()).toBe(false)
    expect(wrapper.find('.departments-tablet-test').exists()).toBe(true)
  })

  it('check visibility of departments according to showDepartments param', () => {
    expect(wrapper.vm.showDepartments).toBe(false)
    expect(wrapper.find('.departments-main-list').visible()).toBe(false)

    wrapper.setData({ showDepartments: true })
    expect(wrapper.vm.showDepartments).toBe(true)
    expect(wrapper.find('.departments-main-list').visible()).toBe(true)
  })

  it('handle close event on departments', () => {
    wrapper.setData({ showDepartments: true })
    expect(wrapper.vm.showDepartments).toBe(true)
    expect(wrapper.find('.departments-main-list').visible()).toBe(true)
    wrapper.vm.hideDepartmentsRecursively()
    expect(wrapper.vm.showDepartments).toBe(false)
  })

  it('handle close event on departments', () => {
    wrapper.setData({ showDepartments: true })
    expect(wrapper.vm.showDepartments).toBe(true)
    expect(wrapper.find('.departments-main-list').visible()).toBe(true)
    wrapper.vm.hideDepartmentsRecursively()
    expect(wrapper.vm.showDepartments).toBe(false)
  })

  it('handle click event on departments-button-desktop', () => {
    expect(wrapper.find('.departments-button-desktop').exists()).toBe(true)
    expect(wrapper.vm.showDepartments).toBe(false)

    wrapper.find('.departments-button-desktop').trigger('click')
    expect(wrapper.vm.showDepartments).toBe(true)

    wrapper.find('.departments-button-desktop').trigger('click')
    expect(wrapper.vm.showDepartments).toBe(false)
  })

  it('handle click event on departments-button-desktop', () => {
    expect(wrapper.find('.departments-button-mobile').exists()).toBe(true)
    expect(wrapper.vm.showDepartmentsMobile).toBe(false)

    wrapper.find('.departments-button-mobile').trigger('click')
    expect(wrapper.vm.showDepartmentsMobile).toBe(true)

    wrapper.find('.departments-button-mobile').trigger('click')
    expect(wrapper.vm.showDepartmentsMobile).toBe(false)
  })

  it('handle close event on departments-mobile', () => {
    wrapper.setData({ showDepartmentsMobile: true })
    expect(wrapper.find('.departments-mobile-test').exists()).toBe(true)
    expect(wrapper.vm.showDepartmentsMobile).toBe(true)

    wrapper.vm.hideDepartments()
    expect(wrapper.vm.showDepartmentsMobile).toBe(false)
  })

  it('correct text by default at search input', () => {
    const searchInput = wrapper.find('.main-search input')
    expect(searchInput.exists()).toBe(true)
    expect(searchInput.element.value).toBe(wrapper.vm.searchText)
  })

  it('handle spy search event on search-input change', () => {
    expect(wrapper.find('.main-search input').exists()).toBe(true)

    wrapper.find('.search-btn').trigger('click')
    expect(search).toBeCalled()
  })

  it('render correct value of cartSubtotal', () => {
    expect(wrapper.vm.cartSubtotal).toBe(0)
    expect(wrapper.find('.price-tooltip').text()).toBe('0.00 EUR')

    store.hotUpdate({
      getters: {
        ...getters,
        getOnlySubtotal: () => 255.726
      }
    })
    wrapper.update()
    expect(wrapper.vm.cartSubtotal).toBe(255.726)
    expect(wrapper.find('.price-tooltip').text()).toBe('255.73 EUR')
  })

  it('check destroying of component', () => {
    wrapper.destroy()
    expect(beforeDestroy).toBeCalled()
  })
})
