import { shallow } from '@vue/test-utils'
import i18n from '@/translations'
import XmHeader from '@/components/header/XmHeader'
import Vue from 'vue'
import Vuex from 'vuex'
import userMock from '../../fixtures/userMock.json'
import departmentsMock from '../../fixtures/departmentsMock.json'

const showLogin = jest.fn()
const logout = jest.fn()

describe('XmHeader.spec.js', () => {
  let wrapper
  let store
  let actions
  let getters

  beforeEach(() => {
    actions = {
      loadDepartments: jest.fn(() => departmentsMock)
    }

    getters = {
      getCartListLength: () => 0,
      getUser: () => userMock,
      getDepartmentsTree: () => departmentsMock,
      getOnlySubtotal: () => 0,
      getSearched: () => []
    }

    store = new Vuex.Store({
      state: {},
      actions,
      getters
    })

    wrapper = shallow(XmHeader, {
      stubs: ['router-link'],
      i18n,
      store,
      methods: { showLogin, logout }
    })
  })

  it('render/don\'t render cart indication with correct number', (done) => {
    expect(wrapper.vm.cartItems).toBe(0)
    expect(wrapper.findAll('.cart-indication').wrappers).toEqual([])

    store.hotUpdate({
      getters: {
        ...getters,
        getCartListLength: () => 3
      }
    })
    expect(wrapper.vm.cartItems).toBe(3)
    Vue.nextTick(() => {
      const cartIndicators = wrapper.findAll('.cart-indication')
      expect(cartIndicators.exists()).toBe(true)
      cartIndicators.wrappers.forEach(cart => expect(cart.text()).toContain(3))
      done()
    })
  })

  it('render relevant dropdown menus based on user logged or not', (done) => {
    expect(wrapper.vm.user).toBeTruthy()
    let userMenus = wrapper.findAll('.user-menu')
    userMenus.wrappers.forEach(menu => expect(menu.findAll('.user-item').length).toBeTruthy())
    const loggedUserMenuItemsQuantityArray = userMenus.wrappers.map(menu => {
      return menu.findAll('.user-item').length
    })
    expect(new Set(loggedUserMenuItemsQuantityArray).size).toBe(1)

    store.hotUpdate({
      getters: {
        ...getters,
        getUser: () => {}
      }
    })
    expect(wrapper.vm.user).not.toBeTruthy()

    Vue.nextTick(() => {
      userMenus = wrapper.findAll('.user-menu')
      userMenus.wrappers.forEach(menu => expect(menu.findAll('.guest-item').length).toBeTruthy())
      const guestUserMenuItemsQuantityArray = userMenus.wrappers.map(menu => {
        return menu.findAll('.guest-item').length
      })
      expect(new Set(guestUserMenuItemsQuantityArray).size).toBe(1)
      done()
    })
  })

  it('check /dashboard link availability in user menus if user logged', () => {
    const mainMenu = wrapper.find('.main-menu')
    const userMenus = mainMenu.findAll('.user-menu')
    expect(mainMenu.findAll('[href="/dashboard"]').length).toBe(userMenus.length)
  })

  it('check another core links availability in top nav bar', () => {
    const navbar = wrapper.find('.top-navbar')
    expect(navbar.find('[href="/privacypolicy"]').exists()).toBe(true)
    expect(navbar.find('[href="/imprint"]').exists()).toBe(true)
    expect(navbar.find('[href="/help"]').exists()).toBe(true)
    expect(navbar.find('[href="/conditions"]').exists()).toBe(true)
  })

  it('show show user name if logged', () => {
    const firstName = wrapper.vm.user.first_name
    const lastName = wrapper.vm.user.last_name
    let userMenuText = wrapper.find('.user-menu-text').text()
    expect(userMenuText.indexOf(firstName) > -1)
    expect(userMenuText.indexOf(lastName) > -1)
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
})

// const stub = jest.fn()
// wrapper.vm.$on('registration::start', stub)
// wrapper.vm.startRegistration()

// expect(stub).toBeCalled()
